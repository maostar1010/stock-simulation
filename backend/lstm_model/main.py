# stock_predictor/models.py
from django.db import models

class StockPrediction(models.Model):
    ticker = models.CharField(max_length=10)
    prediction_date = models.DateTimeField(auto_now_add=True)
    predicted_price = models.FloatField()
    prediction_for_date = models.DateField()

    class Meta:
        ordering = ['-prediction_date']

# stock_predictor/ml_model.py
import numpy as np
import pandas as pd
import yfinance as yf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, LSTM, Dropout
from sklearn.preprocessing import MinMaxScaler
import joblib
import os
from django.conf import settings
import datetime

class StockPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.n_steps = 50
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'stock_prediction_model.h5')
        self.scaler_path = os.path.join(settings.BASE_DIR, 'ml_models', 'scaler.pkl')

    def fetch_stock_data(self, ticker, start_date, end_date):
        data = yf.download(ticker, start=start_date, end=end_date)
        return data['Close'].values.reshape(-1, 1)

    def prepare_data(self, data):
        X, y = [], []
        for i in range(self.n_steps, len(data)):
            X.append(data[i-self.n_steps:i, 0])
            y.append(data[i, 0])
        return np.array(X), np.array(y)

    def train_model(self, ticker='AAPL'):
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        # Fetch and prepare data
        data = self.fetch_stock_data(ticker, '2020-01-01', '2022-01-01')
        
        # Scale data
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        data_scaled = self.scaler.fit_transform(data)
        
        # Save the scaler
        joblib.dump(self.scaler, self.scaler_path)
        
        # Prepare data
        X, y = self.prepare_data(data_scaled)
        X = X.reshape(X.shape[0], X.shape[1], 1)
        
        # Split data
        split = int(0.8 * len(X))
        X_train, y_train = X[:split], y[:split]
        
        # Build model
        self.model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(self.n_steps, 1)),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        self.model.compile(optimizer='adam', loss='mean_squared_error')
        self.model.fit(X_train, y_train, epochs=50, batch_size=32)
        
        # Save model
        self.model.save(self.model_path)

    def load_model(self):
        if not os.path.exists(self.model_path):
            self.train_model()
        self.model = load_model(self.model_path)
        self.scaler = joblib.load(self.scaler_path)

    def predict(self, ticker, prediction_days=1):
        if self.model is None:
            self.load_model()

        # Fetch recent data
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=self.n_steps + 10)
        
        historical_data = self.fetch_stock_data(ticker, start_date, end_date)
        historical_scaled = self.scaler.transform(historical_data)
        
        # Prepare prediction sequence
        X_pred = historical_scaled[-self.n_steps:].reshape(1, self.n_steps, 1)
        
        # Make predictions
        predictions = []
        dates = []
        current_sequence = X_pred.copy()
        current_date = end_date
        
        for _ in range(prediction_days):
            next_pred = self.model.predict(current_sequence, verbose=0)
            predicted_price = float(self.scaler.inverse_transform(next_pred)[0, 0])
            predictions.append(predicted_price)
            
            current_date += datetime.timedelta(days=1)
            dates.append(current_date.date())
            
            current_sequence = np.roll(current_sequence, -1, axis=1)
            current_sequence[0, -1, 0] = next_pred[0, 0]
        
        return list(zip(dates, predictions))

# stock_predictor/views.py
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
import json
from .ml_model import StockPredictor
from .models import StockPrediction

predictor = StockPredictor()

@api_view(["POST"])
@permission_classes([AllowAny])
def predict_stock(request):
    try:
        data = json.loads(request.body)
        ticker = data.get('ticker')
        prediction_days = int(data.get('prediction_days', 1))
        
        if not ticker:
            return JsonResponse({'error': 'Ticker symbol is required'}, status=400)
        
        # Get predictions
        predictions = predictor.predict(ticker, prediction_days)
        
        # Save predictions to database
        saved_predictions = []
        for date, price in predictions:
            prediction = StockPrediction.objects.create(
                ticker=ticker,
                predicted_price=price,
                prediction_for_date=date
            )
            saved_predictions.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': price
            })
        
        return JsonResponse({   
            'ticker': ticker,
            'predictions': saved_predictions
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
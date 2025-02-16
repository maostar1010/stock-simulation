from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Portfolio, CustomUser
from. serializers import PortfolioSerializer, UserSerializer
# from alpha_vantage.timeseries import TimeSeries
import yfinance as yf

ALPHA_VANTAGE_API_KEY = 'R4O9F4FEDY0CFGN3'

@api_view(['POST'])
@permission_classes([AllowAny])
def UserRegistration(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user) 
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def UserLogin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        # User is authenticated, create or get a token for the user
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UserDetail(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def portfolio_list(request):
    portfolios = Portfolio.objects.filter(user=request.user)
    serializer = PortfolioSerializer(portfolios, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def portfolio_buy(request):
    """Buy stocks and update the user's portfolio balance."""
    
    # Extract data from the request
    ticker = request.data.get('ticker')
    price = request.data.get('price')
    shares = request.data.get('shares')

    # Validate if price and shares exist and are correct
    if price is None or shares is None:
        return Response({"error": "Price and shares must be provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        price = float(price)
        shares = int(shares)
    except ValueError:
        return Response({"error": "Invalid price or shares."}, status=status.HTTP_400_BAD_REQUEST)

    total_cost = price * shares

    user = request.user

    # Get or create the portfolio for the given ticker
    portfolio, created = Portfolio.objects.get_or_create(user=user, ticker=ticker)
    print(f"Portfolio created: {created}") 

    if user.cash < total_cost:
        return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

    user.cash -= total_cost
    user.save()

    portfolio.shares += shares
    portfolio.total_spent += total_cost
    
    # Update the portfolio's total worth based on the stock price
    price = get_stock_price(ticker)
    if price > 0:
        portfolio.total_worth = portfolio.shares * price
        portfolio.save()

    # Recalculate and update the total_worth for all tickers in the user's portfolio
    total_worth = 0.0
    portfolios = Portfolio.objects.filter(user=user)

    for p in portfolios:
        price = get_stock_price(p.ticker)
        if price > 0:
            p.total_worth = p.shares * price
            p.save()

        total_worth += p.total_worth

    user.balance = user.cash + total_worth
    user.save()

    return Response({
        "portfolio": PortfolioSerializer(portfolio).data,
        "total_worth": total_worth,
        "updated_balance": user.balance
    }, status=status.HTTP_201_CREATED)


# Function to get the latest stock price using Alpha Vantage
def get_stock_price(ticker):
    try:
        stock = yf.Ticker(ticker)
        price = stock.history(period='1d')['Close'].iloc[-1]  # Get the latest closing price
        return float(price)
    except Exception as e:
        print(f"Error fetching stock price for {ticker}: {e}")
        return 0.0  # Return 0 if an error occurs

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_portfolio_and_balance(request):
    user = request.user

    portfolios = Portfolio.objects.filter(user=user)

    total_worth = 0.0

    for portfolio in portfolios:
        price = get_stock_price(portfolio.ticker)

        if price > 0:
            portfolio.total_worth = portfolio.shares * price
            portfolio.save()

            total_worth += portfolio.total_worth

    user.balance = user.cash + total_worth
    user.save()

    return Response({
        "updated_balance": user.balance
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sorted_users_by_balance(request):
    users = CustomUser.objects.all().order_by('-balance') 
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

STOCK_LIST = ["AAPL", "MSFT", "TSLA", "NVDA", "GOOGL", "AMZN", "META", "NFLX", "AMD"]

@api_view(['GET'])
@permission_classes([AllowAny])
def get_top_gainers(request):
    """Fetch the stock prices for the given list of tickers and calculate the change percentage."""
    try:
        data = []
        for ticker in STOCK_LIST:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")  # Fetch data for the last 1 day
            print(f"Data for {ticker}: {hist}")  # Debugging line
            
            if hist.empty:
                continue  # Skip ticker if no data

            open_price = hist["Open"].iloc[-1]
            close_price = hist["Close"].iloc[-1]
            change = round(close_price - open_price, 2)
            change_percentage = round((change / open_price) * 100, 2)  # Calculate change percentage

            data.append({
                "ticker": ticker,
                "price": round(close_price, 2),
                "change_amount": change,
                "change_percentage": change_percentage,
                "volume": int(hist["Volume"].iloc[-1]),
            })

        # Sort the data by the highest gain percentage
        data = sorted(data, key=lambda x: x["change_percentage"], reverse=True)

        # Return the top 10 gainers
        return Response(data[:10], status=200)

    except Exception as e:
        print(f"Error: {e}")  # Print the error message for debugging
        return Response({"error": str(e)}, status=500)



import numpy as np  # Add this import

@api_view(['GET'])
@permission_classes([AllowAny])
def get_1y_stock_price(request, ticker):
    """Fetch the stock prices for the last 1 year using yfinance."""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1y")  # Get the last 1 year of data
        
        if data.empty:
            return Response({"error": "Invalid ticker or no data available"}, status=400)
        
        # Extract the dates and closing prices
        prices = data['Close'].tolist()
        dates = data.index.strftime('%Y-%m-%d').tolist()  # Format dates as strings
        
        # Handle potential NaN or Infinity values in prices
        prices = [price if np.isfinite(price) else None for price in prices]  # Replace invalid prices with None

        # Return the data for the chart
        return Response({"ticker": ticker, "dates": dates, "prices": prices}, status=200)
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def portfolio_sell(request):
    
    ticker = request.data.get('ticker')
    price = request.data.get('price')
    shares = request.data.get('shares')

    if price is None or shares is None:
        return Response({"error": "Price and shares must be provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        price = float(price)
        shares = int(shares)
    except ValueError:
        return Response({"error": "Invalid price or shares."}, status=status.HTTP_400_BAD_REQUEST)

    total_value = price * shares

    user = request.user

    try:
        portfolio = Portfolio.objects.get(user=user, ticker=ticker)
    except Portfolio.DoesNotExist:
        return Response({"error": "You do not own any shares of this stock."}, status=status.HTTP_400_BAD_REQUEST)

    if portfolio.shares < shares:
        return Response({"error": "Insufficient shares to sell."}, status=status.HTTP_400_BAD_REQUEST)

    portfolio.shares -= shares
    portfolio.total_spent -= portfolio.total_spent * (shares / portfolio.shares)
    portfolio.total_worth = portfolio.shares * price
    portfolio.save()

    user.cash += total_value
    user.save()

    total_worth = 0.0
    portfolios = Portfolio.objects.filter(user=user)

    for p in portfolios:
        price = get_stock_price(p.ticker)
        if price > 0:
            p.total_worth = p.shares * price
            p.save()

        total_worth += p.total_worth

    user.balance = user.cash + total_worth
    user.save()

    return Response({
        "portfolio": PortfolioSerializer(portfolio).data,
        "total_worth": total_worth,
        "updated_balance": user.balance
    }, status=status.HTTP_200_OK)

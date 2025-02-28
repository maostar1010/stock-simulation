# 📈 StockEd

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/7a3548b4-d31c-49f9-b7f9-a73b44e8b2dd" />
<img width="1100" alt="image" src="https://github.com/user-attachments/assets/c4d81570-fbf4-4f1b-abe6-e94f75542834" />

## 🚀 Overview

StockEd is a fun, interactive stock market simulation game designed for everyone! Whether you're a beginner looking to learn about stocks or a seasoned investor testing strategies, StockEd makes it easy, engaging, and competitive. Play solo or challenge your friends to see who can build the best portfolio!

## 🎯 How to Play

1. **Sign Up & Log In** - Create an account to save progress and join the competition.
2. **Get Virtual Cash** - Start with a set amount of virtual money to trade stocks.
3. **Buy & Sell Stocks** - Use real-time market data to build and manage your portfolio.
4. **Compete & Win** - Outperform your friends and climb the leaderboard!

## 🛠 Tech Stack

- React
- TypeScript
- TailwindCSS
- Django REST Framework
- SQLite
- NumPy
- pandas
- Matplotlib
- TensorFlow
- scikit-learn

### Stock Data:

- Integrated with live stock market APIs (Alpha Vantage, Polygon, and Yahoo Finance)

### Authentication:

- Token-based authentication using Django

## 📌 Installation & Setup

### Prerequisites

- Node.js & npm installed
- Python & pip installed

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/maostar1010/stock-simulation
   cd stock-simulation
   ```

2. Start the backend server:

   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Set up environment variables inside /frontend:

   - create a .env file

   ```bash
   ALPHA_VANTAGE_KEY=your_alpha_vantage_key
   VITE_POLYGON_API_KEY=your_polygon_key
   ```

   - Add your API keys and database credentials.

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

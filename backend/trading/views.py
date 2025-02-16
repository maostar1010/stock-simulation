from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Portfolio, CustomUser
from. serializers import PortfolioSerializer, UserSerializer

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

    # Get the logged-in user
    user = request.user

    # Get or create the portfolio for the given ticker
    portfolio, created = Portfolio.objects.get_or_create(user=user, ticker=ticker)
    print(f"Portfolio created: {created}") 

    # Check if the user has enough funds to make the purchase
    if user.cash < total_cost:
        return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

    # Deduct the cost from the user's cash (the investable money)
    user.cash -= total_cost
    # user.balance = user.cash + portfolio.total_worth  # Update the user's total balance (cash + portfolio worth)
    user.save()

    # Update the portfolio (add shares and calculate new total worth)
    portfolio.shares += shares
    portfolio.total_spent += total_cost
    # portfolio.total_worth = portfolio.shares * price  # Update the portfolio's total worth based on new shares and price
    portfolio.save()

    # Return the updated portfolio data
    return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_201_CREATED)


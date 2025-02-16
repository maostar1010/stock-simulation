from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Portfolio, CustomUser
from. serializers import PortfolioSerializer, UserRegistrationSerializer, UserLoginSerializer
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
def portfolio_list(request):
    # AUTH?
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [TokenAuthentication]

    portfolios = Portfolio.objects.filter(user=request.user)
    serializer = PortfolioSerializer(portfolios, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# def portfolio_create(request):
#     serializer = PortfolioSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def portfolio_buy(request):
    """Buy stocks and update the user's portfolio balance."""
    
    # Extract data from the request
    ticker = request.data.get('ticker')
    price = float(request.data.get('price'))
    shares = int(request.data.get('shares'))
    total_cost = price * shares

    # Get the user's portfolio
    portfolio, created = Portfolio.objects.get_or_create(user=request.user)

    # Check if the user has enough funds
    if portfolio.balance < total_cost:
        return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

    # Deduct the funds from the user's balance
    portfolio.balance -= total_cost
    portfolio.save()

    # Add the stock to the portfolio (update price and quantity)
    portfolio.shares += shares 
    portfolio.value += portfolio.shares * price
    portfolio.save()

    return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API is working!"})

@csrf_exempt
@api_view(['POST'])
def UserRegistration(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def UserLogin(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({"message": "Login successful!"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

    
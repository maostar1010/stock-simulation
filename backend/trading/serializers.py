from rest_framework import serializers
from .models import Portfolio, CustomUser

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'symbol', 'price', 'quantity', 'date_purchased', 'total_value']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']
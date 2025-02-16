from rest_framework import serializers
from .models import Portfolio, CustomUser
from django.contrib.auth import get_user_model 

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'symbol', 'price', 'quantity', 'date_purchased', 'total_value']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'username', 'password', 'balance', 'cash']

    def create(self, validated_data):
        validated_data['balance'] = validated_data.get('balance', 10000.00)
        validated_data['cash'] = validated_data.get('cash', 9000.00)
        user = get_user_model().objects.create_user(**validated_data)
        return user
    

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
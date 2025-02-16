from rest_framework import serializers
from .models import Portfolio, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'balance', 'cash']
        extra_kwargs = {'password': {'write_only': True}}  # To ensure password isn't returned in responses

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            balance=validated_data.get('balance', 10000.00),
            cash=validated_data.get('cash', 10000.00)
        )
        return user
class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'ticker', 'shares', 'total_spent', 'total_worth']
                                                            
        
        
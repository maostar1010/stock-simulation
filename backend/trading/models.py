from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10, unique=True)
    shares = models.PositiveIntegerField() 
    balance = models.FloatField(default=10000.00)
    value = models.FloatField()

    def __str__(self):
        return f"{self.symbol} - {self.price}"

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, default="default@example.com")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00)  
    cash = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00)

    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['email'] 

    def __str__(self):
        return self.username

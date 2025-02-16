from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    balance = models.FloatField(default=10000.00)
    cash = models.FloatField(default=10000.00)

    def __str__(self):
        return self.username
    
class Portfolio(models.Model):
    user = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)
    shares = models.PositiveIntegerField(default=0) 
    total_spent = models.FloatField(default=0)
    total_worth = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.ticker}: {self.shares} shares"


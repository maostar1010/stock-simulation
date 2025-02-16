from django.db import models

# Create your models here.

class Portfolio(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10, unique=True)
    shares = models.PositiveIntegerField() 
    balance = models.FloatField(default=10000.00)
    value = models.FloatField()

    def __str__(self):
        return f"{self.symbol} - {self.price}"

class CustomUser(models.Model):
    username = models.CharField(max_length=100)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["username"]    

    def __str__(self):
        return self.username

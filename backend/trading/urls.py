from django.urls import path
from .views import portfolio_list, portfolio_buy, test_api, UserRegistration

urlpatterns = [
    path('portfolios/', portfolio_list, name='portfolio-list'),  
    path('portfolios/buy/', portfolio_buy, name='portfolio-buy'), 
    path('test/', test_api, name='test-api'),   
    path('registration/', UserRegistration, name='user-registration'), 
]

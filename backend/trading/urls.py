from django.urls import path
from .views import portfolio_list, portfolio_buy, UserRegistration, UserLogin, UserDetail

urlpatterns = [
    path('login/', UserLogin, name='login'),
    path('registration/', UserRegistration, name='user-registration'), 
    path('user-detail/', UserDetail, name='get-user-detail'),  
    path('portfolios/', portfolio_list, name='portfolio-list'),  
    path('portfolios/buy/', portfolio_buy, name='portfolio-buy'),   
]
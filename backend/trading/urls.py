from django.urls import path
from .views import portfolio_list, portfolio_buy, UserRegistration, UserLogin, UserDetail, update_portfolio_and_balance, sorted_users_by_balance, get_top_gainers, get_1y_stock_price

urlpatterns = [
    path('login/', UserLogin, name='login'),
    path('registration/', UserRegistration, name='user-registration'), 
    path('user-detail/', UserDetail, name='get-user-detail'),  
    path('portfolios/', portfolio_list, name='portfolio-list'),  
    path('portfolios/buy/', portfolio_buy, name='portfolio-buy'),  
    path('portfolios/update/', update_portfolio_and_balance, name='portfolio-update'),  
    path('users/sorted/', sorted_users_by_balance, name='sorted-users'),
    path('stock/top-gainers/', get_top_gainers, name='stock-latest'),
    path('stock/1y-price/<str:ticker>/', get_1y_stock_price, name='stock-1y-price'),
]
from django.urls import path
from .views import *

urlpatterns = [
    path('signup', SignUp.as_view(), name='signup'),
    path('worker_account', worker_account, name='worker_account'),
    path('update_tags', update_tags, name='update_tags'),
    path('ajax/update_cities', update_cities, name='update_cities'),
]
from django.urls import path
from .views import *

urlpatterns = [
    path('ajax/update_subcategories', update_subcategories, name='update_subcategories')
]
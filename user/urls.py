from django.urls import path
from .views import *

urlpatterns = [
    path('signup', SignUp.as_view(), name='signup'),
    path('worker_account', worker_account, name='worker_account'),
    path('update_tags', update_tags, name='update_tags'),
    path('update_phones', update_phones, name='update_phones'),
    path('delete_tag/<int:pk>', DeleteTag.as_view(), name='delete_tag'),
    path('delete_phone/<int:pk>', DeletePhone.as_view(), name='delete_phone'),
    path('ajax/update_cities', update_cities, name='update_cities'),
]
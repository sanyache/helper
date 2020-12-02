from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('signup', SignUp.as_view(), name='signup'),
    path('worker_account', worker_account, name='worker_account'),
    path('update_tags', update_tags, name='update_tags'),
    path('update_phones', update_phones, name='update_phones'),
    path('update_photos', update_photos, name='update_photos'),
    path('delete_tag/<int:pk>', DeleteTag.as_view(), name='delete_tag'),
    path('delete_phone/<int:pk>', DeletePhone.as_view(), name='delete_phone'),
    path('delete_photo/<int:pk>', DeletePhoto.as_view(), name='delete_photo'),
    path('ajax/update_cities', update_cities, name='update_cities'),
    path('worker_list', WorkerList.as_view(), name='worker_list'),
    path('worker_by_subcategory/<int:pk>', WorkerListBySubCategory.as_view(),
         name='worker_by_subcategory')
]
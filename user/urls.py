from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('signup', SignUp.as_view(), name='signup'),
    path('worker_account', worker_account, name='worker_account'),
    path('toggle_account', toggle_account, name='toggle_account'),
    path('update_tags', update_tags, name='update_tags'),
    path('update_phones', update_phones, name='update_phones'),
    path('update_photos', update_photos, name='update_photos'),
    path('delete_tag/<int:pk>', DeleteTag.as_view(), name='delete_tag'),
    path('delete_phone/<int:pk>', DeletePhone.as_view(), name='delete_phone'),
    path('delete_photo/<int:pk>', DeletePhoto.as_view(), name='delete_photo'),
    path('ajax/update_cities', update_cities, name='update_cities'),
    path('worker_list', WorkerList.as_view(), name='worker_list'),
    path('worker_detail/<int:pk>', WorkerDetail.as_view(), name='worker_detail'),
    path('worker_by_subcategory/<int:pk>', WorkerListBySubCategory.as_view(),
         name='worker_by_subcategory'),
    path('worker_by_tag/<tag>', WorkerListByTag.as_view(), name='worker_by_tag'),
    path('ajax/filter_workers', ajax_filter_workers, name='ajax-filter-workers'),
    path('create_response/<int:pk>', create_response, name='create_response'),
    path('delete_response/<int:pk>', DeleteResponse.as_view(), name='delete_response'),
    path('ajax/filter_response', ajax_filter_response, name='filter_response'),
    path('create_reply', create_reply, name='create_reply'),
    path('search_tag_typeahead', SearchTagTypeahead.as_view(), name='search_tag_typeahead')
]
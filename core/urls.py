from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('', index, name='home'),
    path('privacy_policy', TemplateView.as_view(template_name="privacy_policy.html"),
         name="privacy_policy")
]


from django.shortcuts import render
from django.http import JsonResponse
from .models import *


def update_subcategories(request):

    category = request.GET.get('category', None)
    sub_categories = list(SubCategoryJob.objects.filter(category__name__exact=category).values('id'))
    data = {'val': sub_categories}
    return JsonResponse(data)




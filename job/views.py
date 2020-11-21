from django.shortcuts import render
from django.http import JsonResponse
from .models import *


def update_subcategories(request):
    user = request.user
    try:
        sub = user.worker.subcategories.all().values_list('id')
    except KeyError:
        pass
    category = request.GET.get('category', None)
    sub_categories = list(SubCategoryJob.objects.filter(category__name__exact=category).values('id'))
    data = {'val': sub_categories}
    if sub:
        data['worker_sub'] = list(sub)

    return JsonResponse(data)




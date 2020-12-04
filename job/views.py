from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import *


def update_subcategories(request):
    data = dict()
    category = request.GET.get('category', None)
    sub_categories = list(SubCategoryJob.objects.filter(category__id=category).values(
                                                        'id', 'name'))
    data['html'] = render_to_string('includes/subcategory_list.html',
                                    {'subcategories': sub_categories})
    data['val'] = sub_categories
    return JsonResponse(data)




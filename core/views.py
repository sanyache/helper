from django.shortcuts import render
from django.db.models import Count
from job.models import CategoryJob

# Create your views here.


def index(request):

    categories = CategoryJob.objects.all().prefetch_related('subcategories')

    return render(request, 'index.html', {'categories': categories})

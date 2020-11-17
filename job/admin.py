from django.contrib import admin
from .models import CategoryJob, SubCategoryJob
# Register your models here.


@admin.register(CategoryJob)
class CategoryJobAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(SubCategoryJob)
class SubCategoryJobAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category']
    prepopulated_fields = {'slug': ('name',)}

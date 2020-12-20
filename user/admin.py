from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):

    list_display = ('name',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):

    list_display = ('name', 'region')
    list_filter = ('region',)


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):

    list_display = ('user',)


@admin.register(SkillTag)
class SkillTagAdmin(admin.ModelAdmin):

    list_display = ('name', )


@admin.register(WorkerGallery)
class WorkGalleryAdmin(admin.ModelAdmin):

    list_display = ('worker', )


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):

    list_display = ('worker', 'author')


@admin.register(Reply)
class Reply(admin.ModelAdmin):

    list_display = ('author', )

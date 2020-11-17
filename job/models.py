from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit, Transpose, SmartResize

# Create your models here.


class CategoryAbstract(models.Model):
    """
    abstract class for categoty and subcategory
    """
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, db_index=True, unique=True)
    images = models.ImageField(upload_to='category/', verbose_name='фото', blank=True, null=True)

    def __str__(self):
        return "{}".format(self.name)

    class Meta:
        abstract = True


class CategoryJob(CategoryAbstract):
    """
    class describe category for job
    """
    category_avatar = ImageSpecField(source='images',
                                     processors=[Transpose(), SmartResize(120, 140)],
                                     format='JPEG',
                                     options={'quality': 50})

    class Meta:
        verbose_name = 'Категорія роботи'
        verbose_name_plural = 'Категорії для роботи'


class SubCategoryJob(CategoryAbstract):
    """
    class describe subcategory  for category job
    """
    category = models.ForeignKey(CategoryJob, on_delete=models.CASCADE,
                                 related_name='subcategories')
    subcategory_avatar = ImageSpecField(source='images',
                                     processors=[Transpose(), SmartResize(100, 100)],
                                     format='JPEG',
                                     options={'quality': 50})

    class Meta:
        verbose_name = 'Підкатегорія для роботи'
        verbose_name_plural = 'Підкатегорії для роботи'
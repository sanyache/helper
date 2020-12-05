from django.db import models
from django.contrib.auth.models import User
from job.models import SubCategoryJob
from imagekit.models import ImageSpecField
from imagekit.processors import Transpose, SmartResize

# Create your models here.


class Region(models.Model):
    """
    this class describe a region where worker work
    """
    name = models.CharField(max_length=50, verbose_name='область')

    class Meta:
        verbose_name = 'Область'
        verbose_name_plural = 'Області'

    def __str__(self):
        return "{}".format(self.name)


class City(models.Model):
    """
    this class describe a city where worker work
    """
    name = models.CharField(max_length=125, verbose_name='місто')
    region = models.ForeignKey(Region, on_delete=models.CASCADE, verbose_name='область',
                               related_name='cities')

    class Meta:
        verbose_name = "Місто"
        verbose_name_plural = "Міста"

    def __str__(self):
        return "{}".format(self.name)


class Worker(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cities = models.ManyToManyField(City, related_name='workersincity', verbose_name='місто')
    subcategories = models.ManyToManyField(SubCategoryJob, verbose_name='підкатегорія',
                                           related_name='workers')
    title_image = models.ImageField(upload_to='worker/', blank=True, null=True,
                                    verbose_name='фото користувача')
    image_small_avatar = ImageSpecField(source='title_image',
                                  processors=[Transpose(), SmartResize(100, 100)],
                                  format='JPEG',
                                  options={'quality': 70})
    image_detail_avatar = ImageSpecField(source='title_image',
                                        processors=[Transpose(), SmartResize(225, 225)],
                                        format='JPEG',
                                        options={'quality': 50})
    describe = models.TextField()
    created = models.DateField(auto_now_add=True, verbose_name='створено')
    is_active = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return "{} {}".format(self.user, self.user.last_name)


class Company(Worker):

    name = models.CharField(max_length=125, verbose_name='назва компанії')
    address = models.CharField(max_length=200, verbose_name='адреса компанії', blank=True)

    class Meta:
        verbose_name = 'Компанія'
        verbose_name_plural = 'Компанії'

    def __str__(self):
        return "{}".format(self.name)


class SkillTag(models.Model):

    name = models.CharField(max_length=50, unique=True, verbose_name='майстерність')
    workers = models.ManyToManyField(Worker, related_name='skilltags')

    def __str__(self):
        return "{}".format(self.name)


class Phone(models.Model):

    number = models.CharField(max_length=20, db_index=True, verbose_name='номер телефону')
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='phones')

    def __str__(self):
        return '{}'.format(self.number)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.worker.id, filename)


class WorkerGallery(models.Model):

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='workimages')
    image = models.ImageField(upload_to=user_directory_path)
    image_detail = ImageSpecField(source='image',
                                         processors=[Transpose(), SmartResize(203, 140)],
                                         format='JPEG',
                                         options={'quality': 50})

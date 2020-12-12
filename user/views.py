from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy, reverse
from django.template.loader import render_to_string
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.views.generic import CreateView, DeleteView, ListView, DetailView
from django.db.models import Avg, Count, Sum, FloatField
from django.db.models.functions import Cast
from .forms import SignUpForm, WorkerForm, UserForm
from .models import *
from job.models import CategoryJob


# Create your views here.
class SignUp(CreateView):
    """
    sign up for user
    """
    form_class = SignUpForm
    template_name = 'index.html'

    def get_success_url(self):
        messages.info(self.request, 'Реєстрація пройшла успішно!')
        return reverse('home')

    def form_invalid(self, form):
        messages.error(self.request, 'При створенні профіля сталася помилка, спробуйте ще')
        return self.render_to_response(self.get_context_data(form=form))


def worker_account(request):

    categories_job = CategoryJob.objects.all()
    regions = Region.objects.all()
    if request.method == "GET":
        user_form = UserForm(instance=request.user)
        worker, created = Worker.objects.get_or_create(user=request.user)
        worker_form = WorkerForm(instance=worker)
        try:
            tags = worker.skilltags.all()
        except:
            tags = []
        phones = Phone.objects.filter(worker=worker)
        photos = WorkerGallery.objects.filter(worker=worker)
        return render(request, 'dashboard-profile.html',
                      {'user_form': user_form, 'worker_form': worker_form, 'worker': worker,
                       'categories_job': categories_job,
                       'regions': regions,
                       'tags': tags,
                       'phones': phones,
                       'photos': photos})
    if request.method == "POST":
        user_form = UserForm(request.POST, instance=request.user)
        worker_form = WorkerForm(request.POST, request.FILES, instance=request.user.worker)

        if user_form.is_valid() and worker_form.is_valid():
            print('user',user_form.cleaned_data)
            print('worker',worker_form.cleaned_data.get('title_image'))
            user_form.save()
            # worker, created = Worker.objects.get_or_create(user=user, )
            worker_form.save()
            messages.info(request, 'Дані оновлено успішно')
            # worker.save()
            # worker_form.save_m2m()
        else:
            print('u', user_form.cleaned_data)
            print('w', worker_form.cleaned_data)
            messages.error(request,
                           'При оновленні даних відбулася помилка. Перевірте чи заповненні всі поля'
                           )
        return HttpResponseRedirect(reverse('worker_account'))


def update_cities(request):
    data = dict()
    region = request.GET.get('region', None)
    cities = list(City.objects.filter(region__id=region).values('id', 'name'))
    data['val'] = cities
    data['html'] = render_to_string('includes/cities_list.html', {'cities': cities})
    return JsonResponse(data)


def update_tags(request):

    if request.method == 'POST':
        worker = request.user.worker
        tags = request.POST.getlist('tag-list')
        if tags:
            for item in tags:
                if item:
                    tag, created = SkillTag.objects.get_or_create(name=item)
                    tag.workers.add(worker)
    return HttpResponseRedirect(reverse('worker_account'))


def update_phones(request):

    if request.method == 'POST':
        worker = request.user.worker
        phones = request.POST.getlist('phone-list')
        if phones:
            for phone in phones:
                if phone:
                    Phone.objects.create(worker=worker, number=phone)
    return HttpResponseRedirect(reverse('worker_account'))


def update_photos(request):

    if request.method == 'POST':
        worker = request.user.worker
        photos = request.FILES.getlist('portfolio')
        if photos:
            for photo in photos:
                if photo.size <= 2*1024*1024:
                    fs = FileSystemStorage()
                    file_path = fs.save(photo.name, photo)
                    img = WorkerGallery(worker=worker, image=file_path)
                    img.save()
                else:
                    messages.error(request, '{} розмір перевищує допустимий'.format(photo))
    return HttpResponseRedirect(reverse('worker_account'))


class DeleteTag(DeleteView):
    model = SkillTag
    success_url = reverse_lazy('worker_account')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DeletePhone(DeleteView):
    model = Phone
    success_url = reverse_lazy('worker_account')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class DeletePhoto(DeleteView):
    model = WorkerGallery
    success_url = reverse_lazy('worker_account')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)


class WorkerList(ListView):

    model = Worker
    queryset = Worker.objects.filter(is_active=True).prefetch_related('skilltags').select_related()
    context_object_name = 'workers'
    template_name = 'userlisting.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(WorkerList, self).get_context_data(object_list=None, **kwargs)
        regions = Region.objects.all()
        categories = CategoryJob.objects.all()
        context['regions'] = regions
        context['categories'] = categories
        return context

    def get_queryset(self):
        queryset = self.queryset
        queryset = queryset.annotate(rate=((Sum('responses__rating',
                                                output_field=FloatField()) + 15.0) /
                                           (1.0 * Count('responses__rating',
                                                        output_field=FloatField()) + 5.0))) \
                                           .order_by('-rate') \
                                           .annotate(feedback=Count('responses')) \
                                           .annotate(rating=Avg('responses__rating'))
        return queryset


class WorkerDetail(DetailView):

    model = Worker
    queryset = Worker.objects.select_related().prefetch_related()
    template_name = 'usersingle.html'
    context_object_name = 'worker'

    def get_context_data(self, **kwargs):
        context = super(WorkerDetail, self).get_context_data(**kwargs)
        context['responses'] = self.object.responses.all().select_related('author')
        return context


class WorkerListBySubCategory(ListView):

    model = Worker
    queryset = Worker.objects.filter(is_active=True)
    context_object_name = 'workers'
    template_name = 'userlisting.html'

    def get_queryset(self):
        queryset = Worker.objects.filter(is_active=True, subcategories__id=self.kwargs['pk'])\
                                        .prefetch_related('skilltags').select_related('user')
        queryset = queryset.annotate(rate=((Sum('responses__rating',
                                                  output_field=FloatField())+15.0)/
                                             (1.0*Count('responses__rating',
                                              output_field=FloatField())+5.0)))\
                          .order_by('-rate')\
                          .annotate(feedback=Count('responses'))\
                          .annotate(rating=Avg('responses__rating'))
        return queryset

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(WorkerListBySubCategory, self).get_context_data(object_list=None, **kwargs)
        regions = Region.objects.all()
        categories = CategoryJob.objects.all()
        context['regions'] = regions
        context['categories'] = categories
        context['pk'] = self.kwargs['pk']
        return context


def ajax_filter_workers(request):
    data = dict()
    filters = dict()
    queryset = Worker.objects.filter(is_active=True).prefetch_related(
        'skilltags').select_related('user')
    cities = request.GET.getlist('cities[]')
    subcategories = request.GET.getlist('subcategories[]')
    if cities:
        cities = [int(id) for id in cities]
        filters['cities__id__in'] = cities
    if subcategories:
        subcategories = [int(id) for id in subcategories]
        filters['subcategories__id__in'] = subcategories
    if filters:
        queryset = queryset.filter(**filters).distinct()
    data['html'] = render_to_string('includes/worker_list.html', {'workers': queryset})
    return JsonResponse(data)


def create_response(request, pk):
    if request.method == 'POST':
        worker = Worker.objects.get(id=pk)
        user = request.user
        rating = request.POST.get('rating')
        description = request.POST.get('description')
        if rating or description:
            Response.objects.create(author=user, worker=worker, description=description,
                                    rating= rating)
    return HttpResponseRedirect(reverse('worker_detail', args=[pk]))


class DeleteResponse(DeleteView):
    model = Response

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('home')


def ajax_filter_response(request):
    data = dict()
    id = request.GET.get('id')
    filter = request.GET.get('filter')
    responses = Worker.objects.get(id=id).responses.all().select_related('author')
    if filter == 'fresh':
        responses = responses.order_by('-created')
    if filter == 'old':
        responses = responses.order_by('created')
    if filter == 'highrate':
        responses = responses.order_by('-rating')
    if filter == 'lowrate':
        responses = responses.order_by('rating')
    data['html'] = render_to_string('includes/response_list.html', {'responses': responses})
    return JsonResponse(data)

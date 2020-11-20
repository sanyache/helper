from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy, reverse
from django.contrib import messages
from django.views.generic import CreateView
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
    if request.method == "GET":
        user_form = UserForm(instance=request.user)
        worker, created = Worker.objects.get_or_create(user=request.user)
        worker_form = WorkerForm(instance=worker)
        return render(request, 'dashboard-profile.html',
                      {'user_form': user_form, 'worker_form': worker_form,
                       'categories_job': categories_job})
    if request.method == "POST":
        user_form = UserForm(request.POST, instance=request.user)
        worker_form = WorkerForm(request.POST, request.FILES, instance=request.user.worker)

        if user_form.is_valid() and worker_form.is_valid():
            print('user',user_form.cleaned_data)
            print('worker',worker_form.cleaned_data.get('title_image'))
            user_form.save()
            # worker, created = Worker.objects.get_or_create(user=user, )
            worker_form.save()
            # worker.save()
            # worker_form.save_m2m()
        else:
            print('u', user_form.cleaned_data)
            print('w', worker_form.cleaned_data)
        return HttpResponseRedirect(reverse('worker_account'))

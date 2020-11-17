from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Worker


class SignUpForm(UserCreationForm):
    email = forms.EmailField(max_length=100)
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name','email', 'password1', 'password2')


class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')


class WorkerForm(forms.ModelForm):

    class Meta:
        model = Worker
        fields = ('cities', 'subcategories', 'title_image', 'describe')
        widgets = {
            'subcategories': forms.CheckboxSelectMultiple(),
            'cities': forms.CheckboxSelectMultiple()
        }

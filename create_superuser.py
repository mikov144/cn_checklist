import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cl_back.settings')
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'mikov144@mail.ru', 'pushkin144')

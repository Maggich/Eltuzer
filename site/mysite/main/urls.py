from django.urls import path
from .views import home, index, about, contact
urlpatterns = [
    
    path('home/', home, name='home'),
    path('about/', about, name='about'),
    path('contact/', contact, name='contact'),
]

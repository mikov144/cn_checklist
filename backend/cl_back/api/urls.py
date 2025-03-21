from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/update/<int:pk>/", views.NoteUpdate.as_view(), name="update-note"),
    path("user/", views.UserDetailView.as_view(), name="user-detail"),
    path("user/register/", views.CreateUserView.as_view(), name="register"),
    path("user/update/", views.UserUpdateView.as_view(), name="user-update"),
    path("user/change-password/", views.ChangePasswordView.as_view(), name="change-password"),
]
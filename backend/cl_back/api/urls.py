from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/update/<int:pk>/", views.NoteUpdate.as_view(), name="update-note"),
    path("notes/order/", views.NoteOrderUpdate.as_view(), name="update-note-order"),
    path("categories/", views.CategoryListCreate.as_view(), name="category-list"),
    path("categories/delete/<int:pk>/", views.CategoryDelete.as_view(), name="delete-category"),
    path("categories/update/<int:pk>/", views.CategoryUpdate.as_view(), name="update-category"),
    path("user/", views.UserDetailView.as_view(), name="user-detail"),
    path("user/register/", views.CreateUserView.as_view(), name="register"),
    path("user/update/", views.UserUpdateView.as_view(), name="user-update"),
    path("user/change-password/", views.ChangePasswordView.as_view(), name="change-password"),
]
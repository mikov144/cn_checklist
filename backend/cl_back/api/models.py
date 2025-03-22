from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")

    def __str__(self):
        return self.title

class Note(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="notes")
    order = models.PositiveIntegerField(default=0)
    scratched_out = models.BooleanField(default=False)  # New field to track if the note is scratched out

    def __str__(self):
        return self.content[:20]  # Display the first 20 characters of the content


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.user.username
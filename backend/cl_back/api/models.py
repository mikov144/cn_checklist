from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


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
    scratched_out = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.order == 0:
            max_order = Note.objects.filter(category=self.category).aggregate(models.Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.content[:20]  # Display the first 20 characters of the content


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.user.username


class VisitorPresence(models.Model):
    """Tracks unique visitors and their last heartbeat for online presence."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="visitors")
    visitor_id = models.CharField(max_length=64, unique=True)
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True, db_index=True)
    user_agent = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def touch(self):
        self.last_seen = timezone.now()
        self.save(update_fields=["last_seen"])

    def __str__(self):
        return f"{self.visitor_id} ({self.user.username if self.user else 'anon'})"
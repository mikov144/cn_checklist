from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserCreateSerializer, UserUpdateSerializer, NoteSerializer, ChangePasswordSerializer, CategorySerializer
from .models import Note, Category, VisitorPresence
from django.utils import timezone
from datetime import timedelta
from django.db.models import OuterRef, Subquery

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Order entire trees by their root note's "order" and preserve subtree order via lft
        root_order_subquery = Note.objects.filter(
            tree_id=OuterRef('tree_id'),
            parent__isnull=True,
            author=user,
        ).values('order')[:1]

        return (
            Note.objects
            .filter(author=user)
            .annotate(root_order=Subquery(root_order_subquery))
            .order_by('root_order', 'lft')
        )

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class NoteUpdate(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class NoteOrderUpdate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        ordering = request.data.get('ordering', [])
        for order, note_id in enumerate(ordering, start=1):  # Start from 1 instead of 0
            Note.objects.filter(id=note_id, author=request.user).update(order=order)
        return Response(status=status.HTTP_204_NO_CONTENT)

class NoteResetOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        category_id = request.data.get('category_id')
        if not category_id:
            return Response({"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        notes = Note.objects.filter(category_id=category_id, author=request.user).order_by('created_at')
        for order, note in enumerate(notes, start=1):  # Start from 1 here as well
            note.order = order
            note.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoryListCreate(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class CategoryDelete(generics.DestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

class CategoryUpdate(generics.UpdateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PresenceHeartbeat(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        visitor_id = request.data.get('visitor_id')
        user_agent = request.headers.get('User-Agent', '')[:255]
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0] or request.META.get('REMOTE_ADDR')

        if not visitor_id:
            return Response({"error": "visitor_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        defaults = {
            'user': request.user if request.user.is_authenticated else None,
            'user_agent': user_agent,
            'ip_address': ip_address,
        }

        visitor, created = VisitorPresence.objects.get_or_create(visitor_id=visitor_id, defaults=defaults)

        # Update association if user logs in later
        if request.user.is_authenticated and visitor.user != request.user:
            visitor.user = request.user
        visitor.user_agent = user_agent
        visitor.ip_address = ip_address
        visitor.touch()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PresenceStats(APIView):
    permission_classes = [permissions.AllowAny]

    ONLINE_WINDOW_SECONDS = 60

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        threshold = now - timedelta(seconds=self.ONLINE_WINDOW_SECONDS)
        recent_qs = VisitorPresence.objects.filter(last_seen__gte=threshold)
        online_authenticated_users = recent_qs.exclude(user__isnull=True).values_list('user', flat=True).distinct().count()
        online_anonymous_visitors = recent_qs.filter(user__isnull=True).count()
        online_count = online_authenticated_users + online_anonymous_visitors

        total_visitors = VisitorPresence.objects.count()
        total_users_ever = VisitorPresence.objects.exclude(user__isnull=True).values_list('user', flat=True).distinct().count()

        return Response({
            'online': online_count,
            'total': total_visitors,
            'online_breakdown': {
                'authenticated_users': online_authenticated_users,
                'anonymous_visitors': online_anonymous_visitors,
            },
            'totals': {
                'unique_visitors': total_visitors,
                'unique_authenticated_users': total_users_ever,
            },
            'window_seconds': self.ONLINE_WINDOW_SECONDS,
        })
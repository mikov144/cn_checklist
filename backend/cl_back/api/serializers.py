from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from rest_framework import serializers
from .models import Note, Profile, Category


def validate_image_size(image):
    max_size = 5 * 1024 * 1024  # 5MB
    if image.size > max_size:
        raise serializers.ValidationError("Image file size must be less than 5MB.")

class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True, validators=[validate_image_size])

    class Meta:
        model = Profile
        fields = ['profile_picture']

class UserCreateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=True, validators=[MinLengthValidator(6)])

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {
            "profile": {"required": False}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "profile"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.save()

        profile.profile_picture = profile_data.get('profile_picture', profile.profile_picture)
        profile.save()

        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "title"]

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "content", "created_at", "author", "category", "order", "scratched_out", "important"]
        extra_kwargs = {"author": {"read_only": True}}

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[MinLengthValidator(6)])
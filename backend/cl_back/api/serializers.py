from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture']
        extra_kwargs = {
            'profile_picture': {'required': False}
        }

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
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

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        profile.profile_picture = profile_data.get('profile_picture', profile.profile_picture)
        profile.save()

        return instance


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
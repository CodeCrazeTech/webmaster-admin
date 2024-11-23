from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={"input_type": "password"})

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "password", "password2")
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True}
        }

    def save(self):
        user = get_user_model()(
            email=self.validated_data["email"],
            username=self.validated_data["username"],
        )

        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError(
                {"password": "Passwords do not match!"})

        user.set_password(password)
        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email','username','profile_picture')

class AccountUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "profile_picture", "password", "password2")
        extra_kwargs = {
            "username": {"required": False},
            "email": {"required": False},
            "profile_picture": {"required": False},
            "password": {"required": False},
            "password2": {"required": False},
        }

    def validate(self, data):
        if 'password' in data or 'password2' in data:
            if data.get('password') != data.get('password2'):
                raise serializers.ValidationError({"password": "Passwords do not match!"})
        return data

    def update(self, instance, validated_data):
        if "profile_picture" in validated_data:
            instance.delete_old_profile_image()

        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)

        if "profile_picture" in validated_data:
            instance.profile_picture = validated_data["profile_picture"]

        if "password" in validated_data and validated_data["password"]:
            instance.set_password(validated_data["password"])

        instance.save()
        return instance

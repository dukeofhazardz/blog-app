from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from django.utils import timezone

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'],
										   password=clean_data['password'],
										   first_name=clean_data['first_name'],
										   last_name=clean_data['last_name']
										   )
		user_obj.username = clean_data['username']
		user_obj.created_at = timezone.now()
		user_obj.updated_at = timezone.now()
		user_obj.save()
		return user_obj
	
	def update(self, instance, validated_data):
		instance.password = validated_data.get('password', instance.password)
		instance.updated_at = timezone.now()
		instance.save()
		return instance

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('id', 'first_name', 'last_name', 'email', 'username', 'created_at', 'updated_at')


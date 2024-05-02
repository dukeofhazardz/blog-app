from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime
from django.core.exceptions import ValidationError
from user_api.serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer

UserModel = get_user_model()

class TestUserSerializers(TestCase):
    def setUp(self):
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'username': 'johndoe',
            'password': 'password123'
        }
        self.user = UserModel.objects.create_user(**self.user_data)

    def test_user_register_serializer_create(self):
        get_user_model().objects.all().delete()

        serializer = UserRegisterSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user_obj = serializer.save()
        self.assertEqual(user_obj.email, self.user_data['email'])
        self.assertEqual(user_obj.first_name, self.user_data['first_name'])
        self.assertEqual(user_obj.last_name, self.user_data['last_name'])
        self.assertEqual(user_obj.username, self.user_data['username'])
        self.assertTrue(user_obj.created_at)
        self.assertTrue(user_obj.updated_at)

    def test_user_register_serializer_update(self):
        updated_data = {
            'password': 'new_password123'
        }
        serializer = UserRegisterSerializer(instance=self.user, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid())
        user_obj = serializer.save()
        self.assertTrue(user_obj.updated_at)
        self.assertEqual(user_obj.password, updated_data['password'])

    def test_user_login_serializer_valid_data(self):
        serializer = UserLoginSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.check_user(self.user_data)
        self.assertEqual(user, self.user)

    def test_user_login_serializer_invalid_data(self):
        invalid_data = {
            'email': 'invalid@example.com',
            'password': 'invalidpassword'
        }
        serializer = UserLoginSerializer(data=invalid_data)
        with self.assertRaises(ValidationError):
            serializer.check_user(invalid_data)

    def test_user_serializer(self):
        serializer = UserSerializer(instance=self.user)
        expected_fields = {'id', 'first_name', 'last_name', 'email', 'username', 'created_at', 'updated_at'}
        self.assertEqual(set(serializer.data.keys()), expected_fields)


class TestUserViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'username': 'johndoe',
            'password': 'password123'
        }
        self.user = UserModel.objects.create_user(**self.user_data)
        self.client.login(email=self.user_data['email'], password=self.user_data['password'])

    def test_user_register_view(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': f'john.doe.{timestamp}@example.com',
            'username': 'johndoe',
            'password': 'password123'
        }
        url = '/api/register'
        response = self.client.post(url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_login_view(self):
        url = '/api/login'
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_logout_view(self):
        url = '/api/logout'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_view(self):
        url = f'/api/reset-password/{self.user.id}/'
        new_password = 'new_password123'
        data = {'password': new_password}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        # Verify password has been updated
        updated_user = UserModel.objects.get(id=self.user.id)
        self.assertEqual(updated_user.password, new_password)

    def test_user_view(self):
        url = '/api/user'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_by_id_view(self):
        url = f'/api/user/{self.user.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestCustomUserModel(TestCase):
    def test_create_user(self):
        user = UserModel.objects.create_user(
            email='test@example.com',
            password='testpassword',
            first_name='John',
            last_name='Doe',
            username='johndoe'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpassword'))
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.username, 'johndoe')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        admin_user = UserModel.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword',
            first_name='Admin',
            last_name='User',
            username='adminuser'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.check_password('adminpassword'))
        self.assertEqual(admin_user.first_name, 'Admin')
        self.assertEqual(admin_user.last_name, 'User')
        self.assertEqual(admin_user.username, 'adminuser')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.test import APIClient
from .models import Blog, Category, Tag, Comment
from user_api.models import CustomUser
from .serializers import (
    CreateUpdateBlogSerializer,
    BlogSerializer,
    CreateCommentSerializer,
    TagSerializer,
    CategorySerializer,
    CommentSerializer,
)
import os

User = get_user_model()


class TestSerializers(TestCase):
    def setUp(self):
        # Create a CustomUser instance
        self.user = CustomUser.objects.create_user(first_name="John",
                                             last_name="Doe",
                                             username="test_user",
                                             email="test@example.com",
                                             password="password")

        self.category = Category.objects.create(name="Test Category")
        self.tag1 = Tag.objects.create(name="Test Tag 1")
        self.tag2 = Tag.objects.create(name="Test Tag 2")

        # Create a Blog instance
        self.blog = Blog.objects.create(
            author=self.user,
            title="Test Blog",
            content="This is a test blog content",
            category=self.category,
        )
        self.blog.tags.add(self.tag1, self.tag2)

        # Use the created Blog instance's ID for creating the comment
        self.comment_data = {
            "author": self.user.id,
            "blog": self.blog.id,
            "content": "This is a test comment",
        }

    def test_create_update_blog_serializer(self):
        # Define blog_data
        blog_data = {
            "author": self.user.id,
            "title": "Test Blog",
            "content": "This is a test blog content",
            "category": self.category.name,
            "tags": "#TestTag1 #TestTag2",
        }
        serializer = CreateUpdateBlogSerializer(data=blog_data)
        self.assertTrue(serializer.is_valid())
        serializer = CreateUpdateBlogSerializer(data=blog_data)
        self.assertTrue(serializer.is_valid())

    def test_create_comment_serializer(self):
        serializer = CreateCommentSerializer(data=self.comment_data)
        self.assertTrue(serializer.is_valid())

    def test_blog_serializer(self):
        blog = Blog.objects.create(
            author_id=1,  # Assuming author ID
            title="Test Blog",
            content="This is a test blog content",
            category=self.category,
        )
        blog.tags.add(self.tag1, self.tag2)
        serializer = BlogSerializer(blog)
        expected_data = {
            "id": blog.id,
            "author": 1,  # Assuming author ID
            "title": "Test Blog",
            "content": "This is a test blog content",
            "image": "/media/default.jpg",
            "category": self.category.id,
            "tags": [self.tag1.id, self.tag2.id],
            "created_at": blog.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "updated_at": blog.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        }
        self.assertEqual(serializer.data, expected_data)

    def test_category_serializer(self):
        serializer = CategorySerializer(self.category)
        expected_data = {
            "id": self.category.id,
            "name": "Test Category",
            "created_at": self.category.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "updated_at": self.category.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        }
        self.assertEqual(serializer.data, expected_data)

    def test_tag_serializer(self):
        serializer = TagSerializer(self.tag1)
        expected_data = {
            "id": self.tag1.id,
            "name": "Test Tag 1",
            "created_at": self.tag1.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "updated_at": self.tag1.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        }
        self.assertEqual(serializer.data, expected_data)

    def test_comment_serializer(self):
        comment = Comment.objects.create(
            blog_id=1,  # Assuming blog ID
            author_id=1,  # Assuming author ID
            content="This is a test comment",
        )
        serializer = CommentSerializer(comment)
        expected_data = {
            "id": comment.id,
            "author": 1,  # Assuming author ID
            "content": "This is a test comment",
            "created_at": comment.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            "updated_at": comment.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        }
        self.assertEqual(serializer.data, expected_data)


class TestViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            first_name="John",
            last_name="Doe",
            username="test_user",
            email="test@example.com",
            password="password"
        )
        self.category = Category.objects.create(name="Test Category")
        self.tag1 = Tag.objects.create(name="Test Tag 1")
        self.tag2 = Tag.objects.create(name="Test Tag 2")
        default_image_path = os.path.join(settings.MEDIA_ROOT, 'default.jpg')
        self.blog_data = {
            "title": "Test Blog",
            "content": "This is a test blog content",
            "image": open(default_image_path, 'rb'),
            "category": self.category.name,
            "tags": "#TestTag1 #TestTag2",
        }
        self.client.force_login(self.user)

    def test_create_blog(self):
        url = reverse("create")
        response = self.client.post(url, self.blog_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_blogs(self):
        url = reverse("allblogs")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_blog(self):
        category, created = Category.objects.get_or_create(name="Test Category")
        blog = Blog.objects.create(
            author=self.user,
            title="Test Blog",
            content="This is a test blog content",
            category=category,
        )
        url = reverse("blog", kwargs={"pk": blog.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestModels(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username="test_user", email="test@example.com", password="password")
        self.category = Category.objects.create(name="Test Category")
        self.tag1 = Tag.objects.create(name="Tag1")
        self.tag2 = Tag.objects.create(name="Tag2")
        self.blog = Blog.objects.create(
            author=self.user,
            title="Test Blog",
            content="This is a test blog content",
            category=self.category
        )
        self.comment = Comment.objects.create(
            blog=self.blog,
            author=self.user,
            content="This is a test comment"
        )

    def test_category_str(self):
        self.assertEqual(str(self.category), "Test Category")

    def test_tag_str(self):
        self.assertEqual(str(self.tag1), "Tag1")
        self.assertEqual(str(self.tag2), "Tag2")

    def test_blog_str(self):
        self.assertEqual(str(self.blog), "Test Blog")

    def test_comment_str(self):
        expected_str = f"Comment by {self.user.username} on {self.blog.title}"
        self.assertEqual(str(self.comment), expected_str)

    def test_blog_created_at(self):
        self.assertIsNotNone(self.blog.created_at)
        self.assertTrue(timezone.now() - self.blog.created_at < timezone.timedelta(seconds=1))

    def test_blog_updated_at(self):
        self.assertIsNotNone(self.blog.updated_at)
        self.assertTrue(timezone.now() - self.blog.updated_at < timezone.timedelta(seconds=1))

    def test_comment_created_at(self):
        self.assertIsNotNone(self.comment.created_at)
        self.assertTrue(timezone.now() - self.comment.created_at < timezone.timedelta(seconds=1))

    def test_comment_updated_at(self):
        self.assertIsNotNone(self.comment.updated_at)
        self.assertTrue(timezone.now() - self.comment.updated_at < timezone.timedelta(seconds=1))

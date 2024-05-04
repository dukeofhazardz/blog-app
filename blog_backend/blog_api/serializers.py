from rest_framework import serializers
from .models import Blog, Category, Tag, Comment
from django.utils import timezone
import re


class CreateUpdateBlogSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)
    content = serializers.CharField()
    category = serializers.CharField()
    tags = serializers.CharField()
    image = serializers.ImageField(required=False)

    class Meta:
        model = Blog
        exclude = ('created_at', 'updated_at')

    def create(self, validated_data):
        category_name = validated_data.pop('category')
        category_obj, created = Category.objects.get_or_create(name=category_name)
        tags_str = validated_data.pop('tags')
        tags_list = re.findall(r'#\w+', tags_str)
        
        if created:
            # Optionally, you can add more fields to the category object here if needed
            category_obj.save()

        validated_data['category'] = category_obj
        validated_data['created_at'] = timezone.now()
        validated_data['updated_at'] = timezone.now()

        blog_obj = Blog.objects.create(**validated_data)

        for tag_name in tags_list:
            tag_name = tag_name.lstrip('#')
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            blog_obj.tags.add(tag_obj)

        return blog_obj
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.image = validated_data.get('image', instance.image)
        instance.updated_at = timezone.now()
        instance.save()
        return instance

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        exclude = ('created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_at'] = timezone.now()
        validated_data['updated_at'] = timezone.now()
        comment_obj = Comment.objects.create(**validated_data)
        return comment_obj

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'author', 'content', 'created_at', 'updated_at' )

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('id', 'author', 'title', 'content', 'image', 'category', 'tags', 'created_at', 'updated_at')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'created_at', 'updated_at')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'created_at', 'updated_at')
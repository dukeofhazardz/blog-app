from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404
from .serializers import CreateUpdateBlogSerializer, BlogSerializer, CreateCommentSerializer, TagSerializer, CategorySerializer, CommentSerializer
from rest_framework import permissions, status
from .models import Blog, Category, Tag, Comment


class CreateUpdateBlog(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self, pk=None):
        if pk is not None:
            try:
                return Blog.objects.get(pk=pk)
            except Blog.DoesNotExist:
                raise Http404


    def post(self, request):
        request_data = request.data.copy()
        request_data['author'] = request.user.id
        serializer = CreateUpdateBlogSerializer(data=request_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        blog = self.get_object(pk)
        serializer = CreateUpdateBlogSerializer(blog, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteBlog(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, pk):
        try:
            return Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            raise Http404("Blog does not exist.")

    def delete(self, request, pk):
        blog = self.get_object(pk)
        blog.delete()
        return Response({'message': 'Blog deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class CreateComment(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommentSerializer

    def get_object(self, pk=None):
        if pk is not None:
            try:
                return Blog.objects.get(pk=pk)
            except Blog.DoesNotExist:
                raise Http404

    def post(self, request, pk):
        request_data = request.data.copy()
        blog = self.get_object(pk)
        request_data['author'] = request.user.id
        request_data['blog'] = blog.id
        serializer = CreateCommentSerializer(data=request_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetCommentsByBlog(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        blog_id = self.kwargs.get('pk')
        try:
            blog = Blog.objects.get(pk=blog_id)
            return Comment.objects.filter(blog=blog)
        except Blog.DoesNotExist:
            raise NotFound("Blog does not exist.")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BlogView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk=None):
        if pk is not None:
            # Retrieve a specific blog by its ID
            try:
                blog = Blog.objects.get(pk=pk)
                serializer = BlogSerializer(blog)
                return Response(serializer.data)
            except Blog.DoesNotExist:
                return Response({"error": "Blog does not exist"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve all blogs
            blogs = Blog.objects.all()
            serializer = BlogSerializer(blogs, many=True)
            return Response(serializer.data)

class GetCategories(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class GetTags(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class GetBlogsByCategory(generics.ListAPIView):
    serializer_class = BlogSerializer

    def get_queryset(self):
        category_name = self.kwargs.get('category_name')
        try:
            # Assuming category name is unique
            return Blog.objects.filter(category__name=category_name)
        except Blog.DoesNotExist:
            raise NotFound("Category does not exist.")


class GetBlogsByTag(generics.ListAPIView):
    serializer_class = BlogSerializer

    def get_queryset(self):
        tag_name = self.kwargs.get('tag_name')
        try:
            # Assuming tag name is unique
            return Blog.objects.filter(tags__name=tag_name)
        except Blog.DoesNotExist:
            raise NotFound("Tag does not exist.")
        

class GetBlogsByAuthor(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        author_id = self.kwargs.get('author_id')
        try:
            # Assuming author ID is unique
            return Blog.objects.filter(author__id=author_id)
        except Blog.DoesNotExist:
            raise NotFound("Author does not exist.")

from django.urls import path
from . import views

urlpatterns = [
    path('create', views.CreateUpdateBlog.as_view(), name='create'),
    path('update/<int:pk>/', views.CreateUpdateBlog.as_view(), name='update'),
	path('delete/<int:pk>/', views.DeleteBlog.as_view(), name='delete'),
	path('blog', views.BlogView.as_view(), name='allblogs'),
	path('blog/<int:pk>/', views.BlogView.as_view(), name='blog'),
    path('blogs/author/<int:author_id>/', views.GetBlogsByAuthor.as_view(), name='blogs-by-author'),
    path('comment/<int:pk>/', views.CreateComment.as_view(), name='comment'),
    path('comments/<int:pk>/', views.GetCommentsByBlog.as_view(), name='comments'),
    path('tags', views.GetTags.as_view(), name='tags'),
    path('categories', views.GetCategories.as_view(), name='categories'),
    path('category/<str:category_name>/', views.GetBlogsByCategory.as_view(), name='get_blogs_by_category'),
    path('tag/<str:tag_name>/', views.GetBlogsByTag.as_view(), name='get_blogs_by_tag'),
]

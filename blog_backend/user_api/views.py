from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer,  UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation
from .models import CustomUser


class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		try:
			refresh_token = request.data.get("refresh_token")
			token = RefreshToken(refresh_token)
			token.blacklist()
			return Response(status=status.HTTP_205_RESET_CONTENT)
		except Exception as e:
			print(e)
			return Response(status=status.HTTP_400_BAD_REQUEST)


class PasswordReset(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	##
 
	def get_object(self, pk=None):
		if pk is not None:
			try:
				return CustomUser.objects.get(pk=pk)
			except CustomUser.DoesNotExist:
				raise Http404

	def put(self, request, pk):
		user = self.get_object(pk)
		serializer = UserRegisterSerializer(user, request.data, partial=True, context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class UserByIDView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
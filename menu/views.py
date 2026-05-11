from rest_framework import permissions, viewsets
from .models import MenuItem
from .serializers import MenuItemSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = MenuItem.objects.all()
        available = self.request.query_params.get("available")
        if available is not None:
            if available.lower() in ["1", "true", "yes"]:
                queryset = queryset.filter(is_available=True)
            elif available.lower() in ["0", "false", "no"]:
                queryset = queryset.filter(is_available=False)
        return queryset

from django.shortcuts import render

# Create your views here.

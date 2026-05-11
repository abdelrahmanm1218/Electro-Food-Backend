from django.urls import path
from .views import (
    AdminDashboardView,
    AdminOrderDetailView,
    AdminOrdersView,
    AdminOrderStatusUpdateView,
    CartItemUpdateDeleteView,
    CartListCreateView,
    CreateOrderView,
    MyOrdersView,
    OrderDetailView,
)

urlpatterns = [
    path("cart/", CartListCreateView.as_view(), name="cart-list-create"),
    path("cart/<int:pk>/", CartItemUpdateDeleteView.as_view(), name="cart-item-update-delete"),
    path("checkout/", CreateOrderView.as_view(), name="checkout"),
    path("my-orders/", MyOrdersView.as_view(), name="my-orders"),
    path("my-orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("admin/orders/", AdminOrdersView.as_view(), name="admin-orders"),
    path("admin/orders/<int:pk>/", AdminOrderDetailView.as_view(), name="admin-order-detail"),
    path("admin/orders/<int:pk>/status/", AdminOrderStatusUpdateView.as_view(), name="admin-order-status"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
]

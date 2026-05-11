from django.contrib import admin
from .models import CartItem, Order, OrderItem


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "menu_item", "quantity", "created_at")
    search_fields = ("user__username", "menu_item__name_en")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "payment_method", "total_price", "created_at", "governorate", "city", "street")
    list_filter = ("status", "payment_method")
    search_fields = ("user__username",)
    inlines = [OrderItemInline]

from decimal import Decimal
from rest_framework import serializers
from menu.models import MenuItem
from menu.serializers import MenuItemSerializer
from .models import CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source="menu_item", read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "menu_item", "menu_item_detail", "quantity", "created_at"]


class AddToCartSerializer(serializers.Serializer):
    menu_item = serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.filter(is_available=True))
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source="menu_item", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "menu_item", "menu_item_detail", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "payment_method", "total_price", "created_at", "updated_at", "items", "governorate", "city", "street", "user_email"]


class CreateOrderSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    governorate = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=100)
    street = serializers.CharField(max_length=255)

    def create_order_from_cart(self, user):
        cart_items = CartItem.objects.filter(user=user).select_related("menu_item")
        if not cart_items.exists():
            raise serializers.ValidationError("Cart is empty.")

        order = Order.objects.create(
            user=user,
            payment_method=self.validated_data["payment_method"],
            governorate=self.validated_data["governorate"],
            city=self.validated_data["city"],
            street=self.validated_data["street"]
        )
        total = Decimal("0.00")
        for cart_item in cart_items:
            line_total = cart_item.menu_item.price * cart_item.quantity
            total += line_total
            OrderItem.objects.create(
                order=order,
                menu_item=cart_item.menu_item,
                quantity=cart_item.quantity,
                unit_price=cart_item.menu_item.price,
            )

        order.total_price = total
        order.save(update_fields=["total_price"])
        cart_items.delete()
        return order

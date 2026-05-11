import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { cartItems, fetchCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [address, setAddress] = useState({
    governorate: "",
    city: "",
    street: ""
  });
  const { t, i18n } = useTranslation();

  const total = cartItems.reduce((sum, item) => sum + Number(item.menu_item_detail.price) * item.quantity, 0);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.patch(`/orders/cart/${id}/`, { quantity });
      fetchCart();
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/orders/cart/${id}/`);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const checkout = async () => {
    if (!address.governorate || !address.city || !address.street) {
      toast.error("Please fill in your delivery address");
      return;
    }

    try {
      await api.post("/orders/checkout/", { 
        payment_method: paymentMethod,
        governorate: address.governorate,
        city: address.city,
        street: address.street
      });
      toast.success("Order placed successfully!");
      fetchCart();
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">{t("cartEmpty") || "Your cart is empty"}</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <a href="/">{t("browseMenu") || "Browse Menu"}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t("cart")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("item") || "Item"}</TableHead>
                  <TableHead className="text-center">{t("quantity") || "Quantity"}</TableHead>
                  <TableHead className="text-right">{t("price") || "Price"}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.menu_item_detail.image_url || "https://picsum.photos/80/80"} 
                          alt={i18n.language === "ar" ? item.menu_item_detail.name_ar : item.menu_item_detail.name_en}
                          className="h-16 w-16 rounded-md object-cover border"
                        />
                        <div>
                          <div className="font-medium">
                            {i18n.language === "ar" ? item.menu_item_detail.name_ar : item.menu_item_detail.name_en}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.menu_item_detail.price}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${(Number(item.menu_item_detail.price) * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("deliveryAddress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="governorate">{t("governorate")}</Label>
              <Input 
                id="governorate" 
                value={address.governorate} 
                onChange={(e) => setAddress({...address, governorate: e.target.value})}
                placeholder={t("governorate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input 
                id="city" 
                value={address.city} 
                onChange={(e) => setAddress({...address, city: e.target.value})}
                placeholder={t("city")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">{t("street")}</Label>
              <Input 
                id="street" 
                value={address.street} 
                onChange={(e) => setAddress({...address, street: e.target.value})}
                placeholder={t("street")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t("orderSummary") || "Order Summary"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t("paymentMethod")}</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors" onClick={() => setPaymentMethod("online")}>
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer font-medium">{t("onlinePayment")}</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors" onClick={() => setPaymentMethod("cod")}>
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">{t("cashOnDelivery")}</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-lg h-12" size="lg" onClick={checkout}>
              {t("checkout")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

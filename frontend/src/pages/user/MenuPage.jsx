import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    api.get("/menu/items/").then((res) => {
      const data = res.data;
      setItems(Array.isArray(data) ? data : data.results || []);
    });
  }, []);

  const addToCart = async (menuItemId, itemName) => {
    if (!user) return;
    try {
      await api.post("/orders/cart/", { menu_item: menuItemId, quantity: 1 });
      fetchCart();
      toast.success(`${itemName} added to cart`);
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const itemName = i18n.language === "ar" ? item.name_ar : item.name_en;
        return (
          <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                className="h-full w-full object-cover transition-transform hover:scale-105" 
                src={item.image_url || "https://picsum.photos/400/300"} 
                alt={itemName}
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">
                  {itemName}
                </CardTitle>
                <span className="font-bold text-primary">${item.price}</span>
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {i18n.language === "ar" ? item.description_ar : item.description_en}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              {item.is_available ? (
                user ? (
                  <Button className="w-full gap-2" onClick={() => addToCart(item.id, itemName)}>
                    <ShoppingCart className="h-4 w-4" />
                    {t("addToCart")}
                  </Button>
                ) : null
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  {t("unavailable")}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

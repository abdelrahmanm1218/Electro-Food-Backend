import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Package, User, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";

const statuses = ["pending", "confirmed", "preparing", "on_the_way", "delivered"];

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { t, i18n } = useTranslation();

  const loadOrder = async () => {
    const { data } = await api.get(`/orders/admin/orders/${orderId}/`);
    setOrder(data);
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const updateStatus = async (status) => {
    try {
      await api.patch(`/orders/admin/orders/${orderId}/status/`, { status });
      loadOrder();
      toast.success(t("status") + " updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <Badge variant="outline">{t("pending") || "Pending"}</Badge>;
      case "confirmed": return <Badge variant="secondary">{t("confirmed") || "Confirmed"}</Badge>;
      case "preparing": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t("preparing") || "Preparing"}</Badge>;
      case "on_the_way": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{t("on_the_way") || "On the Way"}</Badge>;
      case "delivered": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("delivered") || "Delivered"}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (!order) return <div className="flex justify-center py-20">{t("loading") || "Loading..."}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/orders">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{t("orderId")} #{order.id}</h2>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("orderItems") || "Order Items"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("item")}</TableHead>
                  <TableHead className="text-center">{t("quantity")}</TableHead>
                  <TableHead className="text-end">{t("unitPrice") || "Unit Price"}</TableHead>
                  <TableHead className="text-end">{t("total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">
                        {i18n.language === "ar" ? item.menu_item_detail.name_ar : item.menu_item_detail.name_en}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-end">${item.unit_price}</TableCell>
                    <TableCell className="text-end font-semibold">
                      ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 flex flex-col items-end gap-2 pe-4">
              <div className="flex w-full max-w-[200px] justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>${order.total_price}</span>
              </div>
              <Separator className="w-full max-w-[200px]" />
              <div className="flex w-full max-w-[200px] justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span className="text-primary">${order.total_price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("customerInfo") || "Customer Info"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.user_email || "N/A"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("deliveryAddress")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("governorate")}: <span className="text-foreground">{order.governorate || "N/A"}</span></p>
              <p className="text-sm font-medium text-muted-foreground">{t("city")}: <span className="text-foreground">{order.city || "N/A"}</span></p>
              <p className="text-sm font-medium text-muted-foreground">{t("street")}: <span className="text-foreground">{order.street || "N/A"}</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("paymentAndStatus") || "Payment & Status"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("paymentMethod")}</p>
                <Badge variant="outline" className="capitalize">
                  {order.payment_method === "online" ? t("onlinePayment") : t("cashOnDelivery")}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t("updateStatus") || "Update Status"}</p>
                <Select value={order.status} onValueChange={updateStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

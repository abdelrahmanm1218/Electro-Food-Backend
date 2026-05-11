import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, CreditCard, Receipt, Package, Truck, CheckCircle2, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    api.get("/orders/my-orders/").then((res) => setOrders(res.data));
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { progress: 20, icon: Clock, label: t("statusPending"), color: "text-muted-foreground" };
      case "confirmed": return { progress: 40, icon: Package, label: t("statusConfirmed"), color: "text-blue-600" };
      case "preparing": return { progress: 60, icon: Package, label: t("statusPreparing"), color: "text-indigo-600" };
      case "on_the_way": return { progress: 85, icon: Truck, label: t("statusOnTheWay"), color: "text-orange-600" };
      case "delivered": return { progress: 100, icon: CheckCircle2, label: t("statusDelivered"), color: "text-green-600" };
      default: return { progress: 0, icon: Clock, label: status, color: "" };
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

  const activeOrders = orders.filter(o => o.status !== "delivered");
  const pastOrders = orders.filter(o => o.status === "delivered");

  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
      <Card key={order.id} className="overflow-hidden border-2 transition-all hover:border-primary/20">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{t("orderId")} #{order.id}</CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString(i18n.language, {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-end">
              <p className="text-sm font-medium text-muted-foreground">{t("total")}</p>
              <p className="text-xl font-bold text-primary">${order.total_price}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                  <span className={statusInfo.color}>{statusInfo.label}</span>
                </div>
                <span className="text-muted-foreground font-medium">{statusInfo.progress}%</span>
              </div>
              <Progress value={statusInfo.progress} className="h-2" />
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{t("paymentMethod")}:</span>
                  <Badge variant="outline" className="capitalize">
                    {order.payment_method === "online" ? t("onlinePayment") : t("cashOnDelivery")}
                  </Badge>
                </div>
                <div className="flex items-start gap-2 text-sm font-medium">
                  <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <span>{t("deliveryAddress")}:</span>
                    <p className="text-muted-foreground font-normal">
                      {order.governorate || "N/A"}, {order.city || "N/A"}, {order.street || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  {t("orderItems")}
                </p>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 text-sm">
                      <img 
                        src={item.menu_item_detail.image_url || "https://picsum.photos/50/50"} 
                        alt={i18n.language === "ar" ? item.menu_item_detail.name_ar : item.menu_item_detail.name_en}
                        className="h-12 w-12 rounded-md object-cover border"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {i18n.language === "ar" ? item.menu_item_detail.name_ar : item.menu_item_detail.name_en}
                          </span>
                          <span className="font-medium">${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ${item.unit_price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Receipt className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("orders")}</h2>
          <p className="text-muted-foreground">Track and manage your recent restaurant orders</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="active" className="text-base">{t("activeOrders")}</TabsTrigger>
          <TabsTrigger value="past" className="text-base">{t("pastOrders")}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeOrders.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">{t("noActiveOrders")}</p>
              <p className="text-sm text-muted-foreground mt-1">When you place an order, it will appear here.</p>
            </Card>
          ) : (
            activeOrders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastOrders.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
              <div className="rounded-full bg-muted p-4 mb-4">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">{t("noPastOrders")}</p>
            </Card>
          ) : (
            pastOrders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

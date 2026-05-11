import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { toast } from "sonner";

const statuses = ["pending", "confirmed", "preparing", "on_the_way", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation();

  const loadOrders = async () => {
    const { data } = await api.get("/orders/admin/orders/");
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/admin/orders/${id}/status/`, { status });
      loadOrders();
      toast.success(`${t("orderId")} #${id} ${t("status")} updated to ${status}`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("orderManagement")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("orderId")}</TableHead>
              <TableHead>{t("customer") || "Customer"}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("payment") || "Payment"}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-end">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.user_email || "N/A"}</TableCell>
                <TableCell className="font-semibold">${order.total_price}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {order.payment_method === "online" ? t("onlinePayment") : t("cashOnDelivery")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue>{getStatusBadge(order.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {t("view")}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { toast } from "sonner";

const statuses = ["pending", "confirmed", "preparing", "on_the_way", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [orderDate, setOrderDate] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(count / 10));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const loadOrders = async ({ orderDate: date = "", page: pageNumber = 1 } = {}) => {
    const params = new URLSearchParams();
    if (date) params.set("order_date", date);
    if (pageNumber) params.set("page", pageNumber);

    const url = `/orders/admin/orders/${params.toString() ? `?${params.toString()}` : ""}`;
    const { data } = await api.get(url);
    const results = Array.isArray(data) ? data : data.results || [];

    setOrders(results);
    setPage(pageNumber);
    setCount(data.count ?? results.length);
    setNextPage(data.next ?? null);
    setPrevPage(data.previous ?? null);
  };

  useEffect(() => {
    loadOrders({ page: 1 });
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
        <div className="mb-6 grid gap-4 md:grid-cols-[auto_auto_1fr] items-end">
          <div className="grid gap-2">
            <Label htmlFor="orderDate">Order Date</Label>
            <Input
              id="orderDate"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:col-span-2">
            <Button onClick={() => loadOrders({ orderDate, page: 1 })}>Filter</Button>
            <Button variant="outline" onClick={() => { setOrderDate(""); loadOrders({ page: 1 }); }}>
              Reset
            </Button>
          </div>
        </div>
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
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              disabled={!prevPage}
              onClick={() => loadOrders({ orderDate, page: page - 1 })}
            >
              Previous
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant="outline"
                className={pageNumber === page ? "bg-primary text-white hover:bg-primary/90" : ""}
                onClick={() => loadOrders({ orderDate, page: pageNumber })}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={!nextPage}
              onClick={() => loadOrders({ orderDate, page: page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

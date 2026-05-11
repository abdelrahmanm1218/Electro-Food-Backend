import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Pencil, Utensils, Globe2, DollarSign, Info } from "lucide-react";

export default function AdminMenuItemDetailsPage() {
  const { menuItemId } = useParams();
  const [item, setItem] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    api.get(`/menu/items/${menuItemId}/`).then((res) => setItem(res.data));
  }, [menuItemId]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-medium">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/menu-items">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {i18n.language === "ar" ? item.name_ar : item.name_en}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">ID: #{item.id}</Badge>
              {item.is_available ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                  {t("available")}
                </Badge>
              ) : (
                <Badge variant="destructive">{t("unavailable") || "Unavailable"}</Badge>
              )}
            </div>
          </div>
        </div>
        <Button asChild className="whitespace-nowrap">
          <Link to="/admin/menu-items" className="gap-2">
            <Pencil className="h-4 w-4" />
            {t("editItem")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <img 
              className="aspect-square w-full object-cover" 
              src={item.image_url || "https://picsum.photos/600/600"} 
              alt={item.name_en}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Info className="h-5 w-5 text-primary" />
                {t("itemDetails") || "Item Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t("price")}
                  </p>
                  <p className="text-2xl font-bold text-primary">${item.price}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    English Content
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t("name") || "Name"}</p>
                    <p className="font-medium">{item.name_en}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t("description") || "Description"}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      {item.description_en || t("noDescription") || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-s ps-6">
                  <div className="flex items-center gap-2 font-semibold justify-end md:justify-start">
                    <span className="hidden md:inline">المحتوى العربي</span>
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span className="md:hidden">المحتوى العربي</span>
                  </div>
                  <div className="space-y-1 text-end md:text-start">
                    <p className="text-sm font-medium text-muted-foreground">{t("name") || "الاسم"}</p>
                    <p className="font-medium" dir="rtl">{item.name_ar}</p>
                  </div>
                  <div className="space-y-1 text-end md:text-start">
                    <p className="text-sm font-medium text-muted-foreground">{t("description") || "الوصف"}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground italic" dir="rtl">
                      {item.description_ar || "لا يوجد وصف."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

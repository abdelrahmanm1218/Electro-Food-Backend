import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  ShoppingCart, 
  ClipboardList, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Globe,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isAdminView = location.pathname.startsWith("/admin");

  const toggleLanguage = () => {
    const next = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-4">
        {isAdminView && <SidebarTrigger className="md:hidden" />}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">{t("appName")}</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {isAdminView ? (
          /* Admin Specific Nav */
          <Button variant="outline" size="sm" asChild className="hidden sm:flex border-primary text-primary hover:bg-primary/5">
            <Link to="/" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              {t("backToWebsite")}
            </Link>
          </Button>
        ) : (
          /* User Specific Nav */
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">{t("menu")}</Link>
            </Button>

            {user && (
              <>
                <Button variant="ghost" size="sm" asChild className="relative">
                  <Link to="/cart" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("cart")}</span>
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]" variant="destructive">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/orders" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("orders")}</span>
                  </Link>
                </Button>
                {user.is_staff && (
                  <Button variant="secondary" size="sm" asChild className="hidden sm:flex bg-primary/10 text-primary hover:bg-primary/20">
                    <Link to="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      {t("goToDashboard")}
                    </Link>
                  </Button>
                )}
              </>
            )}
          </>
        )}

        <div className="flex items-center gap-2 border-s ms-2 ps-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} title={i18n.language.toUpperCase()}>
            <Globe className="h-4 w-4" />
            <span className="sr-only">Toggle Language</span>
          </Button>

          {user ? (
            <Button variant="destructive" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          ) : (
            <>
              {!isAdminView && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      {t("login")}
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="hidden sm:flex">
                    <Link to="/register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      {t("register")}
                    </Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


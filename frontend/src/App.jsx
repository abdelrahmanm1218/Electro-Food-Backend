import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AdminSidebar } from "./components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "./context/AuthContext";
import AdminMenuItemDetailsPage from "./pages/admin/AdminMenuItemDetailsPage";
import AdminMenuItemsPage from "./pages/admin/AdminMenuItemsPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import CartPage from "./pages/user/CartPage";
import LoginPage from "./pages/user/LoginPage";
import MenuPage from "./pages/user/MenuPage";
import OrdersPage from "./pages/user/OrdersPage";
import RegisterPage from "./pages/user/RegisterPage";

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  return user?.is_staff ? children : <Navigate to="/" />;
}

function AdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <RequireAdmin>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
                <Route path="menu-items" element={<AdminMenuItemsPage />} />
                <Route path="menu-items/:menuItemId" element={<AdminMenuItemDetailsPage />} />
              </Routes>
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* User Routes */}
      <Route
        path="*"
        element={
          <UserLayout>
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/cart"
                element={
                  <RequireAuth>
                    <CartPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders"
                element={
                  <RequireAuth>
                    <OrdersPage />
                  </RequireAuth>
                }
              />
              {/* Redirect any other admin attempt without the layout */}
              <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            </Routes>
          </UserLayout>
        }
      />
    </Routes>
  );
}

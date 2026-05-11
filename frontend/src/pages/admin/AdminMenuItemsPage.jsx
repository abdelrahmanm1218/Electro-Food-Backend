import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();

  const loadItems = async () => {
    const { data } = await api.get("/menu/items/");
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleEditClick = (item) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingItem({
      name_en: "",
      name_ar: "",
      price: "",
      is_available: true,
      description_en: "",
      description_ar: "",
      image_url: ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem.id) {
        await api.put(`/menu/items/${editingItem.id}/`, editingItem);
        toast.success("Menu item updated successfully");
      } else {
        await api.post("/menu/items/", editingItem);
        toast.success("Menu item added successfully");
      }
      setIsDialogOpen(false);
      loadItems();
    } catch (err) {
      toast.error(editingItem.id ? "Failed to update menu item" : "Failed to add menu item");
    }
  };

  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">

        <CardTitle className="text-2xl font-bold">Menu Management</CardTitle>

        <Button size="sm" className="gap-2" onClick={handleAddClick}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
        
      </CardHeader>

      <CardContent>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>
                  <img 
                    src={item.image_url || "https://picsum.photos/40/40"} 
                    className="h-10 w-10 rounded-md object-cover"
                    alt={item.name_en}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{item.name_en}</div>
                  <div className="text-xs text-muted-foreground">{item.name_ar}</div>
                </TableCell>
                <TableCell className="font-semibold">${item.price}</TableCell>
                <TableCell>
                  {item.is_available ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {t("available")}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      {t("unavailable")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/menu-items/${item.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            <DialogDescription>
              {editingItem?.id 
                ? "Make changes to the menu item here. Click save when you're done." 
                : "Fill in the details for the new menu item. Click save to add it to the menu."}
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name_en" className="text-end">Name (EN)</Label>
                <Input
                  id="name_en"
                  value={editingItem.name_en}
                  onChange={(e) => setEditingItem({ ...editingItem, name_en: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name_ar" className="text-end">Name (AR)</Label>
                <Input
                  id="name_ar"
                  value={editingItem.name_ar}
                  onChange={(e) => setEditingItem({ ...editingItem, name_ar: e.target.value })}
                  className="col-span-3 text-end"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-end">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="available" className="text-end">Available</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={editingItem.is_available}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_available: checked })}
                  />
                  <Label htmlFor="available">{editingItem.is_available ? "Yes" : "No"}</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="desc_en" className="text-end pt-2">Desc (EN)</Label>
                <Textarea
                  id="desc_en"
                  className="col-span-3"
                  value={editingItem.description_en || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="desc_ar" className="text-end pt-2">Desc (AR)</Label>
                <Textarea
                  id="desc_ar"
                  className="col-span-3 text-end"
                  dir="rtl"
                  value={editingItem.description_ar || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description_ar: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

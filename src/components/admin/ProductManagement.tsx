import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Package, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  activo: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "",
    imagen_url: "",
    activo: true
  });

  const categories = ["Tartas", "Cupcakes", "Chocolates", "Galletas", "Postres Fríos", "Tortas"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio,
      categoria: product.categoria || "",
      imagen_url: product.imagen_url || "",
      activo: product.activo
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: 0,
      categoria: "",
      imagen_url: "",
      activo: true
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('productos')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('productos')
          .insert([formData]);

        if (error) throw error;
        toast.success('Producto creado exitosamente');
      }

      setEditingProduct(null);
      setIsCreating(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <Package className="h-6 w-6 mr-2 text-primary" />
            Gestión de Productos
          </h2>
          <Button onClick={handleCreate} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Formulario de edición/creación */}
        {(editingProduct || isCreating) && (
          <Card className="p-4 mb-6 border-2 border-primary/20">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Nombre del producto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imagen">URL de Imagen</Label>
                <Input
                  id="imagen"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
                />
                <Label>Producto activo</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </Card>
        )}

        {/* Lista de productos */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
              <p className="text-muted-foreground">Crea tu primer producto para comenzar.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.imagen_url && (
                    <img 
                      src={product.imagen_url} 
                      alt={product.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold flex items-center">
                      {product.nombre}
                      {!product.activo && (
                        <Badge variant="secondary" className="ml-2">Inactivo</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{product.descripcion}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{product.categoria}</Badge>
                      <span className="text-sm font-medium text-primary">{formatPrice(product.precio)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="hover:bg-destructive/10 hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductManagement;
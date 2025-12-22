

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, PackageSearch, Edit, Save, XCircle } from 'lucide-react';

const inventorySchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().min(1, 'Medicine name is required.'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  supplier: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;
type Medicine = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const INVENTORY_STORAGE_KEY = 'pharmacistInventory';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<{ quantity: number, price: number }>({ quantity: 0, price: 0 });
  const { toast } = useToast();
  
  const fetchInventory = () => {
    try {
      const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
    } catch (error) {
      console.error("Failed to load inventory from localStorage", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    window.addEventListener('focus', fetchInventory);
    return () => {
      window.removeEventListener('focus', fetchInventory);
    }
  }, []);

  const saveInventory = (updatedInventory: Medicine[]) => {
    setInventory(updatedInventory);
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
    } catch (error) {
      console.error("Failed to save inventory to localStorage", error);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save inventory data.' });
    }
  };

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      medicineName: '',
      quantity: 0,
      price: 0,
      supplier: '',
    },
  });
  
  const medicineName = form.watch('medicineName');
  const existingMedicine = inventory.find(m => m.name.toLowerCase() === medicineName.toLowerCase());

  const updateStatus = (medicine: Medicine): Medicine => {
    if (medicine.quantity <= 0) return { ...medicine, status: 'Out of Stock' };
    if (medicine.quantity < 50) return { ...medicine, status: 'Low Stock' };
    return { ...medicine, status: 'In Stock' };
  };

  const onSubmit = (data: InventoryFormValues) => {
    const existing = inventory.find(m => m.name.toLowerCase() === data.medicineName.toLowerCase());
    
    let updatedInventory: Medicine[];
    
    if (existing) {
      updatedInventory = inventory.map(m => 
        m.id === existing.id ? { ...m, quantity: m.quantity + data.quantity } : m
      );
      toast({
        title: 'Stock Updated',
        description: `Added ${data.quantity} units to ${existing.name}. New total: ${existing.quantity + data.quantity}.`,
      });
    } else {
       if (data.price <= 0) {
         form.setError("price", { type: "manual", message: "Price is required for new medicines." });
         return;
       }
      const newMedicine: Medicine = {
        id: `med-${Date.now()}`,
        name: data.medicineName,
        quantity: data.quantity,
        price: data.price,
        supplier: data.supplier || 'N/A',
        status: 'In Stock', // Initial status will be updated by updateStatus
      };
      updatedInventory = [newMedicine, ...inventory];
       toast({
        title: 'Medicine Added',
        description: `${data.medicineName} has been added to the inventory.`,
      });
    }

    saveInventory(updatedInventory.map(updateStatus));
    form.reset();
  };

  const handleStartEditing = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setEditingValues({ quantity: medicine.quantity, price: medicine.price });
  };

  const handleCancelEditing = () => {
    setEditingMedicineId(null);
  };

  const handleSaveEditing = (medicineId: string) => {
    const updatedInventory = inventory.map(m =>
      m.id === medicineId ? { ...m, ...editingValues } : m
    ).map(updateStatus);
    
    saveInventory(updatedInventory);
    setEditingMedicineId(null);

    toast({
      title: 'Inventory Updated',
      description: `Stock details for ${inventory.find(m => m.id === medicineId)?.name} have been updated.`,
    });
  };
  
  const handleEditingChange = (field: 'quantity' | 'price', value: string) => {
    setEditingValues(prev => ({ ...prev, [field]: Number(value) }));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Stock': return 'secondary';
      case 'Low Stock': return 'default';
      case 'Out of Stock': return 'destructive';
      default: return 'outline';
    }
  };
  
  const filteredInventory = inventory.filter(
    (med) => med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Inventory Management</h1>
      
      <Card>
          <CardHeader>
            <CardTitle>Add or Update Stock</CardTitle>
            <CardDescription>
              Enter a medicine name to add a new entry or update an existing one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                   <FormField
                    control={form.control}
                    name="medicineName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Paracetamol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity to Add</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                           <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={!!existingMedicine} />
                        </FormControl>
                         <FormDescription className="text-xs">{existingMedicine ? 'Price cannot be changed here.' : 'Required for new medicine.'}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cipla" {...field} disabled={!!existingMedicine} />
                        </FormControl>
                        <FormDescription className="text-xs">{existingMedicine ? 'Supplier cannot be changed.' : 'Required for new medicine.'}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {existingMedicine ? 'Update Stock' : 'Add New Medicine'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>A list of all medicines in stock.</CardDescription>
                </div>
                <div className="relative">
                    <PackageSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search for a medicine..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 md:w-64 lg:w-80"
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Quantity</TableHead>
                   <TableHead>Price (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? filteredInventory.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>
                      {editingMedicineId === med.id ? (
                        <Input 
                          type="number" 
                          value={editingValues.quantity}
                          onChange={(e) => handleEditingChange('quantity', e.target.value)}
                          className="h-8 w-24"
                        />
                      ) : (
                        med.quantity
                      )}
                    </TableCell>
                     <TableCell>
                      {editingMedicineId === med.id ? (
                        <Input 
                          type="number"
                          step="0.01"
                          value={editingValues.price}
                          onChange={(e) => handleEditingChange('price', e.target.value)}
                          className="h-8 w-24"
                        />
                      ) : (
                        med.price?.toFixed(2)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(med.status)}>{med.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{med.supplier}</TableCell>
                    <TableCell className="text-right">
                       {editingMedicineId === med.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSaveEditing(med.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelEditing}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEditing(med)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No medicines found. Add one to get started.
                        </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}

    

    

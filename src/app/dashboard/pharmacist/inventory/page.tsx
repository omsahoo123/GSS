
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

const initialInventory = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    quantity: 250,
    supplier: 'Geno Pharmaceuticals',
    status: 'In Stock',
  },
  {
    id: 'med-2',
    name: 'Amoxicillin',
    quantity: 45,
    supplier: 'Cipla',
    status: 'Low Stock',
  },
  {
    id: 'med-3',
    name: 'Metformin',
    quantity: 150,
    supplier: 'Sun Pharma',
    status: 'In Stock',
  },
  {
    id: 'med-4',
    name: 'Ibuprofen',
    quantity: 0,
    supplier: 'Mankind Pharma',
    status: 'Out of Stock',
  },
   {
    id: 'med-5',
    name: 'Lisinopril',
    quantity: 80,
    supplier: 'Cipla',
    status: 'In Stock',
  },
];

const inventorySchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().min(1, 'Medicine name is required.'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
  supplier: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;
type Medicine = (typeof initialInventory)[0];

const INVENTORY_STORAGE_KEY = 'pharmacistInventory';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        setInventory(initialInventory);
      }
    } catch (error) {
      console.error("Failed to load inventory from localStorage", error);
      setInventory(initialInventory);
    }
  }, []);

  useEffect(() => {
    if (inventory.length > 0) {
      try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
      } catch (error) {
        console.error("Failed to save inventory to localStorage", error);
      }
    }
  }, [inventory]);

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      medicineName: '',
      quantity: 0,
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
      const newMedicine: Medicine = {
        id: `med-${Date.now()}`,
        name: data.medicineName,
        quantity: data.quantity,
        supplier: data.supplier || 'N/A',
        status: 'In Stock', // Initial status will be updated by updateStatus
      };
      updatedInventory = [newMedicine, ...inventory];
       toast({
        title: 'Medicine Added',
        description: `${data.medicineName} has been added to the inventory.`,
      });
    }

    setInventory(updatedInventory.map(updateStatus));
    form.reset();
  };

  const handleStartEditing = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setEditingQuantity(medicine.quantity);
  };

  const handleCancelEditing = () => {
    setEditingMedicineId(null);
  };

  const handleSaveEditing = (medicineId: string) => {
    const updatedInventory = inventory.map(m =>
      m.id === medicineId ? { ...m, quantity: editingQuantity } : m
    ).map(updateStatus);
    
    setInventory(updatedInventory);
    setEditingMedicineId(null);

    toast({
      title: 'Quantity Updated',
      description: `Stock for ${inventory.find(m => m.id === medicineId)?.name} has been set to ${editingQuantity}.`,
    });
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
                <div className="grid gap-6 md:grid-cols-3">
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
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cipla" {...field} disabled={!!existingMedicine} />
                        </FormControl>
                        <FormDescription className="text-xs">{existingMedicine ? 'Supplier cannot be changed for existing medicine.' : 'Required for new medicine.'}</FormDescription>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>
                      {editingMedicineId === med.id ? (
                        <Input 
                          type="number" 
                          value={editingQuantity}
                          onChange={(e) => setEditingQuantity(Number(e.target.value))}
                          className="h-8 w-24"
                        />
                      ) : (
                        med.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(med.status)}>{med.status}</Badge>
                    </TableCell>
                    <TableCell>{med.supplier}</TableCell>
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
                ))}
                 {filteredInventory.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No medicines found.
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


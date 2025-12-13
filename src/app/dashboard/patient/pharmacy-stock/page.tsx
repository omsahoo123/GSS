'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for pharmacies and medicine stock
const pharmacies = [
  {
    id: 'ph-1',
    name: 'Jan Aushadhi Kendra',
    address: '123, Village Market Rd, Rampur',
    medicines: [
      { name: 'Paracetamol', stock: 'available' },
      { name: 'Amoxicillin', stock: 'low' },
      { name: 'Metformin', stock: 'available' },
    ],
  },
  {
    id: 'ph-2',
    name: 'Gramin Pharmacy',
    address: '45, Main Bazaar, Sitapur',
    medicines: [
      { name: 'Paracetamol', stock: 'available' },
      { name: 'Ibuprofen', stock: 'not-available' },
      { name: 'Metformin', stock: 'available' },
    ],
  },
  {
    id: 'ph-3',
    name: 'Sehat Medical Store',
    address: '7, Panchayat Bhawan, Aligarh',
    medicines: [
      { name: 'Paracetamol', stock: 'low' },
      { name: 'Lisinopril', stock: 'available' },
      { name: 'Amoxicillin', stock: 'available' },
    ],
  },
  {
    id: 'ph-4',
    name: 'Arogya Medicals',
    address: 'Near Bus Stand, Fatehpur',
    medicines: [
      { name: 'Ibuprofen', stock: 'available' },
      { name: 'Metformin', stock: 'not-available' },
    ],
  },
];


type PharmacyResult = {
  id: string;
  name: string;
  address: string;
  stock: 'available' | 'low' | 'not-available';
};


export default function PharmacyStockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PharmacyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      const results: PharmacyResult[] = [];
      pharmacies.forEach(pharmacy => {
        const medicine = pharmacy.medicines.find(m => m.name.toLowerCase() === searchQuery.trim().toLowerCase());
        if (medicine) {
          results.push({
            id: pharmacy.id,
            name: pharmacy.name,
            address: pharmacy.address,
            stock: medicine.stock as PharmacyResult['stock'],
          });
        }
      });
      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
  };

  const getStockVariant = (stock: PharmacyResult['stock']) => {
    switch (stock) {
      case 'available':
        return 'secondary';
      case 'low':
        return 'default';
      case 'not-available':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getStockText = (stock: PharmacyResult['stock']) => {
    switch (stock) {
      case 'available':
        return 'In Stock';
      case 'low':
        return 'Low Stock';
      case 'not-available':
        return 'Out of Stock';
      default:
        return 'N/A';
    }
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Pharmacy Stock Checker</h1>
        <p className="text-muted-foreground">
          Find out which local pharmacies have your medicines in stock.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search for a Medicine</CardTitle>
          <CardDescription>Enter the name of the medicine you are looking for.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., Paracetamol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for &quot;{searchQuery}&quot;</CardTitle>
            <CardDescription>
              {searchResults.length > 0
                ? `Found in ${searchResults.length} nearby ${searchResults.length === 1 ? 'pharmacy' : 'pharmacies'}.`
                : 'No pharmacies found with this medicine.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading results...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pharmacy Name</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                       <TableCell>
                         <Badge variant={getStockVariant(result.stock)}>
                           <CheckCircle2 className="mr-1 h-3 w-3"/>
                           {getStockText(result.stock)}
                         </Badge>
                       </TableCell>
                      <TableCell>{result.address}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.address)}`, '_blank')}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          View on Map
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
               <div className="text-center py-10">
                 <p className="text-muted-foreground">Try another medicine name or check your spelling.</p>
               </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

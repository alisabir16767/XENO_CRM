'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UpdateCustomerDialog from '@/components/UpdateCustomerDialog';

type Customer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  visits: number;
  lastActive: string;
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await res.json();
      setCustomers(data.customers);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
    } catch (err) {
      alert('Error deleting customer');
      console.error(err);
    }
  };

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-[#2B2B36] rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Customer List</h1>
        <UpdateCustomerDialog 
          mode="create" 
          onCustomerUpdated={fetchCustomers}
        />
      </div>

      <Card className="bg-[#171821] text-white border-none">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] text-[#87888C]">Name</TableHead>
                <TableHead className="w-[200px] text-[#87888C]">Email</TableHead>
                <TableHead className="w-[200px] text-[#87888C]">Phone</TableHead>
                <TableHead className="w-[200px] text-[#87888C]">Total Spent</TableHead>
                <TableHead className="text-[#87888C]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.phone ? customer.phone : <Badge variant="secondary">N/A</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge>${customer.totalSpent}</Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <UpdateCustomerDialog
                      customer={customer}
                      mode="update"
                      onCustomerUpdated={fetchCustomers}
                    >
                      <Button
                        variant="outline"
                        className="bg-[#A9DFD8] text-black hover:bg-[#045e52]"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </UpdateCustomerDialog>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
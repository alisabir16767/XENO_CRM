'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";

interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  visits: number;
  lastActive: string;
}

interface CustomerDialogProps {
  customer?: Customer | null;
  onCustomerUpdated: () => void;
  mode: 'create' | 'update';
  children?: React.ReactNode;
}

export default function UpdateCustomerDialog({ 
  customer, 
  onCustomerUpdated, 
  mode,
  children 
}: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    totalSpent: '0',
    visits: '0',
    lastActive: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (customer && open && mode === 'update') {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        totalSpent: customer.totalSpent.toString(),
        visits: customer.visits.toString(),
        lastActive: customer.lastActive ? customer.lastActive.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else if (open && mode === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        totalSpent: '0',
        visits: '0',
        lastActive: new Date().toISOString().split('T')[0],
      });
    }
  }, [customer, open, mode]);

  const handleSubmit = async () => {
    const { name, email, phone, totalSpent, visits, lastActive } = formData;
  
    if (!name.trim() || !email.trim()) {
      alert('Please fill out name and email.');
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    const payload = {
      name,
      email,
      phone,
      totalSpent: Number(totalSpent),
      visits: Number(visits),
      lastActive,
    };
  
    setLoading(true);
    try {
      let response;
      if (mode === 'update' && customer?._id) {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/${customer._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer`,
          payload,
          { withCredentials: true }
        );
      }
  
      if (response.data.success) {
        alert(`Customer ${mode === 'update' ? 'updated' : 'created'} successfully!`);
        setOpen(false);
        onCustomerUpdated();
      } else {
        throw new Error(response.data.message || `Failed to ${mode} customer`);
      }
    } catch (err: any) {
      console.error(`Error ${mode}ing customer:`, err);
      alert(err.response?.data?.message || err.message || `Failed to ${mode} customer`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="ml-2 bg-[#A9DFD8] text-black hover:bg-[#61c9bb]">
            {mode === 'update' ? 'Edit' : 'Add Customer'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#02675a]">
            {mode === 'update' ? 'Update Customer' : 'Create New Customer'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              placeholder="e.g. John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              placeholder="e.g. john@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              placeholder="e.g. +1234567890"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Spent</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalSpent}
                onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
              />
            </div>

            <div>
              <Label>Visits</Label>
              <Input
                type="number"
                min="0"
                value={formData.visits}
                onChange={(e) => setFormData({ ...formData, visits: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Last Active</Label>
            <Input
              type="date"
              value={formData.lastActive}
              onChange={(e) => setFormData({ ...formData, lastActive: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading 
                ? mode === 'update' 
                  ? 'Updating...' 
                  : 'Creating...'
                : mode === 'update' 
                  ? 'Update' 
                  : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
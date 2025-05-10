'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Ticket, CreditCard, RefreshCw, Plus } from 'lucide-react';

export default function DepositsPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        // In a real app, this would fetch from an API
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDeposits = [
          {
            id: 'DEP-001',
            amount: 100.00,
            date: '2023-06-15T14:30:00Z',
            status: 'completed',
            method: 'bank_transfer',
            reference: 'ACH-123456789'
          },
          {
            id: 'DEP-002',
            amount: 50.00,
            date: '2023-06-10T09:45:00Z',
            status: 'pending',
            method: 'credit_card',
            reference: 'CC-987654321'
          },
          {
            id: 'DEP-003',
            amount: 75.50,
            date: '2023-06-05T11:20:00Z',
            status: 'completed',
            method: 'paypal',
            reference: 'PP-567891234'
          },
          {
            id: 'DEP-004',
            amount: 200.00,
            date: '2023-05-28T16:15:00Z',
            status: 'failed',
            method: 'bank_transfer',
            reference: 'ACH-456789123',
            error: 'Insufficient funds'
          }
        ];
        
        setDeposits(mockDeposits);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deposits:', err);
        setError('Failed to load deposit history');
        setLoading(false);
      }
    };
    
    fetchDeposits();
  }, []);

  const handleNewDeposit = () => {
    router.push('/dashboard/deposits/new');
  };
  
  const handleCreateTicket = (deposit) => {
    router.push(`/dashboard/tickets/new?type=deposit&reference=${deposit.id}&subject=Issue with Deposit ${deposit.id}`);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <RefreshCw className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading deposit history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <Button onClick={handleNewDeposit} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> New Deposit
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Deposit History</CardTitle>
          <CardDescription>View and manage your account deposits</CardDescription>
        </CardHeader>
        <CardContent>
          {deposits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't made any deposits yet</p>
              <Button onClick={handleNewDeposit} variant="outline">
                Make Your First Deposit
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="font-medium">{deposit.id}</TableCell>
                    <TableCell>{formatDate(deposit.date)}</TableCell>
                    <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                    <TableCell className="capitalize">
                      {deposit.method.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                    <TableCell className="text-right">
                      {deposit.status === 'failed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center text-xs"
                          onClick={() => handleCreateTicket(deposit)}
                        >
                          <Ticket className="mr-1 h-3 w-3" /> Report Issue
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
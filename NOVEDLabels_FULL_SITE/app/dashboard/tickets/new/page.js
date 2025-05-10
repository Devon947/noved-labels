'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    category: 'general',
    reference: ''
  });

  // Read query parameters to pre-fill the form
  useEffect(() => {
    const type = searchParams.get('type') || '';
    const reference = searchParams.get('reference') || '';
    const subject = searchParams.get('subject') || '';
    
    // Set category based on type param
    let category = 'general';
    if (type === 'shipping') category = 'shipping';
    if (type === 'deposit') category = 'billing';
    
    setTicketData(prev => ({
      ...prev,
      subject,
      category,
      reference,
      // Set a default description based on the type
      description: type === 'shipping' 
        ? `I'm having an issue with a shipping label (Reference: ${reference}).\n\nProblem details:`
        : type === 'deposit'
        ? `I'm having an issue with a deposit (Reference: ${reference}).\n\nProblem details:`
        : ''
    }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    // Validate form
    if (!ticketData.subject || !ticketData.description) {
      setMessage({ 
        type: 'error', 
        text: 'Please fill in all required fields' 
      });
      setLoading(false);
      return;
    }
    
    // In a real app, this would send the data to an API
    setTimeout(() => {
      // Create ticket ID
      const ticketId = `TKT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      setMessage({ 
        type: 'success', 
        text: `Ticket #${ticketId} created successfully! Our support team will respond shortly.` 
      });
      
      setLoading(false);
      
      // Redirect to tickets page after a delay
      setTimeout(() => {
        router.push('/dashboard/tickets');
      }, 2000);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        onClick={handleBack} 
        variant="ghost" 
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Submit Support Ticket</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>New Support Ticket</CardTitle>
          <CardDescription>
            Please provide details about your issue and our support team will assist you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message.text && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
              {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={ticketData.subject}
                onChange={handleInputChange}
                placeholder="Enter a subject for your ticket"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={ticketData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Question</SelectItem>
                  <SelectItem value="shipping">Shipping Issue</SelectItem>
                  <SelectItem value="billing">Billing/Deposits</SelectItem>
                  <SelectItem value="technical">Technical Problem</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={ticketData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {ticketData.reference && (
              <div>
                <Label htmlFor="reference">Reference ID</Label>
                <Input
                  id="reference"
                  name="reference"
                  value={ticketData.reference}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={ticketData.description}
                onChange={handleInputChange}
                placeholder="Please describe your issue in detail"
                rows={8}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : 'Submit Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
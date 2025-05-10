'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, MessageSquare } from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    category: 'general'
  });

  // Simulating ticket data for the UI
  useEffect(() => {
    // In a real application, this would fetch tickets from an API
    const mockTickets = [
      {
        id: 'TKT-001',
        subject: 'Issue with shipping label generation',
        description: 'I tried to generate a shipping label but received an error message saying "API key invalid".',
        status: 'open',
        priority: 'high',
        category: 'shipping',
        createdAt: '2023-05-15T10:30:00.000Z',
        lastUpdated: '2023-05-15T14:22:00.000Z',
        messages: [
          {
            from: 'user',
            message: 'I tried to generate a shipping label but received an error message saying "API key invalid".',
            timestamp: '2023-05-15T10:30:00.000Z'
          },
          {
            from: 'support',
            message: 'Thank you for reporting this issue. Can you please try refreshing the page and attempting the process again? If the issue persists, we may need to reset your API integration.',
            timestamp: '2023-05-15T14:22:00.000Z'
          }
        ]
      },
      {
        id: 'TKT-002',
        subject: 'Address validation not working',
        description: 'When I enter an address, the validation feature is not working correctly.',
        status: 'closed',
        priority: 'normal',
        category: 'address',
        createdAt: '2023-05-10T09:15:00.000Z',
        lastUpdated: '2023-05-12T11:20:00.000Z',
        messages: [
          {
            from: 'user',
            message: 'When I enter an address, the validation feature is not working correctly.',
            timestamp: '2023-05-10T09:15:00.000Z'
          },
          {
            from: 'support',
            message: 'We apologize for the inconvenience. Our team has identified the issue with address validation and it should be working correctly now. Please let us know if you encounter any further problems.',
            timestamp: '2023-05-12T11:20:00.000Z'
          }
        ]
      }
    ];
    
    setTickets(mockTickets);
  }, []);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    // Validate form
    if (!newTicket.subject || !newTicket.description) {
      setMessage({ 
        type: 'error', 
        text: 'Please fill in all required fields' 
      });
      setLoading(false);
      return;
    }
    
    // In a real app, this would send the data to an API
    setTimeout(() => {
      // Create a new ticket and add it to the list
      const createdTicket = {
        id: `TKT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'open',
        priority: newTicket.priority,
        category: newTicket.category,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        messages: [
          {
            from: 'user',
            message: newTicket.description,
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setTickets(prev => [createdTicket, ...prev]);
      
      // Reset form
      setNewTicket({
        subject: '',
        description: '',
        priority: 'normal',
        category: 'general'
      });
      
      setMessage({ 
        type: 'success', 
        text: `Ticket #${createdTicket.id} created successfully!` 
      });
      
      setLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'closed':
        return <Badge className="bg-green-500">Closed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-gray-500">Low</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge className="bg-gray-500">{priority}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      
      <Tabs defaultValue="create">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="active">Active Tickets</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Tickets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below to create a new support ticket. Our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message.text && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                  {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject"
                    placeholder="Brief summary of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newTicket.category}
                      onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
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
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Please describe your issue in detail. Include any error messages or steps to reproduce the problem."
                    rows={5}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Support Tickets</h2>
            
            {tickets.filter(ticket => ticket.status !== 'closed').length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No active tickets found.</p>
                </CardContent>
              </Card>
            ) : (
              tickets
                .filter(ticket => ticket.status !== 'closed')
                .map(ticket => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <CardDescription>
                            Ticket #{ticket.id} • {formatDate(ticket.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-4">
                        {ticket.messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg ${msg.from === 'user' ? 'bg-gray-100 ml-auto' : 'bg-blue-50'} max-w-[80%] ${msg.from === 'user' ? 'ml-auto' : 'mr-auto'}`}
                          >
                            <div className="text-xs mb-1 text-gray-500">
                              {msg.from === 'user' ? 'You' : 'Support Team'} • {formatDate(msg.timestamp)}
                            </div>
                            <div>{msg.message}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> 
                        Last updated: {formatDate(ticket.lastUpdated)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" /> Reply
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="resolved">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resolved Tickets</h2>
            
            {tickets.filter(ticket => ticket.status === 'closed').length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No resolved tickets found.</p>
                </CardContent>
              </Card>
            ) : (
              tickets
                .filter(ticket => ticket.status === 'closed')
                .map(ticket => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <CardDescription>
                            Ticket #{ticket.id} • {formatDate(ticket.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-4">
                        {ticket.messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg ${msg.from === 'user' ? 'bg-gray-100' : 'bg-blue-50'} max-w-[80%] ${msg.from === 'user' ? 'ml-auto' : 'mr-auto'}`}
                          >
                            <div className="text-xs mb-1 text-gray-500">
                              {msg.from === 'user' ? 'You' : 'Support Team'} • {formatDate(msg.timestamp)}
                            </div>
                            <div>{msg.message}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="text-sm text-gray-500 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> 
                        Resolved on: {formatDate(ticket.lastUpdated)}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" /> Reopen
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
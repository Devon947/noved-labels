'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { shippingProviderService } from '@/app/services/ShippingProviderService';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { AlertCircle, PackageCheck } from 'lucide-react';
import ErrorBoundary, { useErrorHandler } from '@/app/components/ErrorBoundary';
import ShippingLabelErrorFallback from '@/app/components/ShippingLabelErrorFallback';

export default function ShipPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shipmentData, setShipmentData] = useState({
    // From address
    fromName: '',
    fromAddress: '',
    fromCity: '',
    fromState: '',
    fromZip: '',
    // To address
    toName: '',
    toAddress: '',
    toCity: '',
    toState: '',
    toZip: '',
    // Package details
    weight: '1',
    length: '10',
    width: '8',
    height: '4'
  });

  // Initialize shipping services
  useEffect(() => {
    const initServices = async () => {
      try {
        await shippingProviderService.init();
        await shippingHistoryService.init();
      } catch (error) {
        console.error('Failed to initialize shipping services:', error);
        setError('Failed to initialize shipping services. Please refresh the page or contact support.');
      }
    };
    
    initServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate form data
      validateShipmentData(shipmentData);
      
      // Use Shippo as the provider (our only active one)
      const provider = 'shippo';
      
      // Generate the shipping label
      const labelData = await shippingProviderService.generateLabel(provider, shipmentData);
      
      // Add the label to shipping history
      await shippingHistoryService.addToHistory(labelData);
      
      // Redirect to the label preview page
      router.push(`/ship/label/${labelData.id}`);
    } catch (err) {
      console.error('Error generating label:', err);
      setError(err.message || 'An error occurred while generating the shipping label');
      setIsLoading(false);
    }
  };
  
  // Form validation
  const validateShipmentData = (data) => {
    // Simple ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(data.fromZip)) {
      throw new Error('Invalid sender ZIP code format');
    }
    if (!zipRegex.test(data.toZip)) {
      throw new Error('Invalid recipient ZIP code format');
    }
    
    // Weight must be positive number
    if (parseFloat(data.weight) <= 0) {
      throw new Error('Package weight must be greater than 0');
    }
    
    // Package dimensions must be positive
    if (parseFloat(data.length) <= 0 || parseFloat(data.width) <= 0 || parseFloat(data.height) <= 0) {
      throw new Error('Package dimensions must be greater than 0');
    }
  };
  
  // Handle retry from error fallback
  const handleRetry = () => {
    setError(null);
    handleSubmit({ preventDefault: () => {} });
  };
  
  // Handle edit info from error fallback
  const handleEditInfo = () => {
    setError(null);
    // Focus on the first input field
    document.getElementById('fromName')?.focus();
  };
  
  // Handle contact support from error fallback
  const handleContactSupport = () => {
    router.push('/dashboard/tickets');
  };

  return (
    <ErrorBoundary
      errorTitle="Shipping Form Error"
      errorMessage="We encountered an issue with the shipping form. Please try again or contact support."
    >
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create Shipping Label</h1>
        
        {error ? (
          <ShippingLabelErrorFallback
            error={{ message: error }}
            onRetry={handleRetry}
            onEditInfo={handleEditInfo}
            onContact={handleContactSupport}
          />
        ) : null}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Address */}
            <Card>
              <CardHeader>
                <CardTitle>From Address</CardTitle>
                <CardDescription>Enter the sender's address details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fromName">Name</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    value={shipmentData.fromName}
                    onChange={handleInputChange}
                    placeholder="Sender's name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fromAddress">Street Address</Label>
                  <Input
                    id="fromAddress"
                    name="fromAddress"
                    value={shipmentData.fromAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="fromCity">City</Label>
                    <Input
                      id="fromCity"
                      name="fromCity"
                      value={shipmentData.fromCity}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="fromState">State</Label>
                    <Input
                      id="fromState"
                      name="fromState"
                      value={shipmentData.fromState}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="fromZip">ZIP</Label>
                    <Input
                      id="fromZip"
                      name="fromZip"
                      value={shipmentData.fromZip}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* To Address */}
            <Card>
              <CardHeader>
                <CardTitle>To Address</CardTitle>
                <CardDescription>Enter the recipient's address details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="toName">Name</Label>
                  <Input
                    id="toName"
                    name="toName"
                    value={shipmentData.toName}
                    onChange={handleInputChange}
                    placeholder="Recipient's name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="toAddress">Street Address</Label>
                  <Input
                    id="toAddress"
                    name="toAddress"
                    value={shipmentData.toAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="toCity">City</Label>
                    <Input
                      id="toCity"
                      name="toCity"
                      value={shipmentData.toCity}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="toState">State</Label>
                    <Input
                      id="toState"
                      name="toState"
                      value={shipmentData.toState}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="toZip">ZIP</Label>
                    <Input
                      id="toZip"
                      name="toZip"
                      value={shipmentData.toZip}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Package Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>Enter the package dimensions and weight</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={shipmentData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="length">Length (in)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={shipmentData.length}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="width">Width (in)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={shipmentData.width}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height (in)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={shipmentData.height}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 animate-spin">⏳</span> Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <PackageCheck className="mr-2 h-4 w-4" /> Generate Label
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </ErrorBoundary>
  );
} 
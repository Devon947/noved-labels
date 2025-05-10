'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, AlertCircle, Printer, ExternalLink, ArrowLeft, RefreshCw, 
  Download, Ticket, XCircle, Sparkles 
} from 'lucide-react';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { Badge } from '@/components/ui/badge';
import { calculatePlanComparison, PRICING } from '@/lib/pricing';

export default function LabelPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [labelData, setLabelData] = useState(null);
  const [planComparison, setPlanComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({
    type: 'success',
    message: 'Label created successfully'
  });

  useEffect(() => {
    async function fetchLabelData() {
      try {
        setLoading(true);
        const historyItems = await shippingHistoryService.getHistory();
        const label = historyItems.find(item => item.id === params.id);
        
        if (!label) {
          throw new Error('Label not found');
        }
        
        setLabelData(label);
        
        // Calculate plan comparison if on standard plan
        if (label.plan === 'Standard') {
          // Use base rate and estimate for 30 labels per month
          const comparison = calculatePlanComparison(30, parseFloat(label.baseRate));
          setPlanComparison(comparison);
        }
        
        // Set status based on label data
        if (label.status === 'error' || label.error) {
          setStatus({
            type: 'error',
            message: label.error || 'There was an issue with this label'
          });
        }
      } catch (err) {
        console.error('Error fetching label:', err);
        setError('Unable to load shipping label. Please try again.');
        setStatus({
          type: 'error',
          message: 'Failed to load label'
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchLabelData();
  }, [params.id]);

  const handlePrint = () => {
    window.open(labelData.label_url, '_blank');
  };
  
  const handleTrack = () => {
    if (labelData.tracking_url) {
      window.open(labelData.tracking_url, '_blank');
    } else {
      // Fallback to USPS tracking if specific URL not provided
      window.open(`https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${labelData.tracking_number}`, '_blank');
    }
  };
  
  const handleDownload = () => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = labelData.label_url;
    link.download = `shipping-label-${labelData.tracking_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCreateTicket = () => {
    // Navigate to tickets page with pre-filled data for this label
    router.push(`/support/tickets/new?type=shipping&reference=${labelData.id}&subject=Issue with Shipping Label ${labelData.tracking_number}`);
  };
  
  const handleBackToShipping = () => {
    router.push('/ship');
  };
  
  const handleUpgradePlan = () => {
    router.push('/pricing?from=label');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading shipping label...</p>
      </div>
    );
  }

  if (error || !labelData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Label not found'}</AlertDescription>
        </Alert>
        <Button onClick={handleBackToShipping} variant="outline" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shipping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        {status.type === 'success' ? (
          <CheckCircle className="text-green-500 mr-2 h-8 w-8" />
        ) : (
          <XCircle className="text-red-500 mr-2 h-8 w-8" />
        )}
        Shipping Label
      </h1>
      
      <div className="mb-6">
        <Badge 
          variant={status.type === 'success' ? "success" : "destructive"}
          className={`text-sm px-3 py-1 ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {status.message}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Label Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="border border-gray-200 rounded-md p-2 bg-white">
                <iframe 
                  src={labelData.label_url} 
                  className="w-full h-[500px]" 
                  title="Shipping Label"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={handlePrint} className="flex items-center bg-blue-600 hover:bg-blue-700">
                <Printer className="h-4 w-4 mr-2" /> Print Label
              </Button>
              <Button onClick={handleDownload} variant="secondary" className="flex items-center">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button onClick={handleTrack} variant="outline" className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" /> Track Package
              </Button>
              <Button onClick={handleCreateTicket} variant="outline" className="flex items-center">
                <Ticket className="h-4 w-4 mr-2" /> Create Ticket
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Tracking Number</h3>
                <p className="font-mono text-lg">{labelData.tracking_number}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Service</h3>
                <p>{labelData.service || labelData.provider_name}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-500">From</h3>
                <p>{labelData.from_name}</p>
                <p>{labelData.from_address}</p>
                <p>{labelData.from_city}, {labelData.from_state} {labelData.from_zip}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-500">To</h3>
                <p>{labelData.to_name}</p>
                <p>{labelData.to_address}</p>
                <p>{labelData.to_city}, {labelData.to_state} {labelData.to_zip}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-500">Package</h3>
                <p>Weight: {labelData.weight} {labelData.weight_unit || 'lb'}</p>
                {labelData.dimensions && (
                  <p>Dimensions: {labelData.dimensions}</p>
                )}
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-500">
                  Cost
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {labelData.plan || 'Standard'} Plan
                  </Badge>
                </h3>
                <div className="bg-gray-50 p-3 rounded-md mt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Base Shipping Cost:</span>
                    <span className="text-sm">${labelData.baseRate || parseFloat(labelData.rate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Service Fee:</span>
                    <span className="text-sm">${labelData.markup || (labelData.plan === 'Premium' ? '3.00' : '4.00')}</span>
                  </div>
                  {labelData.discountAmount && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Discount ({labelData.discountRate}):</span>
                      <span className="text-sm text-green-600">-${labelData.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200 mt-1 font-semibold">
                    <span>Total:</span>
                    <span className="text-lg">${labelData.totalPrice || parseFloat(labelData.rate).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2">
              {labelData.plan === 'Standard' && planComparison && planComparison.isSavingWithPremium && (
                <div className="w-full bg-blue-50 p-3 rounded-md border border-blue-100 mb-2">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" /> Save with Premium
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Upgrade to Premium and save ${planComparison.savings} per month with your shipping volume.
                  </p>
                  <Button 
                    onClick={handleUpgradePlan}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Upgrade Now - $99/month
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={handleCreateTicket}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <Ticket className="h-4 w-4 mr-2" /> Report Issue
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <Button onClick={handleBackToShipping} variant="outline" className="w-full flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shipping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
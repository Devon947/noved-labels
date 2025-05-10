'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { shippingProviderService } from '@/app/services/ShippingProviderService';
import { configService } from '@/app/services/ConfigService';

export default function SettingsPage() {
  const [providers, setProviders] = useState({});
  const [apiKeys, setApiKeys] = useState({
    easypost: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get providers and current API keys on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      // Initialize the config service
      await configService.init();
      
      // Get shipping providers (only active ones)
      const providersData = shippingProviderService.getProviders();
      setProviders(providersData);
      
      // Get current API keys (only for active providers)
      const keys = {};
      for (const providerId in providersData) {
        keys[providerId] = configService.getApiKey(providerId) || '';
      }
      setApiKeys(keys);
    };
    
    fetchProviders();
  }, []);

  // Handle API key updates
  const handleSaveApiKey = async (provider) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await shippingProviderService.configureProvider(provider, apiKeys[provider]);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `${providers[provider].name} API key saved successfully!` 
        });
        
        // Update providers to show as configured
        setProviders(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            configured: true
          }
        }));
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || `Failed to save ${providers[provider].name} API key.` 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An unexpected error occurred.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle API key input changes
  const handleApiKeyChange = (provider, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="shipping">
        <TabsList className="mb-4">
          <TabsTrigger value="shipping">Shipping Services</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipping">
          <div className="grid grid-cols-1 gap-6">
            {message.text && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            
            {Object.entries(providers).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No shipping services available.</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(providers).map(([providerId, provider]) => (
                <Card key={providerId}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{provider.name}</CardTitle>
                    <div className="text-sm">
                      {provider.configured ? (
                        <span className="text-green-500 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Configured
                        </span>
                      ) : (
                        <span className="text-gray-400">Optional</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`${providerId}-api-key`}>API Key (Optional)</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input 
                            id={`${providerId}-api-key`}
                            type="password"
                            value={apiKeys[providerId]}
                            onChange={(e) => handleApiKeyChange(providerId, e.target.value)}
                            placeholder={`Enter your ${provider.name} API key (optional)`}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleSaveApiKey(providerId)}
                            disabled={loading || !apiKeys[providerId]}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                      
                      {/* Features list */}
                      <div>
                        <Label>Features</Label>
                        <ul className="mt-1 text-sm">
                          {provider.features.map((feature, index) => (
                            <li key={index} className="text-gray-600">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Account settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, DollarSign, AlertTriangle, CreditCard, Bitcoin } from 'lucide-react';
import { walletService } from '@/app/services/WalletService';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function WalletCard() {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  
  useEffect(() => {
    async function loadWalletData() {
      try {
        const data = await walletService.getWalletData();
        setWalletData(data);
      } catch (err) {
        console.error('Error loading wallet data:', err);
        setError('Unable to load wallet data');
      } finally {
        setLoading(false);
      }
    }
    
    loadWalletData();
  }, []);
  
  const handleDepositChange = (e) => {
    // Only allow numeric input with up to 2 decimal places
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setDepositAmount(value);
    }
  };
  
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setIsDepositing(true);
    setError(null);
    
    try {
      let endpoint = '/api/wallet/deposit';
      
      // Use the crypto endpoint if crypto payment method is selected
      if (paymentMethod === 'crypto') {
        endpoint = '/api/crypto-wallet-deposit';
      }
      
      // Create checkout session for the deposit
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          origin: window.location.origin,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to process deposit');
      }
    } catch (err) {
      console.error('Error depositing funds:', err);
      setError('An unexpected error occurred');
      setIsDepositing(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-28 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-40 bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const balanceStatus = walletData?.balance < 10 ? 'danger' : walletData?.balance < 25 ? 'warning' : 'success';
  
  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-blue-400" />
            Account Balance
          </CardTitle>
          <Badge 
            variant={balanceStatus} 
            className={`px-2 py-0.5 ${
              balanceStatus === 'danger' ? 'bg-red-900/30 text-red-400 border border-red-700/30' :
              balanceStatus === 'warning' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30' :
              'bg-green-900/30 text-green-400 border border-green-700/30'
            }`}
          >
            {balanceStatus === 'danger' ? 'Low Balance' : 
             balanceStatus === 'warning' ? 'Running Low' : 'Good Standing'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-white mb-1">
            ${walletData?.balance.toFixed(2)}
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Available for shipping labels
          </p>
          
          {balanceStatus === 'danger' && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-md p-3 w-full mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">
                  Your balance is very low. Please add funds to continue creating shipping labels.
                </p>
              </div>
            </div>
          )}
          
          <div className="w-full">
            {!showPaymentOptions ? (
              <>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Amount"
                    value={depositAmount}
                    onChange={handleDepositChange}
                    className="bg-gray-700 border-gray-600"
                    disabled={isDepositing}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPaymentOptions(true)}
                    disabled={isDepositing || !depositAmount}
                    className="whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Funds
                  </Button>
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </>
            ) : (
              <div className="mt-2">
                <div className="bg-gray-800/60 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-300 mb-2">Select payment method:</p>
                  <RadioGroup 
                    defaultValue="card" 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="wallet-card" />
                      <Label htmlFor="wallet-card" className="flex items-center cursor-pointer">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Credit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="wallet-crypto" />
                      <Label htmlFor="wallet-crypto" className="flex items-center cursor-pointer">
                        <Bitcoin className="w-4 h-4 mr-2" />
                        <span>Cryptocurrency</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'crypto' && (
                    <p className="text-xs text-gray-400 mt-2">
                      We accept BTC, ETH, USDC, and other major cryptocurrencies
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPaymentOptions(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDeposit}
                    disabled={isDepositing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 text-center">
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
              <DollarSign className="h-4 w-4 mr-1" /> Transaction History
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
              Auto-Reload
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 
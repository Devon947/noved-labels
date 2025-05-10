'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TrendingUp, PiggyBank, ArrowUpRight } from 'lucide-react';
import { walletService } from '@/app/services/WalletService';

export default function SavingsCard() {
  const [savingsData, setSavingsData] = useState({ savingsTotal: 0, labelCount: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadSavingsData() {
      try {
        const data = await walletService.getSavingsStats();
        setSavingsData(data);
      } catch (err) {
        console.error('Error loading savings data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadSavingsData();
  }, []);
  
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
  
  // Calculate average savings per label
  const avgSavingsPerLabel = savingsData.labelCount > 0 
    ? (savingsData.savingsTotal / savingsData.labelCount).toFixed(2)
    : '0.00';
  
  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
          Your Savings
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-green-400 mb-1">
            ${savingsData.savingsTotal.toFixed(2)}
          </div>
          <p className="text-gray-400 text-sm">
            Total savings vs. retail rates
          </p>
          
          <div className="w-full mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Labels Created</p>
              <p className="text-xl font-bold text-white">{savingsData.labelCount}</p>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Avg. Savings</p>
              <p className="text-xl font-bold text-green-400">${avgSavingsPerLabel}</p>
              <p className="text-gray-500 text-xs">per label</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-center text-blue-400 text-sm">
          <PiggyBank className="h-3.5 w-3.5 mr-1" />
          <span className="mr-1">30% average discount on shipping</span>
          <ArrowUpRight className="h-3 w-3" />
        </div>
      </CardFooter>
    </Card>
  );
} 
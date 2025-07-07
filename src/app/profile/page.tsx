"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import RateLimitDisplay from '@/components/RateLimitDisplay';
import { getRateLimitInfo } from '@/lib/api';

interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetTime: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [isLoadingRateLimit, setIsLoadingRateLimit] = useState(false);

  // Load rate limit information
  const loadRateLimitInfo = useCallback(async () => {
    if (!session || !session.user?.email) return;
    setIsLoadingRateLimit(true);
    try {
      const data = await getRateLimitInfo(session.user.email);
      if (data.data) {
        setRateLimit({
          remaining: data.data.remaining,
          limit: data.data.limit,
          resetTime: data.data.resetTime,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to load rate limit info:', error.message);
      }
    } finally {
      setIsLoadingRateLimit(false);
    }
  }, [session]);

  useEffect(() => {
    if (session && session.user?.email) {
      loadRateLimitInfo();
    }
  }, [session, loadRateLimitInfo]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  const user = session.user;
  const percentageUsed = rateLimit ? ((rateLimit.limit - rateLimit.remaining) / rateLimit.limit) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "user"} />
                  <AvatarFallback className="text-sm">
                    {user?.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="md:text-lg text-sm font-semibold">{user?.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 truncate max-w-[140px] md:max-w-full" title={user?.email || ''}>{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limit Information Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Usage & Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingRateLimit ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading usage information...</span>
                </div>
              ) : rateLimit ? (
                <>
                  {/* Rate Limit Display */}
                  <RateLimitDisplay rateLimit={rateLimit} />

                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{rateLimit.limit - rateLimit.remaining} / {rateLimit.limit}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentageUsed >= 80 ? 'bg-red-500' :
                          percentageUsed >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {percentageUsed.toFixed(1)}% of your limit used
                    </p>
                  </div>

                  {/* Reset Information */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium">Reset Information</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your limits will reset on{' '}
                      <span className="font-medium">
                        {new Date(rateLimit.resetTime).toLocaleDateString()} at{' '}
                        {new Date(rateLimit.resetTime).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Unable to load usage information</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadRateLimitInfo}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Refresh Button */}
              <Button 
                onClick={loadRateLimitInfo} 
                disabled={isLoadingRateLimit}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingRateLimit ? 'animate-spin' : ''}`} />
                Refresh Usage Info
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Card */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Account Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Authenticated</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full access</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Rate Limited</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fair usage</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Auto Reset</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Daily limits</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage; 
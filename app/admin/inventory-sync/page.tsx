'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, AlertCircle, Database, TrendingUp, Package, Warehouse } from 'lucide-react';
import type { SyncResult, SyncHistoryEntry, Site } from '@/types/inventory-sync';

export default function InventorySyncPage() {
  const [sites] = useState<Site[]>([
    { code: '007', name: 'Santiago Branch' }
  ]);
  
  const [selectedSite, setSelectedSite] = useState<string>('007');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryEntry[]>([]);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    message: string;
  }>({ current: 0, total: 0, message: '' });

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    setProgress({ current: 0, total: 0, message: 'Starting sync...' });

    try {
      const response = await fetch('/api/inventory/sync-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteCode: selectedSite }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'progress') {
              setProgress({
                current: data.current,
                total: data.total,
                message: data.message
              });
              
              if (data.stats) {
                setSyncResult({
                  success: true,
                  stats: data.stats,
                  errors: []
                });
              }
            } else if (data.type === 'complete') {
              const finalResult: SyncResult = {
                success: true,
                stats: data.stats,
                errors: data.errors || []
              };
              
              setSyncResult(finalResult);
              setProgress({
                current: data.total,
                total: data.total,
                message: data.message
              });

              // Add to history
              const siteName = sites.find(s => s.code === selectedSite)?.name || selectedSite;
              setSyncHistory(prev => [
                {
                  timestamp: new Date(),
                  siteCode: selectedSite,
                  siteName,
                  result: finalResult
                },
                ...prev.slice(0, 9)
              ]);
            } else if (data.type === 'error') {
              setSyncResult({
                success: false,
                stats: {
                  totalFetched: 0,
                  productsCreated: 0,
                  productsUpdated: 0,
                  inventoriesCreated: 0,
                  inventoriesUpdated: 0,
                  categoriesCreated: 0,
                  sitesCreated: 0,
                  errors: 1
                },
                errors: data.errors || [data.message]
              });
            }
          }
        }
      }

    } catch (error) {
      setSyncResult({
        success: false,
        stats: {
          totalFetched: 0,
          productsCreated: 0,
          productsUpdated: 0,
          inventoriesCreated: 0,
          inventoriesUpdated: 0,
          categoriesCreated: 0,
          sitesCreated: 0,
          errors: 1
        },
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Sync - Santiago Branch</h1>
            <p className="text-muted-foreground mt-1">
              Sync regular items (non-consignment) from legacy system to PostgreSQL database
            </p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Database className="w-4 h-4" />
            Legacy → PostgreSQL
          </Badge>
        </div>

        {/* Sync Control Panel */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sync Configuration</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Syncing regular items only (excludes consignment products)
              </p>
            </div>
            <Badge className="bg-blue-500">
              Site: 007
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                disabled={isSyncing}
                className="w-full border border-border rounded-md px-4 py-2 bg-background"
              >
                {sites.map((site) => (
                  <option key={site.code} value={site.code}>
                    {site.code} - {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full gap-2"
                size="lg"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Start Sync
                  </>
                )}
              </Button>
            </div>
          </div>

          {isSyncing && (
            <div className="bg-muted p-4 rounded-md space-y-3">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Syncing in progress...</p>
                  <p className="text-sm text-muted-foreground">
                    {progress.message}
                  </p>
                </div>
                {progress.total > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {progress.current} / {progress.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((progress.current / progress.total) * 100)}%
                    </p>
                  </div>
                )}
              </div>
              
              {progress.total > 0 && (
                <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 ease-out"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sync Results */}
        {syncResult && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sync Results</h2>
              {syncResult.success ? (
                <Badge className="gap-2 bg-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  Success
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Failed
                </Badge>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-medium">Total Fetched</p>
                </div>
                <p className="text-2xl font-bold">{syncResult.stats.totalFetched}</p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-medium">Products</p>
                </div>
                <p className="text-2xl font-bold">
                  {syncResult.stats.productsCreated + syncResult.stats.productsUpdated}
                </p>
                <p className="text-xs text-muted-foreground">
                  {syncResult.stats.productsCreated} new, {syncResult.stats.productsUpdated} updated
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Warehouse className="w-4 h-4 text-purple-500" />
                  <p className="text-sm font-medium">Inventories</p>
                </div>
                <p className="text-2xl font-bold">
                  {syncResult.stats.inventoriesCreated + syncResult.stats.inventoriesUpdated}
                </p>
                <p className="text-xs text-muted-foreground">
                  {syncResult.stats.inventoriesCreated} new, {syncResult.stats.inventoriesUpdated} updated
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <p className="text-sm font-medium">Categories</p>
                </div>
                <p className="text-2xl font-bold">{syncResult.stats.categoriesCreated}</p>
                <p className="text-xs text-muted-foreground">
                  {syncResult.stats.sitesCreated} sites created
                </p>
              </div>
            </div>

            {/* Errors */}
            {syncResult.stats.errors > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900 dark:text-red-100">
                      {syncResult.stats.errors} Error{syncResult.stats.errors > 1 ? 's' : ''} Occurred
                    </p>
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {syncResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-800 dark:text-red-200">
                          • {error}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sync History */}
        {syncHistory.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Sync History</h2>
            
            <div className="space-y-2">
              {syncHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {entry.result.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {entry.siteCode} - {entry.siteName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {entry.result.stats.totalFetched} items
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.result.stats.errors > 0 && (
                        <span className="text-red-500">
                          {entry.result.stats.errors} errors
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

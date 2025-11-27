import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Request from './request';

const PENDING_OPERATIONS_KEY = 'pendingOperations';
const LAST_SYNC_KEY = 'lastSyncTime';
const CACHED_EQUIPMENT_KEY = 'cachedEquipment';
const CACHED_ACTIVITIES_KEY = 'cachedActivities';
const CACHED_MATERIALS_KEY = 'cachedMaterials';
const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

export interface PendingOperation {
  id: string;
  type: 'start' | 'stop';
  data: any;
  createdAt: number;
}

class SyncService {
  private syncTimer: NodeJS.Timeout | null = null;

  // Save operation to local storage
  async saveOperationLocally(type: 'start' | 'stop', data: any): Promise<string> {
    const pending = await this.getPendingOperations();
    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const operation: PendingOperation = {
      id,
      type,
      data: { ...data, localStartTime: Date.now() },
      createdAt: Date.now(),
    };

    pending.push(operation);
    await AsyncStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(pending));

    return id;
  }

  // Get all pending operations from local storage
  async getPendingOperations(): Promise<PendingOperation[]> {
    try {
      const data = await AsyncStorage.getItem(PENDING_OPERATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Clear all pending operations
  async clearPendingOperations(): Promise<void> {
    await AsyncStorage.removeItem(PENDING_OPERATIONS_KEY);
  }

  // Remove specific operation from pending
  async removeOperation(id: string): Promise<void> {
    const pending = await this.getPendingOperations();
    const filtered = pending.filter(op => op.id !== id);
    await AsyncStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(filtered));
  }

  // Check network connectivity
  async isOnline(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected === true && state.isInternetReachable === true;
    } catch {
      return false;
    }
  }

  // Sync pending operations to server
  async syncToServer(): Promise<{ synced: number; failed: number }> {
    const isOnline = await this.isOnline();
    if (!isOnline) {
      console.log('Offline - skipping sync');
      return { synced: 0, failed: 0 };
    }

    const pending = await this.getPendingOperations();
    if (pending.length === 0) {
      console.log('No pending operations to sync');
      return { synced: 0, failed: 0 };
    }

    console.log(`Syncing ${pending.length} pending operations...`);

    let synced = 0;
    let failed = 0;

    // Sort by creation time to maintain order
    pending.sort((a, b) => a.createdAt - b.createdAt);

    for (const operation of pending) {
      try {
        let response;

        if (operation.type === 'start') {
          // For start operations, include the original start time
          const payload = {
            ...operation.data,
            startTime: new Date(operation.data.localStartTime).toISOString(),
          };
          delete payload.localStartTime;
          response = await Request.Post('/operations/start', payload);
        } else if (operation.type === 'stop') {
          response = await Request.Post(`/operations/${operation.data.operationId}/stop`, {
            distance: operation.data.distance || 0,
            endTime: new Date(operation.data.localEndTime).toISOString(),
          });
        }

        if (response?.success) {
          await this.removeOperation(operation.id);
          synced++;
        } else {
          console.error('Sync failed for operation:', operation.id, response?.error);
          failed++;
        }
      } catch (error) {
        console.error('Error syncing operation:', operation.id, error);
        failed++;
      }
    }

    // Update last sync time
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());

    console.log(`Sync complete: ${synced} synced, ${failed} failed`);
    return { synced, failed };
  }

  // Check if sync is needed (hourly)
  async shouldSync(): Promise<boolean> {
    try {
      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      if (!lastSync) return true;

      const elapsed = Date.now() - parseInt(lastSync, 10);
      return elapsed >= SYNC_INTERVAL;
    } catch {
      return true;
    }
  }

  // Start automatic sync timer
  startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    // Check and sync every hour
    this.syncTimer = setInterval(async () => {
      console.log('Auto sync triggered');
      await this.syncToServer();
    }, SYNC_INTERVAL);

    // Also sync immediately on start if needed
    this.syncToServer();
  }

  // Stop automatic sync
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // Get pending operations count
  async getPendingCount(): Promise<number> {
    const pending = await this.getPendingOperations();
    return pending.length;
  }

  // Get last sync time
  async getLastSyncTime(): Promise<number | null> {
    try {
      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return lastSync ? parseInt(lastSync, 10) : null;
    } catch {
      return null;
    }
  }

  // Cache reference data (equipment, activities, materials)
  async cacheEquipment(data: any[]): Promise<void> {
    await AsyncStorage.setItem(CACHED_EQUIPMENT_KEY, JSON.stringify(data));
  }

  async cacheActivities(data: any[]): Promise<void> {
    await AsyncStorage.setItem(CACHED_ACTIVITIES_KEY, JSON.stringify(data));
  }

  async cacheMaterials(data: any[]): Promise<void> {
    await AsyncStorage.setItem(CACHED_MATERIALS_KEY, JSON.stringify(data));
  }

  // Get cached reference data
  async getCachedEquipment(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(CACHED_EQUIPMENT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async getCachedActivities(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(CACHED_ACTIVITIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async getCachedMaterials(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(CACHED_MATERIALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const syncService = new SyncService();
export default syncService;

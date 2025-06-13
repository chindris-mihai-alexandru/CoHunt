interface CachedJobResult {
  jobs: any[];
  timestamp: number;
  query: string;
  location?: string;
}

class JobCacheService {
  private cache = new Map<string, CachedJobResult>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  private getCacheKey(query: string, location?: string): string {
    return `${query.toLowerCase()}_${(location || '').toLowerCase()}`;
  }

  get(query: string, location?: string): any[] | null {
    const key = this.getCacheKey(query, location);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    console.log(`Cache hit for query: ${query}`);
    return cached.jobs;
  }

  set(query: string, jobs: any[], location?: string): void {
    const key = this.getCacheKey(query, location);
    this.cache.set(key, {
      jobs,
      timestamp: Date.now(),
      query,
      location
    });

    console.log(`Cached ${jobs.length} jobs for query: ${query}`);
    
    // Clean up old cache entries (keep max 50 entries)
    if (this.cache.size > 50) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const jobCacheService = new JobCacheService();
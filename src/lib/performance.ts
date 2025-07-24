// Performance optimizations for handling large content databases
import { useState, useEffect, useMemo, useCallback } from 'react';

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    visibleRange
  };
}

// Lazy loading hook for content
export function useLazyContent<T>(
  loadFn: () => Promise<T[]>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loadFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load content'));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return { data, loading, error, reload: loadContent };
}

// Debounced search hook
export function useDebouncedSearch<T>(
  items: T[],
  searchFn: (items: T[], query: string) => T[],
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    return searchFn(items, debouncedQuery);
  }, [items, debouncedQuery, searchFn]);

  return {
    query,
    setQuery,
    filteredItems,
    isSearching: query !== debouncedQuery
  };
}

// Content caching system
export class ContentCache {
  private static instance: ContentCache;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  public static getInstance(): ContentCache {
    if (!ContentCache.instance) {
      ContentCache.instance = new ContentCache();
    }
    return ContentCache.instance;
  }

  public set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

// Intersection Observer hook for infinite scrolling
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  onIntersect: () => void,
  options: IntersectionObserverInit = {}
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [onIntersect, options]);
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private marks = new Map<string, number>();
  private measures = new Map<string, number>();

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public mark(name: string): void {
    this.marks.set(name, performance.now());
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  }

  public measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();

    if (!start) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    if (endMark && !end) {
      console.warn(`End mark "${endMark}" not found`);
      return 0;
    }

    const duration = (end || performance.now()) - start;
    this.measures.set(name, duration);

    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        // Fallback for browsers that don't support all performance API features
        console.log(`Performance measure "${name}": ${duration.toFixed(2)}ms`);
      }
    }

    return duration;
  }

  public getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  public getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  public clear(): void {
    this.marks.clear();
    this.measures.clear();
    if ('performance' in window && 'clearMarks' in performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Resource preloading
export function preloadResource(url: string, type: 'image' | 'audio' | 'video' | 'script' = 'image'): Promise<void> {
  return new Promise((resolve, reject) => {
    let element: HTMLElement;

    switch (type) {
      case 'image':
        element = new Image();
        (element as HTMLImageElement).src = url;
        break;
      case 'audio':
        element = new Audio();
        (element as HTMLAudioElement).src = url;
        break;
      case 'video':
        element = document.createElement('video');
        (element as HTMLVideoElement).src = url;
        break;
      case 'script':
        element = document.createElement('script');
        (element as HTMLScriptElement).src = url;
        document.head.appendChild(element);
        break;
      default:
        reject(new Error(`Unsupported resource type: ${type}`));
        return;
    }

    element.onload = () => resolve();
    element.onerror = () => reject(new Error(`Failed to preload ${type}: ${url}`));
  });
}

// Bundle size and loading optimization
export const loadChunk = async (chunkName: string): Promise<any> => {
  const cache = ContentCache.getInstance();
  
  if (cache.has(chunkName)) {
    return cache.get(chunkName);
  }

  try {
    const module = await import(`@/lib/content-chunks/${chunkName}`);
    cache.set(chunkName, module.default, 10 * 60 * 1000); // 10 minutes TTL
    return module.default;
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error);
    throw error;
  }
};

// Efficient state updates for large lists
export function useOptimizedList<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [version, setVersion] = useState(0);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
    setVersion(v => v + 1);
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = item;
      return next;
    });
    setVersion(v => v + 1);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setVersion(v => v + 1);
  }, []);

  const batchUpdate = useCallback((updates: Array<{ type: 'add' | 'update' | 'remove'; item?: T; index?: number }>) => {
    setItems(prev => {
      let next = [...prev];
      
      updates.forEach(update => {
        switch (update.type) {
          case 'add':
            if (update.item) next.push(update.item);
            break;
          case 'update':
            if (update.index !== undefined && update.item) {
              next[update.index] = update.item;
            }
            break;
          case 'remove':
            if (update.index !== undefined) {
              next.splice(update.index, 1);
            }
            break;
        }
      });
      
      return next;
    });
    setVersion(v => v + 1);
  }, []);

  return {
    items,
    version,
    addItem,
    updateItem,
    removeItem,
    batchUpdate
  };
}
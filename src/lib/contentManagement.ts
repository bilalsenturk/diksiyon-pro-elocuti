// Content chunking system to handle large content databases efficiently
import { type SkillLevel, type ContentCategory } from '@/lib/content';

// Split content into manageable chunks to avoid loading everything at once
export interface ContentChunk {
  id: string;
  name: string;
  description: string;
  category: ContentCategory;
  level: SkillLevel;
  itemCount: number;
  estimatedSize: number; // in bytes
  priority: number; // 1-10, higher = more important
}

// Content chunk registry
export const contentChunks: Record<string, ContentChunk> = {
  'breathing-beginner': {
    id: 'breathing-beginner',
    name: 'Temel Nefes Egzersizleri',
    description: 'Başlangıç seviyesi nefes kontrolü egzersizleri',
    category: 'breathing',
    level: 'beginner',
    itemCount: 4,
    estimatedSize: 2048,
    priority: 10
  },
  'breathing-intermediate': {
    id: 'breathing-intermediate',
    name: 'Orta Seviye Nefes Egzersizleri',
    description: 'Gelişmiş nefes teknikleri ve kontrol',
    category: 'breathing',
    level: 'intermediate',
    itemCount: 3,
    estimatedSize: 1536,
    priority: 8
  },
  'breathing-advanced': {
    id: 'breathing-advanced',
    name: 'İleri Seviye Nefes Egzersizleri',
    description: 'Uzman seviye nefes kontrolü ve performans',
    category: 'breathing',
    level: 'advanced',
    itemCount: 2,
    estimatedSize: 1024,
    priority: 6
  },
  'breathing-expert': {
    id: 'breathing-expert',
    name: 'Uzman Seviye Nefes Egzersizleri',
    description: 'Profesyonel seviye nefes teknikleri',
    category: 'breathing',
    level: 'expert',
    itemCount: 2,
    estimatedSize: 1024,
    priority: 4
  },
  'syllable-beginner': {
    id: 'syllable-beginner',
    name: 'Temel Hece Egzersizleri',
    description: 'Başlangıç seviyesi hece ve telaffuz',
    category: 'syllable',
    level: 'beginner',
    itemCount: 3,
    estimatedSize: 3072,
    priority: 9
  },
  'syllable-intermediate': {
    id: 'syllable-intermediate',
    name: 'Orta Seviye Hece Egzersizleri',
    description: 'Karmaşık hece yapıları ve ritim',
    category: 'syllable',
    level: 'intermediate',
    itemCount: 3,
    estimatedSize: 3072,
    priority: 7
  },
  'syllable-advanced': {
    id: 'syllable-advanced',
    name: 'İleri Seviye Hece Egzersizleri',
    description: 'Zorlu kombinasyonlar ve hız çalışmaları',
    category: 'syllable',
    level: 'advanced',
    itemCount: 2,
    estimatedSize: 2048,
    priority: 5
  },
  'syllable-expert': {
    id: 'syllable-expert',
    name: 'Uzman Seviye Hece Egzersizleri',
    description: 'Profesyonel diksiyon teknikleri',
    category: 'syllable',
    level: 'expert',
    itemCount: 1,
    estimatedSize: 1024,
    priority: 3
  },
  'articulation-consonants': {
    id: 'articulation-consonants',
    name: 'Ünsüz Harfler',
    description: 'Tüm seviyeler için ünsüz harf telaffuzu',
    category: 'articulation',
    level: 'beginner',
    itemCount: 3,
    estimatedSize: 4096,
    priority: 9
  },
  'articulation-vowels': {
    id: 'articulation-vowels',
    name: 'Sesli Harfler',
    description: 'Türkçe sesli harf netliği',
    category: 'articulation',
    level: 'beginner',
    itemCount: 1,
    estimatedSize: 1024,
    priority: 8
  },
  'articulation-combinations': {
    id: 'articulation-combinations',
    name: 'Ses Kombinasyonları',
    description: 'Karmaşık ses birleşimleri',
    category: 'articulation',
    level: 'intermediate',
    itemCount: 2,
    estimatedSize: 2048,
    priority: 6
  },
  'articulation-twisters': {
    id: 'articulation-twisters',
    name: 'Tekerleme Egzersizleri',
    description: 'Zorlu tekerleme ve telaffuz çalışmaları',
    category: 'articulation',
    level: 'expert',
    itemCount: 1,
    estimatedSize: 1536,
    priority: 4
  }
};

// Content loading priorities based on user activity
export class ContentLoadManager {
  private static instance: ContentLoadManager;
  private loadedChunks = new Set<string>();
  private loadingChunks = new Set<string>();
  private preloadQueue: string[] = [];

  public static getInstance(): ContentLoadManager {
    if (!ContentLoadManager.instance) {
      ContentLoadManager.instance = new ContentLoadManager();
    }
    return ContentLoadManager.instance;
  }

  // Get chunks to preload based on user level and activity
  public getPreloadQueue(userLevel: SkillLevel, currentCategory?: ContentCategory): string[] {
    const chunks = Object.values(contentChunks);
    
    // Priority rules:
    // 1. Current user level and below
    // 2. Current category if specified
    // 3. High priority chunks
    // 4. Small chunks (faster to load)
    
    const prioritized = chunks
      .filter(chunk => {
        // Include current level and previous levels
        const levelOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
        const userLevelIndex = levelOrder.indexOf(userLevel);
        const chunkLevelIndex = levelOrder.indexOf(chunk.level);
        return chunkLevelIndex <= userLevelIndex + 1; // Include one level above
      })
      .sort((a, b) => {
        // Current category gets highest priority
        if (currentCategory) {
          if (a.category === currentCategory && b.category !== currentCategory) return -1;
          if (b.category === currentCategory && a.category !== currentCategory) return 1;
        }
        
        // Then by priority score
        if (a.priority !== b.priority) return b.priority - a.priority;
        
        // Then by size (smaller first)
        return a.estimatedSize - b.estimatedSize;
      })
      .map(chunk => chunk.id);

    return prioritized;
  }

  // Check if a chunk is loaded
  public isLoaded(chunkId: string): boolean {
    return this.loadedChunks.has(chunkId);
  }

  // Check if a chunk is currently loading
  public isLoading(chunkId: string): boolean {
    return this.loadingChunks.has(chunkId);
  }

  // Mark chunk as loaded
  public markLoaded(chunkId: string): void {
    this.loadedChunks.add(chunkId);
    this.loadingChunks.delete(chunkId);
  }

  // Mark chunk as loading
  public markLoading(chunkId: string): void {
    this.loadingChunks.add(chunkId);
  }

  // Get loading statistics
  public getStats(): {
    totalChunks: number;
    loadedChunks: number;
    loadingChunks: number;
    totalSize: number;
    loadedSize: number;
  } {
    const totalChunks = Object.keys(contentChunks).length;
    const loadedSize = Array.from(this.loadedChunks)
      .reduce((sum, chunkId) => sum + (contentChunks[chunkId]?.estimatedSize || 0), 0);
    const totalSize = Object.values(contentChunks)
      .reduce((sum, chunk) => sum + chunk.estimatedSize, 0);

    return {
      totalChunks,
      loadedChunks: this.loadedChunks.size,
      loadingChunks: this.loadingChunks.size,
      totalSize,
      loadedSize
    };
  }

  // Clear all loaded chunks (for memory management)
  public clearCache(): void {
    this.loadedChunks.clear();
    this.loadingChunks.clear();
  }
}

// Smart content pagination
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalItems: number;
}

export function calculatePagination(options: PaginationOptions) {
  const { page, pageSize, totalItems } = options;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return {
    startIndex,
    endIndex,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    currentPage: page,
    itemsOnPage: endIndex - startIndex
  };
}

// Content search and filtering optimization
export class ContentSearchEngine {
  private static instance: ContentSearchEngine;
  private searchIndex = new Map<string, string[]>(); // term -> content IDs
  private contentMap = new Map<string, any>(); // content ID -> content

  public static getInstance(): ContentSearchEngine {
    if (!ContentSearchEngine.instance) {
      ContentSearchEngine.instance = new ContentSearchEngine();
    }
    return ContentSearchEngine.instance;
  }

  // Build search index for fast searching
  public buildIndex(content: any[], getSearchTerms: (item: any) => string[]): void {
    this.searchIndex.clear();
    this.contentMap.clear();

    content.forEach(item => {
      const id = item.id;
      this.contentMap.set(id, item);
      
      const terms = getSearchTerms(item);
      terms.forEach(term => {
        const normalizedTerm = this.normalizeTerm(term);
        if (!this.searchIndex.has(normalizedTerm)) {
          this.searchIndex.set(normalizedTerm, []);
        }
        this.searchIndex.get(normalizedTerm)!.push(id);
      });
    });
  }

  // Fast search using pre-built index
  public search(query: string, limit: number = 50): any[] {
    const normalizedQuery = this.normalizeTerm(query);
    const matchingIds = new Set<string>();

    // Find exact matches first
    if (this.searchIndex.has(normalizedQuery)) {
      this.searchIndex.get(normalizedQuery)!.forEach(id => matchingIds.add(id));
    }

    // Find partial matches
    if (matchingIds.size < limit) {
      this.searchIndex.forEach((ids, term) => {
        if (term.includes(normalizedQuery) || normalizedQuery.includes(term)) {
          ids.forEach(id => matchingIds.add(id));
        }
      });
    }

    // Return results limited to specified count
    return Array.from(matchingIds)
      .slice(0, limit)
      .map(id => this.contentMap.get(id))
      .filter(Boolean);
  }

  private normalizeTerm(term: string): string {
    return term.toLowerCase()
      .replace(/[üu]/g, 'u')
      .replace(/[öo]/g, 'o')
      .replace(/[çc]/g, 'c')
      .replace(/[ğg]/g, 'g')
      .replace(/[ış]/g, 'i')
      .replace(/[^a-z0-9]/g, '');
  }
}

// Adaptive content recommendation engine
export class ContentRecommendationEngine {
  private static instance: ContentRecommendationEngine;

  public static getInstance(): ContentRecommendationEngine {
    if (!ContentRecommendationEngine.instance) {
      ContentRecommendationEngine.instance = new ContentRecommendationEngine();
    }
    return ContentRecommendationEngine.instance;
  }

  // Get recommended content based on user progress and preferences
  public getRecommendations(
    userStats: {
      level: SkillLevel;
      completedExercises: string[];
      weakAreas: ContentCategory[];
      preferredDifficulty: number;
    },
    count: number = 10
  ): string[] {
    const chunks = Object.values(contentChunks);
    
    // Score each chunk based on relevance
    const scored = chunks.map(chunk => ({
      chunk,
      score: this.calculateRelevanceScore(chunk, userStats)
    }));

    // Sort by score and return top results
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.chunk.id);
  }

  private calculateRelevanceScore(
    chunk: ContentChunk,
    userStats: {
      level: SkillLevel;
      completedExercises: string[];
      weakAreas: ContentCategory[];
      preferredDifficulty: number;
    }
  ): number {
    let score = 0;

    // Level appropriateness (max 40 points)
    const levelOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userLevelIndex = levelOrder.indexOf(userStats.level);
    const chunkLevelIndex = levelOrder.indexOf(chunk.level);
    
    if (chunkLevelIndex === userLevelIndex) {
      score += 40;
    } else if (chunkLevelIndex === userLevelIndex + 1) {
      score += 30; // Slightly challenging
    } else if (chunkLevelIndex === userLevelIndex - 1) {
      score += 20; // Review content
    } else {
      score += Math.max(0, 10 - Math.abs(chunkLevelIndex - userLevelIndex) * 5);
    }

    // Weak area focus (max 30 points)
    if (userStats.weakAreas.includes(chunk.category)) {
      score += 30;
    }

    // Priority and freshness (max 20 points)
    score += chunk.priority * 2;

    // Size consideration (prefer smaller chunks for quick wins) (max 10 points)
    score += Math.max(0, 10 - (chunk.estimatedSize / 1024));

    return score;
  }
}

// Content delivery optimization
export function optimizeContentDelivery() {
  // Implement service worker for content caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/content-worker.js')
      .then(registration => {
        console.log('Content worker registered:', registration);
      })
      .catch(error => {
        console.log('Content worker registration failed:', error);
      });
  }
}

// Content analytics and usage tracking
export class ContentAnalytics {
  private static instance: ContentAnalytics;
  private usage = new Map<string, { views: number; timeSpent: number; lastAccessed: number }>();

  public static getInstance(): ContentAnalytics {
    if (!ContentAnalytics.instance) {
      ContentAnalytics.instance = new ContentAnalytics();
    }
    return ContentAnalytics.instance;
  }

  public trackView(contentId: string): void {
    const current = this.usage.get(contentId) || { views: 0, timeSpent: 0, lastAccessed: 0 };
    current.views++;
    current.lastAccessed = Date.now();
    this.usage.set(contentId, current);
  }

  public trackTimeSpent(contentId: string, duration: number): void {
    const current = this.usage.get(contentId) || { views: 0, timeSpent: 0, lastAccessed: 0 };
    current.timeSpent += duration;
    this.usage.set(contentId, current);
  }

  public getPopularContent(limit: number = 10): string[] {
    return Array.from(this.usage.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, limit)
      .map(([id]) => id);
  }

  public getRecentContent(limit: number = 10): string[] {
    return Array.from(this.usage.entries())
      .sort((a, b) => b[1].lastAccessed - a[1].lastAccessed)
      .slice(0, limit)
      .map(([id]) => id);
  }

  public getEngagementScore(contentId: string): number {
    const data = this.usage.get(contentId);
    if (!data) return 0;
    
    // Combine views and time spent for engagement score
    return data.views * 0.3 + (data.timeSpent / 1000) * 0.7;
  }
}
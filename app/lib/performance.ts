/**
 * Performance optimization utilities
 */

/**
 * Preload an image to avoid flash when it appears
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images in parallel
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => preloadImage(url)));
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1) as unknown as number;
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Lazy load images when they enter viewport
 */
export function setupLazyLoading(
  selector: string = 'img[data-src]'
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll(selector).forEach((img) => {
    observer.observe(img);
  });

  return observer;
}

/**
 * Prefetch resources
 */
export function prefetchResource(url: string, type: 'script' | 'style' | 'image' | 'fetch' = 'fetch'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (type !== 'fetch') {
    link.as = type;
  }
  document.head.appendChild(link);
}

/**
 * Memory usage monitoring (if available)
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  limit: number;
} | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const memory = (performance as Performance & { memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }}).memory;

  if (!memory) return null;

  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
  };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics(): void {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!perfData) return;

  console.log('[Performance Metrics]', {
    DNS: `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
    TCP: `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
    Request: `${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`,
    Response: `${(perfData.responseEnd - perfData.responseStart).toFixed(2)}ms`,
    DOM: `${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`,
    Load: `${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`,
    Total: `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`,
  });

  const memory = getMemoryUsage();
  if (memory) {
    console.log('[Memory Usage]', {
      used: `${(memory.used / 1048576).toFixed(2)}MB`,
      total: `${(memory.total / 1048576).toFixed(2)}MB`,
      limit: `${(memory.limit / 1048576).toFixed(2)}MB`,
    });
  }
}

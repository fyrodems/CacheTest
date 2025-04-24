import { useState, useEffect, useCallback } from "react";
import { PerformanceMetricsViewModel } from "../types/cache";

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetricsViewModel>({
    fp: null,
    fcp: null,
    tti: null,
    lcp: null,
    fid: null,
    ttfb: null,
    offlineAvailability: navigator.onLine,
    timestamp: new Date()
  });
  
  const [isCollecting, setIsCollecting] = useState(false);
  const [observers, setObservers] = useState<PerformanceObserver[]>([]);
  
  const startMeasuring = useCallback(() => {
    setMetrics({
      fp: null,
      fcp: null,
      tti: null,
      lcp: null,
      fid: null,
      ttfb: null,
      offlineAvailability: navigator.onLine,
      timestamp: new Date()
    });
    
    setIsCollecting(true);
    
    // First Paint i First Contentful Paint
    const paintObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (entry.name === 'first-paint') {
          setMetrics(prev => ({ ...prev, fp: entry.startTime }));
        }
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      }
    });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entries) => {
      const lastEntry = entries.getEntries().pop();
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });
    
    // Time to Interactive - nie ma bezpośredniego API, używamy niestandardowego pomiaru
    // First Input Delay
    const fidObserver = new PerformanceObserver((entries) => {
      const firstEntry = entries.getEntries()[0];
      if (firstEntry) {
        setMetrics(prev => ({ 
          ...prev, 
          fid: firstEntry.processingStart 
            ? firstEntry.processingStart - firstEntry.startTime 
            : null
        }));
      }
    });
    
    // Resource timing do Time to First Byte
    const resourceObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (entry.entryType === 'resource' && 'responseStart' in entry && entry.responseStart > 0) {
          const ttfb = entry.responseStart - entry.fetchStart;
          setMetrics(prev => ({ 
            ...prev, 
            ttfb: prev.ttfb === null ? ttfb : Math.min(prev.ttfb, ttfb)
          }));
        }
      }
    });
    
    try {
      paintObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      resourceObserver.observe({ entryTypes: ['resource'] });
      
      setObservers([paintObserver, lcpObserver, fidObserver, resourceObserver]);
      
      // Symulacja TTI - używamy setTimeout jako prostej aproksymacji
      setTimeout(() => {
        setMetrics(prev => ({ 
          ...prev, 
          tti: performance.now() 
        }));
      }, 1000);
      
    } catch (error) {
      console.error('Error setting up performance observers:', error);
    }
  }, []);
  
  const stopMeasuring = useCallback(() => {
    setIsCollecting(false);
    
    // Disconnect all observers
    observers.forEach(observer => observer.disconnect());
    setObservers([]);
    
    return metrics;
  }, [metrics, observers]);
  
  const resetMetrics = useCallback(() => {
    setMetrics({
      fp: null,
      fcp: null,
      tti: null,
      lcp: null,
      fid: null,
      ttfb: null,
      offlineAvailability: navigator.onLine,
      timestamp: new Date()
    });
  }, []);
  
  useEffect(() => {
    return () => {
      // Cleanup observers on component unmount
      observers.forEach(observer => observer.disconnect());
    };
  }, [observers]);
  
  return { 
    metrics, 
    isCollecting,
    startMeasuring, 
    stopMeasuring, 
    resetMetrics 
  };
}; 
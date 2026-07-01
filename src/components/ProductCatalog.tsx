/* src/components/ProductCatalog.tsx */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './ProductCatalog.module.css';
import ProductCard from './ProductCard';
import FiltersSidebar from './FiltersSidebar';
import ProductModal from './ProductModal';
import { sanitizePrice } from '../utils/sanitize';
import { Product, FilterState } from '../types';

const ITEMS_PER_PAGE = 24;

interface ProductCatalogProps {
  rawProducts: Product[];
}

export default function ProductCatalog({ rawProducts = [] }: ProductCatalogProps) {
  const [mounted, setMounted] = useState(false);
  // --- Theme State ---
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setMounted(true);
    // Initialize theme from storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // --- Sanitize and Memoize Dataset ---
  const products = useMemo(() => {
    return rawProducts.map((p) => ({
      ...p,
      cleanPrice: sanitizePrice(p.price),
    }));
  }, [rawProducts]);

  // --- Filter and UI States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('relevance');
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    selectedBrands: [],
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    inStockOnly: false,
  });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // --- Dynamic Catalog Metadata ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  // Calculate dynamic maximum price to bound filters
  const maxRangePrice = useMemo(() => {
    let max = 0;
    products.forEach((p) => {
      if (p.cleanPrice && p.cleanPrice > max) {
        max = p.cleanPrice;
      }
    });
    return Math.ceil(max) || 2000;
  }, [products]);

  // Count items per category (based on search query to feel dynamic!)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat] = 0;
    });

    products.forEach((p) => {
      if (!p.category) return;
      
      // Perform simple search query check so counts reflect current search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        const tagsMatch = p.tags?.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !brandMatch && !tagsMatch) return;
      }
      
      const catTrim = p.category.trim();
      counts[catTrim] = (counts[catTrim] || 0) + 1;
    });
    return counts;
  }, [products, categories, searchQuery]);

  // --- Filter Changes ---
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setVisibleCount(ITEMS_PER_PAGE); // Reset page count on filter
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      selectedBrands: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      inStockOnly: false,
    });
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // --- Search & Filter Logic ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search (Fuzzy token matching)
    const queryStr = searchQuery.toLowerCase().trim();
    if (queryStr) {
      const tokens = queryStr.split(/\s+/);
      result = result.filter((p) => {
        const searchableText = [
          p.title || '',
          p.brand || '',
          p.category || '',
          p.description || '',
          ...(p.tags || []),
        ].join(' ').toLowerCase();

        // All search words must match somewhere in the product text
        return tokens.every((token) => searchableText.includes(token));
      });
    }

    // 2. Category Filter
    if (filters.category) {
      result = result.filter((p) => p.category?.trim() === filters.category);
    }

    // 3. Brands Filter (Multi-select OR logic)
    if (filters.selectedBrands.length > 0) {
      result = result.filter((p) => p.brand !== null && filters.selectedBrands.includes(p.brand.trim()));
    }

    // 4. Price range Filter
    if (filters.minPrice !== '') {
      result = result.filter((p) => p.cleanPrice !== null && p.cleanPrice >= (filters.minPrice as number));
    }
    if (filters.maxPrice !== '') {
      result = result.filter((p) => p.cleanPrice !== null && p.cleanPrice <= (filters.maxPrice as number));
    }

    // 5. Rating Filter (Minimum stars)
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating !== null && p.rating >= filters.minRating);
    }

    // 6. In Stock Filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock === true);
    }

    // --- Sorting Logic ---
    if (sortOption === 'price-asc') {
      result.sort((a, b) => {
        if (a.cleanPrice === null || a.cleanPrice === undefined) return 1;
        if (b.cleanPrice === null || b.cleanPrice === undefined) return -1;
        return a.cleanPrice - b.cleanPrice;
      });
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => {
        if (a.cleanPrice === null || a.cleanPrice === undefined) return 1;
        if (b.cleanPrice === null || b.cleanPrice === undefined) return -1;
        return b.cleanPrice - a.cleanPrice;
      });
    } else if (sortOption === 'rating-desc') {
      result.sort((a, b) => {
        if (a.rating === null || a.rating === undefined) return 1;
        if (b.rating === null || b.rating === undefined) return -1;
        return b.rating - a.rating;
      });
    } else if (sortOption === 'newest') {
      result.sort((a, b) => {
        const dateA = a.releasedAt ? new Date(a.releasedAt).getTime() : 0;
        const dateB = b.releasedAt ? new Date(b.releasedAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === 'relevance' && queryStr) {
      // Basic relevance sorting: items starting with query are listed first
      result.sort((a, b) => {
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        const startsA = titleA.startsWith(queryStr) ? 1 : 0;
        const startsB = titleB.startsWith(queryStr) ? 1 : 0;
        return startsB - startsA;
      });
    }

    return result;
  }, [products, searchQuery, filters, sortOption]);

  // Paginated subset
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  if (!mounted) {
    return (
      <div className={styles.container} id="product-discovery-loading">
        <header className={styles.header}>
          <div className={styles.brandBar}>
            <h1 className={styles.logo}>Foundry<span>Home</span></h1>
          </div>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid hsl(var(--border-color))', borderTopColor: 'hsl(var(--accent-gold))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}} />
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem', letterSpacing: '0.05em' }}>Loading Foundry Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} id="product-discovery-app">
      {/* 1. Header Section */}
      <header className={styles.header}>
        <div className={styles.brandBar}>
          <h1 className={styles.logo}>Foundry<span>Home</span></h1>
          <div className={styles.controls}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme mode"
              title="Toggle theme mode"
              id="btn-theme-toggle"
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search home goods, brands, categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            id="global-search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clearSearchBtn} 
              onClick={clearSearch}
              aria-label="Clear search query"
              id="btn-clear-search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Discovery Grid Layout */}
      <div className={styles.layoutGrid}>
        
        {/* Left Side: Filter Panels */}
        <FiltersSidebar
          categories={categories}
          categoryCounts={categoryCounts}
          brands={brands}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          maxRangePrice={maxRangePrice}
        />

        {/* Right Side: Catalog Listings */}
        <section aria-label="Product listings" id="catalog-section">
          <div className={styles.resultsHeader}>
            <div className={styles.stats}>
              Showing {filteredProducts.length === 0 ? 0 : `1-${Math.min(visibleCount, filteredProducts.length)}`} of {filteredProducts.length} items
            </div>
            
            <div className={styles.resultsActions}>
              {/* Sort Dropdown */}
              <select
                className={styles.sortSelector}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                aria-label="Sort products by"
                id="sort-select"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="newest">Release Date: Newest</option>
              </select>

              {/* Layout view buttons */}
              <div className={styles.viewToggles}>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${layoutMode === 'grid' ? styles.viewBtnActive : ''}`}
                  onClick={() => setLayoutMode('grid')}
                  aria-label="Switch to grid layout"
                  title="Grid view"
                  id="btn-layout-grid"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${layoutMode === 'list' ? styles.viewBtnActive : ''}`}
                  onClick={() => setLayoutMode('list')}
                  aria-label="Switch to list layout"
                  title="List view"
                  id="btn-layout-list"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Panel */}
          {visibleProducts.length > 0 ? (
            <div className={layoutMode === 'grid' ? styles.grid : styles.list} id="products-catalog-list">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={layoutMode}
                  onClick={(prod) => setActiveProduct(prod)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults} id="no-results-panel">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--text-tertiary))' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <h3 className={styles.noResultsTitle}>No items match your search</h3>
              <p className={styles.noResultsText}>
                We couldn't find any products matching those criteria. Try expanding your parameters or clearing active filters.
              </p>
              <button 
                type="button" 
                className={styles.loadMoreBtn} 
                onClick={handleClearFilters}
                style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                id="btn-reset-no-results"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Load More Pagination */}
          {filteredProducts.length > visibleCount && (
            <div className={styles.loadMoreSection} id="load-more-section">
              <span className={styles.progressText}>
                You've viewed {visibleCount} of {filteredProducts.length} items
              </span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${(visibleCount / filteredProducts.length) * 100}%` }}
                ></div>
              </div>
              <button 
                type="button" 
                className={styles.loadMoreBtn} 
                onClick={loadMore}
                id="btn-load-more"
              >
                Load More Products
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 3. Detail Quick View Modal */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}

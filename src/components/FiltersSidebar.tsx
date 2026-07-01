/* src/components/FiltersSidebar.tsx */

import React from 'react';
import styles from './FiltersSidebar.module.css';
import { FilterState } from '../types';

interface FiltersSidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  brands: string[];
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  maxRangePrice?: number;
}

export default function FiltersSidebar({
  categories = [],
  categoryCounts = {},
  brands = [],
  filters,
  onFilterChange,
  onClearFilters,
  maxRangePrice = 2000
}: FiltersSidebarProps) {
  const { category, selectedBrands, minPrice, maxPrice, minRating, inStockOnly } = filters;

  const handleCategorySelect = (cat: string) => {
    onFilterChange('category', category === cat ? '' : cat);
  };

  const handleBrandToggle = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    onFilterChange('selectedBrands', updatedBrands);
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    onFilterChange(field, isNaN(numVal as number) ? '' : (numVal as number));
  };

  const handleRatingChange = (ratingVal: number) => {
    onFilterChange('minRating', minRating === ratingVal ? 0 : ratingVal);
  };

  const handleStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('inStockOnly', e.target.checked);
  };

  // Check if any filter is active
  const hasActiveFilters = 
    category !== '' || 
    selectedBrands.length > 0 || 
    minPrice !== '' || 
    maxPrice !== '' || 
    minRating > 0 || 
    inStockOnly;

  return (
    <aside className={styles.sidebar} aria-label="Product filters" id="filters-sidebar">
      <div className={styles.titleRow}>
        <h3 className={styles.title}>Filters</h3>
        {hasActiveFilters && (
          <button 
            type="button" 
            className={styles.clearAllBtn}
            onClick={onClearFilters}
            id="btn-clear-filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Category</h4>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : ''}`}
                onClick={() => handleCategorySelect(cat)}
                id={`btn-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{cat}</span>
                <span className={styles.countBadge}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Brand</h4>
        <div className={styles.checkboxList}>
          {brands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            const brandId = `brand-${brand.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <label key={brand} htmlFor={brandId} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  id={brandId}
                  className={styles.checkbox}
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price Range</h4>
        <div className={styles.priceInputs}>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              id="filter-price-min"
            />
          </div>
          <span className={styles.priceSeparator}>to</span>
          <div className={styles.priceInputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="Max"
              min="0"
              max={maxRangePrice}
              value={maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              id="filter-price-max"
            />
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Minimum Rating</h4>
        <div className={styles.ratingOptions}>
          {[4, 3, 2].map((stars) => {
            const isActive = minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                className={`${styles.ratingOption} ${isActive ? styles.ratingOptionActive : ''}`}
                onClick={() => handleRatingChange(stars)}
                id={`btn-rating-${stars}-up`}
              >
                <span className={styles.optionStars}>
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </span>
                <span>& Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className={`${styles.section} ${styles.toggleRow}`}>
        <span className={styles.toggleLabel}>In Stock Only</span>
        <label htmlFor="toggle-stock" className={styles.switch}>
          <input
            type="checkbox"
            id="toggle-stock"
            checked={inStockOnly}
            onChange={handleStockToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </aside>
  );
}

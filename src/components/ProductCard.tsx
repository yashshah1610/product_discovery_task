/* src/components/ProductCard.tsx */

import React from 'react';
import styles from './ProductCard.module.css';
import { sanitizeTitle, formatCurrency } from '../utils/sanitize';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, layout = 'grid', onClick }: ProductCardProps) {
  const {
    title,
    brand,
    category,
    rating,
    reviews,
    inStock,
    image,
    description,
  } = product;

  const displayTitle = sanitizeTitle(title);
  const formattedPrice = formatCurrency(product.price);
  const hasRating = rating !== null && rating !== undefined;

  // Render stars based on rating
  const renderStars = (ratingVal: number) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i}>★</span>);
      } else if (i === floor + 1 && hasHalf) {
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ color: 'hsl(var(--border-color))' }}>★</span>
            <span style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden', color: 'hsl(var(--accent-gold))' }}>★</span>
          </span>
        );
      } else {
        stars.push(<span key={i} style={{ color: 'hsl(var(--border-color))' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <article 
      className={`${styles.card} ${layout === 'list' ? styles.cardListLayout : ''} animate-fade-in`}
      onClick={() => onClick && onClick(product)}
      id={`product-card-${product.id}`}
    >
      {/* Stock Status Badge */}
      {layout === 'grid' && (
        <span className={`${styles.badge} ${inStock ? styles.badgeInStock : styles.badgeOutOfStock}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )}

      {/* Image Area */}
      <div className={styles.imageWrapper}>
        {image ? (
          <img 
            src={image} 
            alt={displayTitle} 
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              // Fallback to SVG placeholder if image URL fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const nextSibling = target.nextSibling as HTMLDivElement;
              if (nextSibling) nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Modern Inline SVG Placeholder */}
        <div 
          className={styles.placeholder} 
          style={{ display: image ? 'none' : 'flex' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 22 1-1h3l9-9" />
            <path d="M3 21v-3l9-9" />
            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z" />
            <path d="M13 11 5 19H2v-3l8-8" />
            <circle cx="9" cy="9" r="2" />
          </svg>
        </div>
      </div>

      {/* Card Info Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category || 'Home Goods'}</span>
          <div className={styles.metaRight}>
            <div className={styles.rating}>
              {hasRating ? (
                <>
                  <div className={styles.stars}>{renderStars(rating)}</div>
                  <span>({reviews})</span>
                </>
              ) : (
                <span style={{ color: 'hsl(var(--text-tertiary))', fontSize: '0.75rem' }}>No reviews yet</span>
              )}
            </div>
            {layout === 'list' && (
              <span className={`${styles.inlineBadge} ${inStock ? styles.badgeInStock : styles.badgeOutOfStock}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>

        <h3 className={styles.title}>{displayTitle}</h3>
        <p className={styles.brand}>by {brand || 'Artisan Collection'}</p>

        {layout === 'list' && description && (
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}

        <div className={styles.footer}>
          <div className={styles.priceWrapper}>
            <span className={styles.priceLabel}>Price</span>
            {product.price !== null ? (
              <span className={styles.price}>{formattedPrice}</span>
            ) : (
              <span className={styles.priceUnavailable}>Unavailable</span>
            )}
          </div>

          <button 
            type="button" 
            className={styles.viewBtn} 
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(product);
            }}
            id={`btn-view-${product.id}`}
          >
            Quick View
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

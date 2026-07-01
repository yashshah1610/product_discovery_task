/* src/components/ProductModal.tsx */

import React, { useEffect } from 'react';
import styles from './ProductModal.module.css';
import { sanitizeTitle, formatCurrency } from '../utils/sanitize';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  const {
    title,
    brand,
    category,
    rating,
    reviews,
    inStock,
    image,
    description,
    tags,
    releasedAt,
    imageWidth,
    imageHeight
  } = product;

  const displayTitle = sanitizeTitle(title);
  const formattedPrice = formatCurrency(product.price);
  const hasRating = rating !== null && rating !== undefined;

  // Render stars helper
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
    <div 
      className={`${styles.overlay} animate-fade-in`} 
      onClick={onClose}
      id="product-modal-overlay"
    >
      <div 
        className={`${styles.modal} animate-scale-up`} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Close modal"
          id="btn-close-modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.grid}>
          {/* Left Column: Image Section */}
          <div className={styles.imageWrapper}>
            <span className={`${styles.badge} ${inStock ? styles.badgeInStock : styles.badgeOutOfStock}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {image ? (
              <img 
                src={image} 
                alt={displayTitle} 
                className={styles.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const nextSibling = target.nextSibling as HTMLDivElement;
                  if (nextSibling) nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={styles.placeholder} style={{ display: image ? 'none' : 'flex' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 22 1-1h3l9-9" />
                <path d="M3 21v-3l9-9" />
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z" />
                <path d="M13 11 5 19H2v-3l8-8" />
                <circle cx="9" cy="9" r="2" />
              </svg>
            </div>
          </div>

          {/* Right Column: Details Content */}
          <div className={styles.details}>
            <span className={styles.category}>{category || 'General'}</span>
            <h2 className={styles.title}>{displayTitle}</h2>
            <p className={styles.brand}>by {brand || 'Artisan Collection'}</p>

            <div className={styles.ratingRow}>
              {hasRating ? (
                <>
                  <div className={styles.stars}>{renderStars(rating)}</div>
                  <span style={{ fontWeight: 600 }}>{rating.toFixed(1)}</span>
                  <span style={{ color: 'hsl(var(--text-tertiary))' }}>•</span>
                  <span style={{ color: 'hsl(var(--text-secondary))' }}>{reviews} reviews</span>
                </>
              ) : (
                <span style={{ color: 'hsl(var(--text-tertiary))', fontStyle: 'italic' }}>No reviews yet</span>
              )}
            </div>

            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Price</span>
              {product.price !== null ? (
                <span className={styles.price}>{formattedPrice}</span>
              ) : (
                <span className={styles.priceUnavailable}>Inquire for Price</span>
              )}
            </div>

            <h4 className={styles.descriptionTitle}>Description</h4>
            <p className={styles.description}>
              {description || 'No description available for this handcrafted home goods item. Built with high-quality materials and designed for functional elegance.'}
            </p>

            <div className={styles.specs}>
              <div className={styles.specRow}>
                <span className={styles.specName}>Product ID</span>
                <span className={styles.specValue}>#{product.id}</span>
              </div>
              {releasedAt && (
                <div className={styles.specRow}>
                  <span className={styles.specName}>Release Date</span>
                  <span className={styles.specValue}>{new Date(releasedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {imageWidth && imageHeight && (
                <div className={styles.specRow}>
                  <span className={styles.specName}>Image Dimensions</span>
                  <span className={styles.specValue}>{imageWidth} x {imageHeight} px</span>
                </div>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div>
                <h4 className={styles.tagsTitle}>Tags</h4>
                <div className={styles.tags}>
                  {tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

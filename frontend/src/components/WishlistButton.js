import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const WishlistButton = ({ courseId, user, onShowNotification, className = '' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if course is in user's wishlist
    if (user && user.wishlist) {
      setIsInWishlist(user.wishlist.includes(courseId));
    }
  }, [courseId, user]);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events

    if (!user) {
      onShowNotification('Please login to add to wishlist', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(courseId);
        setIsInWishlist(false);
        onShowNotification('Removed from wishlist', 'success');
      } else {
        await api.addToWishlist(courseId);
        setIsInWishlist(true);
        onShowNotification('Added to wishlist', 'success');
      }
    } catch (error) {
      onShowNotification(error.message || 'Failed to update wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`wishlist-button ${isInWishlist ? 'active' : ''} ${className}`}
      onClick={handleToggleWishlist}
      disabled={loading}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="wishlist-icon">
        {loading ? '⏳' : (isInWishlist ? '💖' : '🤍')}
      </span>
    </button>
  );
};

export default WishlistButton;
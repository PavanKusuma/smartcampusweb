import React, { useState } from 'react';
import styles from '../page.module.css'

function ImageWithShimmer({ src, alt }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.imageContainer}>
      {isLoading ? (
        <div className={`${styles.shimmer} ${styles.image}`} />
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className={styles.image}
        />
      )}
    </div>
  );
}

export default ImageWithShimmer;

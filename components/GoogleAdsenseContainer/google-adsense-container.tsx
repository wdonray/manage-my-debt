import styles from './google-adsense-container.module.scss';
import { useEffect } from 'react';

interface GoogleAdsenseContainerInterface {
  slot: string;
  adFormat?: string;
  fullWidthResponsive?: string;
}

// TODO: Use this!

export function GoogleAdsenseContainer({ slot, adFormat = 'auto', fullWidthResponsive = 'true' }: GoogleAdsenseContainerInterface) {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className={styles['ga-container']}>
      <ins
        className={styles.adsbygoogle}
        data-ad-client={process.env.ADSENSE_AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

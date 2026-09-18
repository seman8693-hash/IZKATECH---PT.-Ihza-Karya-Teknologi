import { useEffect, useState } from 'react';
import { getBrandSettings } from '../data/adminStore';

export interface BrandIdentity {
  companyName: string;
  brandName: string;
  domain: string;
  subdomain: string;
  tagline: string;
  subBrand1: string;
  subBrand2: string;
  mainLogo: string | null;
  monoLogo: string | null;
  favicon: string | null;
  primaryColor: string;
}

const readIdentity = (): BrandIdentity => {
  const brand = getBrandSettings();
  return {
    companyName: brand.legal.companyName,
    brandName: brand.legal.brandName,
    domain: brand.legal.domain,
    subdomain: brand.legal.subdomain,
    tagline: brand.legal.tagline,
    subBrand1: brand.legal.subBrand1,
    subBrand2: brand.legal.subBrand2,
    mainLogo: brand.mainLogo,
    monoLogo: brand.monoLogo,
    favicon: brand.favicon,
    primaryColor: brand.colors.primary,
  };
};

/**
 * Identitas brand reaktif — otomatis diperbarui setiap kali
 * "Pengaturan Logo & Identitas Brand" disimpan (single source of truth).
 */
export const useBrandIdentity = (): BrandIdentity => {
  const [identity, setIdentity] = useState<BrandIdentity>(readIdentity);

  useEffect(() => {
    const sync = () => setIdentity(readIdentity());
    window.addEventListener('izkatech_brand_updated', sync);
    window.addEventListener('izkatech_logo_updated', sync);
    return () => {
      window.removeEventListener('izkatech_brand_updated', sync);
      window.removeEventListener('izkatech_logo_updated', sync);
    };
  }, []);

  return identity;
};

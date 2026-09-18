/**
 * Tipe data konten website publik (data statis katalog perusahaan).
 * Untuk tipe data Portal Admin, lihat `src/types/admin.ts`.
 */

export interface ServiceItem {
  id: string;
  title: string;
  titleEn: string;
  category: 'network' | 'security' | 'telecom' | 'me' | 'hardware' | 'maintenance';
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  brands: string[];
  iconName: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  location: string;
  city: string;
  sector: 'commercial' | 'education' | 'infrastructure' | 'hospitality' | 'government' | 'healthcare';
  sectorLabel: string;
  status: 'Completed' | 'On Going';
  scope: string;
  year?: string;
  highlight?: boolean;
}

export interface BrandPartner {
  name: string;
  category: string;
  categoryKey: 'cctv' | 'access' | 'security' | 'telecom' | 'supply';
  tier?: string;
}

export interface MarketSector {
  title: string;
  description: string;
  icon: string;
  examples: string;
}

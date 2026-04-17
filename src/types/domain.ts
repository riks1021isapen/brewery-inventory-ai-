export type MaterialCategory = 'malt' | 'hop' | 'yeast' | 'adjunct';

export interface Material {
  id: string;
  user_id: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  threshold: number;
  notes?: string | null;
}

export interface Lot {
  id: string;
  user_id: string;
  material_id: string;
  lot_no: string;
  vendor_id: string;
  quantity_total: number;
  quantity_remaining: number;
  cost_per_unit: number;
  received_date: string;
  expiry_date?: string | null;
}

export interface InventoryTransaction {
  id: string;
  user_id: string;
  lot_id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  pdf_metadata?: Record<string, unknown> | null;
}

export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
}

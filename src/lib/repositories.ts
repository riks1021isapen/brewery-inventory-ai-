import { supabase } from '@/lib/supabaseClient';
import type { InventoryTransaction, Lot, Material, Vendor } from '@/types/domain';

export async function listMaterials(category?: Material['category']) {
  let query = supabase.from('materials').select('*').order('name');
  if (category) query = query.eq('category', category);
  return query;
}

export async function upsertMaterial(material: Partial<Material>) {
  return supabase.from('materials').upsert(material).select('*').single();
}

export async function deleteMaterial(id: string) {
  return supabase.from('materials').delete().eq('id', id);
}

export async function listLots() {
  return supabase
    .from('lots')
    .select('*, materials(name, category), vendors(name)')
    .order('received_date', { ascending: false });
}

export async function createLot(lot: Partial<Lot>) {
  return supabase.from('lots').insert(lot).select('*').single();
}

export async function listTransactions() {
  return supabase
    .from('transactions')
    .select('*, lots(lot_no, material_id)')
    .order('date', { ascending: false });
}

export async function createTransaction(transaction: Partial<InventoryTransaction>) {
  return supabase.from('transactions').insert(transaction).select('*').single();
}

export async function listVendors() {
  return supabase.from('vendors').select('*').order('name');
}

export async function upsertVendor(vendor: Partial<Vendor>) {
  return supabase.from('vendors').upsert(vendor).select('*').single();
}

export async function deleteVendor(id: string) {
  return supabase.from('vendors').delete().eq('id', id);
}

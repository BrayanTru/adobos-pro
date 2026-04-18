import { supabase } from "./supabaseClient";

export const itemsService = {
  async getByTransaccion(transaccionId) {
    const { data, error } = await supabase
      .from("transaccion_items")
      .select("*")
      .eq("transaccion_id", transaccionId)
      .order("created_at");
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("transaccion_items")
      .select("*");
    if (error) throw error;
    return data;
  },

  async createMany(items) {
    const { data, error } = await supabase
      .from("transaccion_items")
      .insert(items)
      .select();
    if (error) throw error;
    return data;
  },

  async deleteByTransaccion(transaccionId) {
    const { error } = await supabase
      .from("transaccion_items")
      .delete()
      .eq("transaccion_id", transaccionId);
    if (error) throw error;
  },
};

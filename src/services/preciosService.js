import { supabase } from "./supabaseClient";

export const preciosService = {
  async getAll() {
    const { data, error } = await supabase
      .from("precios")
      .select("*")
      .order("gramos", { ascending: true });
    if (error) throw error;
    return data;
  },

  async update(id, precio) {
    const { data, error } = await supabase
      .from("precios")
      .update({ precio, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },
};

import { supabase } from "./supabaseClient";

export const transaccionesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("transacciones")
      .select("*, transaccion_items(*)")
      .order("fecha", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Crea la cabecera + sus líneas de detalle en una sola operación atómica
  // (función crear_transaccion en Supabase, ver schema.sql)
  async create({ transaccion, items }) {
    const { data, error } = await supabase.rpc("crear_transaccion", {
      p_transaccion: transaccion,
      p_items: items || [],
    });
    if (error) throw error;
    return data;
  },

  // Actualiza la cabecera y reemplaza sus líneas de detalle en una sola
  // operación atómica (función actualizar_transaccion en Supabase)
  async update(id, { transaccion, items }) {
    const { data, error } = await supabase.rpc("actualizar_transaccion", {
      p_id: id,
      p_transaccion: transaccion,
      p_items: items || [],
    });
    if (error) throw error;
    return data;
  },

  async delete(id) {
    // Los items se eliminan solos por ON DELETE CASCADE
    const { error } = await supabase
      .from("transacciones")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

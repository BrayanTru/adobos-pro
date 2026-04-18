import { supabase } from "./supabaseClient";

export const clientesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nombre");
    if (error) throw error;
    return data;
  },
  async create(cliente) {
    const { data, error } = await supabase
      .from("clientes")
      .insert([cliente])
      .select();
    if (error) throw error;
    return data[0];
  },
  async update(id, updates) {
    const { data, error } = await supabase
      .from("clientes")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },
  async delete(id) {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) throw error;
  },
  getMapsUrl(cliente) {
    const q = encodeURIComponent(
      `${cliente.direccion}, ${cliente.municipio}, ${cliente.departamento}, Colombia`,
    );
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  },
};

export const recordatoriosService = {
  async getAll() {
    const { data, error } = await supabase.from("recordatorios").select("*");
    if (error) throw error;
    return data;
  },
  async upsert(recordatorio) {
    const { data, error } = await supabase
      .from("recordatorios")
      .upsert([recordatorio], { onConflict: "cliente_id" })
      .select();
    if (error) throw error;
    return data[0];
  },
  async delete(clienteId) {
    const { error } = await supabase
      .from("recordatorios")
      .delete()
      .eq("cliente_id", clienteId);
    if (error) throw error;
  },
};

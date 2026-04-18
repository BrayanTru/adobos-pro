import { supabase } from "./supabaseClient";
import { itemsService } from "./itemsService";

export const transaccionesService = {
  async getAll() {
    const { data, error } = await supabase
      .from("transacciones")
      .select("*, transaccion_items(*)")
      .order("fecha", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Crea la transacción cabecera + todas sus líneas de detalle
  async create({ transaccion, items }) {
    // 1. Insertar cabecera
    const { data: txData, error: txError } = await supabase
      .from("transacciones")
      .insert([transaccion])
      .select();
    if (txError) throw txError;
    const tx = txData[0];

    // 2. Insertar items si es ingreso
    if (items && items.length > 0) {
      const rows = items.map((item) => ({
        transaccion_id: tx.id,
        tamano: item.tamano,
        gramos: item.gramos,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      }));
      const itemsCreados = await itemsService.createMany(rows);
      tx.transaccion_items = itemsCreados;
    } else {
      tx.transaccion_items = [];
    }

    return tx;
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

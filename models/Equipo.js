import mongoose from 'mongoose';

const MantenimientoPreventivoSchema = new mongoose.Schema({
  fase: String,
  descripcion: String
});

const FallaCatalogoSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  solucion: String,
  observaciones: String
});

const RegistroTrabajoSchema = new mongoose.Schema({
  fechaHora: { type: Date, default: Date.now },
  fallasReportadas: [String],
  solucionAplicada: String,
  estadoFinal: { type: String, enum: ['Operativo', 'Con Falla'] },
  tecnicoId: { type: String, default: null },
  tecnicoNombre: { type: String, default: 'Administrador / General' }
});

const EquipoSchema = new mongoose.Schema({
  codigoEquipo: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['Surtidor', 'Dispensador', 'GLP / Solgas'], required: true },
  marca: { type: String, required: true }, // Aquí guardaremos Realtech, Wayne, Tokheim, Solgas, Eaglestar, etc.
  modelo: String,
  anio: Number,
  imagenUrl: String,
  mantenimientosPreventivos: [MantenimientoPreventivoSchema],
  catalogosFallas: [FallaCatalogoSchema],
  historialTrabajos: [RegistroTrabajoSchema]
});

const TecnicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const Tecnico = mongoose.model('Tecnico', TecnicoSchema);
export default mongoose.model('Equipo', EquipoSchema);

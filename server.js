import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Equipo, { Tecnico } from './models/Equipo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// En tu server.js, ajusta los límites de express así:
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// ==========================================
// AUTENTICACIÓN (Admin .env / Técnico MongoDB)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ 
      success: true, 
      role: 'admin', 
      id: 'admin',
      name: 'Administrador',
      message: 'Bienvenido Administrador' 
    });
  }
  
  try {
    const tecnico = await Tecnico.findOne({ email, password });
    if (tecnico) {
      return res.json({ 
        success: true, 
        role: 'tecnico', 
        id: tecnico._id.toString(),
        name: tecnico.nombre,
        message: `Bienvenido Técnico ${tecnico.nombre}` 
      });
    }
  } catch (err) {
    console.error('Error en autenticación de técnico:', err);
  }

  res.status(401).json({ success: false, error: 'Correo o contraseña incorrectos' });
});

// ==========================================
// CRUD DE TÉCNICOS
// ==========================================
app.get('/api/tecnicos', async (req, res) => {
  try {
    const tecnicos = await Tecnico.find();
    res.json(tecnicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tecnicos', async (req, res) => {
  try {
    const nuevoTecnico = new Tecnico(req.body);
    await nuevoTecnico.save();
    res.status(201).json(nuevoTecnico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tecnicos/:id', async (req, res) => {
  try {
    const actualizado = await Tecnico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Técnico no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tecnicos/:id', async (req, res) => {
  try {
    const eliminado = await Tecnico.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Técnico no encontrado' });
    res.json({ success: true, message: 'Técnico eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// EQUIPOS Y MANTENIMIENTO
// ==========================================
app.get('/api/equipos', async (req, res) => {
  try {
    const equipos = await Equipo.find();
    res.json(equipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/equipos', async (req, res) => {
  try {
    const nuevoEquipo = new Equipo(req.body);
    await nuevoEquipo.save();
    res.status(201).json(nuevoEquipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ==========================================
// EDICIÓN Y ELIMINACIÓN DE FALLAS (Catálogo)
// ==========================================
app.put('/api/equipos/:eqId/fallas/:fallaId', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.eqId);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    const falla = equipo.catalogosFallas.id(req.params.fallaId);
    if (!falla) return res.status(404).json({ error: 'Falla no encontrada' });

    Object.assign(falla, req.body);
    await equipo.save();
    res.json(equipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/equipos/:eqId/fallas/:fallaId', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.eqId);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });

    equipo.catalogosFallas.pull({ _id: req.params.fallaId });
    await equipo.save();
    res.json({ success: true, message: 'Falla eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta PUT para actualizar la información y la foto de los equipos
app.put('/api/equipos/:id', async (req, res) => {
  try {
    const equipoActualizado = await Equipo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipoActualizado) return res.status(404).json({ error: 'Equipo no encontrado' });
    res.json(equipoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/equipos/:id/fallas', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    equipo.catalogosFallas.push(req.body);
    await equipo.save();
    res.json(equipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/equipos/:id/mantenimiento', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id);
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' });
    equipo.historialTrabajos.push(req.body);
    await equipo.save();
    res.json(equipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor COQUIVACOA C.A. en ejecución en el puerto ${PORT}`));

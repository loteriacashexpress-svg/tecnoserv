import 'dotenv/config';
import mongoose from 'mongoose';

// 1. Definir el Esquema de la Estación de Servicio (EDS)
const edsSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  municipio: { type: String, required: true },
  direccion: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  activa: { type: Boolean, default: true },
  tipo: { type: String, default: "Gasolina / Diesel" }
});

const Eds = mongoose.model('Eds', edsSchema);

// 2. Data de ejemplo real basada en el Estado Táchira
const tachiraEdsData = [
  {
    nombre: "E/S Paramillo",
    municipio: "San Cristóbal",
    direccion: "Av. 1, Paramillo, San Cristóbal",
    lat: 7.785000,
    lng: -72.220000,
    activa: true,
    tipo: "Nacional / Internacional"
  },
  {
    nombre: "E/S La Concordia",
    municipio: "San Cristóbal",
    direccion: "La Concordia, San Cristóbal",
    lat: 7.741200,
    lng: -72.221500,
    activa: true,
    tipo: "Nacional"
  },
  {
    nombre: "E/S Las Lomas",
    municipio: "San Cristóbal",
    direccion: "Sector Las Lomas, San Cristóbal",
    lat: 7.760000,
    lng: -72.235000,
    activa: true,
    tipo: "Internacional"
  },
  {
    nombre: "E/S El Terminal",
    municipio: "San Cristóbal",
    direccion: "Cerca del Terminal de Pasajeros, San Cristóbal",
    lat: 7.750500,
    lng: -72.210000,
    activa: true,
    tipo: "Nacional"
  },
  {
    nombre: "E/S Táriba",
    municipio: "Cárdenas",
    direccion: "Táriba, Municipio Cárdenas",
    lat: 7.812000,
    lng: -72.228000,
    activa: true,
    tipo: "Nacional"
  },
  {
    nombre: "E/S Unión Los Capachos",
    municipio: "Libertad",
    direccion: "Capacho Nuevo / Libertad",
    lat: 7.832500,
    lng: -72.274000,
    activa: true,
    tipo: "Nacional"
  }
];

// 3. Función para conectar a MongoDB Atlas e insertar los datos
async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error("❌ Error: No se encontró la variable MONGO_URI en el archivo .env");
      process.exit(1);
    }

    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("¡Conectado exitosamente a MongoDB Atlas!");

    console.log("Limpiando registros anteriores en la colección 'eds'...");
    await Eds.deleteMany({});

    console.log("Insertando estaciones de servicio del Táchira...");
    await Eds.insertMany(tachiraEdsData);

    console.log(`¡Base de datos poblada con éxito! Se agregaron ${tachiraEdsData.length} estaciones.`);
    
    await mongoose.connection.close();
    console.log("Conexión cerrada.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error durante el proceso de seeding:", error);
    process.exit(1);
  }
}

seedDatabase();

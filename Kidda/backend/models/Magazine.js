import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfA3: { type: String, required: true },  // Archivo PDF en formato A3
  pdfA4: { type: String, required: true },  // Archivo PDF en formato A4
  cover: { type: String, required: true },  // Portada
  password: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('Magazine', magazineSchema);
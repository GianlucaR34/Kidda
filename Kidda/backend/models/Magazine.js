import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  cover: { type: String, required: true }, // Nuevo campo para la portada
  password: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('Magazine', magazineSchema);
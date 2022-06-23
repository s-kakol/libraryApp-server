import mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  total: { type: Number, required: true },
  available: { type: Number, required: true },
});

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  total: number;
  available: number;
}

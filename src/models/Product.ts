import { Schema, model, Document, Types } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  amount: number;
  idCategory: string;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  idCategory: { type: String, required: true, ref: 'Category'}
});


const ProductModel = model<Product>('Product', productSchema);

export default ProductModel;

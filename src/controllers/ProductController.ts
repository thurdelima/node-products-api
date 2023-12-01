
import express, { Request, Response } from 'express';
import ProductModel, { Product } from '../models/Product';
import mongoose from 'mongoose';
import CategoryModel from '../models/Category';


interface Parcel  {
  fullAmount: number,
  parcelAmount: number,
  feePercent: number,
  valueByParcel: number,
  maskValueByParcel: string
}


class ProductController {

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, amount, idCategory } = req.body;

      if (!name || !description || !amount || !idCategory) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
      let validIdCategory = idCategory;

      if (!mongoose.Types.ObjectId.isValid(validIdCategory)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      validIdCategory.trim();


      const existCategory = await CategoryModel.findById(idCategory);

      if (!existCategory) {
        res.status(404).json({ error: 'Category does not exist' });
        return;
      }


      const newProduct: Product = await ProductModel.create({
        name,
        description,
        amount,
        idCategory,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  async getAllProduct(req: Request, res: Response): Promise<void> {

    try {
      const products: Product[] = await ProductModel.find();

      res.status(201).json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }

  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id.trim();

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await ProductModel.findById(productId);

      if (!product) {
        res.status(404).json({ error: 'product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {

    try {
      
      const productId = req.params.id.trim();
      const { name, description, amount, idCategory } = req.body;

      if (!name || !description || !amount || !idCategory) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      let validIdCategory = idCategory;
      
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }
      
      if (!mongoose.Types.ObjectId.isValid(validIdCategory)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      validIdCategory.trim();

      const existCategory = await CategoryModel.findById(validIdCategory);

      if (!existCategory) {
        res.status(404).json({ error: 'Category does not exist' });
        return;
      }

      const updatedProduct: Product | null = await ProductModel.findByIdAndUpdate(
        productId,
        { name, description, amount, idCategory },
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json(updatedProduct);

    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });

    }


  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id.trim();

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ error: 'Invalid Product ID' });
        return;
      }

      const deletedProduct = await ProductModel.findByIdAndDelete(productId);

      if (!deletedProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json({ removed: true, id: productId });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  async calculateParcel(req: Request, res: Response): Promise<void> {

    try {

      const { name, description, amount, idCategory, _id, parcelAmount, feesPercent } = req.body;

      if (!name || !description || !amount || !idCategory || !_id || !parcelAmount || !feesPercent) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      let validIdCategory = idCategory;
      let validIdProduct = _id;

      validIdProduct.trim();
      validIdCategory.trim();

      if (!mongoose.Types.ObjectId.isValid(validIdCategory)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(validIdProduct)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const parsePercentFee = feesPercent / 100;
      const parcelWithFee = amount * parsePercentFee / (1 - Math.pow(1 + parsePercentFee, - parcelAmount));

      const parseFeeParcel = new Intl.NumberFormat('id').format(parcelWithFee);

      const calculatedParcel: Parcel = {
        fullAmount: amount,
        feePercent: parsePercentFee,
        parcelAmount: parcelAmount,
        valueByParcel: parcelWithFee,
        maskValueByParcel: parseFeeParcel
      }

      res.status(200).json(calculatedParcel);

    } catch (error) {
      console.error('Error calculate parcel:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }

  }



}

const productController = new ProductController();

export default productController;

import express, { Request, Response } from 'express';
import ProductModel, {Product} from '../models/Product';
import mongoose from 'mongoose';
import CategoryModel from '../models/Category';


class ProductController {

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, amount, idCategory } = req.body;

      let validIdCategory = idCategory;
      validIdCategory.trim();

      if (!name || !description || !amount || !idCategory) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(validIdCategory)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

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
      res.status(500).json({ error: 'Internal Server Error' });
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





}

const productController = new ProductController();

export default productController;
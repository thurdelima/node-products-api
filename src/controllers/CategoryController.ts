import express, { Request, Response } from 'express';
import CategoryModel from '../models/Category';
import mongoose from 'mongoose';



class CategoryController {

  async createCategory(req: Request, res: Response): Promise<void> {

    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const newCategory = await CategoryModel.create({ name });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }


  }


  async getAllCategory(req: Request, res: Response): Promise<void> {

    try {
      const categories = await CategoryModel.find();
      

      res.status(201).json(categories);
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }

  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id.trim();

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      const category = await CategoryModel.findById(categoryId);
      console.log(category)

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(200).json(category);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id.trim();
      const { name } = req.body;

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );

      if (!updatedCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id.trim();

     
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
         res.status(400).json({ error: 'Invalid category ID' });
         return;
      }

      const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

      if (!deletedCategory) {
         res.status(404).json({ error: 'Category not found' });
         return;
      }

      res.status(204).send(); 
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    }
  }

  

}

const categoryController = new CategoryController();

export default categoryController;
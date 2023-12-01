import { Request, Response } from 'express';
import mongoose from 'mongoose';

import ProductController from '../../../src/controllers/ProductController';
import ProductModel from '../../../src/models/Product';
import CategoryModel from '../../../src/models/Category';


jest.mock('../../../src/models/Product', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/models/Category', () => ({
  findById: jest.fn(),
}));

describe('ProductController test suite', () => {

  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { body: {} } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setupSuccessfulCreate = (productId: string) => {
    (ProductModel.create as jest.Mock).mockResolvedValue({
      _id: productId,
      name: 'Test Product',
    });
  };

  const setupFailedCreate = (error: Error) => {
    (ProductModel.create as jest.Mock).mockRejectedValue(error);
  };

  const setupExistingCategory = () => {
    (CategoryModel.findById as jest.Mock).mockResolvedValue({
      _id: '123456789012345678901234',
      name: 'Existing Category',
    });
  };

  describe('POST requests', () => {

    it('should create a product successfully', async () => {
      const productId = new mongoose.Types.ObjectId().toString();

      setupSuccessfulCreate(productId);
      setupExistingCategory();

      req.body = {
        name: 'Test Product',
        description: 'Product description',
        amount: 100,
        idCategory: '123456789012345678901234',
      };

      await ProductController.createProduct(req, res);

      expect((ProductModel.create as jest.Mock)).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Product description',
        amount: 100,
        idCategory: '123456789012345678901234',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: productId, name: 'Test Product' });
    });


    it('should handle missing fields', async () => {
      req.body = {};
  
      await ProductController.createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('should handle invalid category ID', async () => {
      setupExistingCategory();
  
      req.body = {
        name: 'Test Product',
        description: 'Product description',
        amount: 100,
        idCategory: 'invalid-id',
      };
  
      await ProductController.createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should handle non-existing category', async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);
  
      req.body = {
        name: 'Test Product',
        description: 'Product description',
        amount: 100,
        idCategory: '123456789012345678901234',
      };
  
      await ProductController.createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category does not exist' });
    });

    it('should handle internal server error', async () => {
      setupFailedCreate(new Error('Test error'));
      setupExistingCategory();
  
      req.body = {
        name: 'Test Product',
        description: 'Product description',
        amount: 100,
        idCategory: '123456789012345678901234',
      };
  
      await ProductController.createProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    });
  

  })

})
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import ProductController from '../../../src/controllers/ProductController';
import ProductModel from '../../../src/models/Product';
import CategoryModel from '../../../src/models/Category';


jest.mock('../../../src/models/Product', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock('../../../src/models/Category', () => ({
  findById: jest.fn(),
}));

interface Product {
  _id: string,
  name: string,
  amount: number,
  idCategory: string
}


describe('ProductController test suite', () => {

  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { params: { id: '123456789012345678901222' }, body: {} } as unknown as Request;
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

  const setupSuccessfulGetById = (product: Product) => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(product);
  };

  const setupFailedGetById = (error: Error) => {
    (ProductModel.findById as jest.Mock).mockRejectedValue(error);
  };

  const setupSuccessfulGetAll = (products: Product[]) => {
    (ProductModel.find as jest.Mock).mockResolvedValue(products);
  };

  const setupFailedGetAll = (error: Error) => {
    (ProductModel.find as jest.Mock).mockRejectedValue(error);
  };

  const setupSuccessfulUpdate = (product: any) => {
    (ProductModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(product);
  };

  const setupFailedUpdate = (error: Error) => {
    (ProductModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);
  };

  const setupSuccessfulDelete = (product: any) => {
    (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(product);
  };

  const setupFailedDelete = (error: Error) => {
    (ProductModel.findByIdAndDelete as jest.Mock).mockRejectedValue(error);
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

  describe('GET requests', () => {


    it('should get all products successfully', async () => {
      const mockProducts: Product[] = [
        { _id: '123456789012345678901222', name: 'Product 1', amount: 20, idCategory: '123456789012345678901234' },
        { _id: '123456789012345678901223', name: 'Product 2', amount: 23, idCategory: '123456789012345678901238' },
      ];

      setupSuccessfulGetAll(mockProducts);

      await ProductController.getAllProduct(req, res);

      expect((ProductModel.find as jest.Mock)).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should get a product by ID successfully', async () => {
      const mockProduct: Product = { _id: '123456789012345678901222', name: 'Test Product', amount: 20, idCategory: '123456789012345678901234' };

      setupSuccessfulGetById(mockProduct);

      await ProductController.getProductById(req, res);

      expect((ProductModel.findById as jest.Mock)).toHaveBeenCalledWith('123456789012345678901222');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle internal server error', async () => {
      setupFailedGetAll(new Error('Test error'));

      await ProductController.getAllProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

    it('should handle invalid product ID', async () => {
      req.params.id = 'invalid-id';

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid product ID' });
    });

    it('should handle product not found', async () => {
      setupFailedGetById(new Error('Product not found'));
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'product not found' });
    });

    it('should handle internal server error', async () => {
      setupFailedGetById(new Error('Test error'));

      await ProductController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

  })

  describe('PUT requests', () => {

    it('should update a product successfully', async () => {
      const mockProduct: Product = { _id: '123456789012345678901222', amount: 40, name: 'Updated Product', idCategory: '123456789012345678901233' };

      setupSuccessfulUpdate(mockProduct);
      setupExistingCategory();

      req.body = {
        name: 'Updated Product',
        description: 'Updated Product description',
        amount: 200,
        idCategory: '123456789012345678901234',
      };

      await ProductController.updateProduct(req, res);

      expect((ProductModel.findByIdAndUpdate as jest.Mock)).toHaveBeenCalledWith(
        '123456789012345678901222',
        {
          name: 'Updated Product',
          description: 'Updated Product description',
          amount: 200,
          idCategory: '123456789012345678901234',
        },
        { new: true }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle Invalid product ID', async () => {
      const invalidProducId = 'invalid-id';

      req.params.id = invalidProducId;

      req.body = {
        name: 'Updated Product',
        amount: 40,
        description: 'Updated Product description',
        idCategory: '123456789012345678908888'
      };

      setupFailedUpdate(new Error('Invalid product ID'));

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid product ID' });

    });

    it('should handle Invalid category ID', async () => {

      req.body = {
        name: 'Updated Product',
        amount: 40,
        description: 'Updated Product description',
        idCategory: 'invalid-id'
      };

      setupFailedUpdate(new Error('Invalid category ID'));

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });

    });

    it('should handle category does not exist', async () => {

      req.body = {
        _id: '123456789012345678901222',
        amount: 40,
        name: 'Updated Product',
        description: 'Updated Product description',
        idCategory: '123456789012345678908888'
      };

      setupFailedUpdate(new Error('Category does not exist'));
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category does not exist' });

    });

    it('should handle All fields are required', async () => {

      req.body = {};

      setupFailedUpdate(new Error('All fields are required'));

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });

    });

    it('should handle internal server error', async () => {
      setupFailedUpdate(new Error('Test error'));
      setupExistingCategory();

      req.body = {
        name: 'Updated Product',
        description: 'Updated Product description',
        amount: 200,
        idCategory: '123456789012345678901234',
      };

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });


  })

  describe('DELETE requests', () => {

    it('should delete a product successfully', async () => {
      const mockProduct = { _id: '123456789012345678901222', name: 'Deleted Product' };
  
      setupSuccessfulDelete(mockProduct);
  
      await ProductController.deleteProduct(req, res);
  
      expect((ProductModel.findByIdAndDelete as jest.Mock)).toHaveBeenCalledWith('123456789012345678901222');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ removed: true, id: '123456789012345678901222' });
    });

    it('should handle invalid product ID', async () => {
      req.params.id = 'invalid-id';
  
      await ProductController.deleteProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Product ID' });
    });

    it('should handle product not found', async () => {
      setupFailedDelete(new Error('Product not found'));
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
  
      await ProductController.deleteProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle internal server error', async () => {
      setupFailedDelete(new Error('Test error'));
  
      await ProductController.deleteProduct(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

  })

})
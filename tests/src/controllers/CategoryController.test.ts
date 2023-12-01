import { Request, Response } from 'express';
import CategoryController from '../../../src/controllers/CategoryController';
import CategoryModel from '../../../src/models/Category';
import mongoose from 'mongoose';

jest.mock('../../../src/models/Category', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()

}));

interface Category {
  _id: string,
  name: string
}


describe('CategoryController test suite', () => {
  let req: Request;
  let res: Response;

  const mockCategory: Category = {
    _id: '123456789012345678901234',
    name: 'Test Category'
  }

  beforeEach(() => {
    req = { params: { id: '123456789012345678901222' } } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setupSuccessfulUpdate = (categoryId: string, updateData: { name: string }) => {
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: categoryId,
      name: updateData.name,
    });
  };

  const setupFailedUpdate = (error: Error) => {
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);
  };

  const setupSuccessfulDelete = (categoryId: string) => {
    (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: categoryId,
      name: 'Deleted Category',
    });
  };

  const setupFailedDelete = (error: Error) => {
    (CategoryModel.findByIdAndDelete as jest.Mock).mockRejectedValue(error);
  };

  describe('POST requests', () => {

    it('should create a new category and respond with 201 status', async () => {

      const categoryName = 'Test Category';
      req.body = mockCategory;
      const expectedCategory: Category = mockCategory;

      (CategoryModel.create as jest.Mock).mockResolvedValueOnce(expectedCategory);

      await CategoryController.createCategory(req, res);
      expect(CategoryModel.create).toHaveBeenCalledWith({ name: categoryName });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedCategory);
      expect(expectedCategory._id).toHaveLength(24);

    });

    it('should respond with 400 status when name is not provided', async () => {
      req.body = {};

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
    });


    it('should respond with 500 status on server error', async () => {

      req.body = mockCategory;

      (CategoryModel.create as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });



  })


  describe('GET requests', () => {

    it('should get all categories and respond with 201 status', async () => {
      const expectedCategories: Category[] = [
        { _id: '123456789012345678901222', name: 'Category1' },
        { _id: '123456789012345678901255', name: 'Category2' },
      ];

      (CategoryModel.find as jest.Mock).mockResolvedValueOnce(expectedCategories);

      await CategoryController.getAllCategory(req, res);

      expect(CategoryModel.find).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedCategories);
    });

    it('should get category by ID and respond with 200 status', async () => {
      const expectedCategory: Category = { _id: '123456789012345678901222', name: 'TestCategory' };

      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce(expectedCategory);

      await CategoryController.getCategoryById(req, res);

      expect(CategoryModel.findById).toHaveBeenCalledWith(expectedCategory._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedCategory);
    });

    it('should respond with 400 status on invalid category ID', async () => {
      req.params.id = 'invalidCategoryId';

      await CategoryController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should respond with 404 status when category is not found', async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce(null);

      await CategoryController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should respond with 500 status on server error', async () => {
      (CategoryModel.findById as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      await CategoryController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

    it('should respond with 500 status on server error', async () => {
      (CategoryModel.find as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      await CategoryController.getAllCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

  })

  describe('PUT requests', () => {

    it('should update a category successfully', async () => {
      const categoryId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Category' };

      setupSuccessfulUpdate(categoryId, updateData);

      req.params.id = categoryId;
      req.body = updateData;

      await CategoryController.updateCategory(req, res);

      expect((CategoryModel.findByIdAndUpdate as jest.Mock)).toHaveBeenCalledWith(
        categoryId,
        { name: updateData.name },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: categoryId, name: updateData.name });
    });

    it('should handle invalid category ID', async () => {
      const invalidCategoryId = 'invalid-id';

      req.params.id = invalidCategoryId;
      req.body = { name: 'Updated Category' };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should handle missing name field', async () => {
      const categoryId = new mongoose.Types.ObjectId().toString();

      req.params.id = categoryId;
      req.body = {};

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
    });

    it('should handle category not found', async () => {
      const nonExistingCategoryId = new mongoose.Types.ObjectId().toString();

      setupFailedUpdate(new Error('Category not found'));
      (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      req.params.id = nonExistingCategoryId;
      req.body = { name: 'Updated Category' };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should handle internal server error', async () => {
      const categoryId = new mongoose.Types.ObjectId().toString();

      setupFailedUpdate(new Error('Test error'));

      req.params.id = categoryId;
      req.body = { name: 'Updated Category' };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Oops! An error occurred on our server. Please try again or contact support.' });
    });

  })

  describe('DELETE requests', () => {

    it('should delete a category successfully', async () => {
      const categoryId = new mongoose.Types.ObjectId().toString();

      setupSuccessfulDelete(categoryId);

      req.params.id = categoryId;

      await CategoryController.deleteCategory(req, res);

      expect((CategoryModel.findByIdAndDelete as jest.Mock)).toHaveBeenCalledWith(categoryId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ removed: true, id: categoryId });
    });

    it('should handle invalid category ID', async () => {
      const invalidCategoryId = 'invalid-id';

      req.params.id = invalidCategoryId;

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should handle category not found', async () => {
      const nonExistingCategoryId = new mongoose.Types.ObjectId().toString();

      setupFailedDelete(new Error('Category not found'));
      (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      req.params.id = nonExistingCategoryId;

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should handle internal server error', async () => {
      const categoryId = new mongoose.Types.ObjectId().toString();

      setupFailedDelete(new Error('Test error'));

      req.params.id = categoryId;

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Oops! An error occurred on our server. Please try again or contact support.',
      });
    });

  })


})
import { Request, Response } from 'express';
import CategoryController from '../../../src/controllers/CategoryController';
import CategoryModel from '../../../src/models/Category';

jest.mock('../../../src/models/Category', () => ({
  create: jest.fn(),
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
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

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


})
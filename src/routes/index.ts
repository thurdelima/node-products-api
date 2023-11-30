import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import ProductController from '../controllers/ProductController';

const router = Router();

router.post('/categories', CategoryController.createCategory);
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [category1, category2]
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.get('/categories', CategoryController.getAllCategory);
router.get('/categories/:id', CategoryController.getCategoryById);
router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);


router.post('/products', ProductController.createProduct);
router.get('/products', ProductController.getAllProduct);
router.get('/products/:id', ProductController.getProductById);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
router.post('/products/parcel', ProductController.calculateParcel);

export default router;
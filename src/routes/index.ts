import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import ProductController from '../controllers/ProductController';

const router = Router();

router.post('/categories', CategoryController.createCategory);
router.get('/categories', CategoryController.getAllCategory);
router.get('/categories/:id', CategoryController.getCategoryById);
router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);


router.post('/products', ProductController.createProduct);
router.get('/products', ProductController.getAllProduct);
router.get('/products/:id', ProductController.getProductById);


export default router;
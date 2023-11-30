import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import ProductController from '../controllers/ProductController';

const router = Router();


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: CategoryName
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: categoryId
 *               name: CategoryName
 *       400:
 *         description: Bad Request - Name is required
 *         content:
 *           application/json:
 *             example:
 *               error: Name is required
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
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


/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Retrieve a category by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *         example: categoryId
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               _id: categoryId
 *               name: CategoryName
 *       400:
 *         description: Bad Request - Invalid category ID
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid category ID
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               error: Category not found
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.get('/categories/:id', CategoryController.getCategoryById);


/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     description: Update the properties of a category using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to update
 *         schema:
 *           type: string
 *         example: categoryId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: UpdatedCategoryName
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: categoryId
 *               name: UpdatedCategoryName
 *       400:
 *         description: Bad Request - Invalid category ID or input data
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid category ID or input data
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               error: Category not found
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.put('/categories/:id', CategoryController.updateCategory);


/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     description: Delete a category using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: string
 *         example: categoryId
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Bad Request - Invalid category ID
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid category ID
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               error: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.delete('/categories/:id', CategoryController.deleteCategory);


router.post('/products', ProductController.createProduct);
router.get('/products', ProductController.getAllProduct);
router.get('/products/:id', ProductController.getProductById);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
router.post('/products/parcel', ProductController.calculateParcel);

export default router;
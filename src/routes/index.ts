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
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.delete('/categories/:id', CategoryController.deleteCategory);


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               idCategory:
 *                 type: string
 *             example:
 *               name: ProductName
 *               description: ProductDescription
 *               amount: 19
 *               idCategory: categoryId
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: productId
 *               name: ProductName
 *               description: ProductDescription
 *               amount: 19
 *               idCategory: categoryId
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid input data
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.post('/products', ProductController.createProduct);


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [product1, product2]
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.get('/products', ProductController.getAllProduct);


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a product by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *         example: productId
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               _id: productId
 *               name: ProductName
 *               description: ProductDescription
 *               amount: 19
 *               idCategory: categoryId
 *       400:
 *         description: Bad Request - Invalid product ID
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid product ID
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: Product not found
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.get('/products/:id', ProductController.getProductById);


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Update the properties of a product using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *         example: productId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               idCategory:
 *                 type: string
 *             example:
 *               name: UpdatedProductName
 *               description: UpdatedProductDescription
 *               amount: 29
 *               idCategory: updatedCategoryId
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: productId
 *               name: UpdatedProductName
 *               description: UpdatedProductDescription
 *               amount: 29
 *               idCategory: updatedCategoryId
 *       400:
 *         description: Bad Request - Invalid product ID or input data
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid product ID or input data
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: Product not found
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.put('/products/:id', ProductController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Delete a product using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *         example: productId
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       400:
 *         description: Bad Request - Invalid product ID
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid product ID
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: Product not found
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.delete('/products/:id', ProductController.deleteProduct);


/**
 * @swagger
 * /calculate-parcel:
 *   post:
 *     summary: Calculate parcel details
 *     description: Calculate details for a parcel based on input data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               idCategory:
 *                 type: string
 *               _id:
 *                 type: string
 *               parcelAmount:
 *                 type: number
 *               feesPercent:
 *                 type: number
 *             example:
 *               name: ProductName
 *               description: ProductDescription
 *               amount: 1000
 *               idCategory: categoryId
 *               _id: productId
 *               parcelAmount: 12
 *               feesPercent: 5
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               fullAmount: 1000
 *               feePercent: 0.05
 *               parcelAmount: 12
 *               valueByParcel: 93.80
 *               maskValueByParcel: "93.80"
 *       400:
 *         description: Bad Request - Missing required fields or invalid IDs
 *         content:
 *           application/json:
 *             example:
 *               error: All fields are required or Invalid category ID or Invalid product ID
 *       500:
 *         description: Oops! An error occurred on our server. Please try again or contact support.
 *         content:
 *           application/json:
 *             example:
 *               error: Oops! An error occurred on our server. Please try again or contact support.
 */
router.post('/products/parcel', ProductController.calculateParcel);

export default router;
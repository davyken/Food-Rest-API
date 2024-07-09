import express from 'express';
import recipesRouter from './recipes.js';
import categoriesRouter from './categories.js';
import ingredientsRouter from './ingredients.js';
import usersRouter from './users.js';

const router = express.Router();

router.use('/recipes', recipesRouter);
router.use('/categories', categoriesRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/users', usersRouter);

export default router;

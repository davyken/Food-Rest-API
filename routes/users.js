import express from 'express';
import recipesRouter from './recipes.js';
import ingredientsRouter from './ingredients.js';

const router = express.Router();

router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientsRouter);

export default router;

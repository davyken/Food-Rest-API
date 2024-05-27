import express from "express";
import pool from "../../db.config/index.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const router = express.Router();

// Helper function to handle async routes
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// const router = express.Router();
const swaggerDocument = YAML.load('./swagger.yaml');

// Mount Swagger UI middleware
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// GET /recipes
router.get("/recipes", asyncHandler(async (req, res) => {
  router.get("/recipes", asyncHandler(async (req, res) => {
    const { rows: recipes } = await pool.query("SELECT * FROM recipes");
    res.status(200).json(recipes);
  }));}));

// POST /recipes
router.post("/recipes", asyncHandler(async (req, res) => {
  router.post("/recipes", asyncHandler(async (req, res) => {
    const { title, instructions, image_url, category_id, ingredients } = req.body;
  
    const recipe = await pool.query(
      `INSERT INTO recipes (title, instructions, image_url, category_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING recipe_id`,
      [title, instructions, image_url, category_id]
    );
  
    const ingredientIds = await pool.query(
      `SELECT ingredient_id FROM ingredients WHERE name = ANY($1)`,
      [ingredients]
    );
  
    for (const ingredientId of ingredientIds.rows) {
      await pool.query(
        `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) 
         VALUES ($1, $2)`,
        [recipe.rows[0].recipe_id, ingredientId.ingredient_id]
      );
    }
  
    res.status(201).json(recipe.rows[0]);
  }));}));

// GET /recipes/:id
router.get("/recipes/:id", asyncHandler(async (req, res) => {
  router.get("/recipes/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const recipes = await pool.query(
      "SELECT * FROM recipes WHERE recipe_id = $1",
      [id]
    );
  
    if (recipes.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
  
    const ingredients = await pool.query(
      `SELECT i.name 
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
       WHERE ri.recipe_id = $1`,
      [id]
    );
  
    const recipe = {
      ...recipes.rows[0],
      ingredients: ingredients.rows.map((ingredient) => ingredient.name),
    };
  
    res.json(recipe);
  }));}));

// PUT /recipes/:id
router.put("/recipes/:id", asyncHandler(async (req, res) => {
  router.put("/recipes/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, instructions, image_url, category_id, ingredients } = req.body;
  
    if (!title || !instructions || !category_id || !ingredients) {
      return res.status(400).json({
        error: "Title, instructions, category ID, and ingredients are required",
      });
    }
  
    await pool.query(
      `UPDATE recipes SET 
       title = $1, 
       instructions = $2, 
       image_url = $3, 
       category_id = $4, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE recipe_id = $5`,
      [title, instructions, image_url, category_id, id]
    );
  
    await pool.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [id]);
  
    const ingredientValues = ingredients.map((ingredient) => [
      id,
      ingredient.name,
      ingredient.quantity,
    ]);
  
    await pool.query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity) 
       VALUES ${ingredientValues.map(() => "( $1, $2, $3 )").join(", ")}`,
      ingredientValues.flat()
    );
  
    res.json({ message: "Recipe and ingredients updated successfully" });
  }));}));

// DELETE /recipes/:id
router.delete("/recipes/:id", asyncHandler(async (req, res) => {
  router.delete("/recipes/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const result = await pool.query(
      "DELETE FROM recipes WHERE recipe_id = $1",
      [id]
    );
  
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
  
    res.json({ message: "Recipe deleted successfully" });
  }));}));

// GET /recipes/category/:categoryId
router.get("/recipes/category/:categoryId", asyncHandler(async (req, res) => {
  router.get("/recipes/category/:categoryId", asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
  
    const recipes = await pool.query(
      `SELECT * FROM recipes
       WHERE category_id = $1`,
      [categoryId]
    );
  
    if (recipes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No recipes found for the given category" });
    }
  
    res.status(200).json(recipes.rows);
  }));}));

export default router;

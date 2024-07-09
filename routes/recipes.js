import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();

// Fetch all recipes
router.get('/', (req, res, next) => {
  const query = 'SELECT * FROM recipes';
  pool.query(query, (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(result.rows);
  });
});

// Create a new recipe
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const query = 'INSERT INTO recipes (name) VALUES ($1) RETURNING *';
  pool.query(query, [name], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(201).json(result.rows[0]);
  });
});

// Fetch a recipe by ID
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'SELECT * FROM recipes WHERE recipe_id = $1';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const recipe = result.rows[0];
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    return res.json(recipe);
  });
});

// Update a recipe
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE recipes SET name = $1 WHERE recipe_id = $2 RETURNING *';
  pool.query(query, [name, id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const recipe = result.rows[0];
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    return res.json(recipe);
  });
});

// Delete a recipe
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'DELETE FROM recipes WHERE recipe_id = $1 RETURNING *';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const recipe = result.rows[0];
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    return res.json({ message: 'Recipe deleted successfully' });
  });
});

export default router;

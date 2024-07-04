import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();

// Fetch all ingredients
router.get('/', (req, res, next) => {
  const query = 'SELECT * FROM ingredients';
  pool.query(query, (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(result.rows);
  });
});

// Create a new ingredient
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const query = 'INSERT INTO ingredients (name) VALUES ($1) RETURNING *';
  pool.query(query, [name], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(201).json(result.rows[0]);
  });
});

// Fetch an ingredient by ID
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'SELECT * FROM ingredients WHERE ingredient_id = $1';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const ingredient = result.rows[0];
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    return res.json(ingredient);
  });
});

// Update an ingredient
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE ingredients SET name = $1 WHERE ingredient_id = $2 RETURNING *';
  pool.query(query, [name, id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const ingredient = result.rows[0];
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    return res.json(ingredient);
  });
});

// Delete an ingredient
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const ingredient = result.rows[0];
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    return res.json({ message: 'Ingredient deleted successfully' });
  });
});

export default router;

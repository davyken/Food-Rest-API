import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();

// Fetch all ingredients
router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM ingredients';
    const { rows: ingredients } = await pool.query(query);
    return res.status(200).json(ingredients);
  } catch (error) {
    next(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Added return
  }
});

// Create a new ingredient
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const query = 'INSERT INTO ingredients (name) VALUES ($1) RETURNING *';
    const {
      rows: [ingredient],
    } = await pool.query(query, [name]);
    return res.status(201).json(ingredient);
  } catch (error) {
    next(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Added return
  }
});

// Fetch an ingredient by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM ingredients WHERE ingredient_id = $1';
    const {
      rows: [ingredient],
    } = await pool.query(query, [id]);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    return res.json(ingredient);
  } catch (error) {
    next(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Added return
  }
});

// Update an ingredient
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE ingredients SET name = $1 WHERE ingredient_id = $2 RETURNING *';
    const {
      rows: [ingredient],
    } = await pool.query(query, [name, id]);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    return res.json(ingredient);
  } catch (error) {
    next(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Added return
  }
});

// Delete an ingredient
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *';
    const {
      rows: [ingredient],
    } = await pool.query(query, [id]);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    return res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    next(error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Added return
  }
});

export default router;
import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();
// router.get('/', req, res) => {res.send('food recipe api done')}

router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM ingredients';
    // res.send('get end points for recipe app')
    const { rows: ingredients } = await pool.query(query);
    return res.status(200).json(ingredients);
  } catch (error) {
    return next(error);
  }
});

// Create a new ingredient
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const query = 'INSERT INTO ingredients (name) VALUES ($1) RETURNING *';
    const {
      rows: [ingredients],
    } = await pool.query(query, [name]);
    res.send('oyuuu')
    return res.status(201).json(ingredient
    );
  } catch (error) {
    return next(error);
  }
});

// Fetch a ingredient by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM ingredients WHERE ingredient_id = $1';
    const {
      rows: [ingredients
      ],
    } = await pool.query(query, [id]);

    if (!ingredients) {
      return res.status(404).json({ error: 'ingredient not found' });
    }

    return res.json(ingredients);
  } catch (error) {
    return next(error);
  }
});

// Update a ingredients
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const query = `
      UPDATE ingredients SET name = $1 WHERE ingredient_id = $2 RETURNING *
    `;
    const {
      rows: [ingredients],
    } = await pool.query(query, [name, id]);

    if (!ingredients) {
      return res.status(404).json({ error: 'ingredients not found' });
    }

    return res.json(ingredients);
  } catch (error) {
    return next(error);
  }
});

// Delete a ingredients
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM ingredients WHERE ingredient_id = $1 RETURNING *';
    const {
      rows: [ingredients],
    } = await pool.query(query, [id]);

    if (!ingredients) {
      return res.status(404).json({ error: 'ingredients not found' });
    }

    return res.json({ message: 'ingredient deleted successfully' });
  } catch (error) {
    return next(error);
  }
});


export default router;

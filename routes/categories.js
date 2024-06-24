import express from 'express';
import pool from '../database_config/db.js';

const router = express.Router();

// Fetch all categories
router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM categories';
    const { rows: categories } = await pool.query(query);
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
});

// Create a new category
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    const {
      rows: [category],
    } = await pool.query(query, [name]);
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
});

// Fetch a category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM categories WHERE category_id = $1';
    const {
      rows: [category],
    } = await pool.query(query, [id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    return next(error);
  }
});

// Update a category
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const query = `
      UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *
    `;
    const {
      rows: [category],
    } = await pool.query(query, [name, id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    return next(error);
  }
});

// Delete a category
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
    const {
      rows: [category],
    } = await pool.query(query, [id]);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

export default router;

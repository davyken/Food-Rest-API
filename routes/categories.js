import express from 'express';
import pool from '../database_config/db.js';

const router = express.Router();

// Fetch all categories
router.get('/', (req, res, next) => {
  const query = 'SELECT * FROM categories';
  pool.query(query, (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(result.rows);
  });
});

// Create a new category
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
  pool.query(query, [name], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(201).json(result.rows[0]);
  });
});

// Fetch a category by ID
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'SELECT * FROM categories WHERE category_id = $1';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const category = result.rows[0];
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(category);
  });
});

// Update a category
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *';
  pool.query(query, [name, id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const category = result.rows[0];
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(category);
  });
});

// Delete a category
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
  pool.query(query, [id], (error, result) => {
    if (error) {
      next(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const category = result.rows[0];
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ message: 'Category deleted successfully' });
  });
});

export default router;

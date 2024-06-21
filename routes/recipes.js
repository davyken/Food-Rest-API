import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM recipes';
    // res.send('youu')
    const { rows: recipes } = await pool.query(query);
    return res.status(200).json(recipes);
  } catch (error) {
    return next(error);
  }
});

// Create a new ingredient
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const query = 'INSERT INTO recipes (name) VALUES ($1) RETURNING *';
    const {
      rows: [recipes
      ],
    } = await pool.query(query, [name]);
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
    const query = 'SELECT * FROM recipes WHERE recipe_id = $1';
    const {
      rows: [recipes
      ],
    } = await pool.query(query, [id]);

    if (!recipes) {
      return res.status(404).json({ error: 'recipe not found' });
    }

    return res.json(recipes);
  } catch (error) {
    return next(error);
  }
});

// Update a recipes
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const query = `
      UPDATE recipes SET name = $1 WHERE recipe_id = $2 RETURNING *
    `;
    const {
      rows: [recipes],
    } = await pool.query(query, [name, id]);

    if (!recipes) {
      return res.status(404).json({ error: 'recipes not found' });
    }

    return res.json(recipes);
  } catch (error) {
    return next(error);
  }
});

// Delete a recipes
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM recipes WHERE recipe_id = $1 RETURNING *';
    const {
      rows: [recipes],
    } = await pool.query(query, [id]);

    if (!recipes) {
      return res.status(404).json({ error: 'recipes not found' });
    }

    return res.json({ message: 'recipe deleted successfully' });
  } catch (error) {
    return next(error);
  }
});


export default router;

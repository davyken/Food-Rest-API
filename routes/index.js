import express from "express";
import pool from "../database_config/db.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  pool.query("SELECT * FROM ingredients", (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
});

export default router;

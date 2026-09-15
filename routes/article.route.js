const express = require("express");
const router = express.Router();

const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
} = require("../controllers/article.controller");

// NOTE: /search must be defined BEFORE /:id, otherwise "search"
// would be treated as an article id.

router.post("/", createArticle);            // Create
router.get("/", getArticles);               // Read all (with pagination)
router.get("/search", searchArticles);      // BONUS: keyword search
router.get("/:id", getArticleById);         // Read one
router.put("/:id", updateArticle);          // Update
router.delete("/:id", deleteArticle);       // Delete

module.exports = router;

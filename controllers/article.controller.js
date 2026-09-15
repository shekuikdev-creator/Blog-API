const Joi = require("joi");
const Article = require("../models/article.model");

// ---------- Joi schemas ----------
const createSchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  subheading: Joi.string().max(200).allow(""),
  content: Joi.string().min(20).required(),
  author: Joi.string().max(50),
  category: Joi.string().max(50),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  isPublished: Joi.boolean(),
});

// Update: title & content become optional (partial edits allowed)
const updateSchema = createSchema.fork(["title", "content"], (schema) =>
  schema.optional()
);

// ---------- Controllers ----------
const createArticle = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const newArticle = new Article(value);
    const savedArticle = await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      data: savedArticle,
    });
  } catch (err) {
    next(err);
  }
};

const getArticles = async (req, res, next) => {
  try {
    // Pagination: ?page=1&limit=10&sort=latest
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const sortOrder = req.query.sort === "oldest" ? 1 : -1;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find()
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(),
    ]);

    res.status(200).json({
      message: "Articles retrieved successfully",
      count: articles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

const searchArticles = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Please provide a search query (?q=keyword)" });
    }

    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { subheading: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: `Found ${articles.length} article(s) matching "${q}"`,
      count: articles.length,
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: "Article retrieved successfully", data: article });
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ message: "Nothing to update — body is empty" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }

    res.status(200).json({ message: "Article updated successfully", data: updatedArticle });
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};

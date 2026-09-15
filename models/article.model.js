const mongoose = require("mongoose");

// Embedded comment subdocument
const commentSchema = new mongoose.Schema(
  {
    author: { type: String, trim: true, default: "Anonymous", maxlength: 50 },
    content: { type: String, required: true, minlength: 2, maxlength: 500 },
  },
  { timestamps: true }
);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title must not exceed 120 characters"],
    },
    subheading: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [20, "Content must be at least 20 characters"],
    },
    author: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "Guest",
    },
    category: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    readMinutes: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Auto-calculate estimated reading time (avg 200 wpm)
articleSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const words = this.content.trim().split(/\s+/).length;
    this.readMinutes = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);

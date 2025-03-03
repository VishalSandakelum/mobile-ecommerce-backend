const categoryService = require("../services/categoryService");

const categoryController = {
  async addCategories(req, res) {
    try {
      const categories = req.body.categories;
      const createdCategories = await categoryService.addCategories(categories);
      res.status(201).json({
        message: "Categories added successfully",
        categories: createdCategories,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        message: "Categories fetched successfully",
        categories,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getCategoryById(req, res) {
    try {
      const { categoryId } = req.body;
      const category = await categoryService.getCategoryById(categoryId);
      res.status(200).json({
        message: "Category fetched successfully",
        category,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const { categoryId } = req.body;
      const updatedCategory = await categoryService.updateCategory(
        categoryId,
        req.body
      );
      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { categoryId } = req.body;
      const response = await categoryService.deleteCategory(categoryId);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = categoryController;

const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

const categoryService = {
  async addCategories(categories) {
    try {
      if (!Array.isArray(categories)) {
        categories = [categories];
      }

      const createdCategories = await Category.insertMany(categories, {
        ordered: false,
      });

      return createdCategories;
    } catch (error) {
      throw new Error("Error adding categories: " + error.message);
    }
  },

  async getAllCategories() {
    try {
      return await Category.find();
    } catch (error) {
      throw new Error("Error fetching categories: " + error.message);
    }
  },

  async getCategoryById(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Category not found");
      return category;
    } catch (error) {
      throw new Error("Error fetching category: " + error.message);
    }
  },

  async updateCategory(categoryId, updateData) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Category not found");

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        { new: true, runValidators: true }
      );
      if (!updatedCategory) throw new Error("Category not found");
      return updatedCategory;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  },

  async deleteCategory(categoryId) {
    try {
      const prod = await Product.findOneAndDelete({
        category_id: categoryId,
      });
      if (prod != null) {
        throw new Error("This category is already in use");
      }

      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) throw new Error("Category not found");
      return { message: "Category deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting category: " + error.message);
    }
  },
};

module.exports = categoryService;

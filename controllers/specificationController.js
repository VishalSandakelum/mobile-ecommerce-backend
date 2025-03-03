const specificationService = require("../services/specificationService");

const specificationController = {
  async addSpecification(req, res) {
    try {
      const specifications = req.body.specifications;
      const addedSpecifications = await specificationService.addSpecification(
        specifications
      );
      res.status(201).json({
        message: "Specification(s) added successfully",
        specifications: addedSpecifications,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllSpecifications(req, res) {
    try {
      const specifications = await specificationService.getAllSpecifications();
      res.status(200).json({ specifications });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getSpecification(req, res) {
    try {
      const { id } = req.body;
      const specification = await specificationService.getSpecification(id);
      res.status(200).json({ specification });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async updateSpecification(req, res) {
    try {
      const updatedSpecification =
        await specificationService.updateSpecification(req.body);
      res.status(200).json({
        message: "Specification updated successfully",
        specification: updatedSpecification,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteSpecification(req, res) {
    try {
      const { id } = req.body;
      await specificationService.deleteSpecification(id);
      res.status(200).json({ message: "Specification deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = specificationController;

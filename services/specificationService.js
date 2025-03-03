const Specification = require("../models/specificationSchema");
const productSpecification = require("../models/productSpecificationSchema");

const specificationService = {
  async addSpecification(data) {
    try {
      if (Array.isArray(data)) {
        return await Specification.insertMany(data);
      } else {
        const specification = new Specification(data);
        return await specification.save();
      }
    } catch (error) {
      throw new Error("Error while adding specification: " + error.message);
    }
  },

  async getAllSpecifications() {
    try {
      return await Specification.find();
    } catch (error) {
      throw new Error("Error fetching specifications: " + error.message);
    }
  },

  async getSpecification(id) {
    try {
      const specification = await Specification.findById(id);
      if (!specification) {
        throw new Error("Specification not found");
      }
      return specification;
    } catch (error) {
      throw new Error("Error fetching specification: " + error.message);
    }
  },

  async updateSpecification(updateData) {
    try {
      const { specificationId, name } = updateData;

      const specification = await Specification.findById(specificationId);
      if (!specification) {
        throw new Error("Specification not found");
      }

      if (name) specification.name = name;

      await specification.save();
      return specification;
    } catch (error) {
      throw new Error("Error updating specification: " + error.message);
    }
  },

  async deleteSpecification(id) {
    try {
      const productSpec = await productSpecification.findOneAndDelete({
        specification_id: id,
      });
      if (productSpec != null) {
        throw new Error("This specification is already in use");
      }

      const specification = await Specification.findById(id);
      if (!specification) {
        throw new Error("Specification not found");
      }
      await Specification.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting specification: " + error.message);
    }
  },
};

module.exports = specificationService;

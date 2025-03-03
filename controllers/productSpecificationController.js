const productSpecificationService = require("../services/productSpecificationService");

exports.deleteProductSpecification = async (req, res) => {
  try {
    const response =
      await productSpecificationService.deleteProductSpecification(req.body.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const express = require("express");
const QRCode = require("qrcode");
const Certificate = require("../Models/Certificate");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Generate and Save Certificate
router.post(
  "/generate",
  [
    body("elements").not().isEmpty().withMessage("Elements are required"),
    body("background").not().isEmpty().withMessage("Background is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { elements, background } = req.body;

    try {
      const newCertificate = new Certificate({ elements, background });

      await newCertificate.save();

      const qrCodeUrl = await QRCode.toDataURL(
        `${process.env.APP_BASE_URL}/api/certificates/${newCertificate._id}`
      );

      res.json({ success: true, qrCodeUrl, certificateId: newCertificate._id });
    } catch (error) {
      console.error("Error generating certificate:", error); // Log error for debugging
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

// Apply similar validation and error handling improvements to other routes
// ...

module.exports = router;

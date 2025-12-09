const express = require("express");
const Testimonial = require("../models/Testimonial");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//eg tests for view
router.get("/public", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isPublic: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(testimonials);
  } catch (error) {
    console.error("Get public testimonials error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// login mid
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const myTestimonials = await Testimonial.find({ user: req.user.id }).sort({
      createdAt: -1
    });
    res.json(myTestimonials);
  } catch (error) {
    console.error("Get my testimonials error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// create
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { platform, title, rating, url, content, isPublic } = req.body;

    if (!platform || !title || !content) {
      return res.status(400).json({ message: "Platform, title, content required" });
    }

    const testimonial = await Testimonial.create({
      user: req.user.id,
      platform,
      title,
      rating,
      url,
      content,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Create testimonial error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (testimonial.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { platform, title, rating, url, content, isPublic } = req.body;

    testimonial.platform = platform ?? testimonial.platform;
    testimonial.title = title ?? testimonial.title;
    testimonial.rating = rating ?? testimonial.rating;
    testimonial.url = url ?? testimonial.url;
    testimonial.content = content ?? testimonial.content;
    testimonial.isPublic =
      typeof isPublic === "boolean" ? isPublic : testimonial.isPublic;

    const updated = await testimonial.save();
    res.json(updated);
  } catch (error) {
    console.error("Update testimonial error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// user login aithie nee delete cheyagaludu
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (testimonial.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await testimonial.deleteOne();

    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    console.error("Delete testimonial error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

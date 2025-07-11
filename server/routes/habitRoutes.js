const {
  createHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabitComplete,
} = require("../controllers/habitController");
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);
router.post("/", createHabit);
router.get("/", getAllHabits);
router.get("/:id", getHabitById);
router.post("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.patch("/:id/toggle", toggleHabitComplete);
module.exports = router;

const mongoose = require("mongoose");

const HabitSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    datesCompleted: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", HabitSchema);

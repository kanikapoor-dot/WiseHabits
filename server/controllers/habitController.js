const Habit = require("../models/habit");

exports.createHabit = async (req, res) => {
  const { name, description, frequency } = req.body;
  try {
    const habit = await Habit.create({
      name,
      description,
      frequency,
      user: req.user._id,
    });
    res.status(201).json(habit);
  } catch (err) {
    console.error("Habit Creation Error : ", err);
    res.status(500).json({ error: "Failed to create habit" });
  }
};

exports.getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(habits);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

exports.getHabitById = async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habit.findById(id);

    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    res.status(200).json(habit);
  } catch (err) {
    console.error("Error fetching habit:", err);
    res.status(500).json({ error: "Failed to get habit" });
  }
};

exports.updateHabit = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const habit = await Habit.findById(id);

    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    //update changes
    Object.assign(habit, updates, { updatedAt: new Date() });
    const updatedHabit = await habit.save();

    res.status(200).json(updatedHabit);
  } catch (err) {
    console.error("Error updating habit:", err);
    res.status(500).json({ error: "Failed to update habit" });
  }
};

exports.deleteHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    await habit.deleteOne();

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ error: "Failed to delete habit" });
  }
};

exports.toggleHabitComplete = async (req, res) => {
  const { id } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const habit = await Habit.findById(id);

    if (!habit) return res.status(404).json({ error: "Habit Doesn't Exist" });

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const index = habit.datesCompleted.findIndex((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
    if (index !== -1) {
      habit.datesCompleted.splice(index, 1);
    } else {
      habit.datesCompleted.push(today);
    }
    await habit.save();

    res.status(200).json({
      message:
        index !== -1
          ? "Habit unmarked for today"
          : "Habit marked complete for today",
      habit,
    });
  } catch (err) {
    console.error("Error marking habit complete:", err);
    res.status(500).json({ error: "Failed to mark habit complete" });
  }
};

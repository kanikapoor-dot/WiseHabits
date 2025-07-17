import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../api/axios";

const EditHabit = ({ setHabits, setShowEditHabitForm, habit }) => {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [frequency, setFrequency] = useState(habit.frequency);
  const [updating, setUpdateting] = useState(false);
  const modelRef = useRef(null);

  const editOldHabit = async (e) => {
    e.preventDefault();

    setUpdateting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/habits/${habit._id}`,
        { name, description, frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedHabit = res.data;
      setHabits((prev) =>
        prev.map((h) => (h._id === updatedHabit._id ? updatedHabit : h))
      );
    } catch (err) {
      console.error("Failed to update habit", err.response?.data || err);
    } finally {
      setUpdateting(false);
      setShowEditHabitForm(false);
    }
  };

  const handleClickOutside = (e) => {
    if (modelRef.current && !modelRef.current.contains(e.target)) {
      setShowEditHabitForm(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-2 z-50 "
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-[50%] "
        ref={modelRef}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-black font-bold text-2xl">Edit Habit</p>
          <button onClick={() => setShowEditHabitForm(false)}>
            <FaTimes className="hover:text-red-500" />
          </button>
        </div>
        <form onSubmit={editOldHabit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label>Habit Name</label>
            <input
              type="text"
              placeholder="Habit Name"
              value={name}
              required
              className="border border-sm rounded-sm p-2"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Habit Description</label>{" "}
            <input
              type="text"
              placeholder="description"
              value={description}
              required
              className="border border-sm rounded-sm p-2"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Repeat</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`border px-2.5 py-2 rounded text-white ${
                  frequency === "daily" ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={(e) => setFrequency("daily")}
              >
                Daily
              </button>
              <button
                type="button"
                className={`border px-2.5 py-2 rounded text-white ${
                  frequency === "weekly" ? "bg-orange-500 " : "bg-gray-400"
                }`}
                onClick={(e) => setFrequency("weekly")}
              >
                Weekly
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-orange-500 rounded-xl text-white p-2 self-center"
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHabit;

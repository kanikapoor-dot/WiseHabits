import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../api/axios";

const AddHabit = ({ setHabits, setShowAddHabitForm, habits }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [creating, setCreating] = useState(false);
  const modelRef = useRef(null);

  const AddNewHabit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/habits",
        { name, description, frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabits([res.data, ...habits]);
      setName("");
      setDescription("");
      setFrequency("daily");
    } catch (err) {
      console.error("Failed to create habit", err.response?.data || err);
    } finally {
      setCreating(false);
    }
  };

  const handleClickOutside = (e) => {
    if (modelRef.current && !modelRef.current.contains(e.target)) {
      setShowAddHabitForm(false);
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
          <p className="text-black font-bold text-2xl">Add New Habit</p>
          <button onClick={() => setShowAddHabitForm(false)}>
            <FaTimes className="hover:text-red-500" />
          </button>
        </div>
        <form onSubmit={AddNewHabit} className="flex flex-col gap-6">
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
            disabled={creating}
            className="bg-orange-500 rounded-xl text-white p-2 self-center"
          >
            {creating ? "Creating..." : "Add New habit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;

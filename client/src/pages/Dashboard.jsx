import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import HabitCard from "../components/HabitCard";
import AddHabit from "../components/AddHabit";
import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(user?.username || "");
  const [showAddHabitForm, setShowAddHabitForm] = useState(false);
  const [completedTodayHabit, setCompletedTodayHabit] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/habits/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedHabit = res.data.habit;
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit._id === updatedHabit._id ? updatedHabit : habit
        )
      );
    } catch (err) {
      console.error("Toggle failed", err.response?.data || err);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/habits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== id));
    } catch (err) {
      console.error("Habit Deletion failed", err.response?.data || err);
    }
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabits(res.data);
        setLoading(false);
        //const datesCompleted = setCompletedTodayHabit(habits.datesCompleted);
      } catch (err) {
        console.error("Authentication failed:", err.response?.data || err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchHabits();
  }, [navigate]);

  return (
    <>
      {showAddHabitForm && (
        <AddHabit
          setHabits={setHabits}
          setShowAddHabitForm={setShowAddHabitForm}
          habits={habits}
        />
      )}
      <div className="flex w-min-full h-screen border-box">
        <div className="w-[20%] bg-[#fefefe] flex flex-col items-center m-2">
          <p className="text-3xl ml-2 bg-clip-text bg-orange-500 text-transparent font-bold">
            WiseHabit
          </p>{" "}
          <div className="flex flex-col items-center justify-center flex-grow gap-4 ">
            <button
              className={`hover:bg-orange-500 hover:text-white px-4 py-2 rounded-4xl transition`}
            >
              All habits
            </button>
            <div className="self-center">
              <button
                onClick={handleLogout}
                className={`hover:bg-orange-500 hover:text-white px-4 py-2 rounded-4xl transition`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="w-[50%] bg-[#ebecee] flex flex-col m-2">
          <div className="bg-[#fefefe] mb-2 flex items-center justify-between p-2">
            <div>
              <p className="text-gray-700">
                <span className="text-black font-bold">Hi There,</span>{" "}
                {username}
              </p>
              <p className="text-xs text-gray-400">Welcome back</p>
            </div>

            <button
              className="bg-orange-500 text-white p-2 rounded-xl flex items-center gap-1"
              onClick={() => setShowAddHabitForm(true)}
            >
              <FaPlus /> New Habit
            </button>
          </div>
          <HabitCard
            habits={habits}
            loading={loading}
            toggleComplete={toggleComplete}
            deleteHabit={deleteHabit}
          />
        </div>
        <div className="w-[30%] bg-[#fefefe] flex items-center justify-center m-2">
          30%
        </div>
      </div>
    </>
  );
};

export default Dashboard;

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
  const [completedTodayHabits, setCompletedTodayHabits] = useState([]);
  const [dailyHabits, setDailyHabits] = useState([]);
  const [WeeklyHabits, setWeeklyHabits] = useState([]);

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

      const isTodayCompleted = updatedHabit.datesCompleted.some(
        (date) =>
          new Date(date).setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0)
      );

      const updatingHabit = (prev) =>
        prev.map((habit) =>
          habit._id === updatedHabit._id ? updatedHabit : habit
        );

      setHabits(updatingHabit);
      setDailyHabits(updatingHabit);
      setWeeklyHabits(updatingHabit);

      setCompletedTodayHabits((prev) => {
        if (isTodayCompleted) {
          if (!prev.find((habit) => habit._id === updatedHabit._id))
            return [...prev, updatedHabit];

          return prev.map((h) =>
            h._id === updatedHabit._id ? updatedHabit : h
          );
        } else {
          return prev.filter((habit) => habit._id !== updatedHabit._id);
        }
      });
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

        const allHabits = res.data;

        const alreadyCompletedTodayHabits = allHabits.filter((habit) =>
          habit.datesCompleted.some(
            (date) =>
              new Date(date).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          )
        );

        const weekHabits = allHabits.filter(
          (habit) => habit.frequency === "weekly"
        );

        const dailyHabit = allHabits.filter((h) => h.frequency === "daily");

        setHabits(res.data);
        setDailyHabits(dailyHabit);
        setWeeklyHabits(weekHabits);
        setCompletedTodayHabits(alreadyCompletedTodayHabits);
        setLoading(false);
      } catch (err) {
        console.error("Authentication failed:", err.response?.data || err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchHabits();
  }, [navigate]);
  const day = new Date().getDay();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let today = weekday[day];

  return (
    <>
      {showAddHabitForm && (
        <AddHabit
          setHabits={setHabits}
          setShowAddHabitForm={setShowAddHabitForm}
          habits={habits}
        />
      )}
      <div className="flex w-full h-screen">
        <div className="w-[20%] bg-[#fefefe] flex flex-col items-center h-full overflow-hidden">
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
        <div className="w-[60%] bg-[#ebecee] flex flex-col mx-2 h-full overflow-y-auto">
          <div className="bg-[#fefefe] mb-2 flex items-center justify-between p-4">
            <div>
              <p className="text-gray-700">
                <span className="text-xl text-black font-bold">Hi There ,</span>{" "}
                {username}
              </p>
              <p className="text-xs text-gray-700">Welcome back</p>
            </div>

            <button
              className="bg-orange-400 hover:shadow-md hover:bg-orange-500 text-white p-2 rounded-xl flex items-center gap-1 transition"
              onClick={() => setShowAddHabitForm(true)}
            >
              <FaPlus /> New Habit
            </button>
          </div>
          <HabitCard
            cardlabel={`${today}`}
            cardDesc={"No habits found. Add your first one!"}
            habits={dailyHabits}
            loading={loading}
            toggleComplete={toggleComplete}
            deleteHabit={deleteHabit}
          />
          <HabitCard
            cardlabel={"Weekly Habits"}
            cardDesc={"No habits found. Add your first one!"}
            habits={WeeklyHabits}
            loading={loading}
            toggleComplete={toggleComplete}
            deleteHabit={deleteHabit}
          />
          <HabitCard
            cardlabel={"Completed Habits"}
            cardDesc={"Lets complete your first one"}
            habits={completedTodayHabits}
            loading={loading}
            toggleComplete={toggleComplete}
            deleteHabit={deleteHabit}
          />
        </div>
        <div className="w-[20%] bg-[#fefefe] flex items-center justify-center h-full overflow-hidden">
          30%
        </div>
      </div>
    </>
  );
};

export default Dashboard;

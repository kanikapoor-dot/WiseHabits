import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import HabitCard from "../components/HabitCard";
import AddHabit from "../components/AddHabit";
import { FaPlus } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.username || "Guest";
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showAddHabitForm, setShowAddHabitForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleComplete = useCallback(
    async (id) => {
      try {
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

        setHabits((prev) =>
          prev.map((habit) =>
            habit._id === updatedHabit._id ? updatedHabit : habit
          )
        );
      } catch (err) {
        console.error("Toggle failed", err.response?.data || err);
      }
    },
    [token, setHabits]
  );

  const deleteHabit = useCallback(
    async (id) => {
      try {
        const res = await api.delete(`/habits/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabits((prevHabits) =>
          prevHabits.filter((habit) => habit._id !== id)
        );
      } catch (err) {
        console.error("Habit Deletion failed", err.response?.data || err);
      }
    },
    [token, setHabits]
  );

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await api.get("/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHabits(res.data);
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

  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isSameDay = (a, b) =>
    new Date(a).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

  const dailyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "daily"),
    [habits]
  );
  const weeklyHabits = useMemo(
    () => habits.filter((h) => h.frequency === "weekly"),
    [habits]
  );
  const completedTodayHabits = useMemo(
    () =>
      habits.filter((habit) =>
        habit.datesCompleted.some((date) => isSameDay(date, null))
      ),
    [habits]
  );

  return (
    <>
      {showAddHabitForm && (
        <AddHabit
          setHabits={setHabits}
          setShowAddHabitForm={setShowAddHabitForm}
          habits={habits}
        />
      )}
      <div className="flex w-full h-screen overflow-hidden p-1">
        <div className="w-1/5 bg-[#fefefe] flex flex-col items-center h-full">
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
        <div className="w-3/5 bg-[#ebecee] flex flex-col mx-2 h-full overflow-y-auto scrollbar-hide">
          <div className="bg-[#fefefe] mb-1 flex items-center justify-between p-4 sticky top-0 z-20">
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
          <div className="flex flex-col">
            <div className="flex items-center justify-between sticky top-[4.5rem] bg-[#fefefe] px-4 py-2 z-15 mb-1">
              <div>
                <p className="text-xl text-orange-700 font-semibold">{today}</p>
                <p className="text-gray-500 text-sm ">{date}</p>
              </div>
              <div className="flex gap-3">
                <button>
                  <FaArrowCircleLeft className="text-orange-700" />
                </button>
                <button>
                  <FaArrowCircleRight className="text-orange-700" />
                </button>
              </div>
            </div>

            <HabitCard
              cardlabel={"Today Habits"}
              cardDesc={"No habits found. Add your first one!"}
              habits={dailyHabits}
              loading={loading}
              toggleComplete={toggleComplete}
              deleteHabit={deleteHabit}
              setHabits={setHabits}
            />
            <HabitCard
              cardlabel={"Weekly Habits"}
              cardDesc={"No habits found. Add your first one!"}
              habits={weeklyHabits}
              loading={loading}
              toggleComplete={toggleComplete}
              deleteHabit={deleteHabit}
              setHabits={setHabits}
            />
            <HabitCard
              cardlabel={"Completed Habits"}
              cardDesc={"Lets complete your first one"}
              habits={completedTodayHabits}
              loading={loading}
              toggleComplete={toggleComplete}
              deleteHabit={deleteHabit}
              setHabits={setHabits}
            />
          </div>
        </div>
        <div className="w-1/5 bg-[#fefefe] flex items-center justify-center h-full">
          30%
        </div>
      </div>
    </>
  );
};

export default Dashboard;

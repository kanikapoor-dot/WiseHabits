import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import HabitCard from "../components/HabitCard";
import AddHabit from "../components/AddHabit";
import { FaPlus } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.username || "Guest";
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showAddHabitForm, setShowAddHabitForm] = useState(false);
  const [showingDate, setShowingDate] = useState(() => {
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const getDateFromCalendar = (date) => {
    date.setHours(0, 0, 0, 0);
    setShowingDate(date);
  };

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

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let WeekdayName = weekday[showingDate.getDay()];

  const date = showingDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isSameDay = (a, b) => {
    const x = new Date(a);
    x.setUTCHours(0, 0, 0, 0);
    const y = new Date(b);
    y.setUTCHours(0, 0, 0, 0);
    return x.getTime() === y.getTime();
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (6 - d.getDay()));
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const dailyHabits = useMemo(
    () =>
      habits.filter((h) => {
        return (
          h.createdAt.split("T")[0] <=
            showingDate.toLocaleDateString("en-CA") && h.frequency === "daily"
        );
      }),
    [habits, showingDate]
  );
  const weeklyHabits = useMemo(
    () =>
      habits.filter((h) => {
        return (
          h.createdAt.split("T")[0] <=
            showingDate.toLocaleDateString("en-CA") && h.frequency === "weekly"
        );
      }),
    [habits, showingDate]
  );
  const completedTodayHabits = useMemo(
    () =>
      habits.filter((habit) => {
        const weekStart = getWeekStart(showingDate);
        const weekEnd = getWeekEnd(showingDate);
        if (habit.frequency === "daily") {
          return habit.datesCompleted.some((date) =>
            isSameDay(date, showingDate)
          );
        }
        if (habit.frequency === "weekly") {
          return habit.datesCompleted.some((date) => {
            const d = new Date(date);
            return d >= weekStart && d <= weekEnd;
          });
        }
        return false;
      }),
    [habits, showingDate]
  );

  const getPrevDateHabits = (e) => {
    setShowingDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    });
  };

  const getNextDateHabits = (e) => {
    setShowingDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    });
  };

  const disableHabitBoard = () => {
    today.setHours(0, 0, 0, 0);
    const showingCopy = new Date(showingDate);
    showingCopy.setHours(0, 0, 0, 0);

    return showingCopy.getTime() !== today.getTime()
      ? "pointer-events-none opacity-50 select-none" // optional: faded effect
      : "";
  };

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
        <div className="w-0.7/5 bg-mybg flex flex-col items-center h-full px-2 py-5">
          <p className="text-3xl bg-clip-text bg-text1 text-transparent font-bold ">
            WiseHabit
          </p>{" "}
          <div className="flex flex-col items-center justify-center flex-grow gap-4 ">
            <button
              className={`hover:bg-text1 hover:text-white px-4 py-2 rounded-4xl transition`}
            >
              All habits
            </button>
            <hr className="w-[90%] wx-auto" />
            <button
              onClick={handleLogout}
              className={`hover:bg-text1 hover:text-white px-4 py-2 rounded-4xl transition`}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="w-3/5 bg-[#d7daed] flex flex-col mx-2 h-full overflow-y-auto scrollbar-hide">
          <div className="bg-mybg mb-1 flex items-center justify-between p-4 sticky top-0 z-20">
            <div>
              <p className="text-gray-700">
                <span className="text-xl text-black font-bold">Hi There ,</span>{" "}
                {username}
              </p>
              <p className="text-xs text-gray-700">Welcome back</p>
            </div>

            <button
              className="bg-text2 hover:shadow-md hover:bg-text1 text-white p-2 rounded-xl flex items-center gap-1 transition"
              onClick={() => setShowAddHabitForm(true)}
            >
              <FaPlus /> New Habit
            </button>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between sticky top-[4.5rem] bg-mybg px-4 py-2 z-15 mb-1">
              <div>
                <p className="text-xl text-text1 font-semibold">
                  {WeekdayName}
                </p>
                <p className="text-gray-500 text-sm ">{date}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={getPrevDateHabits}>
                  <FaArrowCircleLeft className="text-text1" />
                </button>
                <button onClick={getNextDateHabits} className="">
                  <FaArrowCircleRight className="text-text1" />
                </button>
              </div>
            </div>
            <div className={disableHabitBoard()}>
              <HabitCard
                cardlabel={"Today Habits"}
                cardDesc={"No habits found. Add your first one!"}
                habits={dailyHabits}
                loading={loading}
                toggleComplete={toggleComplete}
                deleteHabit={deleteHabit}
                setHabits={setHabits}
                habitDate={showingDate}
              />
              <HabitCard
                cardlabel={"Weekly Habits"}
                cardDesc={"No habits found. Add your first one!"}
                habits={weeklyHabits}
                loading={loading}
                toggleComplete={toggleComplete}
                deleteHabit={deleteHabit}
                setHabits={setHabits}
                habitDate={showingDate}
              />
              <HabitCard
                cardlabel={"Completed Habits"}
                cardDesc={"Lets complete your first one"}
                habits={completedTodayHabits}
                loading={loading}
                toggleComplete={toggleComplete}
                deleteHabit={deleteHabit}
                setHabits={setHabits}
                habitDate={showingDate}
              />
            </div>
          </div>
        </div>
        <div className="w-1.3/5 bg-mybg flex items-center justify-center h-full">
          <div className="w-[90%]">
            <Calendar
              value={showingDate}
              onChange={getDateFromCalendar}
              className="react-calendar rounded-xl p-4 shadow-lg text-secondary h-[350px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

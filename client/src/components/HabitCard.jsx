import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { FaRegSmile } from "react-icons/fa";
import EditHabit from "./EditHabit";

const HabitCard = ({
  cardlabel,
  cardDesc,
  habits = [],
  setHabits,
  loading,
  toggleComplete,
  deleteHabit,
}) => {
  const [showEditHabitForm, setShowEditHabitForm] = useState(false);
  const [passEditingHabit, setPassEditingHabit] = useState(null);

  const isCompletedToday = (datesCompleted) => {
    return datesCompleted.some(
      (date) =>
        new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    );
  };

  const startEdit = (habit) => {
    setShowEditHabitForm(true);
    setPassEditingHabit(habit);
  };

  const isCompletedHabit = cardlabel === "Completed Habits" ? true : false;
  return (
    <>
      <div className="bg-mybg px-4 py-2.5">
        <div className="bg-mybg sticky top-[8rem] z-10 mb-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-text1 font-semibold">{cardlabel}</h1>
            <p className="text-gray-500 text-sm">
              No of {cardlabel} : {habits.length}
            </p>
          </div>
          {/* <hr className="w-[90%] text-gray-300 mx-auto my-2" /> */}
        </div>

        {loading ? (
          <p>Loading habits...</p>
        ) : habits.length === 0 ? (
          <p>{cardDesc}</p>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit._id}
                id={habit._id}
                className="flex justify-between items-center bg-white hover:shadow-md p-2 rounded"
              >
                <div
                  className={`flex flex-col items-start gap-2 w-full ${
                    isCompletedHabit
                      ? "pointer-events-none opacity-80 focus:outline-none select-none"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex">
                      {!isCompletedHabit ? (
                        <FaRegClock className=" rounded-full bg-text1 text-white w-8 h-8 p-2 me-2" />
                      ) : (
                        <FaRegSmile className=" rounded-full bg-text1 text-white w-8 h-8 p-2 me-2" />
                      )}

                      <div>
                        <h2 className="text-gray-800 text-l font-semibold">
                          {habit.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {habit.frequency}
                        </p>
                      </div>
                    </div>
                    {!isCompletedHabit ? (
                      <div className="flex items-center ms-2 gap-5">
                        <input
                          type="checkbox"
                          checked={isCompletedToday(habit.datesCompleted)}
                          className="accent-green-700"
                          onChange={() => toggleComplete(habit._id)}
                        />
                        <button
                          className="text-gray-500 hover:text-blue-500"
                          onClick={() => startEdit(habit)}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => deleteHabit(habit._id)}
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <p className="text-gray-600 bg-text2/50 p-2 text-xs break-all rounded-sm shadow-sm w-full">
                    {habit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showEditHabitForm && (
        <EditHabit
          setHabits={setHabits}
          setShowEditHabitForm={setShowEditHabitForm}
          habit={passEditingHabit}
        />
      )}
    </>
  );
};

export default HabitCard;

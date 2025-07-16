import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const HabitCard = ({
  cardlabel,
  cardDesc,
  habits = [],
  loading,
  toggleComplete,
  deleteHabit,
}) => {
  const isCompletedToday = (datesCompleted) => {
    return datesCompleted.some(
      (date) =>
        new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    );
  };

  return (
    <>
      <div className=" bg-[#fefefe] p-5">
        <h1 className="text-3xl font-bold mb-4">{cardlabel}</h1>
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
                className="flex justify-between items-center bg-[#eff2f7] px-5 py-2.5"
              >
                <div>
                  <h2 className="text-gray-800 text-xl font-semibold">
                    {habit.name}
                  </h2>
                  <p className="text-gray-600">{habit.description}</p>
                  {/* <p className="text-sm text-gray-500">
                    Frequency: {habit.frequency}
                  </p> */}
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={isCompletedToday(habit.datesCompleted)}
                    className="me-5"
                    onChange={() => toggleComplete(habit._id)}
                  />
                  <button className="me-5 text-blue-500">
                    <FaPen />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteHabit(habit._id)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HabitCard;

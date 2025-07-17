import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { FaRegSmile } from "react-icons/fa";

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
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const isCompletedHabit = cardlabel === "Completed Habits" ? true : false;
  return (
    <>
      <div className=" bg-[#fefefe] px-2.5 py-2 mb-2">
        <div className="mb-8">
          <h1 className="text-2xl text-orange-900 font-semibold">
            {cardlabel}
          </h1>
          <p className="text-gray-500 text-sm mb-4">{date}</p>
          <hr className="w-[90%] text-gray-300 mx-auto" />
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
                className={`flex justify-between items-center bg-[#eff2f7] hover:shadow-md p-2 rounded ${
                  isCompletedHabit
                    ? "pointer-events-none opacity-70 focus:outline-none select-none"
                    : ""
                }`}
              >
                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex">
                      {!isCompletedHabit ? (
                        <FaRegClock className=" rounded-full bg-orange-400 text-white w-10 h-10 p-2 me-2" />
                      ) : (
                        <FaRegSmile className=" rounded-full bg-orange-400 text-white w-10 h-10 p-2 me-2" />
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
                        <button className="text-gray-500 hover:text-blue-500">
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
                  <p className="text-gray-600 bg-orange-300/70 p-2 text-xs break-all rounded-sm shadow-sm w-full">
                    {habit.description}
                  </p>
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

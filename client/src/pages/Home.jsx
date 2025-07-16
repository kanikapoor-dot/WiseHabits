import "../styles/Home.css";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="bg-linear-[30deg,#D66EC0,#5C64A2] min-h-screen px-5 py-5 rounded-3xl">
      <Navbar />
      <div className="p-10 text-white text-center flex flex-col justify-between">
        <div className="inline-block self-center p-5">
          <p className="text-6xl mb-2">Build Better Habits.</p>
          <p className="text-6xl">One Day at a Time.</p>
        </div>
        <p className="text-s text-gray-100">
          Track your daily routines, stay consistant and turn goals into habits
          - all in one beautifull app.
        </p>
        <div className="my-10">
          <button
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-300 font-medium rounded-4xl text-m px-5 py-3.5 text-center inline-flex items-center me-10 mb-2 mt-2"
          >
            Get Started Free
          </button>
          <button className="text-white hover:bg-gray-100/10 border border-white font-medium rounded-4xl text-m px-5 py-3.5 text-center inline-flex items-center mb-2 mt-2">
            ▶ Watch Demo
          </button>
        </div>
        <p className="self-center text-white bg-black rounded-4xl text-xs px-10 py-2 mt-20">
          ⭐️ Loved by 1M+ users worldwide
        </p>
      </div>
    </div>
  );
};

export default Home;

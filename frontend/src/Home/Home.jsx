import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="mt-12 md:min-h-[50vh] text-center">
        <h2 className="text-3xl md:text-5xl font-semibold">
          Make Your Special Day
          <span className="text-pink-400"> Unforgettable</span>
        </h2>

        <div className="max-w-2xl mx-auto">
          <p className="text-gray-700 mt-4">
            At <span className="text-pink-400 font-medium">Grant - Hotel</span>, we turn your dream wedding into reality.
            With our elegant venue, top-notch facilities, and exceptional services, we ensure your big day is truly magical.
          </p>
          <p className="text-gray-700 mt-4">
            We offer fully customizable decorations, delicious catering, and modern amenities to make your
            special day seamless. With ample parking and budget-friendly packages, we take care of every detail.
          </p>
          <p className="text-gray-700 mt-4">
            Let us turn your dream wedding into reality. Book your date today and celebrate without worries!
          </p>
        </div>

        <button onClick={()=> navigate("/register")}
         className="mt-6 mb-6 w-full py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500 transition">
          Join Us
        </button>
      </div>
    </div>
  );
}

export default Home;

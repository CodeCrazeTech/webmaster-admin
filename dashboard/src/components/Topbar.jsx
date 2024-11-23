import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdPersonAddAlt } from "react-icons/md";
import { useStateContext } from "../context/StateContext";
import Profile from "./Profile";
import RegisterModal from "./RegisterModal";
const Topbar = () => {
  const [isRegOpen, setIsRegOpen] = useState(false);
  const { darkMode, setMode } = useStateContext()

  const handleToggle = () => {
    setMode(!darkMode)
  };

  const toggleRegModal = () => {
    setIsRegOpen(!isRegOpen);
  };

  return (
    <div className="w-full flex flex-row justify-between py-3">
      <div>
        <button
          type="button"
          onClick={toggleRegModal}
          className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded text-sm dark:focus:ring-[#3b5998]/55 px-4 py-2 text-center inline-flex items-center"
        >
          <MdPersonAddAlt size={22} className="relative bottom-[2px] mr-1" />
          <span className="md:block hidden">Register Admin</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div
          className={`w-10 -mt-1 h-5 flex items-center bg-gray-300  rounded-full p-1 cursor-pointer ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
          onClick={handleToggle}
        >
          <div
            className={`flex justify-center items-center w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
              darkMode ? "translate-x-4" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <FaMoon size={10} className="text-gray-700" />
            ) : (
              <FaSun size={10} className="text-yellow-500" />
            )}
          </div>
        </div>
        <Profile/>
      </div>

      <RegisterModal isRegOpen={isRegOpen} toggleRegModal={toggleRegModal}/>
    </div>
  );
};

export default Topbar;

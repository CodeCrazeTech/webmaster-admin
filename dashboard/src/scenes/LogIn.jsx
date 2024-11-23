import { useRef, useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FaLock, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ToastMessage from "../components/ToastMessage";
import { useToastContext } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import { axiosInstance } from "../utils/axios";

const LogIn = () => {
  const { setAccessToken, setCSRFToken, setUser } = useAuth();
  const toast = useToastContext()
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/";
  const [focus, setFocus] = useState({ username: false, password: false });
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const handleFocus = (field) => setFocus({ ...focus, [field]: true });
  const handleBlur = (field, e) =>
    setFocus({ ...focus, [field]: e.target.value !== "" });

  const handleLabelClick = (field) => {
    if (field === "username") {
      usernameRef.current.focus();
    } else if (field === "password") {
      passwordRef.current.focus();
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.post(
        "auth/login",
        JSON.stringify({
          username,
          password,
        })
      );  
      setAccessToken(response?.data?.access_token);
      setCSRFToken(response.headers["x-csrftoken"]);
      setUser(response?.data?.user)
      setUsername("");
      setPassword("");
      navigate(fromLocation, { replace: true });

      toast.open(
        <ToastMessage toast={'success'} title={"Authenticated"} details={"You are logged in successfully"}/>
      )

    }catch (err) {
      toast.open(
          <ToastMessage toast={'error'} title={"Login Failed"} details={"Invalid Username or Password"}/>
        )
  }
    
  };

  return (
    <>
        <section className="min-h-screen flex items-center justify-center">
          <div className="flex rounded-2xl shadow-lg max-w-3xl p-5 items-center dark:bg-gray-700">
            <div className="md:w-1/2 px-8 md:px-16">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <img
                  src={"avatar.svg"}
                  alt="avatar"
                  className="h-24 mx-auto"
                />
                <h2 className="font-bold text-3xl text-center mb-4 dark:text-white">Welcome</h2>
                <div
                  className={`relative flex items-center border-b-2 ${
                    focus.username ? "border-green-400" : "border-gray-300"
                  } mb-6`}
                >
                  <FaUser
                    className={` ${
                      focus.username && "text-green-400"
                    } transition`}
                  />
                  <div className="ml-2 w-full relative">
                    <label
                      className={`absolute font-semibold left-[6.5px] transition-all cursor-pointer ${
                        focus.username
                          ? "-top-2 text-sm"
                          : "top-1/2 -translate-y-1/2 text-lg"
                      } text-gray-400 dark:text-white`}
                      onClick={() => handleLabelClick("username")}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      ref={usernameRef}
                      autoComplete="off"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      required
                      className="w-full font-semibold outline-none bg-transparent p-2 text-lg text-gray-700 dark:text-gray-400"
                      onFocus={() => handleFocus("username")}
                      onBlur={(e) => handleBlur("username", e)}
                    />
                  </div>
                </div>
                <div
                  className={`relative flex items-center border-b-2 ${
                    focus.password ? "border-green-400" : "border-gray-300"
                  } mb-4`}
                >
                  <FaLock
                    className={`text-gray-300 ${
                      focus.password && "text-green-400"
                    } transition`}
                  />
                  <div className="ml-2 w-full relative">
                    <label
                      className={`absolute font-semibold left-[6.5px] transition-all cursor-pointer ${
                        focus.password
                          ? "-top-2 text-sm"
                          : "top-1/2 -translate-y-1/2 text-lg"
                      } text-gray-400 dark:text-white`}
                      onClick={() => handleLabelClick("password")}
                    >
                      Password
                    </label>
                    <input
                      type={showPassword?"text":"password"}
                      id="password"
                      ref={passwordRef}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      className="w-full font-semibold outline-none bg-transparent p-2 text-lg text-gray-700 dark:text-gray-400"
                      onFocus={() => handleFocus("password")}
                      onBlur={(e) => handleBlur("password", e)}
                    />
                  </div>

                  <div className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {
                    showPassword ?
                    <BsFillEyeFill size={21}
                      className={`text-gray-300 relative top-[1px] ${
                        focus.password && "text-green-400"
                      } transition`}
                    />:

                    <BsFillEyeSlashFill size={21}
                      className={`text-gray-300 relative top-[1px] ${
                        focus.password && "text-green-400"
                      } transition`}
                    />
                  }
                  </div>




                </div>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-green-400 block text-right mb-4 transition"
                >
                  Forgot Password?
                </a>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-2 rounded-full text-lg transition transform hover:scale-105"
                >
                  Login
                </button>
              </form>
            </div>
            <div className="md:block hidden w-1/2">
              <img
                className="rounded-2xl"
                src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                alt="background"
              />
            </div>
          </div>
        </section>
    </>
  );
};

export default LogIn;

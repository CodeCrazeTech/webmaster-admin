import { useState } from "react";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from './Loader';
import ToastMessage from "./ToastMessage";

const RegisterModal = ({ isRegOpen, toggleRegModal }) => {
  const { loading, setLoading, getErrorDetails } = useStateContext()
  const axiosPrivateInstance = useAxiosPrivate()
  const [registerform, setRegisterForm] = useState({
    username: '',
    email:'',
    password:'',
    password2:'',
  })
  const toast = useToastContext()

  const handleChange = (e) =>{
    setRegisterForm({
      ...registerform,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await axiosPrivateInstance.post(
        "auth/register",
        registerform
      )
      toggleRegModal()
      if (res.status==201){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Created"} details={"User created Successfully"}/>
        )
      }
    }
    catch(err){
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(err)} />
    );
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <>
      {isRegOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity">
          {loading && <Loader/>}
          <div className="relative p-4 w-full max-w-md max-h-full transition-transform transform scale-95 bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign Up New Admin
              </h3>
              <button
                type="button"
                onClick={toggleRegModal}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter Username
                  </label>
                  <input
                    type="test"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="abcd"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    onChange={handleChange}
                    required
                  />
                </div>



                <div className="flex flex-row gap-2">
                    <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={handleChange}
                    required
                  />
                    </div>
                    <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Repeat Password
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={handleChange}
                    required
                  />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterModal;

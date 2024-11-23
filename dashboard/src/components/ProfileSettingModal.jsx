import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ImageUploader from "./ImageUploader";
import Loader from './Loader';
import ToastMessage from './ToastMessage';

const ProfileSettingModal = ({
  isProfileSettingOpen,
  toggleProfileSettingModal,
  currentUser,
  setCurrectUser

}) => {
  const [imageData, setImageData] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const axiosPrivateInstance = useAxiosPrivate();
  const [profilePic, setProfilePic] = useState("");
  const toast = useToastContext()
  const { loading, setLoading, getErrorDetails } = useStateContext()

  useEffect(() => {
    if (isProfileSettingOpen) {
      setUsername(currentUser?.username || "");
      setEmail(currentUser?.email || "");
      setProfilePic(currentUser?.profile_picture || "")
      setPassword("");
      setPassword2("");
      setImageData(null); // Reset imageData when the modal is opened
    }
  }, [isProfileSettingOpen, currentUser]);

  const handleImageDataChange = (image) => setImageData(image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    if (password) {
      data.append("password", password);
    }
    if (password2) {
        data.append("password2", password2);
      }
    if (imageData) {
      data.append("profile_picture", imageData);
    }

    try {
      const response = await axiosPrivateInstance.put("auth/update-account", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCurrectUser(response.data)
      toggleProfileSettingModal();
      if (response.status==200){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"Profile update Successfully"}/>
        )
      }
    } catch (err) {
        toast.open(
            <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(err)} />
        );
    } finally{
      setLoading(false)
    }
  };

  return (
    <div
      id="profile-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed top-0 right-0 bg-slate-400 left-0 z-10 w-full h-full flex items-center justify-center bg-opacity-50 transition-opacity ${
        isProfileSettingOpen ? "" : "hidden"
      }`}
    >
      {loading && <Loader/>}
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <span>Profile Settings</span>
            <button
              type="button"
              onClick={toggleProfileSettingModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4">
              <div className="col-span-2">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
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
                    value={password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="password2"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Upload Profile Image
                </label>
                {isProfileSettingOpen && <ImageUploader onImageDataChange={handleImageDataChange} defaultPreview={profilePic}/>}
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingModal;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { API_DOMAIN } from "../utils/axios";
import ProfileSettingModal from "./ProfileSettingModal";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileSettingOpen, setIsProfileSettingOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  async function onLogout() {
    await logout();
    navigate('/');
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileSettingModal = () => {
    setIsProfileSettingOpen(!isProfileSettingOpen);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button
          type="button"
          className="flex text-sm rounded-full md:me-0"
          id="user-menu-button"
          aria-expanded={isOpen}
          aria-controls="user-dropdown"
          onClick={toggleDropdown}
        >
          <span className="sr-only">Open user menu</span>
          <div className="relative -top-1">
            <img
              className="w-10 h-10 rounded-full"
              src={user?.profile_picture?`${API_DOMAIN}${user.profile_picture}`:"https://pagedone.io/asset/uploads/1704275541.png"}
              alt="Rounded avatar"
            />
            <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        </button>
        {isOpen && (
          <div className="z-10 min-w-40 my-4 absolute top-10 right-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">{user?.username}</span>
            </div>
            <div className="py-2 flex flex-col" aria-labelledby="user-menu-button">
              <button
                className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                onClick={toggleProfileSettingModal}
              >
                Setting
              </button>
              <button
                className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <ProfileSettingModal
        isProfileSettingOpen={isProfileSettingOpen}
        toggleProfileSettingModal={toggleProfileSettingModal}
        currentUser={user} // Pass the current user's data
        setCurrectUser={setUser}
      />
    </>
  );
};

export default Profile;
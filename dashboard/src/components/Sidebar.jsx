import { useEffect, useState } from "react";
import { AiFillNotification } from "react-icons/ai";
import { CgLogOut } from "react-icons/cg";
import { FaMoneyBillWave } from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { RiMenuUnfold4Fill } from "react-icons/ri";
import { SiWebmoney } from "react-icons/si";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import useLogout from "../hooks/useLogout";
import { API_DOMAIN } from "../utils/axios";


const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { getAppConfig, appConfigForm, appLogo } = useStateContext()

  async function onLogout() {
    await logout();
    navigate('/');
  }

  useEffect(() => {
    getAppConfig();
  }, []);

  const menus = [
    { name: "App Config", link: "/", icon: <GrDocumentConfig size={24} /> },
    { name: "Web Details", link: "/web-details", icon: <SiWebmoney size={24} /> },
    { name: "Menus", link: "/menus", icon: <RiMenuUnfold4Fill size={24} /> },
    { name: "Addmob", link: "/add-mob", icon: <FaMoneyBillWave size={24} />},
    { name: "Push Notification", link: "/push-notification", icon: <AiFillNotification size={24} /> },
  ];

  const bottomMenus = [
    { name: "Logout", icon: <CgLogOut size={24} /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="flex flex-col min-h-screen">
      <div className={`bg-[#dad8d8] dark:bg-gray-700 h-full ${open ? "w-72" : "w-[74px]"} duration-500 text-[#626262] dark:text-white shadow px-4 flex flex-col justify-between`}>
        <div>
          <div className="flex gap-x-4 items-center pt-3">
            <img
              src={appLogo? `${API_DOMAIN}${appLogo}`:"logo.png"}
              className={`max-w-[40px] max-h-[40px] object-contain cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
            />
            <h1 className={`whitespace-pre text-xl font-bold duration-500 transform ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[100px]"}`}>
              {appConfigForm?.app_name? appConfigForm?.app_name : 'Web Master'}
            </h1>
          </div>
          {window.innerWidth >= 768 && (
            <div
              className={`absolute cursor-pointer duration-500 top-[1.18rem] ${open ? "left-[272px]" : "left-[60px]"} w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
              onClick={() => setOpen(!open)}
            >
              <img src="control.png" />
            </div>
          )}
          <div className="mt-4 flex flex-col gap-4 relative">
            {menus.map(({ name, link, icon, gap }, i) => (
              <Link
                to={link}
                key={i}
                className={`flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${gap ? "mt-5" : ""} ${location.pathname === link ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-400"}`}
              >
                <div>{icon}</div>
                <h2
                  style={{ transitionDelay: `${open ? i * 100 : 100}ms` }}
                  className={`whitespace-pre font-semibold text-lg duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden duration-0"}`}
                >
                  {name}
                </h2>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-4">
          {bottomMenus.map(({ name, link, icon }, i) => (
            <div
              key={i}
              onClick={onLogout}
              className={`flex items-center text-sm gap-3.5 font-medium p-2 rounded-md ${location.pathname === link ? "bg-gray-200" : "hover:bg-gray-400"}`}
            >
              <div>{icon}</div>
              <h2
                style={{ transitionDelay: `${open ? i * 100 : 100}ms` }}
                className={`whitespace-pre font-semibold text-lg duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden duration-0"}`}
              >
                {name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;

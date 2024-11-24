import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import {
  MdAddCircle,
  MdDelete,
  MdDeleteForever,
  MdEdit,
  MdOutlineEdit,
} from "react-icons/md";
import Loader from "../components/Loader";
import MenuModal from "../components/MenuModal";
import ToastMessage from "../components/ToastMessage";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { API_DOMAIN } from "../utils/axios";
const Menus = () => {
  const { loading, setLoading, getErrorDetails } = useStateContext()
  const [isMenuItemOpen, setIsMenuItemOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const axiosPrivateInstance = useAxiosPrivate();
  const [clickedMenu, setClickedMenu] = useState(null)
  const toast = useToastContext()
  const [editMenu, setEditMenu] = useState(false)
  const [editMenuItem, setEditMenuItem] = useState(false)
  const [clickedMenuTitle, setClickedMenuTitle] = useState('')

  const toggleMenuItemModal = () => {
    setIsMenuItemOpen(!isMenuItemOpen);
  };

  const toggleMenuModel = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getMenus = async()=> {
    try {
      const { data } = await axiosPrivateInstance.get("menu");
      setMenus(data);
    } catch (error) {
      // console.log(error.response);
    }
  }

  useEffect(() => {
    getMenus();
  }, []);

  const handleDeleteMenu = async(id) => {
    try {
      setLoading(true)
      const response = await axiosPrivateInstance.delete(`menu/${id}/`);
      await getMenus();
      if (response.status ===204){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Deteted"} details={"Menu Successfully Detaled"}/>
        )}
    } catch (err) {
        toast.open(
            <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(err)} />
        );
    }
    finally{
      setLoading(false)
    }
  }

  const handleDeleteMenuItem = async(id) => {
    try {
      setLoading(true)
      const response = await axiosPrivateInstance.delete(`menu-item/${id}/`);
      await getMenus();
      if (response.status ===204){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Deteted"} details={"Menu-Item Successfully Detaled"}/>
        )}
      
    } catch (err) {
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
    {loading && <Loader/>}
      <div className="w-full flex flex-row justify-between items-center h-10 rounded">
        <div className=" font-bold text-xl">Menus</div>
        <div>
          <button
            type="button"
            onClick={()=>{setEditMenu(false);setClickedMenu(null);toggleMenuModel()}}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          >
            <IoIosCreate size={25} className="relative bottom-[2px]" />
            Create Menu
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-start mt-4 overflow-y-auto max-h-[100vh]">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <div key={menu.id} className="p-2 min-w-80 max-w-sm">
              <div className="flex rounded bg-white dark:bg-gray-700 px-6 py-4 flex-col gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-gray-900 dark:text-white text-lg font-semibold">
                        {menu.menu_title}
                      </h2>
                    </div>
                    <div className="flex relative -top-1 gap-2 cursor-pointer">
                      <MdEdit
                        title="Edit item"
                        size={20}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                        onClick={()=>{setClickedMenu({'id': menu.id, 'menu_title': menu.menu_title});
                        setEditMenu(true);
                        toggleMenuModel()}}
                      />
                      <MdDelete
                        title="Delete item"
                        size={22}
                        color="red"
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                        onClick={() => handleDeleteMenu(menu.id)}
                      />
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="flex flex-col gap-4">
                  {menu.menu_item.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-row gap-4 flex-grow shadow rounded p-1"
                    >
                      <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                        <img
                          className="object-cover min-w-10 min-h-10 rounded-md shadow-md border"
                          src={API_DOMAIN + item.menu_icon}
                          alt={item.title}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="underline text-xs w-full">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.url}
                          </a>
                        </div>
                        <div className="flex flex-row gap-3">
                          <MdOutlineEdit
                            title="Edit item"
                            size={22}
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                            onClick={()=>{setClickedMenu(item);setEditMenuItem(true);toggleMenuItemModal()}}
                          />
                          <MdDeleteForever
                            title="Delete item"
                            size={22}
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
                  onClick={()=>{setEditMenuItem(false);setClickedMenu(null);toggleMenuItemModal(), setClickedMenuTitle(menu.menu_title)}}
                >
                  <MdAddCircle
                    title="Add item"
                    size={22}
                    className="relative -top-[2px] right-2 hover:bg-gray-200 rounded-md"
                  />
                  Add Item
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-2 min-w-80 max-w-sm">
            <div className="flex rounded bg-white dark:bg-gray-700 px-6 py-4 flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No menus available</h2>
            </div>
          </div>
        )}
      </div>
      <MenuModal
        isMenuItemOpen={isMenuItemOpen}
        toggleMenuItemModal={toggleMenuItemModal}
        isMenuOpen={isMenuOpen}
        toggleMenuModel={toggleMenuModel}
        editMenu={editMenu}
        editMenuItem={editMenuItem}
        clickedMenu={clickedMenu}
        getMenus={getMenus}
        clickedMenuTitle={clickedMenuTitle}
        setClickedMenu={setClickedMenu}
      />
    </>
  );
};

export default Menus;

import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ImageUploader from "./ImageUploader";
import Loader from './Loader';
import ToastMessage from "./ToastMessage";

const MenuModal = ({
  isMenuItemOpen,
  toggleMenuItemModal,
  isMenuOpen,
  toggleMenuModel,
  editMenu,
  editMenuItem,
  clickedMenu,
  getMenus,
  clickedMenuTitle,
  setClickedMenu
}) => {
  const [imageData, setImageData] = useState(null);
  const handleImageDataChange = (image) => setImageData(image);
  const axiosPrivateInstance = useAxiosPrivate();
  const [menuTitle, setMenuTitle] = useState("");
  const [menuItemTitle, setMenuItemTitle] = useState("");
  const [menuItemUrl, setMenuItemUrl] = useState("");
  const [menuItemIcon, setMenuIcon] = useState("");
  const toast = useToastContext()
  const { loading, setLoading, getErrorDetails } = useStateContext()
  useEffect(() => {
    setMenuTitle(clickedMenu?.menu_title || "");
    setMenuItemTitle(clickedMenu?.title || "");
    setMenuItemUrl(clickedMenu?.url || "");
    setMenuIcon(clickedMenu?.menu_icon || "");
  }, [clickedMenu, clickedMenuTitle]);

  const handleSubmit = async (e, isItem, isEdit) => {
    e.preventDefault();
    setLoading(true)
    const endpoint = isItem ? "menu-item" : "menu";
    const id = clickedMenu?.id;
    const method = isEdit ? "put" : "post";
    const url = isEdit && id ? `${endpoint}/${id}/` : endpoint;

    let data;
    const headers = {};

    if (isItem) {
      data = new FormData();
      data.append("title", menuItemTitle);
      data.append("url", menuItemUrl);
      data.append("menu_title", clickedMenuTitle);
      if (imageData) {
        data.append("menu_icon", imageData);
      }
      else if(!imageData && method==='post'){
        setLoading(false)
        toast.open(
          <ToastMessage toast={'error'} title={"Image Required"} details={"Need to upload image"}/>
        )
        return
      }

      headers["Content-Type"] = "multipart/form-data";
    } else {
      data = JSON.stringify({ menu_title: menuTitle });
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await axiosPrivateInstance[method](url, data, { headers });
      await getMenus()
      isItem ? toggleMenuItemModal() : toggleMenuModel();
      if (endpoint ==="menu-item" && method==='put' && response.status==200){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"Menu Item Update Successfully"}/>
        )
      }
      if (endpoint ==="menu-item" && method==='post' && response.status==201){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Created"} details={"Menu Item create Successfully"}/>
        )
      }

      if (endpoint ==="menu" && method==='put' && response.status==200){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"Menu Update Successfully"}/>
        )
      }
      if (endpoint ==="menu" && method==='post' && response.status==201){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Created"} details={"Menu create Successfully"}/>
        )
      }
    } catch (error) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)}/>
      )
    } finally{
      setLoading(false)
      setMenuItemTitle("");
      setMenuItemUrl("");
      setMenuIcon("");
      setMenuTitle("");
      setClickedMenu(null)
    }
  };

  return (
    <>
    
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 right-0 bg-slate-400 left-0 z-10 w-full h-full flex items-center justify-center bg-opacity-50 transition-opacity ${
          isMenuItemOpen || isMenuOpen ? "" : "hidden"
        }`}
      >
         {loading && <Loader/>}
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[650px] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              {isMenuItemOpen ? (
                editMenuItem ? (
                  <>Edit MenuItem</>
                ) : (
                  <>Create MenuItem</>
                )
              ) : isMenuOpen ? (
                editMenu ? (
                  <>Edit Menu</>
                ) : (
                  <>Create Menu</>
                )
              ) : null}
              <button
                type="button"
                onClick={
                  isMenuItemOpen
                    ? () => {
                        toggleMenuItemModal();
                        setMenuItemTitle("");
                        setMenuItemUrl("");
                        setMenuIcon("");
                        setClickedMenu(null)
                      }
                    : isMenuOpen
                    ? () => {
                        toggleMenuModel();
                        setMenuTitle("");
                        setClickedMenu(null)
                      }
                    : undefined
                }
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

            <form
              className="p-4 md:p-5"
              onSubmit={(e) => handleSubmit(
                e,
                isMenuItemOpen,
                isMenuItemOpen ? editMenuItem : isMenuOpen ? editMenu : false
              )}
            >
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={isMenuItemOpen ? menuItemTitle : isMenuOpen? menuTitle : ''}
                    onChange={(e) => {
                      if (isMenuItemOpen) {
                        setMenuItemTitle(e.target.value);
                      } else if (isMenuOpen) {
                        setMenuTitle(e.target.value);
                      }
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={`${
                      isMenuItemOpen
                        ? "Type menuitem title"
                        : isMenuOpen
                        ? "Add menu title"
                        : ""
                    }`}
                    required
                  />
                </div>
                {isMenuItemOpen && (
                  <div className="col-span-2">
                    <label
                      htmlFor="link"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Link
                    </label>
                    <input
                      type="text"
                      name="link"
                      id="link"
                      defaultValue={menuItemUrl}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type menuitem link"
                      onChange={(e) => setMenuItemUrl(e.target.value)}
                      required
                    />
                  </div>
                )}
                {isMenuItemOpen && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Upload Icon
                    </label>
                    <ImageUploader
                      onImageDataChange={handleImageDataChange}
                      defaultPreview={menuItemIcon}
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isMenuItemOpen
                  ? editMenuItem
                    ? "Update MenuItem"
                    : "Add MenuItem"
                  : isMenuOpen
                  ? editMenu
                    ? "Update Menu"
                    : "Add Menu"
                  : ""}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuModal;

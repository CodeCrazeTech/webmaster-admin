import { useEffect, useState } from "react";
import ColorPicker from "../components/ColorPicker";
import ImageUploader from "../components/ImageUploader";
import Loader from "../components/Loader";
import ToastMessage from "../components/ToastMessage";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const AppConfig = () => {
  const [imageData1, setImageData1] = useState(null);
  const axiosPrivateInstance = useAxiosPrivate();
  const [menus, setMenus] = useState([]);
  const toast = useToastContext()
  const { getAppConfig, appConfigForm, setAppConfigForm, appLogo, loading, setLoading, getErrorDetails } = useStateContext()

  const handleChangeAppConfig = (e) => {
    setAppConfigForm({
      ...appConfigForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleColorChange = (color) => {
    setAppConfigForm((prevForm) => ({
      ...prevForm,
      primary_color: color,
    }));
  };

  useEffect(() => {
    async function getMenus() {
      try {
        const { data } = await axiosPrivateInstance.get("menu");
        setMenus(data);
      } catch (error) {
        //console.log(error.response);
      }
    }
    getMenus();
  }, []);

  const handleImageDataChange = (image) => setImageData1(image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    Object.keys(appConfigForm).forEach((key) => {
      formData.append(key, appConfigForm[key]);
    });
    if (imageData1) {
      formData.append("app_logo", imageData1);
    }

    try {
      const response = await axiosPrivateInstance.post("app-config", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status ===201){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"App config Update Successfully"}/>
        )
      }
      await getAppConfig();
    } catch (err) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(err)} />
      );
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <div className="max-w-xl mx-auto p-2 overflow-y-auto max-h-[100vh] ">
      {loading && <Loader/>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="site-name"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Site Name
          </label>
          <input
            id="app_name"
            name="app_name"
            type="text"
            value={appConfigForm.app_name}
            onChange={handleChangeAppConfig}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Site Name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="site-url"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Site URL
          </label>
          <input
            id="app_url"
            name="app_url"
            type="url"
            value={appConfigForm.app_url}
            onChange={handleChangeAppConfig}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="https://example.com"
            required
          />
        </div>

        <ColorPicker
          color={appConfigForm.primary_color}
          onColorChange={handleColorChange}
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white -mt-6">
            Upload Image
          </label>
          <ImageUploader
            onImageDataChange={handleImageDataChange}
            defaultPreview={appLogo}
          />
        </div>

        <div>
          <label
            htmlFor="menu-item"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Dropdown Menu
          </label>
          <select
            id="menu_item"
            name="menu_item"
            value={appConfigForm.menu_item}
            onChange={handleChangeAppConfig}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="" disabled className="text-sm font-medium text-gray-900 dark:text-white">
              Select an option
            </option>
            {menus.length > 0 &&
              menus.map((menu) => (
                <option key={menu.id} value={menu.menu_title}>
                  {menu.menu_title}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppConfig;

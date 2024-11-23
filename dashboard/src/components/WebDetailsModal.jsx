import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ImageUploader from "./ImageUploader";
import Loader from './Loader';
import ToastMessage from "./ToastMessage";

const WebDetailsModal = ({
  isWebDetailsOpen,
  toggleWebDetailsModel,
  editWebDetails,
  clickedWebDetails,
  getWebDetails
}) => {
  const [imageData, setImageData] = useState(null);
  const handleImageDataChange = (image) => setImageData(image);
  const axiosPrivateInstance = useAxiosPrivate();
  const [title, setTitle] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [siteLogo, setSiteLogo] = useState("");
  const toast = useToastContext()
  const { loading, setLoading, getErrorDetails } = useStateContext()

  useEffect(() => {
    if (isWebDetailsOpen) {
      setTitle(clickedWebDetails?.title || "");
      setWebUrl(clickedWebDetails?.web_url || "");
      setSiteLogo(clickedWebDetails?.site_logo || "");
      setImageData(null);
    }
  }, [isWebDetailsOpen, clickedWebDetails]);

  const handleSubmit = async (e, isEdit) => {
    e.preventDefault();
    setLoading(true)
    const endpoint = "web-details";
    const id = clickedWebDetails?.id;
    const method = isEdit ? "put" : "post";
    const url = isEdit && id ? `${endpoint}/${id}/` : endpoint;

    let data;
    const headers = {};

    data = new FormData();
    data.append("title", title);
    data.append("web_url", webUrl);
    if (imageData) {
      data.append("site_logo", imageData);
    }
    else if(!imageData && method==='post'){
      setLoading(false)
      toast.open(
        <ToastMessage toast={'error'} title={"Image Required"} details={"Need to upload image"}/>
      )
      return
    }
    headers["Content-Type"] = "multipart/form-data";

    try {
      const response = await axiosPrivateInstance[method](url, data, {
        headers,
      });
      toggleWebDetailsModel();
      await getWebDetails()
      if (method==='put' && response.status==200){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"Web Details Update Successfully"}/>
        )
      }
      if (method==='post' && response.status==201){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Created"} details={"Web Details create Successfully"}/>
        )
      }
    } catch (error) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)} />
      );
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 right-0 bg-slate-400 left-0 z-10 w-full h-full flex items-center justify-center bg-opacity-50 transition-opacity ${
          isWebDetailsOpen ? "" : "hidden"
        }`}
      >
        {loading && <Loader/>}
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              {isWebDetailsOpen ? (
                editWebDetails ? (
                  <>Edit Web-Details</>
                ) : (
                  <>Create Web-Details</>
                )
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setImageData(null);
                  setSiteLogo("");
                  setTitle("");
                  setWebUrl("");
                  toggleWebDetailsModel();
                }}
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
              onSubmit={(e) => handleSubmit(e, editWebDetails)}
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
                    value={title}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type web-details title"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="link"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Web Url
                  </label>
                  <input
                    type="text"
                    name="link"
                    id="link"
                    value={webUrl}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type Web url"
                    onChange={(e) => setWebUrl(e.target.value)}
                    required
                  />
                </div>

                {isWebDetailsOpen && <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Upload Image
                  </label>
                  <ImageUploader
                    onImageDataChange={handleImageDataChange}
                    defaultPreview={siteLogo}
                  />
                </div>}
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isWebDetailsOpen
                  ? editWebDetails
                    ? "Update Web-Details"
                    : "Add Web-Details"
                  : ""}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebDetailsModal;

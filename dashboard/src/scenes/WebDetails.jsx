import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import Loader from "../components/Loader";
import ToastMessage from "../components/ToastMessage";
import WebDetailsModal from "../components/WebDetailsModal";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { API_DOMAIN } from "../utils/axios";

const WebDetails = () => {
  const { loading, setLoading, getErrorDetails } = useStateContext() 
  const axiosPrivateInstance = useAxiosPrivate();
  const toast = useToastContext()
  const getWebDetails = async() => {
    try {
      const { data } = await axiosPrivateInstance.get("web-details");
      setWebDetails(data);
    } catch (error) {
      // console.log(error.response);
    }
  }
  useEffect(() => {
    getWebDetails();
  }, [axiosPrivateInstance]);

  const [isWebDetailsOpen, setIsWebDetailsOpen] = useState(false);
  const [editWebDetails, setEditWebDetails] = useState(false)
  const [clickedWebDetails, setClickedWebDetails] = useState(null)
  const [webDetails, setWebDetails] = useState([])

  const toggleWebDetailsModel = () => {
    setIsWebDetailsOpen(!isWebDetailsOpen);
  };

  const handleDeleteWebDetail = async(id) => {
    try {
      setLoading(true)
      const response = await axiosPrivateInstance.delete(`web-details/${id}/`);
      await getWebDetails();
      if (response.status ===204){
      toast.open(
        <ToastMessage toast={'success'} title={"Successfully Deteted"} details={"Web Details Successfully Detaled"}/>
      )}
    } catch (error) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)} />
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
        <div className=" font-bold text-xl">Web Details</div>
        <div>
          <button
            type="button"
            onClick={()=>{setEditWebDetails(false);setClickedWebDetails(null);toggleWebDetailsModel()}}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          >
            <IoIosCreate size={25} className="relative bottom-[2px]" />
            Create Web Details
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-start mt-4 overflow-y-auto max-h-[100vh]">
      {webDetails.length > 0 ? (
        webDetails.map((item) => (
        <div key={item.id} className="flex flex-row gap-4 flex-grow shadow rounded p-1 bg-white dark:bg-gray-700 px-6 py-4 min-w-80 max-w-sm">
          <div className="max-w-20 flex h-20 justify-center sm:justify-start sm:w-auto">
            <img
              className="object-contain min-w-20 min-h-20 rounded-md shadow-md border"
              src={API_DOMAIN + item.site_logo}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-display text-xl font-semibold text-gray-900 dark:text-white">{item.title}</div>
            <div className="underline text-xs text-gray-900 dark:text-white w-full">
              <a
                href={item.web_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.web_url}
              </a>
            </div>
            <div className="flex flex-row gap-3">
              <MdOutlineEdit
                title="Edit item"
                size={22}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                onClick={()=>{setClickedWebDetails(item);setEditWebDetails(true);toggleWebDetailsModel()}}
              />
              <MdDeleteForever
                title="Delete item"
                size={22}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                onClick={() => handleDeleteWebDetail(item.id)}
              />
            </div>
          </div>
        </div>))) : (
          <div className="p-2 min-w-80 max-w-sm">
            <div className="flex rounded bg-white dark:bg-gray-700 px-6 py-4 flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No menus available</h2>
            </div>
          </div>
        )}
        
        
      </div>

      <WebDetailsModal isWebDetailsOpen={isWebDetailsOpen}
        toggleWebDetailsModel={toggleWebDetailsModel}
        editWebDetails={editWebDetails}
        clickedWebDetails={clickedWebDetails}
        getWebDetails={getWebDetails}
        />
    </>
  );
};

export default WebDetails;
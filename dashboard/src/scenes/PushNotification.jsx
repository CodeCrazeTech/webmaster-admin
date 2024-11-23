import { useEffect, useState } from "react";
import { IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import NotificationModal from "../components/NotificationModal";
import ToastMessage from "../components/ToastMessage";
import { useStateContext } from "../context/StateContext";
import { useToastContext } from "../context/ToastContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PushNotification = () => {
  const { loading, setLoading, getErrorDetails } = useStateContext()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);
  const toast = useToastContext()
  const toggleModal = (id) => {
    setNotificationIdToDelete(id);
    setIsModalOpen(!isModalOpen);
  };

  const axiosPrivateInstance = useAxiosPrivate();
  
  const handleConfirm = async() => {
    try {
      setIsModalOpen(false);
      setLoading(true)
      const response = await axiosPrivateInstance.delete(`notification/${notificationIdToDelete}/`);
      await getNotifications();
      if (response.status ===204){
        toast.open(
          <ToastMessage toast={'success'} title={"Successfully Deteted"} details={"Notification Successfully Detaled"}/>
        )}
    } catch (error) {
        toast.open(
          <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)} />
        );
    } finally{
      setIsModalOpen(false);
      setNotificationIdToDelete(null);
      setLoading(false)
    }
  };

  const handleSendNotification = async(id) =>{
    try {
      setLoading(true)
      setIsModalOpen(false);
      const response = await axiosPrivateInstance.put(`push-notification/${id}/`);
      await getNotifications();
      if (response.status ===200){
        toast.open(
          <ToastMessage toast={'success'} title={"Send Successfully"} details={"Notification Successfully pushed"}/>
        )}

    } catch (error) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)} />
      );
    } finally{
      setIsModalOpen(false);
      setNotificationIdToDelete(null);
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notification, setNotifications] = useState([]);

  const toggleNotificationModal = () => {
    setIsNotifyOpen(!isNotifyOpen);
  };

  const getNotifications = async () => {
    try {
      const { data } = await axiosPrivateInstance.get("notification");
      setNotifications(data);
    } catch (error) {
      //console.log(error)
    }
  };

  useEffect(() => {
  getNotifications();
}, [axiosPrivateInstance]);

  return (
    <>
      {loading && <Loader/>}
      <div className="w-full flex flex-row justify-between items-center h-10 rounded">
        <div className=" font-bold text-xl">Notifications</div>
        <div>
          <button
            type="button"
            onClick={toggleNotificationModal}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          >
            <IoIosCreate size={25} className="relative bottom-[2px]"/>
            Create Notification
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center xl:justify-start mt-4 overflow-y-auto max-h-[100vh]">

      {notification.length > 0 ? (
        notification.map((item) => (
          <div key={item.id} className="p-2 min-w-80 max-w-sm">
          <div className="flex rounded bg-white dark:bg-gray-700 p-6 flex-col gap-2">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Title</h2>
                </div>

                <div className="flex relative -top-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => toggleModal(item.id)}>
                    <MdDelete size={22} color="red"/>
                </div>
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <p className="leading-relaxed text-sm text-gray-900 dark:text-white">
                  {item.title}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Description</h2>
                </div>
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <p className="leading-relaxed text-sm text-gray-900 dark:text-white">
                {item.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
              onClick={()=>handleSendNotification(item.id)}
            >
              Send Notification
            </button>
          </div>
        </div>
        
        ))) : (
          <div className="p-2 min-w-80 max-w-sm">
            <div className="flex rounded bg-white dark:bg-gray-700 px-6 py-4 flex-col gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No Notification available</h2>
            </div>
          </div>
        )}

        


      </div>


      <NotificationModal isNotifyOpen={isNotifyOpen} toggleNotificationModal={toggleNotificationModal} getNotifications={getNotifications}/>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    
    </>

    

  );
};

export default PushNotification;
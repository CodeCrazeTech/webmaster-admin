import { IoMdAlert } from "react-icons/io";

const ToastMessage = ({ toast, title, details }) => {
  const getToastStyles = (toast) => {
    switch (toast) {
      case 'success':
        return 'bg-green-300 text-green-800';
      case 'error':
        return 'bg-red-300 text-red-800';
      case 'update':
        return 'bg-blue-300 text-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className={`flex gap-2 min-w-60 p-4 rounded-lg shadow-lg ${getToastStyles(toast)}`}>
      <IoMdAlert size={26} />
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm">{details}</p>
      </div>
    </div>
  );
};

export default ToastMessage;
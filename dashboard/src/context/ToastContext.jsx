import { createContext, useContext, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export const ToastContext = createContext();

export const ToastProvider = ({children}) =>{
    const [toasts, setToasts] = useState([]);
    
    const open = (component, timeout = 5000) => {
        const id = Date.now();
        setToasts(toasts => [...toasts, { id, component }]);

        setTimeout(() => close(id), timeout);
    };

    const close = (id) => setToasts(toasts => toasts.filter((toast) => toast.id !== id));

    return (
        <ToastContext.Provider value={{ open, close }}>
            {children}
            <div className='space-y-2 absolute top-4 right-4 z-50'>
                {
                    toasts.map(({ id, component }) => (
                        <div key={id} className="relative">
                            <button onClick={() => close(id)} className="absolute top-2 right-2 p-1 rounded-lg">
                                <IoIosCloseCircleOutline size={20} color='white'/>
                            </button>
                            {component}
                        </div>
                    ))
                }
            </div>
        </ToastContext.Provider>
    );
}

export const useToastContext = () => useContext(ToastContext);
import { createContext, useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [activeMenu, setActiveMenu] = useState(true);
  const axiosPrivateInstance = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

  const [appLogo, setAppLogo] = useState(null);
  const [appConfigForm, setAppConfigForm] = useState({
    app_name: "",
    app_url: "",
    primary_color: "#ffffff",
    menu_item: "",
  });

  const getErrorDetails = (err) =>{
    if (err.response && err.response.data) {
      return Object.entries(err.response.data)
      .map(([field, messages]) => {
          if (Array.isArray(messages)) {
              return `${field}: ${messages.join(' ')}`;
          } else {
              return `${field}: ${messages}`;
          }
      })
      .join('\n');
    } else {
       return err.toString();
    }
  }

  const getAppConfig = async () => {
    try {
      const { data } = await axiosPrivateInstance.get("app-config");
      if (data) {
        setAppLogo(data.app_logo);
        setAppConfigForm({
          app_name: data.app_name,
          app_url: data.app_url,
          primary_color: data.primary_color,
          menu_item: data.menu_item,
        });
      }
    } catch (error) {
      // console.log(error.response);
    }
  };

  const setMode = (value) => {
    setDarkMode(value);
    localStorage.setItem("darkMode", value);
    document.body.classList.toggle("dark", value);
  };


  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        darkMode,
        setDarkMode,
        activeMenu,
        setActiveMenu,
        setMode,
        getAppConfig,
        appLogo,
        setAppLogo,
        appConfigForm,
        setAppConfigForm,
        loading,
        setLoading,
        getErrorDetails
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

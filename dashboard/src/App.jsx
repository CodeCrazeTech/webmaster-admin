import { Route, Routes } from "react-router-dom";
import AddMob from "./scenes/AddMob";
import AppConfig from "./scenes/AppConfig";
import LogIn from "./scenes/LogIn";
import Menus from "./scenes/Menus";
import PushNotification from "./scenes/PushNotification";
import WebDetails from "./scenes/WebDetails";
import Layout from "./utils/Layout";
import PersistLogin from "./utils/PersistLogin";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import RedirectRoute from "./utils/RedirectRoute";

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LogIn />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<AppConfig />} />
            <Route path="/push-notification" element={<PushNotification />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/app-config" element={<AppConfig />} />
            <Route path="/add-mob" element={<AddMob />} />
            <Route path="/web-details" element={<WebDetails />} />
          </Route>
        </Route>
        <Route path="*" element={<RedirectRoute />} />
      </Route>
    </Routes>
  );
}

export default App;

// src/helpers/notifications/Notification.tsx

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return (
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      closeButton // Ensure the close button is enabled
      style={{ marginTop: '5rem' }} // Adjust the marginTop value as needed
    />
  );
}

export default Notification;
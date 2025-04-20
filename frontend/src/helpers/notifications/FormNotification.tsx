import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FormNotification = () => {
  return (
    <ToastContainer 
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      closeButton
      style={{ marginTop: '1rem' }} // Adjust the marginTop value as needed
    />
  );
}

export default FormNotification;
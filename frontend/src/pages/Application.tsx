import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axiosInstance from "../utils/axiosInstance";

const ApplicationPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the application!</h1>
        <Button text="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default ApplicationPage;

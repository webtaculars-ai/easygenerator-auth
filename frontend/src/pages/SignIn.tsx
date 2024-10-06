import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utiils/axiosInstance";
import Input from "../components/Input";
import Button from "../components/Button";
import FormLayout from "../components/FormLayout";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        navigate("/application");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setSignInError("Invalid email or password. Please try again.");
      } else {
        setSignInError("Something went wrong");
      }
    }
  };

  return (
    <FormLayout title="Sign In" onSubmit={handleSignIn}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {signInError && <p className="text-red-500">{signInError}</p>}
      <Button text="Sign In" disabled={!email || !password} />
    </FormLayout>
  );
};

export default SignInPage;

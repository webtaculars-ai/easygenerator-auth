import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utiils/axiosInstance";
import Input from "../components/Input";
import Button from "../components/Button";
import FormLayout from "../components/FormLayout";

const PASSWORD_CONDITION_MESSAGE =
  "Password must be at least 8 characters long, contain 1 letter, 1 number, 1 special character.";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(
    PASSWORD_CONDITION_MESSAGE
  );
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(PASSWORD_CONDITION_MESSAGE);
      setIsPasswordValid(false);
      return false;
    }
    setPasswordError("");
    setIsPasswordValid(true);
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
    validatePassword(e.target.value);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      return;
    }

    try {
      const response = await axiosInstance.post("/user/signup", {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        navigate("/application");
      }
    } catch (error: any) {
      setSignUpError(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <FormLayout title="Sign Up" onSubmit={handleSignUp}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <p
        className={`text-sm ${
          passwordTouched && passwordError ? "text-red-500" : "text-gray-500"
        }`}
      >
        {passwordError}
      </p>

      {signUpError && <p className="text-red-500">{signUpError}</p>}

      <Button text="Sign Up" disabled={!email || !name || !isPasswordValid} />
    </FormLayout>
  );
};

export default SignUpPage;

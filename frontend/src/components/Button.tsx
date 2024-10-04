interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ text, onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      type="submit"
      className={`w-full p-2 rounded ${
        disabled ? "bg-gray-400" : "bg-blue-500 text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      type="submit"
      className="w-full p-2 bg-blue-500 text-white rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

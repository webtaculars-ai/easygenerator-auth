interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  required = true,
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 mb-3 border rounded"
      required={required}
    />
  );
};

export default Input;

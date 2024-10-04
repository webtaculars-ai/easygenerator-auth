interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
}

const FormLayout = ({ children, title, onSubmit }: FormLayoutProps) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </form>
    </div>
  );
};

export default FormLayout;

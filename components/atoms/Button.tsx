type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
};

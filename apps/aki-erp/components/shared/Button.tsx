interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button {...props}>
      {isLoading ? <span className="loading loading-spinner"></span> : <>{children}</>}
    </button>
  );
};

export default Button;

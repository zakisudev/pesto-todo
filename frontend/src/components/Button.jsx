const Button = ({ title, onClick, disabled, className, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      loading={loading}
    >
      {title}
    </button>
  );
};

export default Button;

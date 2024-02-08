const InputComponent = ({
  type,
  className,
  onChange,
  disabled,
  value,
  placeholder,
  required,
}) => {
  return (
    <input
      type={type}
      className={className}
      onChange={onChange}
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default InputComponent;

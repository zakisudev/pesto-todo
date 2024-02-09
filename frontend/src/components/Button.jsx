import Loader from '../assets/spinner.svg';

const Button = ({ title, onClick, disabled, className, loading }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {loading ? (
        <img
          src={Loader}
          alt="loading"
          className="w-7 h-7 bg-transparent mx-auto"
        />
      ) : (
        title
      )}
    </button>
  );
};

export default Button;

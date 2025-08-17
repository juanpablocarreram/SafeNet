import './Button.css';

export default function Button({ children, onClick, type = "button", variant = "primary" }) {
  return (
    <button className={`btn ${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

// Input.jsx
import './Input.css';

export default function Input({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
    />
  );
}

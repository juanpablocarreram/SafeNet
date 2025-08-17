import './Card.css';

export default function Card({ title, description, children }) {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
}

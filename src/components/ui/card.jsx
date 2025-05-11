export function Card({ children, className }) {
    return (
      <div className={`bg-white border shadow-sm rounded-lg ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
  }
  
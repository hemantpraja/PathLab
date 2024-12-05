import React from 'react';

const Button = React.forwardRef(function Button({ title, className = "", ...props }, ref) {
  return (
    <div>
      <button
        ref={ref}
        className={`px-3 py-2 bg-btn-color text-black w-full ${className}`}
        {...props}
      >
        {title}
      </button>
    </div>
  );
});

export default Button;

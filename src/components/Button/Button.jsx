import { buttonStyles } from '../../utils/buttonStyles.js';

function Button({ children, className = '', size = 'normal', variant = 'primary', type = 'button', ...props }) {
  const sizeClass = size === 'small' ? '!px-3 !py-2 text-[13px]' : '';
  return (
    <button
      className={`${buttonStyles[variant] || buttonStyles.primary} ${sizeClass} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;


export const Spinner = ({ 
  loadingText = 'Loading...',
  spinnerColor = 'blue',
  textColor = 'gray',
  spinnerSize = 'md'
}) => {
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80">
      <div className={`
        inline-block
        animate-spin
        rounded-full
        border-4
        border-current
        border-t-transparent
        ${spinnerSizes[spinnerSize]}
        text-${spinnerColor}-600
      `}
      role="status"
      aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      
      <div className={`
        mt-4 
        font-semibold 
        ${textSizes[spinnerSize]}
        text-${textColor}-700
      `}>
        {loadingText}
      </div>
    </div>
  );
};

import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ title = 'Something went wrong', description = 'An error occurred while processing your request.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-emergency/5 border border-emergency/20">
      <div className="w-16 h-16 bg-emergency/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-emergency" />
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-1">{title}</h3>
      <p className="text-neutral-600 max-w-sm mx-auto mb-4">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary bg-emergency hover:bg-emergency-dark">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

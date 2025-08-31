import React, { useState, useEffect } from 'react';
import { CheckCircle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessNotification = ({ 
  isVisible, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully",
  actionText = "View Profile",
  actionLink = "/profile",
  autoClose = true,
  duration = 5000 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {title}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {message}
            </p>
            
            {actionLink && actionText && (
              <Link
                to={actionLink}
                onClick={handleClose}
                className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <span>{actionText}</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;



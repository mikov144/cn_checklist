import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  showActions?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  children,
  showActions = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-synth-background p-6 rounded-lg neon-border z-10 bg-gray-900/95 max-w-md w-full mx-4 transform transition-all duration-200 scale-100">
        <h2 className="text-2xl font-retro text-synth-primary neon-text mb-4">{title}</h2>
        {message && <p className="text-synth-text mb-6">{message}</p>}
        {children}
        
        {showActions && (
          <div className="flex space-x-4 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border-2 border-synth-primary text-synth-primary
                transition-all duration-200 font-retro
                hover:text-pink-500 hover:border-pink-500
                hover:bg-synth-primary/10 
                hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]
                hover:scale-105
                active:scale-95
                active:bg-synth-primary/20
                active:text-pink-700
                active:border-pink-700
                active:shadow-[0_0_8px_rgba(255,0,255,0.2)]"
            >
              No
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className="button-retro px-4 py-2 rounded font-retro"
            >
              Yes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 
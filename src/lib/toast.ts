// Simple toast notification utility

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  status: ToastStatus;
  duration?: number;
  isClosable?: boolean;
}

const toast = (options: ToastOptions) => {
  const { title, description, status, duration = 3000, isClosable = true } = options;
  
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  
  // Set background color based on status
  let bgColor = '';
  let borderColor = '';
  let textColor = '';
  
  switch (status) {
    case 'success':
      bgColor = 'bg-green-950/90';
      borderColor = 'border-green-500';
      textColor = 'text-green-300';
      break;
    case 'error':
      bgColor = 'bg-red-950/90';
      borderColor = 'border-red-500';
      textColor = 'text-red-300';
      break;
    case 'warning':
      bgColor = 'bg-yellow-950/90';
      borderColor = 'border-yellow-500';
      textColor = 'text-yellow-300';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-950/90';
      borderColor = 'border-blue-500';
      textColor = 'text-blue-300';
      break;
  }
  
  toast.className = `${bgColor} border ${borderColor} p-3 rounded-md shadow-lg min-w-[300px] max-w-[400px] backdrop-blur-sm animate-slideIn`;
  
  // Add title
  const titleElement = document.createElement('div');
  titleElement.className = `font-medium ${textColor}`;
  titleElement.textContent = title;
  toast.appendChild(titleElement);
  
  // Add description if provided
  if (description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'text-sm text-white mt-1';
    descriptionElement.textContent = description;
    toast.appendChild(descriptionElement);
  }
  
  // Add close button if closable
  if (isClosable) {
    const closeButton = document.createElement('button');
    closeButton.className = 'absolute top-2 right-2 text-white/70 hover:text-white';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        toastContainer?.removeChild(toast);
      }, 300);
    };
    toast.appendChild(closeButton);
  }
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Remove toast after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        if (toast.parentNode) {
          toastContainer?.removeChild(toast);
        }
      }, 300);
    }
  }, duration);
  
  // Add global styles if they don't exist
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease forwards;
      }
      .animate-fadeOut {
        animation: fadeOut 0.3s ease forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

export default toast;

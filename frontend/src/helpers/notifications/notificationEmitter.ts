// src/helpers/notifications/notificationEmitter.ts

import { toast } from "react-toastify";

export enum toastType {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning'
}

export const showNotification = (message: string, type: toastType) => {
  toast(message, { type });
};

export const parseErrorMessage = (error: any): string => {
  // If the error response has data property (axios error)
  if (error.response?.data) {
    const data = error.response.data;
    
    // If the response is a string, return it directly
    if (typeof data === 'string') return data;
    
    // If the response is an object, collect all error messages
    if (typeof data === 'object') {
      const messages: string[] = [];
      
      Object.entries(data).forEach(([_, errors]) => {
        // Handle array of errors
        if (Array.isArray(errors)) {
          messages.push(`${errors.join(', ')}`);
        }
        // Handle single string error
        else if (typeof errors === 'string') {
          messages.push(`${errors}`);
        }
      });
      
      return messages.join('\n');
    }
  }
  
  // Fallback error message
  return 'An error occurred. Please try again.';
};
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
  if (!error.response?.data) {
    return 'An error occurred. Please try again.';
  }

  const data = error.response.data;
  
  // If it's a string, return it directly
  if (typeof data === 'string') return data;
  
  // If it's an object, find the first error message
  if (typeof data === 'object') {
    const findFirstError = (obj: any): string | null => {
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
          return value[0];
        }
        if (typeof value === 'string') {
          return value;
        }
        if (typeof value === 'object' && value !== null) {
          const nestedError = findFirstError(value);
          if (nestedError) return nestedError;
        }
      }
      return null;
    };

    const message = findFirstError(data);
    return message || 'An error occurred. Please try again.';
  }
  
  return 'An error occurred. Please try again.';
};
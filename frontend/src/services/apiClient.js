// Centralized API configuration to support both local development and production deployments
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

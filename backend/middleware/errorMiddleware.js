/**
 * Error Handling Utilities
 */

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export function handleValidationError(field, message) {
  return new ApiError(`${field}: ${message}`, 400);
}

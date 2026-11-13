export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type FieldErrors = Record<string, string>;

export type ValidationResult<T> =
  | { isValid: true; data: T }
  | { isValid: false; errors: FieldErrors };

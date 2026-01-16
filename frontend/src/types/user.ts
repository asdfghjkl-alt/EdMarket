export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  email: string;
}

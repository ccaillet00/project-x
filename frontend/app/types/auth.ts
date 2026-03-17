export interface LoginForm {
  username: string;
  password: string;
  remember: number;
}

export interface AuthResponse {
  jwt: string;
}

export interface signUpForm {
  username: string;
  email: string;
  password: string;
}

export {};

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export type UserRole = 'admin' | 'teamMember' | string;
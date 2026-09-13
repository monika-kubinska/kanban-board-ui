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
  members?: TeamMember[];
}

export interface TeamMember {
  userId: string;
  name?: string;
  email?: string;
}

export interface CreateTeamInput {
  name: string;
}

export type UserRole = 'admin' | 'teamMember' | string;

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface Board {
  teamId?: string;
  teamName?: string;
  columns?: BoardColumn[];
}

export interface BoardColumn {
  id: string;
  name: string;
  cards?: BoardCard[];
}

export interface BoardCard {
  id: string;
  title: string;
  description?: string;
}
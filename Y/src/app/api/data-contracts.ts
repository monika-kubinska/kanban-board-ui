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
export type ItemType = 'Epic' | 'Story' | 'Defect';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export type ItemState = 'To Do' | 'Ready' | 'In Progress' | 'Code Review' | 'In Test' | 'Ready for Production' | 'Done';
export type EstimationUnit = 'hours' | 'points';

export interface Item {
  id: string;
  title: string;
  type?: ItemType;
  assigneeId?: string;
  assignedUserId?: string;
  state: ItemState;
  estimation?: number;
  estimationUnit?: EstimationUnit;
}

export interface CreateItemInput {
  teamId: string;
  title: string;
  type: ItemType;
  state: ItemState;
  estimation?: number;
  estimationUnit?: EstimationUnit;
}
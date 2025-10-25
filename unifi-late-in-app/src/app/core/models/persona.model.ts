export interface Persona {
  id: PersonaType;
  name: string;
  role: string;
  canEdit: boolean;
  canEditExcused: boolean;
  canEditComment: boolean;
  showAMH: boolean;
  avatar: string;
}

export type PersonaType = 'sm' | 'amh' | 'ops' | 'admin';

export const PERSONAS: Record<PersonaType, Persona> = {
  sm: {
    id: 'sm',
    name: 'Site Manager',
    role: 'Site Manager',
    canEdit: true,
    canEditExcused: true,
    canEditComment: true,
    showAMH: false,
    avatar: 'SM'
  },
  amh: {
    id: 'amh',
    name: 'John Smith',
    role: 'Area Manager',
    canEdit: true,
    canEditExcused: true,
    canEditComment: true,
    showAMH: true,
    avatar: 'AM'
  },
  ops: {
    id: 'ops',
    name: 'Operations User',
    role: 'Operations',
    canEdit: false,
    canEditExcused: false,
    canEditComment: false,
    showAMH: false,
    avatar: 'OP'
  },
  admin: {
    id: 'admin',
    name: 'Admin User',
    role: 'Administrator',
    canEdit: false,
    canEditExcused: false,
    canEditComment: false,
    showAMH: false,
    avatar: 'AD'
  }
};

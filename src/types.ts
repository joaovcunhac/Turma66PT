export interface Grade {
  otimo: number;
  bom: number;
  regular: number;
  finalGrade: number;
  procedure?: string;
  observations?: string;
  professor?: string;
  postgradStudents?: string;
}

export interface SessionInfo {
  postgradStudents: string;
  professor: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  registration: string;
  pairId?: string;
  classId?: string;
  lastUpdated?: string;
  grades: {
    [date: string]: Grade;
  };
}

export interface Class {
  id: string;
  name: string;
  year: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  studentId: string;
  studentName: string;
  action: 'create_grade' | 'update_grade' | 'delete_grade' | 'update_student' | 'delete_student';
  details: any;
}

export interface GradingRule {
  otimo: number;
  bom: number;
  regular: number;
  grade: number;
}

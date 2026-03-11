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
  grades: {
    [date: string]: Grade;
  };
}

export interface GradingRule {
  otimo: number;
  bom: number;
  regular: number;
  grade: number;
}

import React, { useState, useMemo, useEffect } from 'react';
import { Search, User, Users, Plus, ChevronRight, Star, Calendar, Trash2, ArrowLeft, Save, ClipboardList, UserCheck, Settings, Edit2, X, UserPlus, ShieldCheck, Download, Loader2, HelpCircle, LogOut, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Grade, GradingRule, SessionInfo, AuditLog } from './types';
import { GRADING_RULES, MOCK_STUDENTS } from './constants';
import { WelcomeModal } from './components/WelcomeModal';
import { db, auth, signInAnonymously } from './lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Session Setup State
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [tempSession, setTempSession] = useState({ postgradStudents: '', professor: '' });

  // Grading state
  const [currentEval, setCurrentEval] = useState<('O' | 'B' | 'R')[]>(Array(5).fill('O'));
  const [procedure, setProcedure] = useState('');
  const [observations, setObservations] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

  // Admin Editing State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingGrade, setEditingGrade] = useState<{ date: string, grade: Grade } | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', registration: '', pairId: '' });

  // Firebase Auth and Students Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    const unsubscribeStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
      setStudents(studentsData);
      setIsLoading(false);
    }, (err) => {
      console.error('Firestore Error:', err);
      setError('Erro ao sincronizar dados com o servidor.');
      setIsLoading(false);
    });

    try {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setIsWelcomeModalOpen(true);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }

    return () => {
      unsubscribeAuth();
      unsubscribeStudents();
    };
  }, []);

  // Seed initial data if database is empty - only if truly empty
  useEffect(() => {
    if (students.length === 0 && !isLoading) {
      // Small timeout to ensure no race conditions with data loading
      const timeout = setTimeout(() => {
        if (students.length === 0) seedInitialData();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [students.length, isLoading]);

  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);
      MOCK_STUDENTS.forEach((student) => {
        const docRef = doc(db, 'students', student.id);
        batch.set(docRef, student);
      });
      await batch.commit();
      setSuccess('Dados iniciais carregados com sucesso.');
    } catch (err) {
      console.error('Failed to seed data:', err);
    }
  };

  const logAudit = async (action: AuditLog['action'], student: Student, details: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'audit_logs'), {
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email || 'unknown',
        studentId: student.id,
        studentName: student.name,
        action,
        details
      });
    } catch (err) {
      console.error('Audit Log Error:', err);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.registration.includes(searchTerm)
    );
  }, [students, searchTerm]);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedStudentId), 
  [students, selectedStudentId]);

  const pairStudent = useMemo(() => {
    if (!selectedStudent?.pairId) return null;
    return students.find(s => s.id === selectedStudent.pairId);
  }, [students, selectedStudent]);

  const calculateGrade = (evals: ('O' | 'B' | 'R')[]): Grade => {
    const otimo = evals.filter(e => e === 'O').length;
    const bom = evals.filter(e => e === 'B').length;
    const regular = evals.filter(e => e === 'R').length;
    
    const rule = GRADING_RULES.find(r => r.otimo === otimo && r.bom === bom && r.regular === regular);
    return {
      otimo,
      bom,
      regular,
      finalGrade: rule ? rule.grade : 0,
      procedure,
      observations,
      professor: sessionInfo?.professor,
      postgradStudents: sessionInfo?.postgradStudents
    };
  };

  const currentCalculatedGrade = useMemo(() => calculateGrade(currentEval), [currentEval, procedure, observations]);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSession.postgradStudents.toLowerCase() === 'admin' && tempSession.professor.toLowerCase() === 'admin') {
      setIsAdmin(true);
      setSessionInfo({
        postgradStudents: 'Administrador',
        professor: 'Administrador',
        date: new Date().toLocaleDateString('pt-BR')
      });
      return;
    }

    if (tempSession.postgradStudents && tempSession.professor) {
      setSessionInfo({
        ...tempSession,
        date: new Date().toLocaleDateString('pt-BR')
      });
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedStudentId || !selectedStudent) return;
    setIsSaving(true);
    
    // Format manual date to pt-BR
    const [year, month, day] = manualDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const fullDate = `${formattedDate} ${time}`;
    const newGrade = currentCalculatedGrade;

    try {
      const studentDocRef = doc(db, 'students', selectedStudentId);
      const updatedGrades = { ...selectedStudent.grades, [fullDate]: newGrade };
      await updateDoc(studentDocRef, { grades: updatedGrades });
      
      await logAudit('create_grade', selectedStudent, { date: fullDate, grade: newGrade });

      // Sync with pair
      if (selectedStudent.pairId) {
        const pairDocRef = doc(db, 'students', selectedStudent.pairId);
        const pair = students.find(s => s.id === selectedStudent.pairId);
        if (pair) {
          const pairGrades = { ...pair.grades, [fullDate]: newGrade };
          await updateDoc(pairDocRef, { grades: pairGrades });
          await logAudit('create_grade', pair, { date: fullDate, grade: newGrade, syncedFrom: selectedStudentId });
        }
      }

      showSuccess('Avaliação salva com sucesso!');
      setIsGradingModalOpen(false);
      setProcedure('');
      setObservations('');
      setManualDate(new Date().toISOString().split('T')[0]);
      setCurrentEval(Array(5).fill('O'));
    } catch (err) {
      console.error('Failed to save grade:', err);
      showError('Erro ao salvar avaliação.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeGrade = async (date: string) => {
    if (!selectedStudentId || !selectedStudent) return;
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    
    try {
      const studentDocRef = doc(db, 'students', selectedStudentId);
      const newGrades = { ...selectedStudent.grades };
      delete newGrades[date];
      await updateDoc(studentDocRef, { grades: newGrades });
      await logAudit('delete_grade', selectedStudent, { date });

      if (selectedStudent.pairId) {
        const pairDocRef = doc(db, 'students', selectedStudent.pairId);
        const pair = students.find(s => s.id === selectedStudent.pairId);
        if (pair) {
          const pairGrades = { ...pair.grades };
          delete pairGrades[date];
          await updateDoc(pairDocRef, { grades: pairGrades });
          await logAudit('delete_grade', pair, { date, syncedFrom: selectedStudentId });
        }
      }
      showSuccess('Avaliação removida.');
    } catch (err) {
      console.error('Failed to remove grade:', err);
      showError('Erro ao remover avaliação.');
    }
  };

  const handleAdminUpdateStudent = async () => {
    if (!editingStudent) return;
    try {
      const docRef = doc(db, 'students', editingStudent.id);
      await setDoc(docRef, editingStudent);
      await logAudit('update_student', editingStudent, { fields: Object.keys(editingStudent) });
      showSuccess('Aluno atualizado.');
      setEditingStudent(null);
    } catch (err) {
      showError('Erro ao atualizar aluno.');
    }
  };

  const handleAdminUpdateGrade = async () => {
    if (!editingGrade || !selectedStudentId || !selectedStudent) return;
    try {
      const studentDocRef = doc(db, 'students', selectedStudentId);
      const updatedGrades = { ...selectedStudent.grades, [editingGrade.date]: editingGrade.grade };
      await updateDoc(studentDocRef, { grades: updatedGrades });
      await logAudit('update_grade', selectedStudent, { date: editingGrade.date, grade: editingGrade.grade });

      if (selectedStudent.pairId) {
        const pairDocRef = doc(db, 'students', selectedStudent.pairId);
        const pair = students.find(s => s.id === selectedStudent.pairId);
        if (pair) {
          const pairGrades = { ...pair.grades, [editingGrade.date]: editingGrade.grade };
          await updateDoc(pairDocRef, { grades: pairGrades });
          await logAudit('update_grade', pair, { date: editingGrade.date, grade: editingGrade.grade, syncedFrom: selectedStudentId });
        }
      }
      showSuccess('Avaliação atualizada.');
      setEditingGrade(null);
    } catch (err) {
      showError('Erro ao atualizar avaliação.');
    }
  };

  const handleAddStudent = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const student: Student = {
      id,
      name: newStudent.name,
      registration: newStudent.registration,
      pairId: newStudent.pairId || undefined,
      grades: {}
    };
    try {
      await setDoc(doc(db, 'students', id), student);
      showSuccess('Aluno adicionado.');
      setIsAddingStudent(false);
      setNewStudent({ name: '', registration: '', pairId: '' });
    } catch (err) {
      showError('Erro ao adicionar aluno.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteDoc(doc(db, 'students', id));
        showSuccess('Aluno excluído.');
        if (selectedStudentId === id) setSelectedStudentId(null);
      } catch (err) {
        showError('Erro ao excluir aluno.');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Matrícula', 'Nome', 'Data', 'O', 'B', 'R', 'Nota Final', 'Procedimento', 'Professor', 'Pós-Graduação', 'Observações'];
    const rows: string[][] = [];

    students.forEach(student => {
      Object.entries(student.grades).forEach(([date, gradeData]) => {
        const grade = gradeData as Grade;
        rows.push([
          student.registration,
          student.name,
          date,
          grade.otimo.toString(),
          grade.bom.toString(),
          grade.regular.toString(),
          grade.finalGrade.toString(),
          (grade.procedure || '').replace(/,/g, ';'),
          (grade.professor || '').replace(/,/g, ';'),
          (grade.postgradStudents || '').replace(/,/g, ';'),
          (grade.observations || '').replace(/,/g, ';')
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `notas_protese_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBackup = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup_protese_total_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
    try {
      localStorage.setItem('hasSeenWelcome', 'true');
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#0071E3] animate-spin" />
          <p className="text-[#86868B] font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F7]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mac-card w-full max-w-md p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm flex items-center gap-2"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Created by</span>
              <span className="text-sm font-black text-[#1D1D1F] tracking-tight">@joaovictorcunhac</span>
            </motion.div>
            <div className="w-20 h-20 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
              <ClipboardList size={40} />
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1F]">Configuração da Sessão</h1>
            <p className="text-[#86868B] text-center mt-2">Inicie a clínica preenchendo as informações dos responsáveis.</p>
          </div>

          <form onSubmit={handleStartSession} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Professor Responsável</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B] w-5 h-5" />
                <input 
                  type="text" 
                  required
                  placeholder="Nome do Professor" 
                  className="mac-input pl-10"
                  value={tempSession.professor}
                  onChange={(e) => setTempSession({ ...tempSession, professor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Alunos de Pós-Graduação Presentes</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-[#86868B] w-5 h-5" />
                <textarea 
                  required
                  placeholder="Nomes dos alunos de pós..." 
                  className="mac-input pl-10 h-24 pt-2 resize-none"
                  value={tempSession.postgradStudents}
                  onChange={(e) => setTempSession({ ...tempSession, postgradStudents: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="mac-button-primary w-full py-3 text-lg">
              Iniciar Clínica
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desenvolvido por</span>
              <span className="text-xs font-bold text-[#0071E3]">@joaovictorcunhac</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col">
      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-green-500 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <UserCheck size={18} />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-red-500 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <X size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Prótese Total Turma 66</h1>
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">By</span>
              <span className="text-[10px] font-black text-[#1D1D1F]">@joaovictorcunhac</span>
            </div>
            <button 
              onClick={() => {
                setSessionInfo(null);
                setIsAdmin(false);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-[#86868B] transition-colors"
              title="Configurações da Sessão"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => setIsWelcomeModalOpen(true)}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-[#86868B] transition-colors"
              title="Instruções de Uso"
            >
              <HelpCircle size={18} />
            </button>
            <button 
              onClick={exportToCSV}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-[#0071E3] transition-colors"
              title="Exportar CSV"
            >
              <FileDown size={18} />
            </button>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-200">
                  <ShieldCheck size={14} />
                  Modo Admin
                </div>
                <button 
                  onClick={downloadBackup}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-200 hover:bg-blue-200 transition-colors"
                  title="Baixar Backup Semanal"
                >
                  <Download size={14} />
                  Backup
                </button>
              </div>
            )}
          </div>
          <p className="text-[#86868B]">Sistema de Avaliação Clínica • {sessionInfo.date}</p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="glass px-3 py-2 rounded-xl text-xs flex items-center gap-2">
              <UserCheck size={14} className="text-[#0071E3]" />
              <span className="font-semibold text-[#1D1D1F]">Professor:</span>
              <span className="text-[#86868B]">{sessionInfo.professor}</span>
            </div>
            <div className="glass px-3 py-2 rounded-xl text-xs flex items-center gap-2">
              <Users size={14} className="text-[#0071E3]" />
              <span className="font-semibold text-[#1D1D1F]">Pós-Graduação:</span>
              <span className="text-[#86868B] truncate max-w-[200px]">{sessionInfo.postgradStudents}</span>
            </div>
          </div>
        </div>
        
        {!selectedStudentId && (
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar aluno..." 
                className="mac-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsAddingStudent(true)}
                className="mac-button-primary p-2 flex items-center justify-center aspect-square"
                title="Adicionar Aluno"
              >
                <UserPlus size={24} />
              </button>
            )}
          </div>
        )}
      </header>

      <main>
        <AnimatePresence mode="wait">
          {!selectedStudentId ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredStudents.map(student => (
                <div 
                  key={student.id} 
                  onClick={() => setSelectedStudentId(student.id)}
                  className="mac-card cursor-pointer group relative"
                >
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3]">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-[#86868B]">{student.registration}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-[#D2D2D7] group-hover:text-[#86868B] transition-colors" />
                  </div>
                  
                  {student.pairId && (
                    <div className="mt-4 pt-4 border-t border-[#D2D2D7]/30 flex items-center gap-2 text-sm text-[#86868B]">
                      <Users size={16} />
                      <span>Dupla: {students.find(s => s.id === student.pairId)?.name}</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F]">
                      {Object.keys(student.grades).length} Avaliações
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setSelectedStudentId(null)}
                className="flex items-center gap-2 text-[#0071E3] font-medium hover:underline mb-4"
              >
                <ArrowLeft size={20} />
                Voltar para lista
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="mac-card relative">
                    {isAdmin && (
                      <button 
                        onClick={() => setEditingStudent(selectedStudent || null)}
                        className="absolute top-4 right-4 p-2 text-[#0071E3] hover:bg-[#0071E3]/10 rounded-full transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] mb-4">
                        <User size={48} />
                      </div>
                      <h2 className="text-2xl font-bold">{selectedStudent?.name}</h2>
                      <p className="text-[#86868B]">{selectedStudent?.registration}</p>
                    </div>

                    {pairStudent && (
                      <div className="mt-6 p-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#86868B] mb-2 uppercase tracking-wider">
                          <Users size={14} />
                          Dupla Vinculada
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0071E3] border border-[#D2D2D7]">
                            <User size={16} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{pairStudent.name}</p>
                            <p className="text-xs text-[#86868B]">{pairStudent.registration}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-[10px] text-[#86868B] italic">
                          * As notas serão sincronizadas automaticamente entre a dupla.
                        </p>
                      </div>
                    )}

                    <button 
                      onClick={() => setIsGradingModalOpen(true)}
                      className="mac-button-primary w-full mt-6 flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Nova Avaliação
                    </button>
                  </div>
                </div>

                {/* Grades History */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calendar size={20} />
                    Histórico de Notas
                  </h3>

                  {Object.keys(selectedStudent?.grades || {}).length === 0 ? (
                    <div className="mac-card flex flex-col items-center justify-center py-12 text-[#86868B]">
                      <Star size={48} className="mb-4 opacity-20" />
                      <p>Nenhuma avaliação registrada ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(Object.entries(selectedStudent?.grades || {}) as [string, Grade][]).sort((a, b) => b[0].localeCompare(a[0])).map(([date, grade]) => (
                        <div key={date} className="mac-card space-y-4 relative group">
                          {isAdmin && (
                            <button 
                              onClick={() => setEditingGrade({ date, grade })}
                              className="absolute top-4 right-12 p-2 text-[#0071E3] hover:bg-[#0071E3]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-center px-3 border-r border-[#D2D2D7]">
                                <p className="text-xs text-[#86868B] uppercase font-bold">Data/Hora</p>
                                <p className="font-medium text-sm">{date}</p>
                              </div>
                              <div className="flex gap-4">
                                <div className="text-center">
                                  <p className="text-[10px] text-[#86868B]">Ótimo</p>
                                  <p className="font-semibold text-green-600">{grade.otimo}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] text-[#86868B]">Bom</p>
                                  <p className="font-semibold text-blue-600">{grade.bom}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] text-[#86868B]">Regular</p>
                                  <p className="font-semibold text-orange-600">{grade.regular}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-[#86868B]">Nota Final</p>
                                <p className="text-2xl font-bold text-[#0071E3]">{grade.finalGrade.toLocaleString('pt-BR')}</p>
                              </div>
                              <button 
                                onClick={() => removeGrade(date)}
                                className="p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                          {(grade.procedure || grade.observations || grade.professor || grade.postgradStudents) && (
                            <div className="pt-4 border-t border-[#D2D2D7]/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {grade.procedure && (
                                <div>
                                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Procedimento</p>
                                  <p className="text-sm text-[#1D1D1F] bg-[#F5F5F7] p-2 rounded-lg">{grade.procedure}</p>
                                </div>
                              )}
                              {grade.observations && (
                                <div>
                                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Observações</p>
                                  <p className="text-sm text-[#1D1D1F] bg-[#F5F5F7] p-2 rounded-lg">{grade.observations}</p>
                                </div>
                              )}
                              {grade.professor && (
                                <div>
                                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Professor Responsável</p>
                                  <div className="flex items-center gap-2 text-xs text-[#1D1D1F] bg-[#F5F5F7] p-2 rounded-lg">
                                    <UserCheck size={12} className="text-[#0071E3]" />
                                    {grade.professor}
                                  </div>
                                </div>
                              )}
                              {grade.postgradStudents && (
                                <div>
                                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Pós-Graduação Presente</p>
                                  <div className="flex items-center gap-2 text-xs text-[#1D1D1F] bg-[#F5F5F7] p-2 rounded-lg">
                                    <Users size={12} className="text-[#0071E3]" />
                                    {grade.postgradStudents}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <WelcomeModal 
        isOpen={isWelcomeModalOpen} 
        onClose={closeWelcomeModal} 
      />

      {/* Grading Modal */}
      <AnimatePresence>
        {isGradingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGradingModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Nova Avaliação</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side: Criteria */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-[#86868B] uppercase tracking-wider">Critérios de Avaliação</p>
                    {[
                      'Pontualidade',
                      'Organização',
                      'Material/Biossegurança',
                      'Conhecimento (Teórico, Prático)',
                      'Execução do Procedimento'
                    ].map((label, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#F5F5F7] p-3 rounded-xl">
                        <span className="font-medium text-sm">{label}</span>
                        <div className="flex gap-1">
                          {(['O', 'B', 'R'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                const next = [...currentEval];
                                next[idx] = type;
                                setCurrentEval(next);
                              }}
                              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                                currentEval[idx] === type 
                                  ? type === 'O' ? 'bg-green-500 text-white' : type === 'B' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                                  : 'bg-white text-[#86868B] hover:bg-gray-100'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Side: Notes */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Procedimento do Dia</label>
                      <textarea 
                        placeholder="Descreva o procedimento realizado..." 
                        className="mac-input h-24 pt-2 resize-none"
                        value={procedure}
                        onChange={(e) => setProcedure(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Observações</label>
                      <textarea 
                        placeholder="Observações adicionais..." 
                        className="mac-input h-24 pt-2 resize-none"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Data da Avaliação</label>
                      <input 
                        type="date" 
                        className="mac-input"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0071E3]/5 border border-[#0071E3]/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#0071E3] font-bold uppercase">Nota Calculada</p>
                    <div className="flex gap-2 text-[10px] text-[#86868B] mt-1">
                      <span>{currentCalculatedGrade.otimo} Ótimo</span>
                      <span>•</span>
                      <span>{currentCalculatedGrade.bom} Bom</span>
                      <span>•</span>
                      <span>{currentCalculatedGrade.regular} Regular</span>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-[#0071E3]">
                    {currentCalculatedGrade.finalGrade.toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsGradingModalOpen(false)}
                    className="mac-button-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveGrade}
                    disabled={isSaving}
                    className="mac-button-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Salvando...' : 'Salvar Nota'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Edit Student Modal */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Editar Aluno</h2>
                <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Matrícula</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    value={editingStudent.registration}
                    onChange={(e) => setEditingStudent({ ...editingStudent, registration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">ID da Dupla (Opcional)</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    value={editingStudent.pairId || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, pairId: e.target.value || undefined })}
                    placeholder="ID do outro aluno"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setEditingStudent(null)}
                    className="mac-button-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAdminUpdateStudent}
                    className="mac-button-primary flex-1"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Edit Grade Modal */}
        {editingGrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingGrade(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Editar Avaliação</h2>
                <button onClick={() => setEditingGrade(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Nota Final</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="mac-input"
                      value={editingGrade.grade.finalGrade}
                      onChange={(e) => setEditingGrade({ 
                        ...editingGrade, 
                        grade: { ...editingGrade.grade, finalGrade: parseFloat(e.target.value) || 0 } 
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#86868B] uppercase">Ótimo</label>
                      <input 
                        type="number" 
                        className="mac-input py-1 px-2"
                        value={editingGrade.grade.otimo}
                        onChange={(e) => setEditingGrade({ 
                          ...editingGrade, 
                          grade: { ...editingGrade.grade, otimo: parseInt(e.target.value) || 0 } 
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#86868B] uppercase">Bom</label>
                      <input 
                        type="number" 
                        className="mac-input py-1 px-2"
                        value={editingGrade.grade.bom}
                        onChange={(e) => setEditingGrade({ 
                          ...editingGrade, 
                          grade: { ...editingGrade.grade, bom: parseInt(e.target.value) || 0 } 
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#86868B] uppercase">Regular</label>
                      <input 
                        type="number" 
                        className="mac-input py-1 px-2"
                        value={editingGrade.grade.regular}
                        onChange={(e) => setEditingGrade({ 
                          ...editingGrade, 
                          grade: { ...editingGrade.grade, regular: parseInt(e.target.value) || 0 } 
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Professor Responsável</label>
                    <input 
                      type="text" 
                      className="mac-input"
                      value={editingGrade.grade.professor || ''}
                      onChange={(e) => setEditingGrade({ 
                        ...editingGrade, 
                        grade: { ...editingGrade.grade, professor: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Pós-Graduação</label>
                    <textarea 
                      className="mac-input h-20 pt-2 resize-none"
                      value={editingGrade.grade.postgradStudents || ''}
                      onChange={(e) => setEditingGrade({ 
                        ...editingGrade, 
                        grade: { ...editingGrade.grade, postgradStudents: e.target.value } 
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Procedimento</label>
                    <textarea 
                      className="mac-input h-32 pt-2 resize-none"
                      value={editingGrade.grade.procedure || ''}
                      onChange={(e) => setEditingGrade({ 
                        ...editingGrade, 
                        grade: { ...editingGrade.grade, procedure: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Observações</label>
                    <textarea 
                      className="mac-input h-32 pt-2 resize-none"
                      value={editingGrade.grade.observations || ''}
                      onChange={(e) => setEditingGrade({ 
                        ...editingGrade, 
                        grade: { ...editingGrade.grade, observations: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  onClick={() => setEditingGrade(null)}
                  className="mac-button-secondary flex-1"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAdminUpdateGrade}
                  className="mac-button-primary flex-1"
                >
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Add Student Modal */}
        {isAddingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingStudent(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Adicionar Novo Aluno</h2>
                <button onClick={() => setIsAddingStudent(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="Ex: João Silva"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">Matrícula</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="Ex: 2023001"
                    value={newStudent.registration}
                    onChange={(e) => setNewStudent({ ...newStudent, registration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#86868B] uppercase tracking-wider ml-1">ID da Dupla (Opcional)</label>
                  <input 
                    type="text" 
                    className="mac-input"
                    placeholder="ID do parceiro"
                    value={newStudent.pairId}
                    onChange={(e) => setNewStudent({ ...newStudent, pairId: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAddingStudent(false)}
                    className="mac-button-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddStudent}
                    className="mac-button-primary flex-1"
                  >
                    Adicionar Aluno
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
      
      <footer className="mt-auto py-8 flex flex-col items-center gap-2">
        <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Developed by</span>
          <span className="text-sm font-bold text-[#1D1D1F] tracking-tight">@joaovictorcunhac</span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium">© 2024 • Sistema de Avaliação Clínica</p>
      </footer>
    </div>
  );
}

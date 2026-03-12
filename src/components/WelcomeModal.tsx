import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, CheckCircle2, HelpCircle, Instagram } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#0071E3]/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0071E3]/20">
                    <Info size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F]">Bem-vindo!</h2>
                    <p className="text-sm text-[#86868B]">Instruções de uso do sistema</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#86868B]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="mt-1 text-[#0071E3] shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F] text-sm">Início da Sessão</p>
                    <p className="text-sm text-[#86868B] leading-relaxed">Preencha o nome do professor e alunos de pós-graduação para começar a clínica.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 text-[#0071E3] shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F] text-sm">Avaliação de Alunos</p>
                    <p className="text-sm text-[#86868B] leading-relaxed">Selecione um aluno e use o botão "Nova Avaliação". As notas são sincronizadas automaticamente entre as duplas.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 text-[#0071E3] shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F] text-sm">Critérios de Nota</p>
                    <p className="text-sm text-[#86868B] leading-relaxed">Avalie cada critério como Ótimo (O), Bom (B) ou Regular (R). O sistema calcula a nota final automaticamente.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="mt-1 text-amber-600 shrink-0">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">Dúvidas ou Suporte?</p>
                    <p className="text-sm text-amber-800 leading-relaxed">Qualquer dúvida, entre em contato com o desenvolvedor pelo Instagram:</p>
                    <a 
                      href="https://instagram.com/joaovictorcunhac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-[#0071E3] font-bold hover:underline"
                    >
                      <Instagram size={14} />
                      @joaovictorcunhac
                    </a>
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold rounded-2xl shadow-lg shadow-[#0071E3]/20 transition-all active:scale-[0.98]"
              >
                Entendi, vamos começar!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

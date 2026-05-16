import { GradingRule } from "./types";

export const GRADING_RULES: GradingRule[] = [
  { otimo: 5, bom: 0, regular: 0, grade: 10 },
  { otimo: 4, bom: 1, regular: 0, grade: 9.5 },
  { otimo: 4, bom: 0, regular: 1, grade: 9 },
  { otimo: 3, bom: 2, regular: 0, grade: 9 },
  { otimo: 3, bom: 1, regular: 1, grade: 8.5 },
  { otimo: 3, bom: 0, regular: 2, grade: 8 },
  { otimo: 2, bom: 3, regular: 0, grade: 8.5 },
  { otimo: 2, bom: 2, regular: 1, grade: 8 },
  { otimo: 2, bom: 1, regular: 2, grade: 7.5 },
  { otimo: 2, bom: 0, regular: 3, grade: 7 },
  { otimo: 1, bom: 4, regular: 0, grade: 8 },
  { otimo: 1, bom: 3, regular: 1, grade: 7.5 },
  { otimo: 1, bom: 2, regular: 2, grade: 7 },
  { otimo: 1, bom: 1, regular: 3, grade: 6.5 },
  { otimo: 1, bom: 0, regular: 4, grade: 6 },
  { otimo: 0, bom: 5, regular: 0, grade: 7.5 },
  { otimo: 0, bom: 4, regular: 1, grade: 7 },
  { otimo: 0, bom: 3, regular: 2, grade: 6.5 },
  { otimo: 0, bom: 2, regular: 3, grade: 6 },
  { otimo: 0, bom: 1, regular: 4, grade: 5.5 },
  { otimo: 0, bom: 0, regular: 5, grade: 5 },
];

export const MOCK_STUDENTS = [
  { 
    id: "1a", 
    name: "Rafaela Andrade", 
    registration: "T66-001", 
    grades: {
      "17/04/2026 15:30": {
        otimo: 5, bom: 0, regular: 0, finalGrade: 10,
        procedure: "Prova montagem dos dentes",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "1b" 
  },
  { 
    id: "1b", 
    name: "Luma Cavale Christofoleti", 
    registration: "T66-002", 
    grades: {
      "17/04/2026 15:30": {
        otimo: 5, bom: 0, regular: 0, finalGrade: 10,
        procedure: "Prova montagem dos dentes",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "1a" 
  },
  { id: "2a", name: "Bianca Hiramatsu Ogata", registration: "T66-003", grades: {}, pairId: "2b" },
  { id: "2b", name: "Laura Pereira Colobiale", registration: "T66-004", grades: {}, pairId: "2a" },
  { id: "3a", name: "Thainá Olivo Alves", registration: "T66-005", grades: {}, pairId: "3b" },
  { id: "3b", name: "Lavinya Santos Fonseca", registration: "T66-006", grades: {}, pairId: "3a" },
  { id: "4a", name: "Júlia Paoletti Fogari", registration: "T66-007", grades: {}, pairId: "4b" },
  { id: "4b", name: "Lissandra Crispim de Faria Cruz", registration: "T66-008", grades: {}, pairId: "4a" },
  { id: "5a", name: "Luísa Batista Cavalcante Ribeiro", registration: "T66-009", grades: {}, pairId: "5b" },
  { id: "5b", name: "Bianca Marques Souza", registration: "T66-010", grades: {}, pairId: "5a" },
  { id: "6a", name: "Lívia Nadylena Da Silva Lima", registration: "T66-011", grades: {}, pairId: "6b" },
  { id: "6b", name: "Fernanda Soares Andrade", registration: "T66-012", grades: {}, pairId: "6a" },
  { id: "7a", name: "Erick Sampaio Ribeiro da Silva", registration: "T66-013", grades: {}, pairId: "7b" },
  { id: "7b", name: "Thalita De Carvalho Santos", registration: "T66-014", grades: {}, pairId: "7a" },
  { 
    id: "8a", 
    name: "Maria Luiza Vieira Guidi", 
    registration: "T66-015", 
    grades: {
      "16/04/2026 14:06": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Prova dos dentes ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "8b" 
  },
  { 
    id: "8b", 
    name: "Allana Domingues Ferracioli", 
    registration: "T66-016", 
    grades: {
      "16/04/2026 14:06": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Prova dos dentes ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "8a" 
  },
  { 
    id: "9a", 
    name: "Beatriz de Barros Simões", 
    registration: "T66-017", 
    grades: {
      "16/04/2026 14:03": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Atualização do caso ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "9b" 
  },
  { 
    id: "9b", 
    name: "Ester Nathália Da Fonseca Pereira", 
    registration: "T66-018", 
    grades: {
      "16/04/2026 14:03": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Atualização do caso ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "9a" 
  },
  { 
    id: "10a", 
    name: "Sayadh Malki Jibrail Siryani", 
    registration: "T66-019", 
    grades: {
      "17/04/2026 15:33": {
        otimo: 3, bom: 2, regular: 0, finalGrade: 9,
        procedure: "Ajuste plano de cera",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "10b" 
  },
  { 
    id: "10b", 
    name: "Leonardo Pagotto Spinace", 
    registration: "T66-020", 
    grades: {
      "17/04/2026 15:33": {
        otimo: 3, bom: 2, regular: 0, finalGrade: 9,
        procedure: "Ajuste plano de cera",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "10a" 
  },
  { id: "11a", name: "Marina Martelini Malta", registration: "T66-021", grades: {}, pairId: "11b" },
  { id: "11b", name: "Isabela Fernanda Castilho", registration: "T66-022", grades: {}, pairId: "11a" },
  { 
    id: "12a", 
    name: "Ettore Freitas Callegaro", 
    registration: "T66-023", 
    grades: {
      "16/04/2026 14:04": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Moldagem funcional superior ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "12b" 
  },
  { 
    id: "12b", 
    name: "Isabella Julia Silva", 
    registration: "T66-024", 
    grades: {
      "16/04/2026 14:04": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Moldagem funcional superior ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "12a" 
  },
  { id: "13a", name: "Luiza Cristina Rodrigues", registration: "T66-025", grades: {}, pairId: "13b" },
  { id: "13b", name: "Paola Fernandes do Nascimento", registration: "T66-026", grades: {}, pairId: "13a" },
  { id: "14a", name: "Ursula Modesto Sandi", registration: "T66-027", grades: {}, pairId: "14b" },
  { id: "14b", name: "Daniela Buenos Ayres de Castro", registration: "T66-028", grades: {}, pairId: "14a" },
  { id: "15a", name: "Nathalia Ayumi Costillas Sasaki", registration: "T66-029", grades: {}, pairId: "15b" },
  { id: "15b", name: "Matheus Bacco De Luca", registration: "T66-030", grades: {}, pairId: "15a" },
  { id: "16a", name: "Mariana Nery dos Santos Machado", registration: "T66-031", grades: {}, pairId: "16b" },
  { id: "16b", name: "Roberta Grigolli", registration: "T66-032", grades: {}, pairId: "16a" },
  { id: "17a", name: "Cesar Henrique Sanches Guedes", registration: "T66-033", grades: {}, pairId: "17b" },
  { id: "17b", name: "Hugo Murylo Teixeira", registration: "T66-034", grades: {}, pairId: "17a" },
  { id: "18a", name: "Nathália Rohwedder dos Santos", registration: "T66-035", grades: {}, pairId: "18b" },
  { id: "18b", name: "Giovanna Ribeiro Teixeira", registration: "T66-036", grades: {}, pairId: "18a" },
  { id: "19a", name: "Maria Júlia Fontes Pavanello", registration: "T66-037", grades: {}, pairId: "19b" },
  { id: "19b", name: "Yasmin Samara Santos", registration: "T66-038", grades: {}, pairId: "19a" },
  { 
    id: "20a", 
    name: "Isadora Pousa Faria", 
    registration: "T66-039", 
    grades: {
      "17/04/2026 15:31": {
        otimo: 3, bom: 1, regular: 1, finalGrade: 8.5,
        procedure: "Arco gotico de gysi",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "20b" 
  },
  { 
    id: "20b", 
    name: "Giulia Medeiros", 
    registration: "T66-040", 
    grades: {
      "17/04/2026 15:31": {
        otimo: 3, bom: 1, regular: 1, finalGrade: 8.5,
        procedure: "Arco gotico de gysi",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "20a" 
  },
  { id: "21a", name: "Livia Gimenez Jardim", registration: "T66-041", grades: {}, pairId: "21b" },
  { id: "21b", name: "Ligia Marques De Oliveira Da Silva", registration: "T66-042", grades: {}, pairId: "21a" },
  { 
    id: "22a", 
    name: "Beatriz Cristina Cabeza", 
    registration: "T66-043", 
    grades: {
      "16/04/2026 14:05": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Relacionamento MM e Montagem em ASA ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "22b" 
  },
  { 
    id: "22b", 
    name: "Davi Maia de Arruda", 
    registration: "T66-044", 
    grades: {
      "16/04/2026 14:05": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Relacionamento MM e Montagem em ASA ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "22a" 
  },
  { 
    id: "23a", 
    name: "Sara Costa da Silva", 
    registration: "T66-045", 
    grades: {
      "16/04/2026 14:06": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Refez arco gótico e remontagem do inferior ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      },
      "16/04/2026 14:08": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Moldagem funcional ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "23b" 
  },
  { 
    id: "23b", 
    name: "Clara Teixeira Mendes Ono", 
    registration: "T66-046", 
    grades: {
      "16/04/2026 14:06": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Refez arco gótico e remontagem do inferior ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      },
      "16/04/2026 14:08": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "Moldagem funcional ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "23a" 
  },
  { 
    id: "24a", 
    name: "Isaura Cristina da Silva Saldanha", 
    registration: "T66-047", 
    grades: {
      "16/04/2026 14:08": {
        otimo: 0, bom: 4, regular: 1, finalGrade: 7,
        procedure: "Arco Gótico ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      },
      "17/04/2026 15:31": {
        otimo: 4, bom: 1, regular: 0, finalGrade: 9.5,
        procedure: "FINALIZARAM RC ",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "24b" 
  },
  { 
    id: "24b", 
    name: "Vitória França Bícego", 
    registration: "T66-048", 
    grades: {
      "16/04/2026 14:08": {
        otimo: 0, bom: 4, regular: 1, finalGrade: 7,
        procedure: "Arco Gótico ",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      },
      "17/04/2026 15:31": {
        otimo: 4, bom: 1, regular: 0, finalGrade: 9.5,
        procedure: "FINALIZARAM RC ",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "24a" 
  },
  { id: "25a", name: "Maria Eduarda Albino Pereira", registration: "T66-049", grades: {}, pairId: "25b" },
  { id: "25b", name: "Bruno dos Santos", registration: "T66-050", grades: {}, pairId: "25a" },
  { id: "26a", name: "Gabriel Fernandes Patronieri", registration: "T66-051", grades: {}, pairId: "26b" },
  { id: "26b", name: "Luciano Antônio De Castro Ferraz", registration: "T66-052", grades: {}, pairId: "26a" },
  { id: "27a", name: "Fernando Umberto Vaz De Queiroz Neto", registration: "T66-053", grades: {}, pairId: "27b" },
  { id: "27b", name: "Kevin Pedrero Watkins", registration: "T66-054", grades: {}, pairId: "27a" },
  { 
    id: "28a", 
    name: "Victória Maria de Paula Santos", 
    registration: "T66-055", 
    grades: {
      "16/04/2026 14:07": {
        otimo: 2, bom: 2, regular: 1, finalGrade: 8,
        procedure: "",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "28b" 
  },
  { 
    id: "28b", 
    name: "Lucas Adam Prado Julião", 
    registration: "T66-056", 
    grades: {
      "16/04/2026 14:07": {
        otimo: 2, bom: 2, regular: 1, finalGrade: 8,
        procedure: "",
        professor: "Marcelo Mesquita",
        postgradStudents: "Matheus e Robert (14/04/2026)",
        observations: ""
      }
    }, 
    pairId: "28a" 
  },
  { id: "29a", name: "Bruna Celegati Reis", registration: "T66-057", grades: {}, pairId: "29b" },
  { id: "29b", name: "Maria Fernanda Zaccharias Okuyama", registration: "T66-058", grades: {}, pairId: "29a" },
  { id: "2a", name: "Bianca Hiramatsu Ogata", registration: "T66-003", grades: {}, pairId: "2b" },
  { id: "2b", name: "Laura Pereira Colobiale", registration: "T66-004", grades: {}, pairId: "2a" },
  { id: "30a", name: "Ana Luisa Betiolli", registration: "T66-059", grades: {}, pairId: "30b" },
  { id: "30b", name: "Gabriela Kalinsqui Lopes", registration: "T66-060", grades: {}, pairId: "30a" },
  { id: "31a", name: "Leah Marcondes Machado", registration: "T66-061", grades: {}, pairId: "31b" },
  { id: "31b", name: "Camila Fernandes Dantas Wanderley", registration: "T66-062", grades: {}, pairId: "31a" },
  { id: "32a", name: "Altivino Gabriel Pavaneli Calisto", registration: "T66-063", grades: {}, pairId: "32b" },
  { id: "32b", name: "Melina Zambrotti Machado Donatoni", registration: "T66-064", grades: {}, pairId: "32a" },
  { id: "33a", name: "Larissa Reinó de Freitas", registration: "T66-065", grades: {}, pairId: "33b" },
  { id: "33b", name: "Ana Carolina Palombo Siqueira", registration: "T66-066", grades: {}, pairId: "33a" },
  { id: "34a", name: "Manuella Vitoria de Freitas", registration: "T66-067", grades: {}, pairId: "34b" },
  { id: "34b", name: "Giulia Fernanda Abreu Pichinelli", registration: "T66-068", grades: {}, pairId: "34a" },
  { id: "35a", name: "Guilherme de Oliveira Barbosa", registration: "T66-069", grades: {}, pairId: "35b" },
  { id: "35b", name: "Rayssa Zuchi Kasinof", registration: "T66-070", grades: {}, pairId: "35a" },
  { id: "3a", name: "Thainá Olivo Alves", registration: "T66-005", grades: {}, pairId: "3b" },
  { id: "3b", name: "Lavinya Santos Fonseca", registration: "T66-006", grades: {}, pairId: "3a" },
  { id: "4a", name: "Júlia Paoletti Fogari", registration: "T66-007", grades: {}, pairId: "4b" },
  { id: "4b", name: "Lissandra Crispim de Faria Cruz", registration: "T66-008", grades: {}, pairId: "4a" },
  { id: "5a", name: "Luísa Batista Cavalcante Ribeiro", registration: "T66-009", grades: {}, pairId: "5b" },
  { id: "5b", name: "Bianca Marques Souza", registration: "T66-010", grades: {}, pairId: "5a" },
  { id: "6a", name: "Lívia Nadylena Da Silva Lima", registration: "T66-011", grades: {}, pairId: "6b" },
  { id: "6b", name: "Fernanda Soares Andrade", registration: "T66-012", grades: {}, pairId: "6a" },
  { id: "7a", name: "Erick Sampaio Ribeiro da Silva", registration: "T66-013", grades: {}, pairId: "7b" },
  { id: "7b", name: "Thalita De Carvalho Santos", registration: "T66-014", grades: {}, pairId: "7a" },
  { 
    id: "Ra", 
    name: "Miguel Caixeta", 
    registration: "T66-R01", 
    grades: {
      "17/04/2026 15:32": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "Rb" 
  },
  { 
    id: "Rb", 
    name: "Bruno Ryuchi Kamakura", 
    registration: "T66-R02", 
    grades: {
      "17/04/2026 15:32": {
        otimo: 1, bom: 4, regular: 0, finalGrade: 8,
        procedure: "",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    pairId: "Ra" 
  },
  { 
    id: "Rc", 
    name: "Natalia Silva Barroso", 
    registration: "T66-R03", 
    grades: {
      "17/04/2026 15:32": {
        otimo: 5, bom: 0, regular: 0, finalGrade: 10,
        procedure: "Prova dos dentes ",
        professor: "Valentim Barao",
        postgradStudents: "Leticia, Maryana e Joao Calazans",
        observations: ""
      }
    }, 
    // pairId: undefined 
  },
  { id: "Rd", name: "Gisele Silva", registration: "T66-R04", grades: {}, pairId: "Re" },
  { id: "Re", name: "Vanessa Mayumi", registration: "T66-R05", grades: {}, pairId: "Rd" },
];


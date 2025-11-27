export type GradeLevel = 1 | 2 | 3;

export interface CurriculumItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface CurriculumData {
  [key: number]: CurriculumItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface ExampleSentence {
  english: string;
  korean: string;
}

export interface GrammarLesson {
  topic: string;
  summary: string;
  keyPoints: string[];
  examples: ExampleSentence[];
  quiz: QuizQuestion;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
import React, { useState } from 'react';
import { GrammarLesson, QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ArrowLeft, Lightbulb, BookOpenCheck, RotateCcw } from 'lucide-react';

interface LessonViewProps {
  lesson: GrammarLesson;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack }) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleQuizSubmit = (index: number) => {
    if (isQuizSubmitted) return;
    setSelectedQuizOption(index);
    setIsQuizSubmitted(true);
  };

  const handleRetryQuiz = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  }

  const isCorrect = selectedQuizOption === lesson.quiz.correctAnswerIndex;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        커리큘럼으로 돌아가기
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex items-center gap-2 text-indigo-200 mb-2 font-semibold tracking-wide uppercase text-sm">
            <BookOpenCheck className="w-5 h-5" />
            Grammar Point
          </div>
          <h1 className="text-3xl font-bold mb-2">{lesson.topic}</h1>
          <p className="text-indigo-100 text-lg opacity-90">{lesson.summary}</p>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Key Points */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              핵심 포인트
            </h2>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Examples */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">예문으로 익히기</h2>
            <div className="grid gap-4">
              {lesson.examples.map((ex, idx) => (
                <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-indigo-500">
                  <p className="text-lg font-medium text-indigo-900 mb-1 font-serif">"{ex.english}"</p>
                  <p className="text-slate-600">{ex.korean}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quiz */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Pop Quiz!</h2>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-6">
              <p className="text-lg font-medium text-slate-800 mb-6">Q. {lesson.quiz.question}</p>
              
              <div className="space-y-3">
                {lesson.quiz.options.map((option, idx) => {
                  let buttonStyle = "border-slate-200 hover:bg-slate-50 hover:border-indigo-300";
                  let icon = null;

                  if (isQuizSubmitted) {
                    if (idx === lesson.quiz.correctAnswerIndex) {
                      buttonStyle = "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                      icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
                    } else if (idx === selectedQuizOption) {
                      buttonStyle = "bg-red-50 border-red-500 text-red-800";
                      icon = <XCircle className="w-5 h-5 text-red-600" />;
                    } else {
                      buttonStyle = "border-slate-100 text-slate-400 opacity-50";
                    }
                  } else if (selectedQuizOption === idx) {
                     buttonStyle = "border-indigo-500 bg-indigo-50 text-indigo-700";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSubmit(idx)}
                      disabled={isQuizSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${buttonStyle}`}
                    >
                      <span className="font-medium">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isQuizSubmitted && (
                <div className={`mt-6 p-4 rounded-xl flex gap-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{isCorrect ? '정답입니다!' : '오답입니다.'}</h4>
                    <p className="text-sm opacity-90 mb-3">{lesson.quiz.explanation}</p>
                    {!isCorrect && (
                       <button 
                       onClick={handleRetryQuiz}
                       className="text-xs font-semibold underline flex items-center gap-1 hover:opacity-75"
                     >
                       <RotateCcw className="w-3 h-3"/> 다시 풀기
                     </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
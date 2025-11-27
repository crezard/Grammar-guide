import React, { useState } from 'react';
import { GradeLevel, CurriculumItem, GrammarLesson, LoadingState } from './types';
import { CURRICULUM } from './constants';
import { fetchGrammarLesson } from './services/geminiService';
import { TopicCard } from './components/TopicCard';
import { LessonView } from './components/LessonView';
import { GraduationCap, Loader2, Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [activeGrade, setActiveGrade] = useState<GradeLevel>(1);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumItem | null>(null);
  const [lessonData, setLessonData] = useState<GrammarLesson | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleTopicClick = async (item: CurriculumItem) => {
    setSelectedTopic(item);
    setLoadingState(LoadingState.LOADING);
    setErrorMsg('');
    
    try {
      const data = await fetchGrammarLesson(activeGrade, item.title, item.description);
      setLessonData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("AI 선생님이 내용을 불러오는데 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleBackToCurriculum = () => {
    setSelectedTopic(null);
    setLessonData(null);
    setLoadingState(LoadingState.IDLE);
  };

  const currentCurriculum = CURRICULUM[activeGrade] || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">중학영문법<span className="text-indigo-600">마스터</span></span>
          </div>
          <div className="text-xs font-medium text-slate-400 border border-slate-200 px-3 py-1 rounded-full hidden sm:block">
            Powered by Google Gemini 2.5
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If no lesson is loaded, show the curriculum list */}
        {loadingState === LoadingState.IDLE && !selectedTopic && (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                  학년별 맞춤 영문법 커리큘럼
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  중학교 1학년 기초부터 3학년 심화 과정까지.<br className="hidden sm:block"/>
                  AI 선생님과 함께 체계적으로 학습해보세요.
                </p>
              </div>

            {/* Grade Tabs */}
            <div className="flex justify-center mb-10">
              <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
                {[1, 2, 3].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setActiveGrade(grade as GradeLevel)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      activeGrade === grade
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    중학교 {grade}학년
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCurriculum.map((item) => (
                <TopicCard key={item.id} item={item} onClick={handleTopicClick} />
              ))}
            </div>
            
            {/* Empty State / Coming Soon */}
            {currentCurriculum.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <p>아직 등록된 커리큘럼이 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loadingState === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-pulse">
            <div className="bg-white p-4 rounded-full shadow-lg mb-6 relative">
              <Sparkles className="w-10 h-10 text-indigo-500 animate-spin-slow" />
              <div className="absolute inset-0 bg-indigo-200 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">AI 선생님이 수업을 준비하고 있어요</h2>
            <p className="text-slate-500">
              <span className="font-semibold text-indigo-600">{selectedTopic?.title}</span> 내용을 생성 중입니다...
            </p>
          </div>
        )}

        {/* Success State - Lesson View */}
        {loadingState === LoadingState.SUCCESS && lessonData && (
          <LessonView lesson={lessonData} onBack={handleBackToCurriculum} />
        )}

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
             <AlertCircle className="w-16 h-16 text-red-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">오류가 발생했습니다</h3>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <button
              onClick={handleBackToCurriculum}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              목록으로 돌아가기
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
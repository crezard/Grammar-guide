import React from 'react';
import { CurriculumItem } from '../types';
import { BookOpen, ChevronRight } from 'lucide-react';

interface TopicCardProps {
  item: CurriculumItem;
  onClick: (item: CurriculumItem) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="group relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            {item.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2">
          {item.description}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-slate-400 group-hover:text-blue-500">
        <div className="flex items-center gap-1 text-xs">
          <BookOpen className="w-4 h-4" />
          <span>학습하기</span>
        </div>
        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
import React from 'react';
import type { Level } from '../types';
import LockIcon from '../components/icons/LockIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import ProgressBar from '../components/ProgressBar';
import { playSound } from '../utils/sounds';

interface HomeScreenProps {
  levels: Level[];
  onSelectLevel: (levelId: number) => void;
  completedUnitsCount: (level: Level) => number;
}

const LevelNode: React.FC<{ 
  level: Level; 
  onClick: () => void; 
  progress: number; 
}> = ({ level, onClick, progress }) => {
  const isUnlocked = level.is_unlocked;
  const isCompleted = progress === 100;

  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      className={`relative p-5 rounded-2xl transition-all duration-300 transform border-2 
        ${!isUnlocked 
          ? 'bg-slate-800/50 border-slate-700 opacity-60' 
          : 'cursor-pointer bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1 border-slate-700 hover:border-gold-royal'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 flex items-center justify-center
          ${!isUnlocked ? 'bg-slate-700 border-slate-600' 
            : isCompleted ? 'bg-green-900 border-green-500' 
            : 'bg-slate-700 border-gold-royal'}
        `}>
          {isUnlocked ? (
            <span className="text-2xl font-bold text-gold-royal">{level.level_id}</span>
          ) : (
            <LockIcon className="w-8 h-8 text-slate-500" />
          )}
        </div>
        <div className="flex-grow pt-1">
          <h2 className={`text-xl font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
            {level.title}
          </h2>
          {isUnlocked ? (
             <div className="mt-2">
                <ProgressBar progress={progress} />
                <p className="text-sm text-slate-400 mt-1">{Math.round(progress)}% مكتمل</p>
             </div>
          ) : (
             <p className="text-slate-400 mt-1">{level.teaser}</p>
          )}
        </div>
        {isUnlocked && <ChevronRightIcon className="w-6 h-6 text-slate-400 self-center transform -scale-x-100" />}
      </div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ levels, onSelectLevel, completedUnitsCount }) => {
  return (
    <div className="h-screen overflow-y-auto pt-24 bg-[#0A192F]">
      <main className="max-w-md md:max-w-xl mx-auto pb-12 px-4">
        <div className="space-y-6">
          {levels.map(level => {
            const progress = level.units.length > 0 ? (completedUnitsCount(level) / level.units.length) * 100 : 0;
            return (
              <LevelNode
                key={level.level_id}
                level={level}
                onClick={() => onSelectLevel(level.level_id)}
                progress={progress}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
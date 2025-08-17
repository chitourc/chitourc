import React from 'react';
import type { Level } from '../types';
import LockIcon from '../components/icons/LockIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import StarIcon from '../components/icons/StarIcon';

interface HomeScreenProps {
  levels: Level[];
  onSelectLevel: (levelId: number) => void;
  completedUnitsCount: (levelId: number) => number;
}

const LevelNode: React.FC<{ level: Level; onClick: () => void; completedUnits: number; isPath: boolean; alignment: 'left' | 'right' }> = ({ level, onClick, completedUnits, isPath, alignment }) => {
  const isLocked = !level.is_unlocked;
  const isCompleted = level.units.length > 0 && completedUnits >= level.units.length;
  const progress = level.units.length > 0 ? (completedUnits / level.units.length) * 100 : 0;

  const nodeContent = (
    <div className="relative z-10">
      <div
        onClick={!isLocked ? onClick : undefined}
        className={`
          w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 transform 
          ${isLocked
            ? 'bg-gray-200 border-gray-300'
            : isCompleted
            ? 'bg-green-100 border-green-500 hover:scale-105 cursor-pointer shadow-lg'
            : 'bg-teal-100 border-teal-500 hover:scale-105 cursor-pointer shadow-lg'
          }
        `}
      >
        {isLocked ? (
          <LockIcon className="w-8 h-8 text-gray-400" />
        ) : isCompleted ? (
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
        ) : (
          <StarIcon className="w-10 h-10 text-teal-500" />
        )}
      </div>
      <div className={`absolute top-1/2 -translate-y-1/2 w-48 p-3 rounded-lg bg-white shadow-md ${alignment === 'left' ? 'right-full mr-6' : 'left-full ml-6'}`}>
          <p className={`text-xs font-bold ${isLocked ? 'text-gray-500' : 'text-teal-600'}`}>
            المستوى {level.level_id}
          </p>
          <h3 className={`font-bold mt-1 ${isLocked ? 'text-gray-600' : 'text-gray-800'}`}>
            {level.title}
          </h3>
          {isLocked && level.teaser && <p className="text-xs text-gray-500 mt-1">{level.teaser}</p>}
           {!isLocked && (
            <div className="text-xs mt-2 text-gray-600">
                {completedUnits}/{level.units.length} وحدة
            </div>
           )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full flex justify-center">
      {isPath && (
        <div className={`absolute top-0 h-full w-1 border-r-4 border-dashed  ${isLocked ? 'border-gray-300': 'border-teal-300'}`} style={{ right: 'calc(50% - 2px)' }}></div>
      )}
      <div className={`w-1/2 flex ${alignment === 'left' ? 'justify-start' : 'justify-end'}`}>
        {nodeContent}
      </div>
    </div>
  );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ levels, onSelectLevel, completedUnitsCount }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F4] p-4 sm:p-6 lg:p-8">
      <main className="max-w-md mx-auto pt-24">
        <div className="space-y-12">
          {levels.map((level, index) => (
            <LevelNode 
              key={level.level_id} 
              level={level} 
              onClick={() => onSelectLevel(level.level_id)}
              completedUnits={completedUnitsCount(level.level_id)}
              isPath={index < levels.length -1}
              alignment={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
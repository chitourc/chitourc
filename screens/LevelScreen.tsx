import React from 'react';
import type { Level, Unit, UnitProgress } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

interface LevelScreenProps {
  level: Level;
  onSelectUnit: (unitId: number) => void;
  onBack: () => void;
  getUnitProgress: (unitId: number) => UnitProgress;
  isUnitCompleted: (unitId: number) => boolean;
}

const ProgressRing: React.FC<{ progress: number, isCompleted: boolean }> = ({ progress, isCompleted }) => {
  const radius = 28;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg height="64" width="64" className="-rotate-90">
        <circle
          stroke={isCompleted ? '#34D399' : '#D1D5DB'}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {!isCompleted && <circle
          stroke="#107569"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, strokeLinecap: 'round' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         {isCompleted ? (
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          ) : (
            <span className="text-xl font-bold text-teal-700">{Math.round(progress)}%</span>
          )}
      </div>
    </div>
  );
};

const UnitListItem: React.FC<{ unit: Unit; onClick: () => void; isCompleted: boolean; progressPercent: number; }> = ({ unit, onClick, isCompleted, progressPercent }) => {
  return (
    <li
      onClick={onClick}
      className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-teal-500"
    >
      <div className="flex items-center flex-grow">
        <ProgressRing progress={progressPercent} isCompleted={isCompleted} />
        <div className="ms-4">
          <p className="text-sm text-gray-500">الوحدة {unit.unit_id}</p>
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{unit.title}</h3>
        </div>
      </div>
      <ChevronRightIcon className="w-6 h-6 text-gray-400 transform -scale-x-100" />
    </li>
  );
};

const LevelScreen: React.FC<LevelScreenProps> = ({ level, onSelectUnit, onBack, getUnitProgress, isUnitCompleted }) => {
  
  const getProgressPercent = (unit: Unit) => {
    const progress = getUnitProgress(unit.unit_id);
    let completedSteps = 0;
    const totalSteps = unit.cards.length + 1 + 1; // cards + exercise + reward

    completedSteps += progress.completedCards.size;
    if (progress.exerciseCompleted) completedSteps++;
    if (progress.rewardClaimed) completedSteps++;

    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  };
  
  return (
    <div className="min-h-screen bg-[#FAF8F4] p-4">
       <header className="relative text-center py-4 mb-8">
        <button onClick={onBack} className="absolute top-1/2 -translate-y-1/2 start-0 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
           <ChevronRightIcon className="w-6 h-6 text-gray-700" />
        </button>
        <div>
           <p className="text-sm font-bold text-teal-600">المستوى {level.level_id}</p>
           <h1 className="text-3xl font-bold text-gray-800">{level.title}</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto">
        <ul className="space-y-5">
          {level.units.map(unit => (
            <UnitListItem
              key={unit.unit_id}
              unit={unit}
              onClick={() => onSelectUnit(unit.unit_id)}
              isCompleted={isUnitCompleted(unit.unit_id)}
              progressPercent={getProgressPercent(unit)}
            />
          ))}
           {level.units.length === 0 && (
             <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">المحتوى لهذا المستوى سيضاف قريبًا بإذن الله.</p>
             </div>
           )}
        </ul>
      </main>
    </div>
  );
};

export default LevelScreen;
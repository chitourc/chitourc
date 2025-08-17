import React, { useState, useMemo } from 'react';
import { appData } from './data/content';
import type { Level, Unit } from './types';
import HomeScreen from './screens/HomeScreen';
import LevelScreen from './screens/LevelScreen';
import UnitScreen from './screens/UnitScreen';
import { useProgress } from './hooks/useProgress';
import StarIcon from './components/icons/StarIcon';
import FireIcon from './components/icons/FireIcon';

type Screen = 'home' | 'level' | 'unit';

const AppHeader: React.FC<{ points: number, streak: number, screen: Screen }> = ({ points, streak, screen }) => {
    if (screen === 'unit') return null; // Hide header on unit screen for more focus
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-md mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-teal-800">رحلتي</h1>
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm shadow-md rounded-full px-4 py-2">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                        <StarIcon className="w-5 h-5 text-amber-500" />
                        <span>{points}</span>
                    </div>
                    <div className="w-px h-5 bg-gray-200"></div>
                    <div className="flex items-center gap-1 font-bold text-red-600">
                        <FireIcon className="w-5 h-5 text-red-500" />
                        <span>{streak}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};


const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const progressHook = useProgress();

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setScreen('level');
  };

  const handleSelectUnit = (unitId: number) => {
    setSelectedUnitId(unitId);
    setScreen('unit');
  };

  const handleBack = () => {
    if (screen === 'unit') {
      setScreen('level');
      setSelectedUnitId(null);
    } else if (screen === 'level') {
      setScreen('home');
      setSelectedLevelId(null);
    }
  };

  const selectedLevel = useMemo(() => {
    if (!selectedLevelId) return null;
    return appData.levels.find(l => l.level_id === selectedLevelId) || null;
  }, [selectedLevelId]);

  const selectedUnit = useMemo(() => {
    if (!selectedLevel || !selectedUnitId) return null;
    return selectedLevel.units.find(u => u.unit_id === selectedUnitId) || null;
  }, [selectedLevel, selectedUnitId]);

  const renderScreen = () => {
    if (!progressHook.isLoaded) {
      return <div className="flex items-center justify-center min-h-screen text-xl font-bold text-teal-700">تحميل رحلتك...</div>;
    }
    
    switch (screen) {
      case 'unit':
        if (selectedUnit) {
          return <UnitScreen 
                    unit={selectedUnit} 
                    onBack={handleBack} 
                    unitProgress={progressHook.getUnitProgress(selectedUnit.unit_id)}
                    completeCard={progressHook.completeCard}
                    completeExercise={progressHook.completeExercise}
                    claimReward={progressHook.claimReward}
                  />;
        }
        setScreen('level'); // Fallback if unit not found
        return null;

      case 'level':
        if (selectedLevel) {
          const isUnlocked = selectedLevel.level_id === 1 || progressHook.completedUnitsCount(selectedLevel.level_id - 1) >= 8;
          const levelToShow: Level = {...selectedLevel, is_unlocked: isUnlocked };
          if (!levelToShow.is_unlocked) {
            handleBack(); // Prevent access
            return null;
          }

          return <LevelScreen 
                    level={levelToShow} 
                    onSelectUnit={handleSelectUnit} 
                    onBack={handleBack} 
                    getUnitProgress={progressHook.getUnitProgress}
                    isUnitCompleted={progressHook.isUnitCompleted}
                 />;
        }
        setScreen('home'); // Fallback if level not found
        return null;
        
      case 'home':
      default:
        const levelsWithProgress: Level[] = appData.levels.map((level, index) => {
            if (index === 0) return {...level, is_unlocked: true};
            const prevLevel = appData.levels[index - 1];
            if (!prevLevel || !prevLevel.units || prevLevel.units.length === 0) {
              return { ...level, is_unlocked: false };
            }
            const prevLevelCompletedUnits = progressHook.completedUnitsCount(prevLevel.level_id);
            const isPrevLevelEvaluationUnitCompleted = progressHook.isUnitCompleted(prevLevel.units[prevLevel.units.length - 1]?.unit_id);
            return {
                ...level,
                is_unlocked: prevLevelCompletedUnits >= 8 && isPrevLevelEvaluationUnitCompleted
            };
        });

        return <HomeScreen 
                 levels={levelsWithProgress} 
                 onSelectLevel={handleSelectLevel}
                 completedUnitsCount={progressHook.completedUnitsCount}
               />;
    }
  };

  return (
      <>
        <AppHeader points={progressHook.points} streak={progressHook.streak.count} screen={screen} />
        {renderScreen()}
      </>
  );
};

export default App;
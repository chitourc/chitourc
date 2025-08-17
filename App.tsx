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
        <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-[#0A192F] to-transparent">
            <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gold-royal">رحلتي</h1>
                <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-sm shadow-md rounded-full px-4 py-2 border border-slate-700">
                    <div className="flex items-center gap-1 font-bold text-yellow-300">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span>{points}</span>
                    </div>
                    <div className="w-px h-5 bg-slate-600"></div>
                    <div className="flex items-center gap-1 font-bold text-red-400">
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

  const levelsWithProgress: Level[] = useMemo(() => {
    if (!progressHook.isLoaded) return appData.levels;
    return appData.levels.map((level, index) => {
      if (index === 0) return {...level, is_unlocked: true};
      const prevLevel = appData.levels[index - 1];
      return {
          ...level,
          is_unlocked: progressHook.isLevelCompleted(prevLevel)
      };
    });
  }, [progressHook.isLevelCompleted, progressHook.isLoaded]);

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
    return levelsWithProgress.find(l => l.level_id === selectedLevelId) || null;
  }, [selectedLevelId, levelsWithProgress]);

  const selectedUnit = useMemo(() => {
    if (!selectedLevel || !selectedUnitId) return null;
    return selectedLevel.units.find(u => u.unit_id === selectedUnitId) || null;
  }, [selectedLevel, selectedUnitId]);

  const renderScreen = () => {
    if (!progressHook.isLoaded) {
      return <div className="flex items-center justify-center min-h-screen text-xl font-bold text-gold-royal">تحميل رحلتك...</div>;
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
        // Fallback if unit not found
        handleBack(); 
        return null;

      case 'level':
        if (selectedLevel) {
          if (!selectedLevel.is_unlocked) {
            handleBack(); // Prevent access
            return null;
          }

          return <LevelScreen 
                    level={selectedLevel} 
                    onSelectUnit={handleSelectUnit} 
                    onBack={handleBack} 
                    isUnitCompleted={progressHook.isUnitCompleted}
                 />;
        }
        // Fallback if level not found
        handleBack();
        return null;
        
      case 'home':
      default:
        return <HomeScreen 
                 levels={levelsWithProgress} 
                 onSelectLevel={handleSelectLevel}
                 completedUnitsCount={(levelId) => {
                    const level = appData.levels.find(l => l.level_id === levelId);
                    return level ? progressHook.completedUnitsCount(level) : 0;
                 }}
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
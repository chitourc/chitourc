import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { appData } from './data/content';
import type { Level, Unit } from './types';
import HomeScreen from './screens/HomeScreen';
import LevelScreen from './screens/LevelScreen';
import UnitScreen from './screens/UnitScreen';
import { useProgress } from './hooks/useProgress';
import StarIcon from './components/icons/StarIcon';
import FireIcon from './components/icons/FireIcon';
import XIcon from './components/icons/XIcon';

type Screen = 'home' | 'level' | 'unit';

const LoginModal: React.FC<{ 
    onClose: () => void; 
    onLogin: (user: string, pass: string) => boolean;
    onLogout: () => void;
    isAdmin: boolean;
}> = ({ onClose, onLogin, onLogout, isAdmin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (onLogin(username, password)) {
            onClose();
        } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
            setUsername('');
            setPassword('');
        }
    };

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border-2 border-gold-royal/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="relative flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-center text-gold-royal">
                        {isAdmin ? 'وضع المطور' : 'تسجيل دخول المطور'}
                    </h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 start-0 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition" aria-label="إغلاق">
                         <XIcon className="w-6 h-6" />
                    </button>
                </header>
                {isAdmin ? (
                     <div className="text-center">
                        <p className="text-slate-300 mb-6">أنت مسجل كمدير. جميع المستويات مفتوحة للمراجعة.</p>
                        <button
                            onClick={handleLogout}
                            className="w-full px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-lg shadow-lg hover:bg-red-700 transition"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-slate-400 mb-1" htmlFor="username">اسم المستخدم</label>
                                <input 
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-royal"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1" htmlFor="password">كلمة الدخول</label>
                                <input 
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-royal"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full mt-6 px-6 py-3 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg hover:bg-yellow-700 transition"
                        >
                            دخول
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};


const AppHeader: React.FC<{ points: number, streak: number, onTitleClick: () => void }> = ({ points, streak, onTitleClick }) => {
    const clickTimeout = useRef<number | null>(null);
    const clickCount = useRef(0);

    const handleTitleClick = () => {
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }
        clickCount.current += 1;

        if (clickCount.current >= 5) {
            onTitleClick();
            clickCount.current = 0;
        } else {
            clickTimeout.current = window.setTimeout(() => {
                clickCount.current = 0;
            }, 1500); // Reset after 1.5 seconds
        }
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-[#0A192F] to-transparent">
            <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gold-royal cursor-pointer select-none" onClick={handleTitleClick}>رحلتي</h1>
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const progressHook = useProgress();
  
  useEffect(() => {
    // Check for admin status in localStorage on initial load
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
        setIsAdmin(true);
    }
  }, []);

  const handleLogin = useCallback((user: string, pass: string): boolean => {
    if (user === 'chitour1' && pass === '19883636') {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  }, []);

  const levelsWithProgress: Level[] = useMemo(() => {
    if (!progressHook.isLoaded) return appData.levels;
    return appData.levels.map((level, index) => {
      if (isAdmin) {
          return { ...level, is_unlocked: true };
      }
      if (index === 0) return {...level, is_unlocked: true};
      const prevLevel = appData.levels[index - 1];
      return {
          ...level,
          is_unlocked: progressHook.isLevelCompleted(prevLevel)
      };
    });
  }, [progressHook.isLevelCompleted, progressHook.isLoaded, isAdmin]);

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
    if (!selectedUnitId) return null;
    for (const level of levelsWithProgress) {
        const unit = level.units.find(u => u.unit_id === selectedUnitId);
        if (unit) return unit;
    }
    return null;
  }, [selectedUnitId, levelsWithProgress]);

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
                    addPoints={progressHook.addPoints}
                    isAdmin={isAdmin}
                  />;
        }
        handleBack(); 
        return null;

      case 'level':
        if (selectedLevel) {
            return <LevelScreen
                        level={selectedLevel}
                        onSelectUnit={handleSelectUnit}
                        onBack={handleBack}
                        isUnitCompleted={progressHook.isUnitCompleted}
                        isAdmin={isAdmin}
                    />;
        }
        handleBack();
        return null;
        
      case 'home':
      default:
        return <HomeScreen 
                 levels={levelsWithProgress} 
                 onSelectLevel={handleSelectLevel}
                 completedUnitsCount={progressHook.completedUnitsCount}
               />;
    }
  };

  return (
      <>
        {screen === 'home' && <AppHeader points={progressHook.points} streak={progressHook.streak.count} onTitleClick={() => setShowLoginModal(true)} />}
        {renderScreen()}
        {showLoginModal && (
            <LoginModal 
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
                onLogout={handleLogout}
                isAdmin={isAdmin}
            />
        )}
      </>
  );
};

export default App;
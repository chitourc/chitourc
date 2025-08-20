import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { appData } from './data/content';
import type { Level } from './types';
import HomeScreen from './screens/HomeScreen';
import LevelScreen from './screens/LevelScreen';
import UnitScreen from './screens/UnitScreen';
import { useProgress } from './hooks/useProgress';
import XIcon from './components/icons/XIcon';
import AppHeader from './components/AppHeader';

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
        <AppHeader 
            points={progressHook.points} 
            streak={progressHook.streak.count}
            isAdmin={isAdmin}
            onAdminClick={() => setShowLoginModal(true)}
            onLogout={handleLogout}
        />
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
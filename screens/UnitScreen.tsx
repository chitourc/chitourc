import React, { useState, useEffect, useCallback } from 'react';
import type { Unit, UnitProgress, Card } from '../types';
import { SectionType } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import StarIcon from '../components/icons/StarIcon';
import MicrophoneIcon from '../components/icons/MicrophoneIcon';
import ExerciseIcon from '../components/icons/ExerciseIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import LockIcon from '../components/icons/LockIcon';
import RevelationIcon from '../components/icons/RevelationIcon';
import InsightIcon from '../components/icons/InsightIcon';
import ScienceIcon from '../components/icons/ScienceIcon';
import ActionIcon from '../components/icons/ActionIcon';


interface UnitScreenProps {
  unit: Unit;
  unitProgress: UnitProgress;
  onBack: () => void;
  completeCard: (unitId: number, cardId: string) => void;
  completeExercise: (unitId: number) => void;
  claimReward: (unitId: number) => void;
}

// --- Card Modal Component ---
const CardModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onComplete: () => void;
}> = ({ isOpen, onClose, title, content, onComplete }) => {
    const [countdown, setCountdown] = useState(30);
    const [isCompletable, setIsCompletable] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsCompletable(false);
            setCountdown(30);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsCompletable(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleComplete = () => {
        onComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#0A192F] border-2 border-gold-royal/50 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b-2 border-gold-royal/30">
                    <h2 className="text-2xl font-bold text-center text-gold-royal">{title}</h2>
                </header>
                <main className="p-6 overflow-y-auto flex-1">
                    <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line">{content}</p>
                </main>
                <footer className="p-4 border-t-2 border-gold-royal/30">
                    <button
                        onClick={handleComplete}
                        disabled={!isCompletable}
                        className="w-full px-6 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg hover:bg-yellow-700 transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                    >
                        {isCompletable ? 'أتممتُ القراءة' : `انتظر... (${countdown})`}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Sections Icon Mapping ---
const sectionIconMap = {
  [SectionType.Sharii]: { icon: <RevelationIcon className="w-10 h-10" />, color: "text-sky-300" },
  [SectionType.Tarbawi]: { icon: <InsightIcon className="w-10 h-10" />, color: "text-teal-300" },
  [SectionType.Science]: { icon: <ScienceIcon className="w-10 h-10" />, color: "text-indigo-300" },
  [SectionType.Tactile]: { icon: <ActionIcon className="w-10 h-10" />, color: "text-amber-300" },
};


const CardContent: React.FC<{ unit: Unit; unitProgress: UnitProgress; onCardComplete: (cardId: string) => void; onAllCardsCompleted: () => void }> = ({ unit, unitProgress, onCardComplete, onAllCardsCompleted }) => {
    const firstIncompleteIndex = unit.cards.findIndex(card => !unitProgress.completedCards.has(card.card_id));
    const [currentIndex, setCurrentIndex] = useState(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0);
    
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const currentCard = unit.cards[currentIndex];
    
    const allSections = currentCard.sections.map(section => ({
        ...section,
        ...(sectionIconMap[section.id] || {}),
    }));

    useEffect(() => {
        if (firstIncompleteIndex === -1 && unit.cards.length > 0) {
            onAllCardsCompleted();
        }
    }, [firstIncompleteIndex, onAllCardsCompleted, unit.cards.length]);

     useEffect(() => {
        // Reset completed sections when card changes
        setCompletedSections(new Set());
    }, [currentIndex]);
    
    const handleSectionComplete = (sectionId: string) => {
        const newCompletedSections = new Set(completedSections).add(sectionId);
        setCompletedSections(newCompletedSections);
        
        if (newCompletedSections.size === allSections.length) {
            if (!unitProgress.completedCards.has(currentCard.card_id)) {
                onCardComplete(currentCard.card_id);
            }
            
            if (currentIndex < unit.cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onAllCardsCompleted();
            }
        }
    };
    
    if (!unit.cards || unit.cards.length === 0) {
        useEffect(() => onAllCardsCompleted(), [onAllCardsCompleted]);
        return <div className="p-6 text-center text-slate-400">لا توجد بطاقات لهذه الوحدة.</div>;
    }
    
    if (firstIncompleteIndex === -1 && unit.cards.length > 0) {
       return <div className="p-6 text-center text-slate-400">لقد أكملت جميع البطاقات.</div>;
    }
    
    const completedCount = Array.from(unitProgress.completedCards).filter(id => unit.cards.some(c => c.card_id === id)).length;
    const progressPercent = (completedCount / unit.cards.length) * 100;
    const activeSectionData = allSections.find(s => s.id === activeModal);

    return (
        <div className="p-4 flex flex-col h-full bg-slate-800/50 rounded-t-3xl">
            <div className="px-4 pt-2 pb-4 flex-shrink-0">
                 <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-2">البطاقة {completedCount + 1} من {unit.cards.length}</p>
            </div>

            <div className="text-center px-2 flex-shrink-0 mb-6">
                <h2 className="text-2xl font-bold text-white">{currentCard.title}</h2>
                <p className="text-sm text-slate-400 mt-1">افتح الأيقونات بالترتيب لإكمال البطاقة</p>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
                {allSections.map((section, index) => {
                    const isCompleted = completedSections.has(section.id);
                    const isUnlocked = index === 0 || completedSections.has(allSections[index - 1].id);
                    
                    return (
                        <button 
                            key={section.id}
                            onClick={() => isUnlocked && !isCompleted && setActiveModal(section.id)}
                            disabled={!isUnlocked || isCompleted}
                            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 text-center relative border-2 
                                ${!isUnlocked ? 'bg-slate-800 border-slate-700 opacity-50'
                                : isCompleted ? 'bg-green-800/50 border-green-500'
                                : 'bg-slate-700/80 border-slate-600 hover:border-gold-royal cursor-pointer'
                            }`}
                        >
                            <div className={`${isUnlocked ? section.color : 'text-slate-500'}`}>{section.icon}</div>
                            <h3 className={`font-bold ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>{section.title}</h3>
                            {!isUnlocked && <LockIcon className="absolute top-2 right-2 w-5 h-5 text-slate-500" />}
                            {isCompleted && <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6 text-green-400" />}
                        </button>
                    );
                })}
            </div>

            {activeSectionData && (
                 <CardModal 
                    isOpen={!!activeModal}
                    onClose={() => setActiveModal(null)}
                    title={activeSectionData.title}
                    content={activeSectionData.content}
                    onComplete={() => handleSectionComplete(activeSectionData.id)}
                 />
            )}
        </div>
    );
};

const ExerciseContent: React.FC<{ unit: Unit, isCompleted: boolean, onComplete: () => void }> = ({ unit, isCompleted, onComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const isEvaluationUnit = unit.unit_id === 10;

    const handleRecord = () => {
        setIsRecording(true);
        setIsSaved(false);
        setTimeout(() => {
            setIsRecording(false);
            setIsSaved(true);
        }, 3000);
    }
    
    return (
        <div className="p-6 text-center flex flex-col items-center justify-between h-full bg-slate-800/50 rounded-t-3xl">
            <div className="w-full">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center border-2 border-gold-royal/50">
                    <ExerciseIcon className="w-12 h-12 text-gold-royal" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{unit.exercise.title}</h3>
                <div className="text-slate-300 leading-loose whitespace-pre-line text-lg mb-6">
                    {unit.exercise.instructions}
                </div>
                {isEvaluationUnit && (
                     <div className="my-6 flex justify-center">
                        <button 
                            onClick={handleRecord}
                            disabled={isRecording || isSaved}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                                isRecording ? 'bg-red-500' : isSaved ? 'bg-green-500' : 'bg-yellow-600 hover:bg-yellow-700'
                            }`}
                        >
                            <MicrophoneIcon className="w-6 h-6" />
                            {isRecording ? 'يسجل الآن...' : isSaved ? 'تم حفظ التسجيل' : 'ابدأ تسجيل الدعاء'}
                        </button>
                     </div>
                )}
            </div>
            <button
                onClick={onComplete}
                disabled={isCompleted}
                className="w-full max-w-sm mt-8 px-6 py-4 rounded-2xl bg-yellow-600 text-white font-bold text-xl shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
            >
                {isCompleted && <CheckCircleIcon className="w-7 h-7" />}
                {isCompleted ? 'تم الإنجاز بنجاح' : unit.exercise.cta_label}
            </button>
        </div>
    );
};

const RewardContent: React.FC<{ unit: Unit, onClaim: () => void, onFinish: () => void }> = ({ unit, onClaim, onFinish }) => {
    useEffect(() => {
        onClaim();
    }, [onClaim]);

    return (
      <div className="p-6 text-center flex flex-col items-center justify-between h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl">
          <div className="w-full">
            <div className="relative w-40 h-40 mx-auto mb-4">
                <StarIcon className="w-full h-full text-yellow-400 opacity-80 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <StarIcon className="w-24 h-24 text-yellow-300" />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-gold-royal">مكافأة رائعة!</h3>
            <p className="text-lg text-slate-300 mt-2">لقد أنجزت الوحدة وحصلت على:</p>
            <div className="mt-6 flex justify-center items-center gap-4">
                <div className="px-5 py-3 bg-slate-700 border-2 border-yellow-400/50 shadow-md text-white font-bold rounded-full text-lg">
                    شارة "{unit.reward.badge}"
                </div>
                <div className="px-5 py-3 bg-yellow-500 text-white font-bold rounded-full text-lg shadow-lg">
                    {unit.reward.points} نقطة
                </div>
            </div>
            <p className="mt-8 text-slate-300 leading-relaxed text-lg max-w-prose mx-auto">{unit.reward.message}</p>
        </div>
        <button
            onClick={onFinish}
            className="w-full max-w-sm mt-8 px-6 py-4 rounded-2xl bg-yellow-600 text-white font-bold text-xl shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-105"
        >
            متابعة الرحلة
        </button>
      </div>
    );
};

const UnitScreen: React.FC<UnitScreenProps> = ({ unit, unitProgress, onBack, completeCard, completeExercise, claimReward }) => {
  const getInitialStep = useCallback(() => {
    const allCardsDone = unit.cards.length === 0 || unit.cards.every(c => unitProgress.completedCards.has(c.card_id));
    if (!allCardsDone) return 'cards';
    if (!unitProgress.exerciseCompleted) return 'exercise';
    return 'reward';
  }, [unit, unitProgress]);
  
  const [currentStep, setCurrentStep] = useState<'cards' | 'exercise' | 'reward'>(getInitialStep());
  
  const handleAllCardsCompleted = () => {
      setCurrentStep('exercise');
  };

  const handleExerciseCompleted = () => {
      if (!unitProgress.exerciseCompleted) {
          completeExercise(unit.unit_id);
      }
      setCurrentStep('reward');
  };

  const handleClaimReward = useCallback(() => {
      if (!unitProgress.rewardClaimed) {
          claimReward(unit.unit_id);
      }
  }, [claimReward, unit.unit_id, unitProgress.rewardClaimed]);

  const renderContent = () => {
      switch(currentStep) {
          case 'cards':
              return <CardContent 
                        unit={unit} 
                        unitProgress={unitProgress}
                        onCardComplete={(cardId) => completeCard(unit.unit_id, cardId)}
                        onAllCardsCompleted={handleAllCardsCompleted}
                      />;
          case 'exercise':
              return <ExerciseContent 
                        unit={unit} 
                        isCompleted={unitProgress.exerciseCompleted} 
                        onComplete={handleExerciseCompleted} 
                     />;
          case 'reward':
              return <RewardContent 
                        unit={unit} 
                        onClaim={handleClaimReward} 
                        onFinish={onBack}
                     />;
          default:
              return null;
      }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A192F]">
      <header className="relative flex items-center justify-between py-4 px-4 flex-shrink-0">
        <button onClick={onBack} className="p-3 rounded-full bg-slate-700 shadow-md hover:bg-slate-600 transition">
          <ChevronRightIcon className="w-6 h-6 text-slate-200" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-slate-200 truncate w-2/3 text-center" title={unit.title}>
          {unit.title}
        </h1>
        <div className="w-12"></div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default UnitScreen;
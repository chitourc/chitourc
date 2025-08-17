import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import CardsIcon from '../components/icons/CardsIcon';
import RewardIcon from '../components/icons/RewardIcon';

interface UnitScreenProps {
  unit: Unit;
  unitProgress: UnitProgress;
  onBack: () => void;
  completeCard: (unitId: number, cardId: string) => void;
  completeExercise: (unitId: number) => void;
  claimReward: (unitId: number) => void;
}

// --- Card Section Modal Component ---
const CardModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onComplete: () => void;
    isAlreadyCompleted?: boolean;
}> = ({ isOpen, onClose, title, content, onComplete, isAlreadyCompleted }) => {
    const [countdown, setCountdown] = useState(15);
    const [isCompletable, setIsCompletable] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (isAlreadyCompleted) {
                setIsCompletable(true);
                setCountdown(0);
            } else {
                setIsCompletable(false);
                setCountdown(15);
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
        }
    }, [isOpen, isAlreadyCompleted]);

    if (!isOpen) return null;

    const handleComplete = () => {
        if (!isAlreadyCompleted) {
            onComplete();
        }
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
                    <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content }}></p>
                </main>
                <footer className="p-4 border-t-2 border-gold-royal/30">
                    <button
                        onClick={handleComplete}
                        disabled={!isCompletable}
                        className="w-full px-6 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg hover:bg-yellow-700 transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                    >
                        {isAlreadyCompleted ? 'إغلاق' : (isCompletable ? 'أتممتُ القراءة' : `انتظر... (${countdown})`)}
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

// --- Stage Content Components ---
const CardContent: React.FC<{ card: Card; onComplete: () => void; isAlreadyCompleted: boolean; }> = ({ card, onComplete, isAlreadyCompleted }) => {
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const allSections = useMemo(() => card.sections.map(section => ({
        ...section,
        ...(sectionIconMap[section.id] || {}),
    })), [card]);

    useEffect(() => {
        if (isAlreadyCompleted) {
            setCompletedSections(new Set(card.sections.map(s => s.id)));
        } else {
            try {
                const savedProgress = sessionStorage.getItem(`cardProgress-${card.card_id}`);
                setCompletedSections(savedProgress ? new Set(JSON.parse(savedProgress)) : new Set());
            } catch (e) {
                console.error("Failed to parse card progress from sessionStorage", e);
                setCompletedSections(new Set());
            }
        }
    }, [card, isAlreadyCompleted]);
    
    const handleSectionComplete = (sectionId: string) => {
        const newCompletedSections = new Set(completedSections).add(sectionId);
        setCompletedSections(newCompletedSections);

        try {
            sessionStorage.setItem(`cardProgress-${card.card_id}`, JSON.stringify(Array.from(newCompletedSections)));
        } catch (e) {
            console.error("Failed to save card progress to sessionStorage", e);
        }
        
        if (newCompletedSections.size === allSections.length) {
             try {
                sessionStorage.removeItem(`cardProgress-${card.card_id}`);
            } catch (e) {
                console.error("Failed to remove card progress from sessionStorage", e);
            }
            onComplete();
        }
    };
    
    if (!card) return null;
    
    const progressPercent = allSections.length > 0 ? (completedSections.size / allSections.length) * 100 : 0;
    const activeSectionData = allSections.find(s => s.id === activeModal);

    return (
        <div className="p-4 flex flex-col h-full bg-slate-800/50 rounded-t-3xl max-w-4xl mx-auto w-full">
            <div className="px-4 pt-2 pb-4 flex-shrink-0">
                 <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-2">أكملت {completedSections.size} من {allSections.length} أقسام</p>
            </div>

            <div className="text-center px-2 flex-shrink-0 mb-6">
                <h2 className="text-2xl font-bold text-white">{card.title}</h2>
                <p className="text-sm text-slate-400 mt-1">افتح الأيقونات بالترتيب لإكمال البطاقة</p>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {allSections.map((section, index) => {
                    const isCompleted = completedSections.has(section.id);
                    const isUnlocked = index === 0 || completedSections.has(allSections[index - 1].id);
                    
                    return (
                        <button 
                            key={section.id}
                            onClick={() => isUnlocked && setActiveModal(section.id)}
                            disabled={!isUnlocked}
                            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 text-center relative border-2 
                                ${!isUnlocked ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
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
                    isAlreadyCompleted={completedSections.has(activeSectionData.id)}
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
        <div className="p-6 flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-t-3xl max-w-2xl mx-auto w-full">
            <div className="w-full text-center">
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
        if (onClaim) {
            onClaim();
        }
    }, [onClaim]);

    return (
      <div className="p-6 flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl max-w-2xl mx-auto w-full">
          <div className="w-full text-center">
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

const StageModal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#0A192F]/95 z-40 flex flex-col animate-fade-in p-4" onClick={onClose}>
      <div className="flex-1 overflow-y-auto w-full h-full" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const Stage: React.FC<{
    title: string; 
    subtitle?: string;
    icon: React.ReactNode; 
    status: 'completed' | 'unlocked' | 'locked'; 
    onClick: () => void;
}> = ({ title, subtitle, icon, status, onClick }) => {
      const isLocked = status === 'locked';
      const isCompleted = status === 'completed';

      return (
          <button
              onClick={onClick}
              disabled={isLocked}
              className={`group relative w-full p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 text-center border-2 min-h-[180px] 
                  ${isLocked ? 'bg-slate-800 border-slate-700 opacity-60 cursor-not-allowed'
                  : isCompleted ? 'bg-green-800/40 border-green-500 shadow-lg hover:scale-105'
                  : 'bg-slate-700/80 border-slate-600 hover:border-gold-royal hover:scale-105 cursor-pointer'
              }`}
          >
              <div className={`transition-colors duration-300 mb-2
                  ${isLocked ? 'text-slate-500' 
                  : isCompleted ? 'text-green-400' 
                  : 'text-gold-royal group-hover:text-yellow-300'}`
              }>
                  {icon}
              </div>
              {subtitle && <p className={`text-sm font-bold transition-colors duration-300 ${isLocked ? 'text-slate-500' : 'text-slate-300'}`}>{subtitle}</p>}
              <h3 className={`text-lg font-bold leading-tight transition-colors duration-300
                  ${isLocked ? 'text-slate-500' 
                  : isCompleted ? 'text-slate-300' 
                  : 'text-white'}`
              }>
                  {title}
              </h3>
              {isLocked && <LockIcon className="absolute top-3 right-3 w-6 h-6 text-slate-500" />}
              {isCompleted && <CheckCircleIcon className="absolute top-3 right-3 w-7 h-7 text-green-400" />}
          </button>
      )
  }

type StageType = {
    id: string;
    type: 'card' | 'exercise' | 'reward';
    data: any;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    status: 'completed' | 'unlocked' | 'locked';
}

const UnitScreen: React.FC<UnitScreenProps> = ({ unit, unitProgress, onBack, completeCard, completeExercise, claimReward }) => {
  const [activeStage, setActiveStage] = useState<Pick<StageType, 'type' | 'data'> | null>(null);
  
  const stages = useMemo<StageType[]>(() => {
    const cardStages: StageType[] = unit.cards.map((card, index) => {
        const isCompleted = unitProgress.completedCards.has(card.card_id);
        const prevCard = index > 0 ? unit.cards[index - 1] : null;
        const isPrevCardCompleted = prevCard ? unitProgress.completedCards.has(prevCard.card_id) : true;
        const isUnlocked = index === 0 || isPrevCardCompleted;

        return {
            id: `card-${card.card_id}`,
            type: 'card',
            data: card,
            title: card.title,
            subtitle: `البطاقة ${index + 1}`,
            icon: <CardsIcon className="w-12 h-12"/>,
            status: isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked',
        };
    });

    const allCardsCompleted = unit.cards.every(c => unitProgress.completedCards.has(c.card_id));
    const exerciseCompleted = unitProgress.exerciseCompleted;

    const exerciseStage: StageType | null = unit.exercise ? {
        id: 'exercise',
        type: 'exercise',
        data: unit.exercise,
        title: "التمرين",
        icon: <ExerciseIcon className="w-12 h-12"/>,
        status: exerciseCompleted ? 'completed' : allCardsCompleted ? 'unlocked' : 'locked',
    } : null;

    const rewardStage: StageType | null = unit.reward ? {
        id: 'reward',
        type: 'reward',
        data: unit.reward,
        title: "المكافأة",
        icon: <RewardIcon className="w-12 h-12"/>,
        status: unitProgress.rewardClaimed ? 'completed' : exerciseCompleted ? 'unlocked' : 'locked',
    } : null;
    
    return [
        ...cardStages,
        ...(exerciseStage ? [exerciseStage] : []),
        ...(rewardStage ? [rewardStage] : [])
    ];
  }, [unit, unitProgress]);

  const handleStageClick = (stage: StageType) => {
      if (stage.status !== 'locked') {
        setActiveStage({ type: stage.type, data: stage.data });
      }
  };

  const handleCardCompleted = useCallback(() => {
      if (activeStage?.type === 'card') {
          completeCard(unit.unit_id, activeStage.data.card_id);
      }
      setActiveStage(null);
  }, [activeStage, completeCard, unit.unit_id]);
  
  const handleExerciseCompleted = useCallback(() => {
      if (!unitProgress.exerciseCompleted) {
          completeExercise(unit.unit_id);
      }
      setActiveStage(null);
  }, [completeExercise, unit.unit_id, unitProgress.exerciseCompleted]);
  
  const handleRewardClaimedAndFinish = useCallback(() => {
      if (!unitProgress.rewardClaimed) {
          claimReward(unit.unit_id);
      }
      onBack();
  }, [claimReward, unit.unit_id, unitProgress.rewardClaimed, onBack]);

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
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stages.map(stage => (
                <Stage 
                    key={stage.id}
                    title={stage.title}
                    subtitle={stage.subtitle}
                    icon={stage.icon}
                    status={stage.status}
                    onClick={() => handleStageClick(stage)}
                />
            ))}
        </div>
      </main>

      <StageModal isOpen={activeStage !== null} onClose={() => setActiveStage(null)}>
        {activeStage?.type === 'card' && (
           <CardContent 
              card={activeStage.data} 
              onComplete={handleCardCompleted}
              isAlreadyCompleted={unitProgress.completedCards.has(activeStage.data.card_id)}
            />
        )}
        {activeStage?.type === 'exercise' && (
            <ExerciseContent 
              unit={unit} 
              isCompleted={unitProgress.exerciseCompleted} 
              onComplete={handleExerciseCompleted} 
            />
        )}
        {activeStage?.type === 'reward' && (
           <RewardContent 
              unit={unit} 
              onClaim={() => claimReward(unit.unit_id)} 
              onFinish={handleRewardClaimedAndFinish}
            />
        )}
      </StageModal>
    </div>
  );
};

export default UnitScreen;
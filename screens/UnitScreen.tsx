import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Unit, UnitProgress, Card, MotivationalQuestion, Section, QuizQuestion } from '../types';
import { SectionType } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import StarIcon from '../components/icons/StarIcon';
import ExerciseIcon from '../components/icons/ExerciseIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import XIcon from '../components/icons/XIcon';
import LockIcon from '../components/icons/LockIcon';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import InsightIcon from '../components/icons/InsightIcon';
import ScienceIcon from '../components/icons/ScienceIcon';
import ActionIcon from '../components/icons/ActionIcon';
import CardsIcon from '../components/icons/CardsIcon';
import RewardIcon from '../components/icons/RewardIcon';
import QuizModal from '../components/QuizModal';
import ChestIcon from '../components/icons/ChestIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import { playSound } from '../utils/sounds';


interface UnitScreenProps {
  unit: Unit;
  unitProgress: UnitProgress;
  onBack: () => void;
  completeCard: (unitId: number, cardId: string) => void;
  completeExercise: (unitId: number) => void;
  claimReward: (unitId: number) => void;
  addPoints: (amount: number) => void;
  isAdmin: boolean;
}

// --- Card Section Modal Component ---
const CardModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onProgress: () => void;
    isAlreadyCompleted?: boolean;
    onNavigate: (direction: 'next' | 'prev') => void;
    isFirst: boolean;
    isLast: boolean;
    isNextUnlocked: boolean;
    motivationalQuestion?: MotivationalQuestion;
    isAdmin: boolean;
}> = ({ isOpen, onClose, title, content, onProgress, isAlreadyCompleted, onNavigate, isFirst, isLast, isNextUnlocked, motivationalQuestion, isAdmin }) => {
    const [showQuestion, setShowQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
    const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnswerConfirmed(false);
            setSelectedAnswer(null);
            setAnswerStatus('idle');

            if (!isAdmin && !isAlreadyCompleted && motivationalQuestion) {
                setShowQuestion(false);
                const timer = setTimeout(() => {
                    setShowQuestion(true);
                }, 10000); // 10 seconds

                return () => clearTimeout(timer);
            } else {
                setShowQuestion(false);
            }
        }
    }, [isOpen, isAlreadyCompleted, title, motivationalQuestion, isAdmin]);

    if (!isOpen) return null;

    const handleAnswerClick = (index: number) => {
        if (!motivationalQuestion || answerStatus !== 'idle') return;
        
        setSelectedAnswer(index);
        
        if (index === motivationalQuestion.correct_option_index) {
            setAnswerStatus('correct');
            setTimeout(() => {
                setIsAnswerConfirmed(true);
            }, 500);
        } else {
            playSound('incorrect');
            setAnswerStatus('incorrect');
            setTimeout(() => {
                setAnswerStatus('idle');
                setSelectedAnswer(null);
            }, 1500);
        }
    };
    
    const getOptionClasses = (index: number) => {
        if (answerStatus === 'correct' && index === selectedAnswer) {
            return 'bg-green-700 border-green-500 scale-105';
        }
        if (answerStatus === 'incorrect' && index === selectedAnswer) {
            return 'bg-red-700 border-red-500 animate-shake';
        }
        if (selectedAnswer === index && answerStatus === 'idle') {
            return 'bg-yellow-600 border-yellow-400';
        }
        return 'bg-slate-700/80 border-slate-600 hover:border-gold-royal';
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
            <div 
                className="bg-[#0A192F] border-2 border-gold-royal/50 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="relative p-4 border-b-2 border-gold-royal/30 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-center text-gold-royal truncate px-12">{title}</h2>
                     <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 start-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition" aria-label="إغلاق">
                         <XIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto flex-1">
                    <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content }}></div>
                    
                    {motivationalQuestion ? (
                        <>
                            {!isAnswerConfirmed && showQuestion && (
                                <div className="mt-8 pt-6 border-t-2 border-slate-700 animate-fade-in">
                                    <h3 className="text-xl font-bold text-center text-yellow-400 mb-4">{motivationalQuestion.question}</h3>
                                    <div className="space-y-3">
                                        {motivationalQuestion.options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswerClick(index)}
                                                disabled={answerStatus !== 'idle'}
                                                className={`w-full p-3 rounded-lg text-md font-medium text-right text-white border-2 transition-all duration-300 transform ${getOptionClasses(index)}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {isAnswerConfirmed && (
                                <div className="mt-8 pt-6 border-t-2 border-slate-700 animate-fade-in text-center">
                                    <h3 className="text-2xl font-bold text-green-400 mb-4">أحسنت! إجابة موفقة.</h3>
                                    <p className="text-slate-300 mb-6">لقد أثبتّ فهمك لهذا الجزء. واصل رحلتك الملهمة.</p>
                                    <button
                                        onClick={onProgress}
                                        className="w-full max-w-sm mx-auto px-6 py-4 rounded-2xl bg-green-600 text-white font-bold text-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
                                    >
                                        <CheckCircleIcon className="w-7 h-7" />
                                        المتابعة
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="mt-8 pt-6 border-t-2 border-slate-700 animate-fade-in text-center">
                             <button
                                onClick={onProgress}
                                className="w-full max-w-sm mx-auto px-6 py-4 rounded-2xl bg-green-600 text-white font-bold text-xl shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <CheckCircleIcon className="w-7 h-7" />
                                {isLast ? "العودة للوحدة" : "المتابعة"}
                            </button>
                        </div>
                    )}
                </main>
                 <footer className="p-4 border-t-2 border-gold-royal/30 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('prev')}
                        disabled={isFirst}
                        className="p-4 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="القسم السابق"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                     <button
                        onClick={() => onNavigate('next')}
                        disabled={isLast || !isNextUnlocked}
                        className="p-4 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="القسم التالي"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Sections Icon Mapping ---
const sectionIconMap: { [key in SectionType]: { icon: JSX.Element, color: string } } = {
  [SectionType.Sharii]: { icon: <BookOpenIcon className="w-10 h-10" />, color: "text-sky-300" },
  [SectionType.Tarbawi]: { icon: <InsightIcon className="w-10 h-10" />, color: "text-teal-300" },
  [SectionType.Science]: { icon: <ScienceIcon className="w-10 h-10" />, color: "text-indigo-300" },
  [SectionType.Tactile]: { icon: <ActionIcon className="w-10 h-10" />, color: "text-amber-300" },
  [SectionType.Summary]: { icon: <SparklesIcon className="w-10 h-10" />, color: "text-yellow-300" },
};

type MappedSection = Section & { icon: JSX.Element; color: string };

// --- Stage Content Components ---
const CardContent: React.FC<{ card: Card; onComplete: () => void; isAlreadyCompleted: boolean; isAdmin: boolean; }> = ({ card, onComplete, isAlreadyCompleted, isAdmin }) => {
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [activeModalId, setActiveModalId] = useState<string | null>(null);

    const allSections = useMemo(() => card.sections.map(section => ({
        ...section,
        ...(sectionIconMap[section.id] || {}),
    }) as MappedSection), [card]);

    useEffect(() => {
        try {
            const savedProgress = sessionStorage.getItem(`cardProgress-${card.card_id}`);
            if (savedProgress) {
                setCompletedSections(new Set(JSON.parse(savedProgress)));
                return;
            }
        } catch (e) {
            console.error("Failed to parse card progress from sessionStorage", e);
        }
        
        if (isAlreadyCompleted) {
            setCompletedSections(new Set(card.sections.map(s => s.id)));
        } else {
            setCompletedSections(new Set());
        }
    }, [isAlreadyCompleted, card.card_id, card.sections]);
    
    const allSectionsCompleted = useMemo(() => completedSections.size >= card.sections.length, [completedSections, card.sections]);

    useEffect(() => {
        if (allSectionsCompleted && !isAlreadyCompleted) {
            onComplete();
        }
    }, [allSectionsCompleted, isAlreadyCompleted, onComplete]);

    const handleSectionProgression = (sectionId: string) => {
        // 1. Mark section as complete
        if (!completedSections.has(sectionId)) {
             setCompletedSections(prev => {
                const newSet = new Set(prev);
                newSet.add(sectionId);
                try {
                    sessionStorage.setItem(`cardProgress-${card.card_id}`, JSON.stringify(Array.from(newSet)));
                } catch (e) { console.error("Failed to save card progress to sessionStorage", e); }
                return newSet;
            });
        }
       
        // 2. Navigate to next or close
        const currentIndex = allSections.findIndex(s => s.id === sectionId);
        const nextIndex = currentIndex + 1;

        if (nextIndex < allSections.length) {
            setActiveModalId(allSections[nextIndex].id);
        } else {
            setActiveModalId(null);
        }
    };

    const handleNavigate = (direction: 'next' | 'prev') => {
        const currentIndex = allSections.findIndex(s => s.id === activeModalId);
        if (currentIndex === -1) return;
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < allSections.length) {
            const nextSection = allSections[nextIndex];
            const isUnlocked = isAdmin || completedSections.has(nextSection.id) || (nextIndex > 0 && completedSections.has(allSections[nextIndex - 1].id));
            if (isUnlocked) {
                setActiveModalId(nextSection.id);
            }
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-2xl shadow-lg">
            <header className="flex items-start sm:items-center gap-4 mb-6">
                <img src={card.imageUrl} alt={card.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-slate-600"/>
                <div>
                    <h3 className="text-2xl font-bold text-slate-100">{card.title}</h3>
                    <p className="text-slate-400 mt-1">افتح الأقسام لتتعلم وتتقدم.</p>
                </div>
            </header>
            <div className="space-y-3">
                {allSections.map((section, index) => {
                    const isCompleted = completedSections.has(section.id);
                    const isUnlocked = isAdmin || isCompleted || index === 0 || completedSections.has(allSections[index - 1].id);
                    return (
                        <div key={section.id} onClick={isUnlocked ? () => setActiveModalId(section.id) : undefined}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isUnlocked ? 'cursor-pointer bg-slate-700/80 hover:bg-slate-700' : 'bg-slate-800 opacity-60'}`}>
                            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${section.color}`}>
                                {section.icon}
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-lg font-bold text-slate-200">{section.title}</h4>
                            </div>
                            {isUnlocked ? (isCompleted ? <CheckCircleIcon className="w-8 h-8 text-green-400"/> : <ChevronLeftIcon className="w-6 h-6 text-slate-400"/>) : <LockIcon className="w-6 h-6 text-slate-500"/>}
                        </div>
                    );
                })}
            </div>
            {activeModalId && (() => {
                const activeSection = allSections.find(s => s.id === activeModalId);
                const currentIndex = allSections.findIndex(s => s.id === activeModalId);
                if (!activeSection) return null;
                const nextSection = allSections[currentIndex + 1];
                const isNextUnlocked = !!nextSection && (isAdmin || completedSections.has(activeSection.id));
                return (
                    <CardModal
                        isOpen={!!activeModalId}
                        onClose={() => setActiveModalId(null)}
                        title={activeSection.title}
                        content={activeSection.content}
                        onProgress={() => handleSectionProgression(activeSection.id)}
                        isAlreadyCompleted={completedSections.has(activeSection.id)}
                        onNavigate={handleNavigate}
                        isFirst={currentIndex === 0}
                        isLast={currentIndex === allSections.length - 1}
                        isNextUnlocked={isNextUnlocked}
                        motivationalQuestion={activeSection.motivational_question}
                        isAdmin={isAdmin}
                    />
                );
            })()}
        </div>
    );
};

const CardsStageContent: React.FC<{
    unit: Unit;
    quiz: QuizQuestion[];
    onCompleteCard: (cardId: string) => void;
    completedCards: Set<string>;
    onStartQuiz: () => void;
    isAdmin: boolean;
}> = ({ unit, quiz, onCompleteCard, completedCards, onStartQuiz, isAdmin }) => {
    
    const allCardsCompleted = completedCards.size >= unit.cards.length;

    return (
        <div className="space-y-6">
            {unit.cards.map((card, index) => {
                const isCompleted = completedCards.has(card.card_id);
                const isUnlocked = isAdmin || isCompleted || index === 0 || completedCards.has(unit.cards[index - 1].card_id);
                return (
                    <div key={card.card_id} className={`${!isUnlocked ? 'opacity-60' : ''}`}>
                         <CardContent 
                             card={card} 
                             onComplete={() => onCompleteCard(card.card_id)} 
                             isAlreadyCompleted={isCompleted}
                             isAdmin={isAdmin}
                         />
                    </div>
                );
            })}
             {quiz && quiz.length > 0 && (
                <div className="p-4 sm:p-6 bg-slate-800/50 rounded-2xl shadow-lg text-center">
                    <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                    <h3 className="text-2xl font-bold text-slate-100">اختبر فهمك</h3>
                    <p className="text-slate-400 mt-2 mb-6 max-w-md mx-auto">أكملت جميع بطاقات هذه الوحدة. الآن، اختبر معلوماتك لترسيخ ما تعلمته واكسب نقاطًا إضافية!</p>
                    <button 
                        onClick={onStartQuiz}
                        disabled={!allCardsCompleted && !isAdmin}
                        className="px-8 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                       ابدأ الاختبار
                    </button>
                </div>
            )}
        </div>
    );
};

const ExerciseStageContent: React.FC<{
    unit: Unit;
    onComplete: () => void;
    isCompleted: boolean;
}> = ({ unit, onComplete, isCompleted }) => (
    <div className="p-6 sm:p-8 bg-slate-800/50 rounded-2xl shadow-lg text-center">
        <ExerciseIcon className="w-16 h-16 text-green-400 mx-auto mb-4"/>
        <h3 className="text-3xl font-bold text-slate-100">{unit.exercise.title}</h3>
        <p className="text-slate-300 my-6 text-lg whitespace-pre-line">{unit.exercise.instructions}</p>
        <button 
            onClick={() => { playSound('complete'); onComplete(); }}
            disabled={isCompleted}
            className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 mx-auto"
        >
            <CheckCircleIcon className="w-7 h-7" />
            {isCompleted ? 'تم إنجاز التمرين' : unit.exercise.cta_label}
        </button>
    </div>
);

const RewardStageContent: React.FC<{
    unit: Unit;
    onClaim: () => void;
    isClaimed: boolean;
}> = ({ unit, onClaim, isClaimed }) => (
     <div className="p-6 sm:p-8 bg-slate-800/50 rounded-2xl shadow-lg text-center">
        <ChestIcon className="w-20 h-20 text-yellow-400 mx-auto mb-4"/>
        <h3 className="text-3xl font-bold text-gold-royal">مكافأتك!</h3>
        <p className="text-slate-300 mt-4 text-lg">لقد أكملت هذه الوحدة بنجاح. تستحق هذه المكافأة القيمة.</p>
        <div className="my-6 bg-slate-900/50 p-6 rounded-xl border-2 border-slate-700">
            <p className="text-2xl font-bold text-yellow-300">{unit.reward.badge}</p>
            <p className="text-3xl font-bold text-yellow-400 my-2">+{unit.reward.points} <span className="text-lg">نقطة</span></p>
            <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: unit.reward.message }}></p>
        </div>
        <button 
            onClick={() => { playSound('complete'); onClaim(); }}
            disabled={isClaimed}
            className="px-8 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
        >
            {isClaimed ? 'تم استلام المكافأة' : 'استلام المكافأة'}
        </button>
    </div>
);

const StageButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
    isCompleted: boolean;
    isUnlocked: boolean;
}> = ({ icon, label, onClick, isActive, isCompleted, isUnlocked }) => (
    <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={`flex flex-col items-center justify-center gap-2 p-3 w-full h-24 rounded-2xl text-center transition-all duration-300 border-2
            ${!isUnlocked ? 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed' : 
            isActive ? 'bg-slate-700 border-gold-royal shadow-lg scale-105' :
            'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
    >
        <div className={`transition-colors duration-300 ${isCompleted ? 'text-green-400' : 'text-slate-300'} ${isActive && 'text-gold-royal'}`}>
            {isCompleted && !isActive ? <CheckCircleIcon className="w-8 h-8 text-green-400"/> : icon}
        </div>
        <span className={`font-bold text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
    </button>
);

const UnitScreen: React.FC<UnitScreenProps> = ({ unit, unitProgress, onBack, completeCard, completeExercise, claimReward, addPoints, isAdmin }) => {
    type Stage = 'cards' | 'exercise' | 'reward';
    const [currentStage, setCurrentStage] = useState<Stage>('cards');
    const [showQuizModal, setShowQuizModal] = useState(false);
    
    const unitQuiz = useMemo(() => {
        return unit.cards.flatMap(card => card.quiz || []);
    }, [unit.cards]);

    const { completedCards, exerciseCompleted, rewardClaimed } = unitProgress;

    const cardsCompleted = completedCards.size >= unit.cards.length;
    
    // Determine which stage to show by default
    useEffect(() => {
        if (!cardsCompleted) {
            setCurrentStage('cards');
        } else if (!exerciseCompleted) {
            setCurrentStage('exercise');
        } else {
            setCurrentStage('reward');
        }
    }, [cardsCompleted, exerciseCompleted]);

    const handleCompleteCard = (cardId: string) => {
        completeCard(unit.unit_id, cardId);
    };
    
    const handleCompleteExercise = () => {
        completeExercise(unit.unit_id);
        setCurrentStage('reward');
    };
    
    const handleClaimReward = () => {
        claimReward(unit.unit_id);
    };

    const handleQuizComplete = () => {
        setShowQuizModal(false);
        // Quiz is part of the 'cards' stage conceptually
        setCurrentStage('exercise');
    };

    const exerciseUnlocked = isAdmin || cardsCompleted;
    const rewardUnlocked = isAdmin || (cardsCompleted && exerciseCompleted);
    
    return (
        <div className="flex flex-col min-h-screen bg-[#0A192F] pt-24">
            {showQuizModal && unitQuiz.length > 0 && (
                 <QuizModal 
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    questions={unitQuiz}
                    onComplete={handleQuizComplete}
                    addPoints={addPoints}
                 />
            )}
            <header className="relative text-center py-4 px-4 sm:px-6 lg:px-8 flex-shrink-0">
                <button onClick={onBack} className="absolute top-1/2 -translate-y-1/2 start-4 p-3 rounded-full bg-slate-700 shadow-md hover:bg-slate-600 transition">
                    <ChevronRightIcon className="w-6 h-6 text-slate-200" />
                </button>
                <div className="pt-2">
                    <p className="text-sm font-bold text-gold-royal">الوحدة {unit.unit_id}</p>
                    <h1 className="text-3xl font-bold text-slate-100 mt-1">{unit.title}</h1>
                </div>
            </header>

            <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <StageButton 
                        icon={<CardsIcon className="w-8 h-8"/>}
                        label="البطاقات"
                        onClick={() => setCurrentStage('cards')}
                        isActive={currentStage === 'cards'}
                        isCompleted={cardsCompleted}
                        isUnlocked={true}
                    />
                    <StageButton 
                        icon={<ExerciseIcon className="w-8 h-8"/>}
                        label="التمرين"
                        onClick={() => setCurrentStage('exercise')}
                        isActive={currentStage === 'exercise'}
                        isCompleted={exerciseCompleted}
                        isUnlocked={exerciseUnlocked}
                    />
                    <StageButton 
                        icon={<RewardIcon className="w-8 h-8"/>}
                        label="المكافأة"
                        onClick={() => setCurrentStage('reward')}
                        isActive={currentStage === 'reward'}
                        isCompleted={rewardClaimed}
                        isUnlocked={rewardUnlocked}
                    />
                </div>

                <div className="animate-fade-in">
                    {currentStage === 'cards' && (
                        <CardsStageContent 
                            unit={unit}
                            quiz={unitQuiz}
                            completedCards={completedCards}
                            onCompleteCard={handleCompleteCard}
                            onStartQuiz={() => setShowQuizModal(true)}
                            isAdmin={isAdmin}
                        />
                    )}
                    {currentStage === 'exercise' && (
                         <ExerciseStageContent 
                            unit={unit}
                            onComplete={handleCompleteExercise}
                            isCompleted={exerciseCompleted}
                         />
                    )}
                    {currentStage === 'reward' && (
                        <RewardStageContent 
                            unit={unit}
                            onClaim={handleClaimReward}
                            isClaimed={rewardClaimed}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default UnitScreen;
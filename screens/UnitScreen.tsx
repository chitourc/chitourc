import React, { useState, useEffect, useRef } from 'react';
import type { Unit, UnitProgress } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import StarIcon from '../components/icons/StarIcon';
import MicrophoneIcon from '../components/icons/MicrophoneIcon';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import BrainIcon from '../components/icons/BrainIcon';
import BeakerIcon from '../components/icons/BeakerIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import ExerciseIcon from '../components/icons/ExerciseIcon';
import RewardIcon from '../components/icons/RewardIcon';
import CardsIcon from '../components/icons/CardsIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

type Tab = 'cards' | 'exercise' | 'reward';

interface UnitScreenProps {
  unit: Unit;
  unitProgress: UnitProgress;
  onBack: () => void;
  completeCard: (unitId: number, cardId: string) => void;
  completeExercise: (unitId: number) => void;
  claimReward: (unitId: number) => void;
}

const BottomNavBar: React.FC<{ activeTab: Tab, setActiveTab: (tab: Tab) => void, progress: {cards: boolean, exercise: boolean, reward: boolean} }> = ({ activeTab, setActiveTab, progress }) => {
    const tabs: { id: Tab, label: string, icon: React.ReactNode }[] = [
        { id: 'cards', label: 'البطاقات', icon: <CardsIcon className="w-7 h-7 mb-1" /> },
        { id: 'exercise', label: 'التمرين', icon: <ExerciseIcon className="w-7 h-7 mb-1" /> },
        { id: 'reward', label: 'المكافأة', icon: <RewardIcon className="w-7 h-7 mb-1" /> },
    ];
    
    const isCompleted = (tab: Tab) => {
        if (tab === 'cards') return progress.cards;
        if (tab === 'exercise') return progress.exercise;
        if (tab === 'reward') return progress.reward;
        return false;
    }

    return (
        <div className="flex justify-around items-center bg-white border-t-2 border-gray-100 shadow-top">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center pt-2 pb-1 transition-colors duration-300 relative ${
                        activeTab === tab.id ? 'text-teal-600' : 'text-gray-400 hover:text-teal-500'
                    }`}
                >
                    {isCompleted(tab.id) && (
                        <div className="absolute top-1 right-1/2 transform translate-x-4">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 bg-white rounded-full" />
                        </div>
                    )}
                    {tab.icon}
                    <span className="text-xs font-bold">{tab.label}</span>
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 w-12 h-1 bg-teal-600 rounded-full"></div>
                    )}
                </button>
            ))}
        </div>
    );
};

const SectionView: React.FC<{ icon: React.ReactNode, title: string, content: string, borderColor: string, bgColor: string, iconColor: string }> = ({ icon, title, content, borderColor, bgColor, iconColor }) => (
    <div className={`p-4 border-r-4 ${borderColor} ${bgColor} rounded-lg shadow-sm`}>
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/60 ${iconColor}`}>
                {icon}
            </div>
            <h3 className={`text-lg font-bold ${iconColor}`}>{title}</h3>
        </div>
        <p className="text-gray-800 leading-relaxed text-base">{content}</p>
    </div>
);


const CardContent: React.FC<{ unit: Unit; onCardComplete: (cardId: string) => void }> = ({ unit, onCardComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (unit.cards.length > 0) {
            onCardComplete(unit.cards[currentIndex].card_id);
        }
    }, [currentIndex, unit.cards, onCardComplete]);

    if (!unit.cards || unit.cards.length === 0) {
        return <div className="p-6 text-center text-gray-500">لا توجد بطاقات لهذه الوحدة.</div>;
    }
    
    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = carouselRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    };
    
    const sections = (card: typeof unit.cards[0]) => [
        { icon: <BookOpenIcon className="w-5 h-5" />, title: "نص شرعي/أثري", content: card.content_blocks.text_sharii, borderColor: "border-teal-500", bgColor: "bg-teal-50", iconColor: "text-teal-700" },
        { icon: <BrainIcon className="w-5 h-5" />, title: "شرح تربوي/نفسي", content: card.content_blocks.tarbawi_psych, borderColor: "border-sky-500", bgColor: "bg-sky-50", iconColor: "text-sky-700" },
        { icon: <BeakerIcon className="w-5 h-5" />, title: "إضافة من العلوم/التجربة", content: card.content_blocks.science_experience, borderColor: "border-indigo-500", bgColor: "bg-indigo-50", iconColor: "text-indigo-700" },
        { icon: <SparklesIcon className="w-5 h-5" />, title: "لمسة تطبيقية", content: card.content_blocks.tactile_tip, borderColor: "border-amber-500", bgColor: "bg-amber-50", iconColor: "text-amber-700" },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="text-center px-4 pt-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-teal-800">{unit.cards[currentIndex].title}</h2>
                {unit.cards.length > 1 && <p className="text-sm text-gray-500 mt-1">اسحب لاستعراض الأفكار</p>}
            </div>

            <div 
                ref={carouselRef} 
                className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
                onScroll={handleScroll}
                style={{ scrollbarWidth: 'none' }}
            >
                {unit.cards.map((card) => (
                    <div key={card.card_id} className="snap-center flex-shrink-0 w-full h-full p-4">
                        <div className="bg-white rounded-3xl shadow-lg h-full p-5 space-y-4 overflow-y-auto">
                            {sections(card).map(section => (
                                <SectionView key={section.title} {...section} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {unit.cards.length > 1 && (
                <div className="flex-shrink-0 flex justify-center items-center pt-2 pb-4 gap-2">
                    {Array.from({ length: unit.cards.length }).map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-teal-500 w-5' : 'bg-gray-300 w-2'}`}></div>
                    ))}
                </div>
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
        <div className="p-6 text-center flex flex-col items-center justify-between h-full bg-white rounded-t-3xl">
            <div className="w-full">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                    <ExerciseIcon className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{unit.exercise.title}</h3>
                <div className="text-gray-600 leading-loose whitespace-pre-line text-lg mb-6">
                    {unit.exercise.instructions}
                </div>
                {isEvaluationUnit && (
                     <div className="my-6">
                        <button 
                            onClick={handleRecord}
                            disabled={isRecording || isSaved}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                                isRecording ? 'bg-red-500' : isSaved ? 'bg-green-500' : 'bg-teal-600 hover:bg-teal-700'
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
                className="w-full max-w-sm mt-8 px-6 py-4 rounded-2xl bg-teal-600 text-white font-bold text-xl shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
            >
                {isCompleted && <CheckCircleIcon className="w-7 h-7" />}
                {isCompleted ? 'تم الإنجاز بنجاح' : unit.exercise.cta_label}
            </button>
        </div>
    );
};

const RewardContent: React.FC<{ unit: Unit, isClaimed: boolean, onClaim: () => void, onBack: () => void }> = ({ unit, isClaimed, onClaim, onBack }) => {
    useEffect(() => {
        if (!isClaimed) {
            onClaim();
        }
    }, [isClaimed, onClaim]);

    return (
      <div className="p-6 text-center flex flex-col items-center justify-between h-full bg-gradient-to-b from-yellow-50 to-white rounded-t-3xl">
          <div className="w-full">
            <div className="relative w-40 h-40 mx-auto mb-4 animate-pulse">
                <StarIcon className="w-full h-full text-yellow-400" />
                <div className="absolute inset-0 flex items-center justify-center animate-ping once">
                    <StarIcon className="w-24 h-24 text-yellow-300" />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">مكافأة رائعة!</h3>
            <p className="text-lg text-gray-600 mt-2">لقد أنجزت الوحدة وحصلت على:</p>
            <div className="mt-6 flex justify-center items-center gap-4">
                <div className="px-5 py-3 bg-white border-2 border-yellow-300 shadow-md text-gray-800 font-bold rounded-full text-lg">
                    شارة "{unit.reward.badge}"
                </div>
                <div className="px-5 py-3 bg-yellow-400 text-white font-bold rounded-full text-lg shadow-lg">
                    {unit.reward.points} نقطة
                </div>
            </div>
            <p className="mt-8 text-gray-700 leading-relaxed text-lg max-w-prose mx-auto">{unit.reward.message}</p>
        </div>
        <button
            onClick={onBack}
            className="w-full max-w-sm mt-8 px-6 py-4 rounded-2xl bg-teal-600 text-white font-bold text-xl shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105"
        >
            متابعة الرحلة
        </button>
      </div>
    );
};

const UnitScreen: React.FC<UnitScreenProps> = ({ unit, unitProgress, onBack, completeCard, completeExercise, claimReward }) => {
  const [activeTab, setActiveTab] = useState<Tab>('cards');

  const allCardsCompleted = unit.cards.length === 0 || unitProgress.completedCards.size >= unit.cards.length;

  useEffect(() => {
    if (allCardsCompleted && activeTab === 'cards') {
      setActiveTab('exercise');
    }
  }, [allCardsCompleted, activeTab]);
  
  useEffect(() => {
    if (unitProgress.exerciseCompleted && activeTab === 'exercise') {
      setActiveTab('reward');
    }
  }, [unitProgress.exerciseCompleted, activeTab]);

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F4]">
      <header className="relative flex items-center justify-between py-4 px-4 flex-shrink-0">
        <button onClick={onBack} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
          <ChevronRightIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-gray-800 truncate w-2/3 text-center" title={unit.title}>
          {unit.title}
        </h1>
        <div className="w-12"></div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {activeTab === 'cards' && <CardContent unit={unit} onCardComplete={(cardId) => completeCard(unit.unit_id, cardId)} />}
        {activeTab === 'exercise' && <ExerciseContent unit={unit} isCompleted={unitProgress.exerciseCompleted} onComplete={() => completeExercise(unit.unit_id)} />}
        {activeTab === 'reward' && <RewardContent unit={unit} isClaimed={unitProgress.rewardClaimed} onClaim={() => claimReward(unit.unit_id)} onBack={onBack} />}
      </main>

      <footer className="flex-shrink-0">
          <BottomNavBar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            progress={{
                cards: allCardsCompleted,
                exercise: unitProgress.exerciseCompleted,
                reward: unitProgress.rewardClaimed
            }}
          />
      </footer>
    </div>
  );
};

export default UnitScreen;
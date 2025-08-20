import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XIcon from './icons/XIcon';
import StarIcon from './icons/StarIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { playSound } from '../utils/sounds';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onComplete: () => void;
  addPoints: (amount: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, questions, onComplete, addPoints }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const POINTS_PER_CORRECT_ANSWER = 2;

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setPointsEarned(0);
    }
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const isQuizFinished = currentQuestionIndex >= questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correct_option_index) {
      playSound('correct');
      setScore(s => s + 1);
      const points = POINTS_PER_CORRECT_ANSWER;
      addPoints(points);
      setPointsEarned(p => p + points);
    } else {
        playSound('incorrect');
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentQuestionIndex(i => i + 1);
  };
  
  const getOptionClasses = (index: number) => {
    if (!isAnswered) {
      return selectedOption === index 
        ? 'bg-yellow-600 border-yellow-400' 
        : 'bg-slate-700/80 border-slate-600 hover:border-gold-royal';
    }
    
    if (index === currentQuestion.correct_option_index) {
      return 'bg-green-700 border-green-500';
    }
    
    if (index === selectedOption) {
      return 'bg-red-700 border-red-500';
    }

    return 'bg-slate-800 border-slate-700 opacity-60';
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
            className="bg-slate-900/95 backdrop-blur-sm border-2 border-gold-royal/50 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[95vh] animate-fade-in"
            onClick={e => e.stopPropagation()}
        >
          {isQuizFinished ? (
            // --- Results View ---
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
              <StarIcon className="w-24 h-24 text-yellow-400 mb-4" />
              <h2 className="text-3xl font-bold text-gold-royal mb-2">أحسنت!</h2>
              <p className="text-xl text-slate-300 mb-6">أكملت الاختبار بنجاح.</p>
              <div className="bg-slate-800 rounded-lg p-6 w-full">
                <div className="flex justify-around">
                    <div className="text-center">
                        <p className="text-lg text-slate-400">النتيجة</p>
                        <p className="text-3xl font-bold text-white">{score} / {questions.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg text-slate-400">النقاط المكتسبة</p>
                        <p className="text-3xl font-bold text-yellow-400">+{pointsEarned}</p>
                    </div>
                </div>
              </div>
              <button 
                onClick={() => {
                    playSound('complete');
                    onComplete();
                }}
                className="w-full mt-8 px-6 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
              >
                متابعة الرحلة
              </button>
            </div>
          ) : (
            // --- Question View ---
            <>
              <header className="relative p-4 border-b-2 border-gold-royal/30">
                <h2 className="text-xl font-bold text-center text-gold-royal">اختبر معلوماتك</h2>
                <p className="text-center text-slate-400">السؤال {currentQuestionIndex + 1} من {questions.length}</p>
                <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 start-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition" aria-label="إغلاق">
                  <XIcon className="w-6 h-6" />
                </button>
              </header>

              <main className="p-6 overflow-y-auto flex-1">
                <p className="text-slate-200 leading-relaxed text-2xl font-semibold text-center mb-8">{currentQuestion.question}</p>
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button 
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-lg font-medium text-right text-white border-2 transition-all duration-300 ${getOptionClasses(index)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {isAnswered && (
                  <div className="mt-6 p-4 bg-slate-800 rounded-lg animate-fade-in">
                    <h3 className={`text-lg font-bold ${selectedOption === currentQuestion.correct_option_index ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedOption === currentQuestion.correct_option_index ? 'إجابة صحيحة!' : 'إجابة غير صحيحة'}
                    </h3>
                    <p className="text-slate-300 mt-2">{currentQuestion.explanation}</p>
                  </div>
                )}
              </main>

              <footer className="p-4 border-t-2 border-gold-royal/30">
                {isAnswered ? (
                  <button 
                    onClick={handleNextQuestion}
                    className="w-full px-6 py-4 rounded-xl bg-yellow-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                ) : (
                  <button 
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    className="w-full px-6 py-4 rounded-xl bg-green-700 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    <CheckCircleIcon className="w-7 h-7" />
                    تحقق من الإجابة
                  </button>
                )}
              </footer>
            </>
          )}
        </div>
    </div>
  );
};

export default QuizModal;
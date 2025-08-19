import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, UnitProgress, Unit, Level } from '../types';
import { appData } from '../data/content';

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const findUnitById = (unitId: number): Unit | null => {
    for (const level of appData.levels) {
        const unit = level.units.find(u => u.unit_id === unitId);
        if (unit) {
            return unit;
        }
    }
    return null;
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({});
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<{ count: number; lastDate: string | null }>({ count: 0, lastDate: null });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('userProgress');
      const savedPoints = localStorage.getItem('userPoints');
      const savedStreak = localStorage.getItem('userStreak');
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        // Convert array of card IDs back to a Set
        for (const unitId in parsedProgress) {
          if (parsedProgress[unitId].completedCards && Array.isArray(parsedProgress[unitId].completedCards)) {
            parsedProgress[unitId].completedCards = new Set(parsedProgress[unitId].completedCards);
          }
        }
        setProgress(parsedProgress);
      }
      if (savedPoints) {
        setPoints(JSON.parse(savedPoints));
      }
      if (savedStreak) {
        const parsedStreak = JSON.parse(savedStreak);
        const today = new Date();
        const lastDate = parsedStreak.lastDate ? new Date(parsedStreak.lastDate) : null;
        
        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          if (!isSameDay(lastDate, today) && !isSameDay(lastDate, yesterday)) {
             setStreak({ count: 0, lastDate: null }); // Reset streak
          } else {
             setStreak(parsedStreak);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveData = useCallback(() => {
    try {
      // Convert Set to Array for JSON serialization
      const serializableProgress: { [key: number]: any } = {};
      for (const unitId in progress) {
        serializableProgress[unitId] = {
          ...progress[unitId],
          completedCards: Array.from(progress[unitId].completedCards),
        };
      }
      localStorage.setItem('userProgress', JSON.stringify(serializableProgress));
      localStorage.setItem('userPoints', JSON.stringify(points));
      localStorage.setItem('userStreak', JSON.stringify(streak));
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [progress, points, streak]);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [progress, points, streak, isLoaded, saveData]);
  
  const updateStreak = useCallback(() => {
    const today = new Date();
    const lastDate = streak.lastDate ? new Date(streak.lastDate) : null;
  
    if (!lastDate || !isSameDay(lastDate, today)) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
  
      if (lastDate && isSameDay(lastDate, yesterday)) {
        // Continue streak
        setStreak({ count: streak.count + 1, lastDate: today.toISOString() });
      } else {
        // Start new streak
        setStreak({ count: 1, lastDate: today.toISOString() });
      }
    }
  }, [streak, setStreak]);

  const getUnitProgress = useCallback((unitId: number): UnitProgress => {
    return progress[unitId] || {
      completedCards: new Set(),
      exerciseCompleted: false,
      rewardClaimed: false,
    };
  }, [progress]);

  const addPoints = useCallback((amount: number) => {
    setPoints(p => p + amount);
  }, []);

  const completeCard = useCallback((unitId: number, cardId: string) => {
    setProgress(prev => {
      const unitProgress = prev[unitId] || { completedCards: new Set(), exerciseCompleted: false, rewardClaimed: false };
      if (!unitProgress.completedCards.has(cardId)) {
        const newCompletedCards = new Set(unitProgress.completedCards);
        newCompletedCards.add(cardId);
        setPoints(p => p + 5);
        return { ...prev, [unitId]: { ...unitProgress, completedCards: newCompletedCards } };
      }
      return prev;
    });
  }, []);

  const completeExercise = useCallback((unitId: number) => {
    const unitProgress = getUnitProgress(unitId);
    if (!unitProgress.exerciseCompleted) {
      setProgress(prev => ({
        ...prev,
        [unitId]: { ...unitProgress, exerciseCompleted: true },
      }));
      setPoints(p => p + 10);
      updateStreak();
    }
  }, [getUnitProgress, updateStreak]);

  const claimReward = useCallback((unitId: number) => {
    const unitProgress = getUnitProgress(unitId);
    if (!unitProgress.rewardClaimed) {
      const unit = findUnitById(unitId);
      if (unit) {
        setProgress(prev => ({
          ...prev,
          [unitId]: { ...unitProgress, rewardClaimed: true },
        }));
        setPoints(p => p + (unit.reward.points || 0));
      }
    }
  }, [getUnitProgress]);

  const isUnitCompleted = useCallback((unit: Unit) => {
    if (!unit) return false;
    const unitProgress = getUnitProgress(unit.unit_id);
    const allCardsCompleted = unit.cards.length === 0 || unitProgress.completedCards.size >= unit.cards.length;
    return allCardsCompleted && unitProgress.exerciseCompleted && unitProgress.rewardClaimed;
  }, [getUnitProgress]);
  
  const completedUnitsCount = useCallback((level: Level) => {
      if (!level) return 0;
      return level.units.filter(u => isUnitCompleted(u)).length;
  }, [isUnitCompleted]);

  const isLevelCompleted = useCallback((level: Level) => {
    if (!level || level.units.length === 0) return false;
    return level.units.every(unit => isUnitCompleted(unit));
  }, [isUnitCompleted]);

  return {
    progress,
    points,
    streak,
    isLoaded,
    getUnitProgress,
    completeCard,
    completeExercise,
    claimReward,
    isUnitCompleted,
    isLevelCompleted,
    completedUnitsCount,
    addPoints,
  };
};
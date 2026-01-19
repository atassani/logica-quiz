'use client';
import { useEffect } from 'react';
import { AreaType } from '../types';

// Custom hook for persisting and loading quiz preferences
export function useQuizPersistence(
  selectedArea: AreaType | null,
  current: number | null,
  shuffleQuestions: boolean,
  setShuffleQuestions: (value: boolean) => void,
  shuffleAnswers: boolean,
  setShuffleAnswers: (value: boolean) => void,
  status: Record<number, 'correct' | 'fail' | 'pending'>,
  questionsLength: number
) {
  // Persist current question index per area
  useEffect(() => {
    if (selectedArea && current !== null) {
      const areaKey = selectedArea.shortName;
      localStorage.setItem(`currentQuestion_${areaKey}`, String(current));
    }
  }, [selectedArea, current]);

  // Persist question order preference per area
  useEffect(() => {
    if (selectedArea && shuffleQuestions !== undefined) {
      const areaKey = selectedArea.shortName;
      localStorage.setItem(`shuffleQuestions_${areaKey}`, JSON.stringify(shuffleQuestions));
    }
  }, [shuffleQuestions]); // Only run when shuffleQuestions changes, not when selectedArea changes

  // Load question order preference when area changes
  useEffect(() => {
    if (selectedArea) {
      const areaKey = selectedArea.shortName;
      const saved = localStorage.getItem(`shuffleQuestions_${areaKey}`);
      if (saved !== null) {
        setShuffleQuestions(JSON.parse(saved));
      } else {
        // Default to true (random/shuffled) for new areas
        setShuffleQuestions(true);
      }
    }
  }, [selectedArea, setShuffleQuestions]);

  // Persist answer order preference per area
  useEffect(() => {
    if (selectedArea && shuffleAnswers !== undefined) {
      const areaKey = selectedArea.shortName;
      localStorage.setItem(`shuffleAnswers_${areaKey}`, JSON.stringify(shuffleAnswers));
    }
  }, [shuffleAnswers]); // Only run when shuffleAnswers changes, not when selectedArea changes

  // Load answer order preference when area changes
  useEffect(() => {
    if (selectedArea) {
      const areaKey = selectedArea.shortName;
      const saved = localStorage.getItem(`shuffleAnswers_${areaKey}`);
      if (saved !== null) {
        setShuffleAnswers(JSON.parse(saved));
      } else {
        // Default to false (no shuffle) for new areas
        setShuffleAnswers(false);
      }
    }
  }, [selectedArea, setShuffleAnswers]);

  // Persist status to localStorage whenever it changes
  useEffect(() => {
    if (questionsLength > 0 && selectedArea) {
      const areaKey = selectedArea.shortName;
      // Only persist if the status corresponds to the current area's questions
      // Check by comparing status keys with questions length
      const statusKeys = Object.keys(status).map(Number);
      const expectedLength = questionsLength;
      const statusMatchesCurrentArea = statusKeys.length === expectedLength;

      if (statusMatchesCurrentArea) {
        localStorage.setItem(`quizStatus_${areaKey}`, JSON.stringify(status));
      }
    }
  }, [status, questionsLength, selectedArea]);
}

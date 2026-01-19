'use client';
import React from 'react';
import { QuestionType, AreaType } from '../types';
import { formatRichText, groupBySection } from '../utils';
import {
  EMOJI_SUCCESS,
  EMOJI_FAIL,
  EMOJI_ASK,
  EMOJI_SECTION,
  EMOJI_PROGRESS,
  EMOJI_DONE,
} from '../constants';

interface ResultDisplayProps {
  selectedArea: AreaType | null;
  questions: QuestionType[];
  current: number | null;
  currentQuizType: 'True False' | 'Multiple Choice' | null;
  showResult: null | { correct: boolean; explanation: string };
  status: Record<number, 'correct' | 'fail' | 'pending'>;
  handleContinue: (action: 'C' | 'E') => void;
  resetQuiz: () => void;
}

export function ResultDisplay({
  selectedArea,
  questions,
  current,
  currentQuizType,
  showResult,
  status,
  handleContinue,
  resetQuiz,
}: ResultDisplayProps) {
  const allAnswered =
    questions.length > 0 && Object.values(status).filter((s) => s === 'pending').length === 0;

  // Single question result display
  if (showResult) {
    return (
      <div className="space-y-4">
        {/* Show area name at top */}
        {selectedArea && (
          <div className="text-lg font-bold text-blue-600 mb-2">🎓 Área: {selectedArea.area}</div>
        )}
        {current !== null && questions[current] && (
          <>
            <div className="font-bold text-lg">
              {EMOJI_SECTION} {questions[current].section}
            </div>
            <div
              className="text-xl font-semibold rich-content question-text"
              dangerouslySetInnerHTML={formatRichText(
                `${questions[current].number}. ${questions[current].question}`
              )}
            ></div>
          </>
        )}
        <div className="text-2xl">
          {showResult.correct ? EMOJI_SUCCESS + ' ¡Correcto!' : EMOJI_FAIL + ' Incorrecto.'}
        </div>
        <div
          className={`text-base font-semibold mt-2 rich-content ${showResult.correct ? 'text-green-600' : 'text-red-600'}`}
          dangerouslySetInnerHTML={formatRichText(
            current !== null && questions[current]
              ? currentQuizType === 'Multiple Choice'
                ? (() => {
                    const q = questions[current];
                    const answerIndex = q.options?.findIndex((option) => option === q.answer) ?? -1;
                    const answerLetter =
                      answerIndex >= 0 ? String.fromCharCode(65 + answerIndex) : '';
                    return `Respuesta esperada ${answerLetter}) ${q.answer}`;
                  })()
                : questions[current].answer
              : ''
          )}
        ></div>
        <div
          className="text-base rich-content"
          dangerouslySetInnerHTML={formatRichText(showResult.explanation)}
        ></div>
        {/* appearsIn bullet list if present */}
        {current !== null &&
          questions[current] &&
          Array.isArray(questions[current].appearsIn) &&
          questions[current].appearsIn.length > 0 && (
            <div className="mt-2">
              <div className="text-sm text-gray-500">Aparece en:</div>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-500">
                {questions[current].appearsIn.map((ref: string, idx: number) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => handleContinue('C')}
          >
            Continuar
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => handleContinue('E')}
          >
            Options
          </button>
        </div>
      </div>
    );
  }

  // Quiz completion summary display
  if (allAnswered) {
    const grouped = groupBySection(questions);
    const correctCount = Object.values(status).filter((s) => s === 'correct').length;
    const failCount = Object.values(status).filter((s) => s === 'fail').length;
    const pendingCount = questions.length - (correctCount + failCount);

    return (
      <div className="space-y-8 mt-8">
        {/* Show area name at top */}
        {selectedArea && (
          <div className="text-lg font-bold text-blue-600 mb-2">🎓 Área: {selectedArea.area}</div>
        )}
        <div className="text-2xl font-bold">{EMOJI_DONE} ¡Quiz completado!</div>
        <div className="mt-2 text-base flex items-center gap-2">
          {EMOJI_PROGRESS} {questions.length}
          <span className="ml-2">
            {EMOJI_SUCCESS} {correctCount}
          </span>
          <span>
            {EMOJI_ASK} {pendingCount}
          </span>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-orange-500 text-white rounded" onClick={resetQuiz}>
            🔄 Volver a empezar
          </button>
        </div>
        {[...grouped.entries()].map(([section, qs]) => (
          <div key={section}>
            <div className="font-bold text-lg mb-2">
              {EMOJI_SECTION} {section}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {qs.map((q: QuestionType) => {
                let emoji = EMOJI_ASK;
                if (status[q.index] === 'correct') emoji = EMOJI_SUCCESS;
                else if (status[q.index] === 'fail') emoji = EMOJI_FAIL;
                return (
                  <div key={q.index} className="flex flex-col items-center">
                    <span className="text-2xl">
                      {q.number}
                      {emoji}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <span>{EMOJI_SUCCESS} = Correcta </span>
          <span>{EMOJI_FAIL} = Fallada </span>
          <span>{EMOJI_ASK} = Pendiente</span>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="px-4 py-2 bg-orange-500 text-white rounded" onClick={resetQuiz}>
            🔄 Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  return null;
}

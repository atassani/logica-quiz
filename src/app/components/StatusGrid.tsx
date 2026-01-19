import { QuestionType, AreaType } from '../types';
import { groupBySection } from '../utils';
import {
  EMOJI_SUCCESS,
  EMOJI_FAIL,
  EMOJI_ASK,
  EMOJI_SECTION,
  EMOJI_PROGRESS,
  EMOJI_DONE,
} from '../constants';

interface StatusGridProps {
  selectedArea: AreaType | null;
  questions: QuestionType[];
  status: Record<number, 'correct' | 'fail' | 'pending'>;
  handleContinue: (option: string) => void;
  pendingQuestions: () => [number, QuestionType][];
  resetQuiz: () => void;
  setShowAreaSelection: (show: boolean) => void;
  setShowStatus: (show: boolean) => void;
  setShowResult: (result: null | { correct: boolean; explanation: string }) => void;
}

export function StatusGrid({
  selectedArea,
  questions,
  status,
  handleContinue,
  pendingQuestions,
  resetQuiz,
  setShowAreaSelection,
  setShowStatus,
  setShowResult,
}: StatusGridProps) {
  const grouped = groupBySection(questions);
  const correctCount = Object.values(status).filter((s) => s === 'correct').length;
  const failCount = Object.values(status).filter((s) => s === 'fail').length;
  const pendingCount = questions.length - (correctCount + failCount);

  const actionButtons = (
    <div className="flex gap-4 mt-6">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => handleContinue('C')}
        disabled={pendingQuestions().length === 0}
        aria-label="Continuar"
      >
        {pendingQuestions().length === 0 ? EMOJI_DONE + ' ¡Completado!' : 'Continuar'}
      </button>
      <button
        className="px-4 py-2 bg-orange-500 text-white rounded"
        onClick={resetQuiz}
        onTouchEnd={resetQuiz}
        aria-label="Volver a empezar"
      >
        🔄 Volver a empezar
      </button>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded"
        onClick={() => {
          setShowAreaSelection(true);
          setShowStatus(false);
          setShowResult(null);
        }}
        aria-label="Cambiar área"
      >
        Cambiar área
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Show area name at top */}
      {selectedArea && (
        <div className="text-lg font-bold text-blue-600 mb-2">🎓 Área: {selectedArea.area}</div>
      )}
      {actionButtons}
      <div className="mt-2 text-base flex items-center gap-2">
        {EMOJI_PROGRESS} {questions.length}
        <span className="ml-2">
          | {EMOJI_SUCCESS} {correctCount}
        </span>
        <span>
          | {EMOJI_FAIL} {failCount}
        </span>
        <span>
          | {EMOJI_ASK} {pendingCount}
        </span>
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
      {actionButtons}
    </div>
  );
}

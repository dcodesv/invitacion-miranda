import { useState, useEffect, useCallback } from 'react';
import {
  getGameState,
  getQuestions,
  submitQuizResponse,
  getQuizResponses,
} from '../services/quizService';

export function useQuiz() {
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState({ isActive: true, title: '¿Qué tanto conoces al cumpleañero?' });
  const [questions, setQuestions] = useState([]);
  
  // Game session state
  const [participantName, setParticipantName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  
  // Finish & leaderboard state
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Initialize data from Supabase
  const initQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const [state, fetchedQuestions] = await Promise.all([
        getGameState(),
        getQuestions(),
      ]);
      setGameState(state);
      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error('Failed to init quiz:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initQuiz();
  }, [initQuiz]);

  // Start the quiz
  const startQuiz = useCallback((name) => {
    if (!name || !name.trim()) return false;
    setParticipantName(name.trim());
    setHasStarted(true);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setIsCompleted(false);
    setSubmissionSuccess(false);
    return true;
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const data = await getQuizResponses();
      setLeaderboard(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  // Answer current question (supports numeric optionIndex or string text for open questions)
  const answerQuestion = useCallback((answerInput) => {
    if (isAnswerRevealed || selectedOption !== null) return; // Prevent double click

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const isOpenQuestion = !currentQ.options || currentQ.options.length === 0;
    let isCorrect = false;
    let selectedText = '';
    let selectedIndex = null;
    let correctText = '';

    if (isOpenQuestion) {
      const textVal = typeof answerInput === 'object' && answerInput !== null ? answerInput.text : String(answerInput || '');
      selectedText = textVal.trim() || 'Sin respuesta';
      isCorrect = true; // Open answers count as positive participation
      setSelectedOption('submitted_open');
    } else {
      const optionIdx = typeof answerInput === 'number' ? answerInput : Number(answerInput) || 0;
      selectedIndex = optionIdx;
      selectedText = currentQ.options[optionIdx] || '';
      correctText = currentQ.options[currentQ.correct_index] || '';
      isCorrect = optionIdx === currentQ.correct_index;
      setSelectedOption(optionIdx);
    }

    setIsAnswerRevealed(true);

    const record = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      questionType: isOpenQuestion ? 'open' : 'multiple',
      selectedIndex,
      selectedText,
      correctIndex: isOpenQuestion ? null : currentQ.correct_index,
      correctText: isOpenQuestion ? 'Respuesta abierta' : correctText,
      isCorrect,
    };

    const nextAnswers = [...userAnswers, record];
    setUserAnswers(nextAnswers);

    // Short 450ms feedback to register selection before moving to next question
    setTimeout(async () => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
      } else {
        // Quiz completed!
        setIsCompleted(true);
        setIsAnswerRevealed(false);
        setSelectedOption(null);

        // Auto-submit to Supabase
        const finalScore = nextAnswers.filter((a) => a.isCorrect).length;
        setIsSubmitting(true);
        try {
          await submitQuizResponse({
            participant_name: participantName,
            score: finalScore,
            total_questions: questions.length,
            answers: nextAnswers,
          });
          setSubmissionSuccess(true);
          // Refresh leaderboard
          fetchLeaderboard();
        } catch (err) {
          console.error('Failed to submit quiz results:', err);
        } finally {
          setIsSubmitting(false);
        }
      }
    }, 450);
  }, [currentIndex, isAnswerRevealed, questions, selectedOption, userAnswers, participantName, fetchLeaderboard]);

  // Restart quiz
  const resetQuiz = useCallback(() => {
    setHasStarted(false);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setIsCompleted(false);
    setSubmissionSuccess(false);
    initQuiz();
  }, [initQuiz]);

  const score = userAnswers.filter((a) => a.isCorrect).length;
  const currentQuestion = questions[currentIndex] || null;
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return {
    loading,
    gameState,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    participantName,
    hasStarted,
    userAnswers,
    score,
    progressPercent,
    selectedOption,
    isAnswerRevealed,
    isCompleted,
    isSubmitting,
    submissionSuccess,
    leaderboard,
    loadingLeaderboard,
    startQuiz,
    answerQuestion,
    resetQuiz,
    fetchLeaderboard,
    refreshGameState: initQuiz,
  };
}

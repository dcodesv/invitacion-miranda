import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Share2,
  Users,
  Flame,
  Star,
  ChevronRight,
  Smile,
} from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';

// Decorative image assets
import carton from '../images/carton.webp';
import lemonFruit from '../images/lemon.webp';
import lemonBranch from '../images/decoracion2.webp';
import lemonDecor from '../images/decoracion1.webp';
import bannerDisruptivo from '../images/miranda_lite.webp';
import carita from '../images/carita.webp';

// Web Audio synthesizer for playful interactive sound effects
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.5, now + 0.24); // C6

      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'celebrate') {
      [0, 0.1, 0.2, 0.3, 0.4].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freqs[idx], now + delay);
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.25);
      });
    }
  } catch (e) {
    // AudioContext not allowed or unsupported
  }
}

export default function QuizPage() {
  const {
    loading,
    gameState,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    participantName,
    hasStarted,
    userAnswers,
    score,
    progressPercent,
    selectedOption,
    isAnswerRevealed,
    isCompleted,
    isSubmitting,
    leaderboard,
    loadingLeaderboard,
    startQuiz,
    answerQuestion,
    resetQuiz,
    fetchLeaderboard,
    refreshGameState,
  } = useQuiz();

  const [inputName, setInputName] = useState('');
  const [nameError, setNameError] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [openAnswerText, setOpenAnswerText] = useState('');
  const [openAnswerError, setOpenAnswerError] = useState('');

  // Clear open answer text when moving to next question
  useEffect(() => {
    setOpenAnswerText('');
    setOpenAnswerError('');
  }, [currentIndex]);

  // Trigger celebration confetti on finish
  useEffect(() => {
    if (isCompleted) {
      playSound('celebrate');
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#F5C623', '#4A6B52', '#0F3885', '#FFF', '#E91E63'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#F5C623', '#4A6B52', '#0F3885', '#FFF', '#E91E63'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      fetchLeaderboard();
    }
  }, [isCompleted, fetchLeaderboard]);

  const handleStart = (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setNameError('¡Por favor escribe tu nombre para participar!');
      return;
    }
    setNameError('');
    playSound('click');
    startQuiz(inputName);
  };

  const handleOptionSelect = (idx) => {
    if (isAnswerRevealed || selectedOption !== null) return;
    playSound('click');
    answerQuestion(idx);
  };

  const handleOpenAnswerSubmit = (e) => {
    if (e) e.preventDefault();
    if (isAnswerRevealed || selectedOption !== null) return;
    if (!openAnswerText.trim()) {
      setOpenAnswerError('Por favor escribe tu respuesta antes de continuar.');
      return;
    }
    setOpenAnswerError('');
    playSound('correct');
    answerQuestion(openAnswerText.trim());
  };

  const handleShareWhatsApp = () => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const tier = getTier(score, totalQuestions);
    const text = `🎉 ¡Acabo de jugar la trivia "¿Qué tanto conoces al cumpleañero?"!\n` +
      `👤 Participante: ${participantName}\n` +
      `🏆 Puntuación: ${score}/${totalQuestions} (${percentage}%)\n` +
      `✨ Rango: ${tier.title} ${tier.emoji}\n` +
      `¡Juega tú también y ponte a prueba! 🍋💚`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Helper tier generator
  function getTier(aciertos, total) {
    const ratio = total > 0 ? aciertos / total : 0;
    if (ratio === 1) {
      return {
        title: '¡BFF Legendario / Nivel Dios!',
        emoji: '👑',
        badgeColor: 'bg-amber-400 text-amber-950 border-amber-500',
        desc: '¡Lo conoces mejor que nadie en esta fiesta! Sin duda eres del círculo íntimo.',
      };
    } else if (ratio >= 0.75) {
      return {
        title: '¡Amigo Incondicional!',
        emoji: '🌟',
        badgeColor: 'bg-emerald-500 text-white border-emerald-600',
        desc: '¡Gran conocimiento! Tienes muchas anécdotas y momentos compartidos.',
      };
    } else if (ratio >= 0.5) {
      return {
        title: '¡Buen Conocedor!',
        emoji: '😎',
        badgeColor: 'bg-blue-500 text-white border-blue-600',
        desc: '¡Nada mal! Conoces bastantes secretos y detalles del cumpleañero.',
      };
    } else {
      return {
        title: '¡Viniste por el Pastel y los Tragos!',
        emoji: '🍰',
        badgeColor: 'bg-rose-400 text-white border-rose-500',
        desc: '¡Lo importante es festejar y brindar hoy! Aprovecha la fiesta para conocerle mejor.',
      };
    }
  }

  // Letters for multiple choice badges
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];
  const optionColorStyles = [
    'bg-[#FFFDF9] hover:bg-[#FFF9E5] border-[#4A6B52]/40 text-[#2D3748]',
    'bg-[#FFFDF9] hover:bg-[#FFF9E5] border-[#4A6B52]/40 text-[#2D3748]',
    'bg-[#FFFDF9] hover:bg-[#FFF9E5] border-[#4A6B52]/40 text-[#2D3748]',
    'bg-[#FFFDF9] hover:bg-[#FFF9E5] border-[#4A6B52]/40 text-[#2D3748]',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A6B52] flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center space-y-3"
        >
          <img src={lemonFruit} alt="Cargando..." className="w-16 h-16 mx-auto animate-bounce" />
          <p className="font-mansalva text-2xl text-white tracking-wide">Cargando Trivia...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A6B52] azulejo-pattern py-6 px-3 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Animated Corner Decorations */}
      <motion.img
        src={lemonBranch}
        alt="Decoración limones"
        animate={{ y: [0, -6, 0], rotate: [180, 183, 180] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -left-6 w-24 sm:w-36 pointer-events-none select-none z-10 drop-shadow-lg"
      />
      <motion.img
        src={lemonDecor}
        alt="Rama de limones"
        animate={{ y: [0, 6, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-8 -right-6 w-28 sm:w-40 pointer-events-none select-none z-10 drop-shadow-lg"
      />

      {/* Main Container Card with Carton Background */}
      <div
        style={{
          backgroundImage: `url(${carton})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '450px',
          backgroundPosition: 'center',
        }}
        className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl shadow-black/50 p-4 sm:p-7 text-slate-800 border-4 border-white z-20 my-2"
      >
        {/* Top Floating Mini Hero Banner */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full overflow-hidden rounded-2xl mb-4 p-0.5 shadow-md bg-white/40"
        >
          <img
            src={bannerDisruptivo}
            alt="Banner Disruptivo"
            className="w-full h-auto object-cover rounded-xl select-none"
          />
        </motion.div>

        {/* ========================================================== */}
        {/* STATE 1: GAME IS CURRENTLY INACTIVE / PAUSED BY ADMIN      */}
        {/* ========================================================== */}
        {!gameState.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFDF9]/95 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-[#C59B27]/50 shadow-lg space-y-5"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-inner"
            >
              <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
            </motion.div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-mansalva text-sm rounded-full border border-amber-300 font-bold uppercase tracking-wider">
                ⏳ Dinámica en Espera
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A6B52] font-mansalva">
                ¡Aún no está disponible!
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-sans max-w-md mx-auto">
                El cumpleañero activará esta dinámica durante la fiesta para que todos jueguen al mismo tiempo. ¡Mantente atento!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  refreshGameState();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A6B52] hover:bg-[#3d5843] text-white font-mansalva text-base tracking-wider font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Comprobar si ya inició
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================== */}
        {/* STATE 2: REGISTRATION SCREEN (Enter Participant Name)      */}
        {/* ========================================================== */}
        {gameState.isActive && !hasStarted && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFDF9]/95 backdrop-blur-sm rounded-2xl p-5 sm:p-7 border-2 border-white shadow-xl text-center space-y-5"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-[#4A6B52]">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-400 animate-bounce" />
                <span className="font-mansalva font-bold text-xl sm:text-2xl tracking-wide uppercase">
                  Trivia Cumpleañera
                </span>
                <Flame className="w-6 h-6 text-amber-500 fill-amber-400 animate-bounce" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mansalva">
                ¿Qué tanto conoces al cumpleañero?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Pon a prueba tu memoria y demuestra si eres su amigo #1 respondiendo {totalQuestions} preguntas rápidas.
              </p>
            </div>

              {totalQuestions === 0 ? (
                <div className="py-6 space-y-3 bg-amber-50/70 rounded-2xl border border-amber-200 p-4">
                  <p className="text-sm font-semibold text-amber-900 font-sans">
                    Aún no hay preguntas cargadas en la trivia.
                  </p>
                  <p className="text-xs text-amber-700 font-sans">
                    El administrador está preparando el cuestionario. ¡Vuelve pronto!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStart} className="space-y-4 pt-2">
                  <div className="text-left space-y-1">
                    <label className="block text-xs font-bold text-[#4A6B52] uppercase tracking-wider">
                      Tu Nombre o Apodo:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Sofía, Carlos..."
                      value={inputName}
                      onChange={(e) => {
                        setInputName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      maxLength={40}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#4A6B52]/40 bg-white text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-[#4A6B52] focus:ring-2 focus:ring-[#4A6B52]/20 text-base shadow-sm transition-all"
                      autoFocus
                    />
                    {nameError && (
                      <p className="text-xs text-rose-600 font-semibold pt-1 animate-shake">
                        {nameError}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F5C623] to-[#e6b815] hover:from-[#e6b815] hover:to-[#d8a80a] text-slate-900 font-mansalva text-lg tracking-wider font-extrabold shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 border-2 border-white cursor-pointer transition-all"
                  >
                    <span>¡Comenzar Trivia!</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>
              )}

            <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {totalQuestions} preguntas
              </span>
              <button
                type="button"
                onClick={() => {
                  fetchLeaderboard();
                  setShowLeaderboard(!showLeaderboard);
                }}
                className="text-[#4A6B52] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                {showLeaderboard ? 'Ocultar Ranking' : 'Ver Tabla de Posiciones'}
              </button>
            </div>

            {/* Quick Leaderboard Modal / Drawer */}
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-left space-y-2 max-h-60 overflow-y-auto"
              >
                <div className="flex items-center justify-between font-mansalva text-sm font-bold text-[#4A6B52]">
                  <span>🏆 Ranking Actual</span>
                  <span className="text-xs font-sans text-slate-500 font-normal">
                    {leaderboard.length} jugadores
                  </span>
                </div>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2 text-center">
                    Aún no hay respuestas. ¡Sé el primero en jugar!
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {leaderboard.slice(0, 10).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-amber-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate max-w-[180px]">
                          <span className="font-mono text-amber-700 font-bold">#{idx + 1}</span>
                          {item.participant_name}
                        </span>
                        <span className="font-bold text-[#4A6B52] font-mono">
                          {item.score}/{item.total_questions} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ========================================================== */}
        {/* STATE 3: INTERACTIVE QUIZ QUESTIONS IN PROGRESS           */}
        {/* ========================================================== */}
        {gameState.isActive && hasStarted && !isCompleted && currentQuestion && (
          <div className="space-y-4">
            {/* Top Bar: Participant name & Progress Bar */}
            <div className="bg-[#FFFDF9]/95 rounded-2xl p-3.5 border-2 border-white shadow-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#4A6B52]">
                <span className="flex items-center gap-1 font-mansalva text-sm">
                  <Smile className="w-4 h-4 text-amber-500" />
                  Jugador: <span className="text-slate-800">{participantName}</span>
                </span>
                <span className="bg-[#4A6B52] text-white px-2.5 py-0.5 rounded-full font-mansalva text-xs tracking-wider">
                  {currentIndex + 1} de {totalQuestions}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#F5C623] to-[#4A6B52] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id || currentIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFDF9]/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-2 border-white shadow-xl space-y-5"
              >
                {/* Question Text */}
                <div className="text-center space-y-2">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-mansalva text-xs font-bold rounded-full border border-amber-300">
                    Pregunta #{currentIndex + 1}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A6B52] font-mansalva leading-snug">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Question Type Logic */}
                {(() => {
                  const isOpenQuestion = !currentQuestion.options || currentQuestion.options.length === 0;

                  if (isOpenQuestion) {
                    return (
                      <form onSubmit={handleOpenAnswerSubmit} className="space-y-4 pt-1">
                        <div className="space-y-1.5 text-left">
                          <label className="block text-xs font-bold text-[#4A6B52] uppercase tracking-wider flex items-center justify-between">
                            <span>Tu Respuesta o Mensaje:</span>
                            <span className="text-slate-400 font-normal lowercase">{openAnswerText.length}/280</span>
                          </label>
                          <textarea
                            rows={3}
                            maxLength={280}
                            disabled={isAnswerRevealed}
                            value={openAnswerText}
                            onChange={(e) => {
                              setOpenAnswerText(e.target.value);
                              if (openAnswerError) setOpenAnswerError('');
                            }}
                            placeholder="Escribe tu respuesta, recuerdo o anécdota aquí..."
                            className="w-full p-4 rounded-2xl border-2 border-[#4A6B52]/40 bg-white text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#4A6B52] focus:ring-2 focus:ring-[#4A6B52]/20 shadow-xs transition-all resize-none"
                            autoFocus
                          />
                          {openAnswerError && (
                            <p className="text-xs text-rose-600 font-semibold pt-0.5 animate-shake">
                              {openAnswerError}
                            </p>
                          )}
                        </div>

                        <motion.button
                          whileHover={!isAnswerRevealed ? { scale: 1.02 } : {}}
                          whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                          type="submit"
                          disabled={isAnswerRevealed || !openAnswerText.trim()}
                          className={`w-full py-3.5 px-6 rounded-2xl font-mansalva text-base tracking-wider font-extrabold shadow-lg flex items-center justify-center gap-2 border-2 border-white cursor-pointer transition-all ${
                            isAnswerRevealed
                              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                              : 'bg-gradient-to-r from-[#F5C623] to-[#e6b815] hover:from-[#e6b815] text-slate-900 shadow-amber-500/30'
                          }`}
                        >
                          {isAnswerRevealed ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-white" />
                              <span>¡Respuesta Enviada!</span>
                            </>
                          ) : (
                            <>
                              <span>Continuar / Enviar Respuesta</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </form>
                    );
                  }

                  // Multiple Choice Options List
                  return (
                    <div className="space-y-2.5 pt-1">
                      {currentQuestion.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;

                        let buttonStateStyles = optionColorStyles[optIdx % optionColorStyles.length];

                        if (isAnswerRevealed) {
                          if (isSelected) {
                            buttonStateStyles = 'bg-[#4A6B52] text-white border-[#3d5843] shadow-md scale-[1.01]';
                          } else {
                            buttonStateStyles = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
                          }
                        }

                        return (
                          <motion.button
                            key={optIdx}
                            whileHover={!isAnswerRevealed ? { scale: 1.015, x: 2 } : {}}
                            whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                            onClick={() => handleOptionSelect(optIdx)}
                            disabled={isAnswerRevealed}
                            className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 font-medium text-sm sm:text-base flex items-center justify-between text-left transition-all cursor-pointer shadow-xs ${buttonStateStyles}`}
                          >
                            <div className="flex items-center gap-3 pr-2">
                              <span
                                className={`w-7 h-7 rounded-xl font-mansalva font-bold text-sm flex items-center justify-center shrink-0 border ${
                                  isAnswerRevealed && isSelected
                                    ? 'bg-white/20 text-white border-white/40'
                                    : 'bg-[#4A6B52]/10 text-[#4A6B52] border-[#4A6B52]/30'
                                }`}
                              >
                                {optionLetters[optIdx] || optIdx + 1}
                              </span>
                              <span className="font-sans font-semibold leading-snug">{opt}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Subtle transition note */}
                {isAnswerRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center font-mansalva text-xs pt-0.5 font-semibold text-slate-500"
                  >
                    Guardando respuesta...
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================== */}
        {/* STATE 4: FINAL RESULTS, SCORE, BADGE & LEADERBOARD         */}
        {/* ========================================================== */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFDF9]/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border-2 border-white shadow-2xl space-y-6 text-center"
          >
            {/* Header Tier Badge */}
            {(() => {
              const tier = getTier(score, totalQuestions);
              const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

              return (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-5xl block animate-bounce">{tier.emoji}</span>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full font-mansalva font-extrabold text-sm sm:text-base border shadow-sm ${tier.badgeColor}`}
                    >
                      {tier.title}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A6B52] font-mansalva pt-1">
                      ¡Trivia Finalizada!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-sans">
                      {tier.desc}
                    </p>
                  </div>

                  {/* Big Score Card */}
                  <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 shadow-inner flex items-center justify-around">
                    <div className="text-center">
                      <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Aciertos
                      </span>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mansalva text-[#4A6B52]">
                        {score} <span className="text-xl text-slate-400 font-sans">/ {totalQuestions}</span>
                      </span>
                    </div>

                    <div className="h-10 w-px bg-amber-300" />

                    <div className="text-center">
                      <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Efectividad
                      </span>
                      <span className="text-4xl sm:text-5xl font-extrabold font-mansalva text-amber-600">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {isSubmitting && (
                    <p className="text-xs text-[#4A6B52] animate-pulse font-medium">
                      Guardando tu puntuación en Supabase...
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Action Buttons: WhatsApp share, Play again, View Leaderboard */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-mansalva text-base tracking-wider font-extrabold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-white"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartir mi resultado en WhatsApp</span>
              </motion.button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="flex-1 py-3 px-3 rounded-2xl bg-white hover:bg-slate-100 text-[#4A6B52] border-2 border-[#4A6B52]/40 font-mansalva text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{showLeaderboard ? 'Ocultar Ranking' : 'Ver Tabla de Posiciones'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="py-3 px-4 rounded-2xl bg-[#4A6B52] hover:bg-[#3d5843] text-white font-mansalva text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar de nuevo</span>
                </button>
              </div>
            </div>

            {/* Summary of Answers Breakdown */}
            <div className="text-left space-y-2.5 pt-2 border-t border-dashed border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-mansalva font-bold text-base text-[#4A6B52] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  Desglose de tus respuestas:
                </h3>
                <span className="text-[11px] text-slate-500 font-sans">
                  {score} de {totalQuestions} correctas
                </span>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {userAnswers.map((ans, idx) => {
                  const isOpen = ans.questionType === 'open' || ans.correctText === 'Respuesta abierta';

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${
                        isOpen
                          ? 'bg-blue-50/80 border-blue-200 shadow-2xs'
                          : ans.isCorrect
                          ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                          : 'bg-rose-50/90 border-rose-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-800 text-xs">
                          {idx + 1}. {ans.questionText}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 uppercase tracking-wider ${
                            isOpen
                              ? 'bg-blue-600 text-white'
                              : ans.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {isOpen ? '✍️ Abierta' : ans.isCorrect ? '✓ Correcto' : '✕ Incorrecto'}
                        </span>
                      </div>

                      {isOpen ? (
                        <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200/60 text-slate-700 space-y-0.5">
                          <span className="text-[10px] font-bold text-blue-800 uppercase block">
                            Tu respuesta / mensaje:
                          </span>
                          <p className="font-semibold text-slate-900 whitespace-pre-wrap text-xs">
                            {ans.selectedText || '(Sin respuesta)'}
                          </p>
                        </div>
                      ) : ans.isCorrect ? (
                        <div className="bg-white/80 p-2 rounded-xl border border-emerald-200/60 text-emerald-900">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                            Tu respuesta:
                          </span>
                          <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                            <span>✓</span> {ans.selectedText}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/85 p-2.5 rounded-xl border border-rose-200/60 space-y-1.5">
                          <div className="text-rose-900">
                            <span className="text-[10px] font-bold text-rose-600 uppercase block">
                              Tu elección:
                            </span>
                            <p className="font-semibold text-rose-950 text-xs flex items-center gap-1.5">
                              <span>✕</span> {ans.selectedText}
                            </p>
                          </div>
                          <div className="text-emerald-900 pt-1 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                              Respuesta correcta:
                            </span>
                            <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                              <span>✓</span> {ans.correctText}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard Drawer on Results Screen */}
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-50 rounded-2xl p-4 border border-amber-300 text-left space-y-2"
              >
                <div className="flex items-center justify-between font-mansalva text-base font-bold text-[#4A6B52]">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Tabla de Posiciones en Vivo
                  </span>
                  <span className="text-xs font-sans text-slate-500 font-normal">
                    {leaderboard.length} participantes
                  </span>
                </div>

                {loadingLeaderboard ? (
                  <p className="text-xs text-slate-500 text-center py-3 animate-pulse">
                    Actualizando posiciones...
                  </p>
                ) : leaderboard.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-3">
                    Aún no hay más registros guardados.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {leaderboard.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl border shadow-2xs ${
                          item.participant_name.toLowerCase() === participantName.toLowerCase()
                            ? 'bg-amber-200/80 border-amber-400 font-bold'
                            : 'bg-white border-amber-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate max-w-[200px]">
                          <span
                            className={`w-5 h-5 rounded-full font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              idx === 0
                                ? 'bg-amber-400 text-amber-950'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="truncate">{item.participant_name}</span>
                        </div>
                        <div className="text-right font-mono font-bold text-[#4A6B52]">
                          {item.score}/{item.total_questions} ({item.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import {
  getGuests,
  addGuest,
  updateGuestByAdmin,
  deleteGuest,
  resetGuestsData,
} from '../services/guestService';
import {
  getGameState,
  setGameState,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  seedDefaultQuestions,
  getQuizResponses,
  deleteQuizResponse,
  clearAllQuizResponses,
} from '../services/quizService';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserPlus,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  RotateCcw,
  Lock,
  Key,
  Check,
  MessageSquare,
  FileSpreadsheet,
  LogOut,
  Sparkles,
  HelpCircle,
  Trophy,
  Play,
  Pause,
  Plus,
  Eye,
  Download,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Main Tab State: 'guests' | 'quiz'
  const [activeTab, setActiveTab] = useState('guests');

  // ==================== GUESTS STATE ====================
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, confirmed, pending, declined

  // Guest Modal State
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [guestFormData, setGuestFormData] = useState({ name: '', passes: 1, code: '' });
  const [copiedId, setCopiedId] = useState(null);

  // ==================== QUIZ DYNAMICS STATE ====================
  const [quizLoading, setQuizLoading] = useState(false);
  const [gameStateData, setGameStateData] = useState({ isActive: true, title: '¿Qué tanto conoces al cumpleañero?' });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizResponses, setQuizResponses] = useState([]);

  // Question Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correct_index: 0,
    order_index: 1,
  });

  // Response Detail Modal
  const [viewingResponse, setViewingResponse] = useState(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadGuests();
      loadQuizData();
    }
  }, []);

  const loadGuests = () => {
    setGuests(getGuests());
  };

  const loadQuizData = useCallback(async () => {
    setQuizLoading(true);
    try {
      const [state, questions, responses] = await Promise.all([
        getGameState(),
        getQuestions(),
        getQuizResponses(),
      ]);
      setGameStateData(state);
      setQuizQuestions(questions);
      setQuizResponses(responses);
    } catch (err) {
      console.error('Error loading quiz data:', err);
    } finally {
      setQuizLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      if (isAuthenticated) loadGuests();
    };
    window.addEventListener('guests_updated', handleUpdate);
    return () => window.removeEventListener('guests_updated', handleUpdate);
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'cumple2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError(false);
      loadGuests();
      loadQuizData();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // ==================== GUESTS HANDLERS ====================
  const totalGuestsCount = guests.length;
  const totalAllocatedPasses = guests.reduce((sum, g) => sum + g.passes, 0);
  const confirmedCount = guests.filter((g) => g.status === 'confirmed').length;
  const confirmedPasses = guests.reduce(
    (sum, g) => sum + (g.status === 'confirmed' ? g.attendingPasses : 0),
    0
  );
  const declinedCount = guests.filter((g) => g.status === 'declined').length;
  const pendingCount = guests.filter((g) => g.status === 'pending').length;

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateGuestModal = () => {
    setEditingGuest(null);
    setGuestFormData({ name: '', passes: 1, code: '' });
    setIsGuestModalOpen(true);
  };

  const handleOpenEditGuestModal = (guest) => {
    setEditingGuest(guest);
    setGuestFormData({ name: guest.name, passes: guest.passes, code: guest.code });
    setIsGuestModalOpen(true);
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();
    if (!guestFormData.name.trim()) return;

    if (editingGuest) {
      updateGuestByAdmin(editingGuest.id, {
        name: guestFormData.name,
        passes: Number(guestFormData.passes),
        code: guestFormData.code,
      });
    } else {
      addGuest({
        name: guestFormData.name,
        passes: Number(guestFormData.passes),
        code: guestFormData.code,
      });
    }
    setIsGuestModalOpen(false);
    loadGuests();
  };

  const handleDeleteGuest = (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a "${name}" de la lista?`)) {
      deleteGuest(id);
      loadGuests();
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        '¿Deseas restablecer la lista original de invitados? Se perderán las modificaciones actuales.'
      )
    ) {
      resetGuestsData();
      loadGuests();
    }
  };

  const getWhatsAppMessage = (guest) => {
    const baseUrl = window.location.origin;
    const invitationUrl = `${baseUrl}/invitado/${guest.code}`;
    const text = `¡Hola ${guest.name}! 🍋 Te invito a celebrar mi cumpleaños en Quinta Adelaida este 15 de agosto. Tienes ${
      guest.passes
    } ${guest.passes === 1 ? 'pase reservado' : 'pases reservados'}. Por favor confirma tu asistencia aquí:\n${invitationUrl}`;
    return text;
  };

  const handleCopyWhatsApp = (guest) => {
    const message = getWhatsAppMessage(guest);
    navigator.clipboard.writeText(message);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWhatsApp = (guest) => {
    const message = encodeURIComponent(getWhatsAppMessage(guest));
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // ==================== QUIZ DYNAMICS HANDLERS ====================
  const handleToggleGameState = async () => {
    const nextState = !gameStateData.isActive;
    const res = await setGameState(nextState);
    if (res.success) {
      setGameStateData((prev) => ({ ...prev, isActive: nextState }));
    } else {
      alert('Error actualizando el estado de la dinámica en Supabase.');
    }
  };

  const handleOpenCreateQuestionModal = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      question_type: 'multiple',
      question: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      correct_index: 0,
      order_index: quizQuestions.length + 1,
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestionModal = (q) => {
    setEditingQuestion(q);
    const isOpen = !q.options || q.options.length === 0;
    setQuestionFormData({
      question_type: isOpen ? 'open' : 'multiple',
      question: q.question,
      option0: (q.options && q.options[0]) || '',
      option1: (q.options && q.options[1]) || '',
      option2: (q.options && q.options[2]) || '',
      option3: (q.options && q.options[3]) || '',
      correct_index: q.correct_index || 0,
      order_index: q.order_index || 1,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    const isOpen = questionFormData.question_type === 'open';
    const options = isOpen
      ? []
      : [
          questionFormData.option0,
          questionFormData.option1,
          questionFormData.option2,
          questionFormData.option3,
        ].filter((o) => o && o.trim().length > 0);

    if (!questionFormData.question.trim()) {
      alert('Por favor ingresa el enunciado de la pregunta.');
      return;
    }
    if (!isOpen && options.length < 2) {
      alert('Debes ingresar al menos 2 opciones para una pregunta de selección múltiple.');
      return;
    }

    if (editingQuestion) {
      const res = await updateQuestion(editingQuestion.id, {
        question: questionFormData.question,
        options,
        correct_index: isOpen ? 0 : Number(questionFormData.correct_index),
        order_index: Number(questionFormData.order_index),
      });
      if (!res.success) alert(`Error al actualizar la pregunta: ${res.error || ''}`);
    } else {
      const res = await createQuestion({
        question: questionFormData.question,
        options,
        correct_index: isOpen ? 0 : Number(questionFormData.correct_index),
        order_index: Number(questionFormData.order_index),
      });
      if (!res.success) alert(`Error al crear la pregunta: ${res.error || ''}`);
    }

    setIsQuestionModalOpen(false);
    loadQuizData();
  };

  const handleDeleteQuestion = async (id, questionText) => {
    if (window.confirm(`¿Eliminar la pregunta "${questionText}"?`)) {
      const res = await deleteQuestion(id);
      if (res && !res.success) {
        alert(`Error al eliminar la pregunta: ${res.error || 'Verifica los permisos en Supabase'}`);
      }
      loadQuizData();
    }
  };

  const handleSeedQuestions = async () => {
    if (
      window.confirm(
        '¿Deseas insertar las preguntas predeterminadas de ejemplo en Supabase?'
      )
    ) {
      await seedDefaultQuestions();
      loadQuizData();
    }
  };

  const handleDeleteResponse = async (id, name) => {
    if (window.confirm(`¿Eliminar la respuesta de "${name}"?`)) {
      await deleteQuizResponse(id);
      loadQuizData();
    }
  };

  const handleClearAllResponses = async () => {
    if (
      window.confirm(
        '¿ATENCIÓN: Estás seguro de borrar TODAS las respuestas y puntuaciones de la trivia?'
      )
    ) {
      await clearAllQuizResponses();
      loadQuizData();
    }
  };

  const handleExportCSV = () => {
    if (quizResponses.length === 0) {
      alert('No hay respuestas para exportar.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Nombre,Puntuacion,Total_Preguntas,Porcentaje,Fecha\n';

    quizResponses.forEach((r) => {
      const dateStr = new Date(r.created_at).toLocaleString();
      const cleanName = `"${(r.participant_name || '').replace(/"/g, '""')}"`;
      csvContent += `${cleanName},${r.score},${r.total_questions},${r.percentage}%,${dateStr}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `respuestas_trivia_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Password Modal if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-porcelain azulejo-pattern">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-chinoiserie border-2 border-sage/30 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sage/10 text-sage flex items-center justify-center mx-auto border border-sage/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#4A6B52] font-bold">
              Panel de Administración
            </h2>
            <p className="text-sm text-sage mt-1">
              Ingresa la contraseña para gestionar invitados y dinámicas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-11 pr-4 py-3 bg-porcelain rounded-2xl border border-sage/30 text-sm focus:ring-2 focus:ring-sage outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium">
                Contraseña incorrecta. Intenta nuevamente.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-sage hover:bg-sage-dark text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Acceder al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 pt-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-sage/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍋</span>
              <h1 className="font-serif text-2xl sm:text-3xl text-sage font-bold">
                Panel de Administración
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Administración de invitados, RSVP y dinámica interactiva en Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-sage/20 bg-white/70 p-1.5 rounded-2xl gap-2 shadow-2xs">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex-1 py-3 px-4 rounded-xl font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guests'
                ? 'bg-sage text-white shadow-md'
                : 'text-slate-600 hover:bg-sage/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Invitados & Pases ({guests.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              loadQuizData();
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#F5C623] text-slate-900 shadow-md'
                : 'text-slate-600 hover:bg-amber-100/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Dinámica: Trivia Cumpleañero</span>
            {gameStateData.isActive ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Juego Activo" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" title="Juego Pausado" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: GUESTS MANAGEMENT                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            {/* Dashboard Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-sage/20 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sage/10 text-sage">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-medium block">
                    Invitaciones
                  </span>
                  <span className="font-serif text-xl font-bold text-sage">{totalGuestsCount}</span>
                  <span className="text-[10px] text-slate-400 block">{totalAllocatedPasses} pases</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-medium block">
                    Confirmados
                  </span>
                  <span className="font-serif text-xl font-bold text-emerald-600">
                    {confirmedCount}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    {confirmedPasses} asisten
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-medium block">
                    Pendientes
                  </span>
                  <span className="font-serif text-xl font-bold text-amber-600">{pendingCount}</span>
                  <span className="text-[10px] text-slate-400 block">Sin responder</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-medium block">
                    Declinados
                  </span>
                  <span className="font-serif text-xl font-bold text-rose-600">{declinedCount}</span>
                  <span className="text-[10px] text-slate-400 block">No asisten</span>
                </div>
              </div>
            </div>

            {/* Actions Bar & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-sage/20 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sage outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">Todos los estados</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="pending">Pendientes</option>
                  <option value="declined">Declinados</option>
                </select>

                <button
                  onClick={handleOpenCreateGuestModal}
                  className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Invitado</span>
                </button>

                <button
                  onClick={handleResetData}
                  title="Restablecer lista predeterminada"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-2xl border border-sage/20 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Invitado</th>
                      <th className="py-3 px-3">Código</th>
                      <th className="py-3 px-3">Pases</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3">Asisten</th>
                      <th className="py-3 px-4 text-right">Acciones WhatsApp</th>
                      <th className="py-3 px-4 text-right">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredGuests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                          No se encontraron invitados.
                        </td>
                      </tr>
                    ) : (
                      filteredGuests.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="py-3 px-4 font-semibold text-slate-800">{g.name}</td>
                          <td className="py-3 px-3 font-mono font-bold text-sage">{g.code}</td>
                          <td className="py-3 px-3">{g.passes}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                g.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : g.status === 'declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {g.status === 'confirmed'
                                ? 'Confirmado'
                                : g.status === 'declined'
                                ? 'Declinado'
                                : 'Pendiente'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">
                            {g.status === 'confirmed' ? g.attendingPasses : 0}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleCopyWhatsApp(g)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                title="Copiar mensaje con enlace"
                              >
                                {copiedId === g.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copiado</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-500" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleOpenWhatsApp(g)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                                title="Enviar por WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`/invitado/${g.code}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer"
                                title="Ver invitación de este invitado"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditGuestModal(g)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(g.id, g.name)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUIZ / TRIVIA DYNAMICS MANAGEMENT                                  */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Game State Control Banner */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-sage/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#4A6B52]">
                    Estado de la Dinámica
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full font-sans text-xs font-extrabold uppercase border ${
                      gameStateData.isActive
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {gameStateData.isActive ? '🟢 Juego ACTIVO' : '🔴 Juego PAUSADO'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {gameStateData.isActive
                    ? 'Los invitados pueden ingresar a la trivia y registrar sus respuestas en vivo.'
                    : 'La trivia muestra una pantalla de espera avisando que el juego comenzará pronto.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <a
                  href="/dinamicas/quiz"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Probar /dinamicas/quiz</span>
                </a>

                <button
                  onClick={handleToggleGameState}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    gameStateData.isActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {gameStateData.isActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar Dinámica</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Activar Dinámica Ahora</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Questions Management Section */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sage/20 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-serif font-bold text-xl text-sage flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    Preguntas de la Trivia ({quizQuestions.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Preguntas de opción múltiple que responderán los invitados.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenCreateQuestionModal}
                    className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Pregunta</span>
                  </button>

                  <button
                    onClick={handleSeedQuestions}
                    title="Insertar preguntas de ejemplo"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {quizQuestions.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">
                    No hay preguntas configuradas todavía.
                  </p>
                  <button
                    onClick={handleSeedQuestions}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Cargar 5 preguntas de ejemplo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizQuestions.map((q, idx) => {
                    const isOpen = !q.options || q.options.length === 0;
                    return (
                      <div
                        key={q.id || idx}
                        className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#4A6B52] text-white font-mono text-[11px] font-bold">
                              #{q.order_index || idx + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                isOpen
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {isOpen ? '✍️ Abierta' : '🔘 Múltiple'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditQuestionModal(q)}
                              className="p-1.5 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                              title="Editar Pregunta"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id, q.question)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                              title="Eliminar Pregunta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 text-sm">{q.question}</h3>

                        {isOpen ? (
                          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900/80 space-y-1">
                            <p className="font-medium flex items-center gap-1.5 text-blue-950">
                              <span>✍️</span> Pregunta de respuesta abierta
                            </p>
                            <p className="text-[11px] text-blue-700">
                              El participante responderá escribiendo texto libremente.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = optIdx === q.correct_index;
                              return (
                                <div
                                  key={optIdx}
                                  className={`px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border ${
                                    isCorrect
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                                      : 'bg-white text-slate-600 border-slate-200'
                                  }`}
                                >
                                  <span className="truncate pr-2">
                                    <span className="font-bold mr-1.5 opacity-70">
                                      {['A', 'B', 'C', 'D', 'E'][optIdx] || optIdx + 1}.
                                    </span>
                                    {opt}
                                  </span>
                                  {isCorrect && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider shrink-0">
                                      Correcta
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Leaderboard & Responses Section */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sage/20 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-serif font-bold text-xl text-sage flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Respuestas y Tabla de Posiciones ({quizResponses.length} participantes)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Resultados guardados en tiempo real desde Supabase.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    disabled={quizResponses.length === 0}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>

                  <button
                    onClick={handleClearAllResponses}
                    disabled={quizResponses.length === 0}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Borrar Todo</span>
                  </button>

                  <button
                    onClick={loadQuizData}
                    title="Actualizar tabla"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {quizResponses.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic">
                  Aún ningún invitado ha completado la trivia.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3"># Posición</th>
                        <th className="py-3 px-4">Participante</th>
                        <th className="py-3 px-3">Aciertos</th>
                        <th className="py-3 px-3">Efectividad</th>
                        <th className="py-3 px-4">Fecha y Hora</th>
                        <th className="py-3 px-4 text-right">Detalle & Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {quizResponses.map((res, idx) => (
                        <tr key={res.id || idx} className="hover:bg-slate-50/80 transition-all">
                          <td className="py-3 px-3 font-mono font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-amber-950 font-extrabold'
                                  : idx === 1
                                  ? 'bg-slate-300 text-slate-800 font-bold'
                                  : idx === 2
                                  ? 'bg-amber-700 text-white font-bold'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">{res.participant_name}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#4A6B52]">
                            {res.score} / {res.total_questions}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                res.percentage >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : res.percentage >= 50
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {res.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(res.created_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingResponse(res)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-slate-500" />
                                <span>Ver Respuestas</span>
                              </button>
                              <button
                                onClick={() => handleDeleteResponse(res.id, res.participant_name)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT GUEST                                              */}
      {/* ========================================================================= */}
      {isGuestModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sage/20 space-y-4">
            <h3 className="font-serif text-xl font-bold text-sage">
              {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
            </h3>

            <form onSubmit={handleSaveGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={guestFormData.name}
                  onChange={(e) => setGuestFormData({ ...guestFormData, name: e.target.value })}
                  placeholder="Nombre completo o Familia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sage outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Número de Pases
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={guestFormData.passes}
                  onChange={(e) => setGuestFormData({ ...guestFormData, passes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sage outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Código Personalizado (Opcional)
                </label>
                <input
                  type="text"
                  value={guestFormData.code}
                  onChange={(e) =>
                    setGuestFormData({ ...guestFormData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="Se generará uno automáticamente si está vacío"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase focus:ring-2 focus:ring-sage outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGuestModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT QUIZ QUESTION                                      */}
      {/* ========================================================================= */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-sage/20 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-sage flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {editingQuestion ? 'Editar Pregunta de Trivia' : 'Nueva Pregunta de Trivia'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Type Selector (Multiple vs Open) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tipo de Respuesta:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setQuestionFormData({ ...questionFormData, question_type: 'multiple' })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      questionFormData.question_type === 'multiple'
                        ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>🔘</span>
                    <span>Opción Múltiple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setQuestionFormData({ ...questionFormData, question_type: 'open' })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      questionFormData.question_type === 'open'
                        ? 'bg-[#4A6B52] border-[#3d5843] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>✍️</span>
                    <span>Respuesta Abierta</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enunciado de la Pregunta:
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.question}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, question: e.target.value })
                  }
                  placeholder={
                    questionFormData.question_type === 'open'
                      ? 'Ej: ¿Qué consejo o anécdota divertida le dejas al cumpleañero?'
                      : 'Ej: ¿Cuál es la película favorita del cumpleañero?'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sage outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de Orden:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={questionFormData.order_index}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, order_index: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sage outline-none"
                  />
                </div>

                {questionFormData.question_type === 'multiple' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Opción Correcta:
                    </label>
                    <select
                      value={questionFormData.correct_index}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          correct_index: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold text-xs outline-none cursor-pointer"
                    >
                      <option value={0}>Opción A (1)</option>
                      <option value={1}>Opción B (2)</option>
                      <option value={2}>Opción C (3)</option>
                      <option value={3}>Opción D (4)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Evaluación:
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-semibold text-[11px]">
                      Texto libre (sin calificación)
                    </div>
                  </div>
                )}
              </div>

              {/* Options Fields for Multiple Choice */}
              {questionFormData.question_type === 'multiple' ? (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Opciones de Respuesta:
                  </label>

                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((optNum) => {
                      const key = `option${optNum}`;
                      const isCorrect = Number(questionFormData.correct_index) === optNum;
                      return (
                        <div key={optNum} className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                              isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {['A', 'B', 'C', 'D'][optNum]}
                          </span>
                          <input
                            type="text"
                            required={optNum < 2}
                            value={questionFormData[key]}
                            onChange={(e) =>
                              setQuestionFormData({ ...questionFormData, [key]: e.target.value })
                            }
                            placeholder={`Texto de la Opción ${['A', 'B', 'C', 'D'][optNum]}${
                              optNum >= 2 ? ' (opcional)' : ''
                            }`}
                            className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-50/40 focus:ring-2 focus:ring-emerald-500'
                                : 'border-slate-200 focus:ring-2 focus:ring-sage'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1 text-xs text-blue-900">
                  <p className="font-bold flex items-center gap-1">
                    <span>💡</span> ¿Cómo funciona la respuesta abierta?
                  </p>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    El invitado verá un campo de texto para escribir su respuesta con sus propias palabras. Podrás leer todas las respuestas en el panel administrativo.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A6B52] hover:bg-[#3d5843] text-white text-xs font-semibold cursor-pointer"
                >
                  Guardar Pregunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW PARTICIPANT ANSWERS BREAKDOWN                               */}
      {/* ========================================================================= */}
      {viewingResponse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-sage/20 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-sage">
                  Detalle de {viewingResponse.participant_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Puntuación: {viewingResponse.score} / {viewingResponse.total_questions} (
                  {viewingResponse.percentage}%)
                </p>
              </div>
              <button
                onClick={() => setViewingResponse(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2.5">
              {Array.isArray(viewingResponse.answers) && viewingResponse.answers.length > 0 ? (
                viewingResponse.answers.map((ans, idx) => {
                  const isOpen = ans.questionType === 'open' || ans.correctText === 'Respuesta abierta';
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isOpen
                          ? 'bg-blue-50/70 border-blue-200'
                          : ans.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-rose-50/70 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800">
                          {idx + 1}. {ans.questionText}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOpen
                              ? 'bg-blue-600 text-white'
                              : ans.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {isOpen ? '✍️ Abierta' : ans.isCorrect ? 'Correcto' : 'Incorrecto'}
                        </span>
                      </div>
                      <div className="text-slate-700 text-xs bg-white/70 p-2 rounded-lg border border-slate-200/60">
                        <span className="font-medium text-slate-500 text-[10px] uppercase block">Respuesta del invitado:</span>
                        <span className="font-semibold text-slate-900 whitespace-pre-wrap">{ans.selectedText || '(Sin respuesta)'}</span>
                        {!isOpen && !ans.isCorrect && (
                          <div className="text-emerald-700 font-medium pt-1 text-[11px] border-t border-slate-100 mt-1">
                            Opción correcta: {ans.correctText}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No hay desglose detallado de respuestas disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

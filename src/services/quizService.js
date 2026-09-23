import { supabase } from './supabaseClient';

const DEFAULT_QUESTIONS = [
  {
    question: '¿Cuál es la comida o antojito favorito del cumpleañero?',
    options: ['Tacos al pastor', 'Pupusas revueltas', 'Pizza artesanal', 'Sushi'],
    correct_index: 1,
    order_index: 1,
  },
  {
    question: '¿A qué le tiene más fobia o miedo?',
    options: ['Las cucarachas voladoras', 'Las alturas', 'Quedarse sin batería en el cel', 'Los payasos'],
    correct_index: 0,
    order_index: 2,
  },
  {
    question: '¿Cuál es su bebida preferida para festejar?',
    options: ['Limonada con menta', 'Cerveza bien fría', 'Gin Tonic', 'Cafecito caliente'],
    correct_index: 2,
    order_index: 3,
  },
  {
    question: 'Si pudiera viajar a cualquier lugar mañana mismo, ¿a dónde iría?',
    options: ['La playa / Costa del Sol', 'Europa (Italia o España)', 'Japón', 'Nueva York'],
    correct_index: 1,
    order_index: 4,
  },
  {
    question: '¿Qué frase o expresión dice más seguido?',
    options: ['¡Qué bendición!', 'Ya no aguanto la vida', 'Una y nos vamos', 'De una, hagámosle'],
    correct_index: 3,
    order_index: 5,
  },
];

/**
 * Get current Game State (Active / Inactive)
 */
export async function getGameState() {
  try {
    const { data, error } = await supabase
      .from('quiz_settings')
      .select('value')
      .eq('key', 'game_state')
      .maybeSingle();

    if (error) {
      console.warn('Error fetching game state from Supabase:', error);
      return { isActive: true, title: '¿Qué tanto conoces al cumpleañero?' };
    }

    if (!data || !data.value) {
      return { isActive: true, title: '¿Qué tanto conoces al cumpleañero?' };
    }

    return {
      isActive: Boolean(data.value.isActive),
      title: data.value.title || '¿Qué tanto conoces al cumpleañero?',
    };
  } catch (err) {
    console.error('getGameState unexpected error:', err);
    return { isActive: true, title: '¿Qué tanto conoces al cumpleañero?' };
  }
}

/**
 * Set Game State (Active / Inactive)
 */
export async function setGameState(isActive, extraData = {}) {
  try {
    const payload = {
      key: 'game_state',
      value: {
        isActive: Boolean(isActive),
        title: extraData.title || '¿Qué tanto conoces al cumpleañero?',
        updatedAt: new Date().toISOString(),
        ...extraData,
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('quiz_settings')
      .upsert(payload, { onConflict: 'key' })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('setGameState error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all quiz questions ordered by order_index
 */
export async function getQuestions() {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching questions from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      question: item.question,
      options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
      correct_index: Number(item.correct_index) || 0,
      order_index: Number(item.order_index) || 0,
      created_at: item.created_at,
    }));
  } catch (err) {
    console.error('getQuestions unexpected error:', err);
    return [];
  }
}

/**
 * Create a new question (Multiple Choice or Open-ended)
 */
export async function createQuestion({ question, options = [], correct_index = 0, order_index = 0 }) {
  try {
    const cleanQuestion = (question || '').trim();
    if (!cleanQuestion) {
      throw new Error('El enunciado de la pregunta es obligatorio.');
    }

    const cleanOptions = Array.isArray(options) ? options.filter((o) => o && o.trim().length > 0) : [];
    // If options are provided, must have at least 2 for multiple choice
    if (cleanOptions.length > 0 && cleanOptions.length < 2) {
      throw new Error('Las preguntas de selección múltiple deben tener al menos 2 opciones.');
    }

    const safeCorrectIndex = cleanOptions.length > 0
      ? Math.max(0, Math.min(Number(correct_index) || 0, cleanOptions.length - 1))
      : 0;

    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([
        {
          question: cleanQuestion,
          options: cleanOptions,
          correct_index: safeCorrectIndex,
          order_index: Number(order_index) || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('createQuestion error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing question
 */
export async function updateQuestion(id, { question, options, correct_index, order_index }) {
  try {
    const updates = { updated_at: new Date().toISOString() };
    if (question !== undefined) {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) throw new Error('El enunciado de la pregunta es obligatorio.');
      updates.question = cleanQuestion;
    }
    if (options !== undefined) {
      const cleanOptions = Array.isArray(options) ? options.filter((o) => o && o.trim().length > 0) : [];
      if (cleanOptions.length > 0 && cleanOptions.length < 2) {
        throw new Error('Las preguntas de selección múltiple deben tener al menos 2 opciones.');
      }
      updates.options = cleanOptions;
      if (correct_index !== undefined) {
        updates.correct_index = cleanOptions.length > 0
          ? Math.max(0, Math.min(Number(correct_index) || 0, cleanOptions.length - 1))
          : 0;
      }
    } else if (correct_index !== undefined) {
      updates.correct_index = Number(correct_index) || 0;
    }

    if (order_index !== undefined) updates.order_index = Number(order_index) || 0;

    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('updateQuestion error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a question
 */
export async function deleteQuestion(id) {
  try {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('deleteQuestion error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Seed starter questions into Supabase
 */
export async function seedDefaultQuestions() {
  try {
    const { data, error } = await supabase.from('quiz_questions').insert(DEFAULT_QUESTIONS).select();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('seedDefaultQuestions error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submit participant quiz response to Supabase
 */
export async function submitQuizResponse({ participant_name, score, total_questions, answers = [] }) {
  try {
    const name = (participant_name || '').trim() || 'Participante Anónimo';
    const payload = {
      participant_name: name,
      score: Number(score) || 0,
      total_questions: Number(total_questions) || 0,
      answers: answers,
    };

    const { data, error } = await supabase
      .from('quiz_responses')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('submitQuizResponse error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get all responses for leaderboard and admin monitoring
 */
export async function getQuizResponses() {
  try {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select('*')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching quiz responses from Supabase:', error);
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      participant_name: item.participant_name,
      score: Number(item.score) || 0,
      total_questions: Number(item.total_questions) || 0,
      percentage:
        item.total_questions > 0 ? Math.round((Number(item.score) / Number(item.total_questions)) * 100) : 0,
      answers: Array.isArray(item.answers) ? item.answers : JSON.parse(item.answers || '[]'),
      created_at: item.created_at,
    }));
  } catch (err) {
    console.error('getQuizResponses error:', err);
    return [];
  }
}

/**
 * Delete a single response
 */
export async function deleteQuizResponse(id) {
  try {
    const { error } = await supabase.from('quiz_responses').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('deleteQuizResponse error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Clear all responses (Admin reset)
 */
export async function clearAllQuizResponses() {
  try {
    const { error } = await supabase
      .from('quiz_responses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('clearAllQuizResponses error:', err);
    return { success: false, error: err.message };
  }
}

import React from 'react';

import { useFetch } from '@/lib/useFetch';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type State = {
  selected: string | undefined;
  currentQuestionIndex: number;
  isCorrectAnswer: boolean | undefined;
};

type Action = {
  type: 'select' | 'validate' | 'next';
  payload?: string;
};

function reducer(state: State, action: Action) {
  if (action.type === 'select') {
    return {
      ...state,
      selected: action.payload,
      isCorrectAnswer: undefined,
    };
  } else if (action.type === 'validate') {
    return {
      ...state,
      isCorrectAnswer: action.payload === state.selected,
    };
  } else if (action.type === 'next') {
    return {
      ...state,
      selected: undefined,
      currentQuestionIndex: state.currentQuestionIndex + 1,
      isCorrectAnswer: undefined,
    };
  } else {
    throw new Error();
  }
}

export function useQuiz() {
  const [state, dispatch] = React.useReducer<
    (state: State, action: Action) => State
  >(reducer, {
    selected: undefined,
    currentQuestionIndex: 0,
    isCorrectAnswer: undefined,
  });

  const { error, loading, data } = useFetch<Question[]>('quiz.json');

  const currentQuestionMetadata = React.useMemo(
    () => ({
      question: data?.at(state.currentQuestionIndex),
      number: state.currentQuestionIndex + 1,
      total: data?.length,
    }),
    [data, state.currentQuestionIndex],
  );

  const onNext = React.useCallback(() => {
    if (currentQuestionMetadata.question == null) return;

    if (state.isCorrectAnswer === true) {
      dispatch({ type: 'next' });
      return;
    }

    dispatch({
      type: 'validate',
      payload: currentQuestionMetadata.question.answer,
    });
  }, [currentQuestionMetadata.question, state.isCorrectAnswer]);

  const setSelected = React.useCallback((value: string) => {
    dispatch({ type: 'select', payload: value });
  }, []);

  return {
    selected: state.selected,
    isCorrectAnswer: state.isCorrectAnswer,
    setSelected,

    currentQuestion: currentQuestionMetadata.question,
    number: currentQuestionMetadata.number,
    total: currentQuestionMetadata.total,

    error,
    loading,

    onNext,
  };
}

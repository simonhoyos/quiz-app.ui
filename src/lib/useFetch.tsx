import React from 'react';

type State<T> = {
  loading: boolean;
  data?: T;
  error?: any;
};

type Action<T> = {
  type: 'init' | 'resolve' | 'reject';
  data?: T;
  error?: Error;
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  if (action.type === 'init') {
    return {
      ...state,
      loading: true,
      data: undefined,
      error: undefined,
    };
  } else if (action.type === 'resolve') {
    return {
      ...state,
      loading: false,
      data: action.data,
      error: undefined,
    };
  } else if (action.type === 'reject') {
    return {
      ...state,
      loading: false,
      data: undefined,
      error: action.error,
    };
  } else {
    throw new Error();
  }
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  return fetch(url, init).then((response) => {
    if (response.status >= 200 && response.status < 400) {
      return response.json();
    }

    throw response;
  });
}

export function useFetch<T>(url: string) {
  const [state, dispatch] = React.useReducer<
    (state: State<T>, action: Action<T>) => State<T>
  >(reducer, {
    loading: true,
    data: undefined,
    error: undefined,
  });

  React.useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: 'init' });

    apiFetch<T>(url, { signal: controller.signal })
      .then((data) => dispatch({ type: 'resolve', data }))
      .catch((error) => {
        if (error.message?.includes('aborted') !== true) {
          dispatch({ type: 'reject', error });
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, dispatch]);

  return { ...state };
}

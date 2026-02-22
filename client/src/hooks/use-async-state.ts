import { useReducer } from "react";
type State<T> = {
  loading: boolean;
  data: T | null;
  error: string | null;
};

type Action<T> =
  | { type: "LOADING"; payload: boolean }
  | { type: "SUCCESS"; payload: T | null }
  | { type: "ERROR"; payload: string | null }
  | { type: "RESET" };

function asyncReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SUCCESS":
      return {
        loading: false,
        data: action.payload,
        error: null,
      };

    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "RESET":
      return {
        loading: false,
        data: null,
        error: null,
      };

    default:
      return state;
  }
}

export default function useAsyncState<T>() {
  const initialState: State<T> = {
    loading: false,
    data: null,
    error: null,
  };

  const [state, dispatch] = useReducer(asyncReducer<T>, initialState);

  const setLoading = (state: boolean) => {
    dispatch({ type: "LOADING", payload: state });
  };

  const setData = (data: T | ((prev: T | null) => T | null)) => {
    if (typeof data === "function") {
      dispatch({
        type: "SUCCESS",
        payload: (data as (prev: T | null) => T | null)(state.data),
      });
    } else {
      dispatch({ type: "SUCCESS", payload: data });
    }
  };

  const setError = (error: string | null) => {
    dispatch({ type: "ERROR", payload: error });
  };

  const reset = () => dispatch({ type: "RESET" });

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
  };
}

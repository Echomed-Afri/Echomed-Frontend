import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  User,
  Doctor,
  Language,
  Consultation,
  HomeVisit,
  MenstrualCycle,
} from "../types";

interface AppState {
  user: User | Doctor | null;
  userType: "patient" | "doctor" | null;
  currentLanguage: Language;
  isAuthenticated: boolean;
  isLoading: boolean;
  consultations: Consultation[];
  homeVisits: HomeVisit[];
  menstrualCycles: MenstrualCycle[];
}

type AppAction =
  | { type: "SET_USER"; payload: User | Doctor }
  | { type: "SET_USER_TYPE"; payload: "patient" | "doctor" }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_CONSULTATION"; payload: Consultation }
  | { type: "ADD_HOME_VISIT"; payload: HomeVisit }
  | { type: "ADD_MENSTRUAL_CYCLE"; payload: MenstrualCycle }
  | { type: "LOGOUT" };

const initialState: AppState = {
  user: null,
  userType: null,
  currentLanguage: "en",
  isAuthenticated: false,
  isLoading: true,
  consultations: [],
  homeVisits: [],
  menstrualCycles: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_USER_TYPE":
      return { ...state, userType: action.payload };
    case "SET_LANGUAGE":
      return { ...state, currentLanguage: action.payload };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "ADD_CONSULTATION":
      return {
        ...state,
        consultations: [...state.consultations, action.payload],
      };
    case "ADD_HOME_VISIT":
      return { ...state, homeVisits: [...state.homeVisits, action.payload] };
    case "ADD_MENSTRUAL_CYCLE":
      return {
        ...state,
        menstrualCycles: [...state.menstrualCycles, action.payload],
      };
    case "LOGOUT":
      return {
        ...initialState,
        currentLanguage: state.currentLanguage,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

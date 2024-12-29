import { configureStore } from '@reduxjs/toolkit';
import ongoingGamesReducer from './slices/OngoingGameState';
import pendingGamesReducer from './slices/PendingGameState';
import playerReducer from './slices/PlayerState';

const store = configureStore({
  reducer: {
    ongoingGames: ongoingGamesReducer,
    pendingGames: pendingGamesReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

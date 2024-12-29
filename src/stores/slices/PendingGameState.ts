import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IndexedYahtzeeSpecs {
  id: number;
  // Add other properties based on your IndexedYahtzeeSpecs model
}

interface PendingGamesState {
  gameList: IndexedYahtzeeSpecs[];
}

const initialState: PendingGamesState = {
  gameList: [],
};

const pendingGamesSlice = createSlice({
  name: 'pendingGames',
  initialState,
  reducers: {
    // Return all games
    setGames(state, action: PayloadAction<IndexedYahtzeeSpecs[]>) {
      state.gameList = action.payload;
    },
    // Update an existing game
    updateGame(state, action: PayloadAction<IndexedYahtzeeSpecs>) {
      const index = state.gameList.findIndex(game => game.id === action.payload.id);
      if (index !== -1) {
        state.gameList[index] = action.payload;
      }
    },
    // Add or update a game (upsert)
    upsertGame(state, action: PayloadAction<IndexedYahtzeeSpecs>) {
      const index = state.gameList.findIndex(game => game.id === action.payload.id);
      if (index !== -1) {
        state.gameList[index] = action.payload;
      } else {
        state.gameList.push(action.payload);
      }
    },
    // Remove a game
    removeGame(state, action: PayloadAction<number>) {
      state.gameList = state.gameList.filter(game => game.id !== action.payload);
    },
  },
});

export const {
  setGames,
  updateGame,
  upsertGame,
  removeGame,
} = pendingGamesSlice.actions;

export default pendingGamesSlice.reducer;

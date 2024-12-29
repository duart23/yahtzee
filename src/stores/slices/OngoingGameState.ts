import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IndexedYahtzee {
  id: number;
  // Add other properties specific to IndexedYahtzee
}

interface OngoingGamesState {
  gameList: IndexedYahtzee[];
}

const initialState: OngoingGamesState = {
  gameList: [],
};

const ongoingGamesSlice = createSlice({
  name: 'ongoingGames',
  initialState,
  reducers: {
    // Get all games
    setGames(state, action: PayloadAction<IndexedYahtzee[]>) {
      state.gameList = action.payload;
    },
    // Get a specific game by ID
    getGame(state, action: PayloadAction<number>) {
      return state.gameList.find(game => game.id === action.payload);
    },
    // Update an existing game
    updateGame(state, action: PayloadAction<IndexedYahtzee>) {
      const index = state.gameList.findIndex(game => game.id === action.payload.id);
      if (index !== -1) {
        state.gameList[index] = action.payload;
      }
    },
    // Add or update a game (upsert)
    upsertGame(state, action: PayloadAction<IndexedYahtzee>) {
      const index = state.gameList.findIndex(game => game.id === action.payload.id);
      if (index !== -1) {
        state.gameList[index] = action.payload;
      } else {
        state.gameList.push(action.payload);
      }
    },
  },
});

export const { setGames, getGame, updateGame, upsertGame } = ongoingGamesSlice.actions;

export default ongoingGamesSlice.reducer;

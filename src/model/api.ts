// api.ts
import type { DieValue } from "../../models/src/model/dice";
import type { IndexedYahtzee, IndexedYahtzeeSpecs } from "./game";
import type { LowerSectionKey } from "../../models/src/model/yahtzee.score";


// Set up headers for the requests
const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

// Utility function for making POST requests
async function post(url: string, body: {} = {}): Promise<any> {
  const response: Response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  return await response.json();
}

// Fetch ongoing games
export async function games(): Promise<IndexedYahtzee[]> {
  const response = await fetch('http://localhost:8080/games', { headers });
  return await response.json();
}

// Fetch pending games
export async function pending_games(): Promise<IndexedYahtzeeSpecs[]> {
  const response = await fetch('http://localhost:8080/pending-games', { headers });
  return await response.json();
}

// Join a pending game
export async function join(game: IndexedYahtzeeSpecs, player: string) {
  return post(`http://localhost:8080/pending-games/${game.id}/players`, { player });
}

// Create a new game
export async function new_game(number_of_players: number, player: string): Promise<IndexedYahtzeeSpecs | IndexedYahtzee> {
  return await post('http://localhost:8080/pending-games', { creator: player, number_of_players });
}

// Helper function for performing game actions (like reroll or register)
async function perform_action(game: IndexedYahtzee, action: any) {
  return post(`http://localhost:8080/games/${game.id}/actions`, action);
}

// Reroll dice for a specific game
export async function reroll(game: IndexedYahtzee, held: number[], player: string) {
  return perform_action(game, { type: 'reroll', held, player });
}

// Register a score for a game
export async function register(game: IndexedYahtzee, slot: DieValue | LowerSectionKey, player: string) {
  return perform_action(game, { type: 'register', slot, player });
}

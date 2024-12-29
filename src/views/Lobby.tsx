import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../model/api';
import { setPlayer } from '@/store/playerStore'; // Assuming Redux store for player management
import 'Lobby.css';

const Lobby: React.FC = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(2);
  const player = useSelector((state: any) => state.player); // Replace with your actual Redux state
  const dispatch = useDispatch();
  const history = useHistory();

  const newGame = async (player: string) => {
    try {
      const pendingGame = await api.new_game(numberOfPlayers, player);
      setTimeout(() => history.push(`/pending/${pendingGame.id}`), 100);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  };

  useEffect(() => {
    if (!player) {
      history.push('/login');
    }
  }, [player, history]);

  return (
    <div>
      <h1>Yahtzee!</h1>
      {player && (
        <main>
          <div>
            Number of players:
            <input
              type="number"
              min="1"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
            />
          </div>
          <button onClick={() => newGame(player)}>New Game</button>
        </main>
      )}
    </div>
  );
};

export default Lobby;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '@/store/playerStore'; // Assuming Redux store for player management
import * as api from '@/model/api'; // Adjust the import as needed
import { RootState } from '@/store';
import 'Pending.css';


const Pending: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get game ID from route params
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [game, setGame] = useState<any | null>(null); // Game data state
  const [canJoin, setCanJoin] = useState(false); // State to check if the player can join the game
  const player = useSelector((state: RootState) => state.player); // Get player from Redux store

  // Fetch the pending game when the component is mounted or when the game ID changes
  useEffect(() => {
    const fetchGame = async () => {
      const fetchedGame = await api.getPendingGame(parseInt(id));
      setGame(fetchedGame);
      if (fetchedGame && player) {
        setCanJoin(fetchedGame.players.indexOf(player) === -1); // Check if player can join
      }
    };

    fetchGame();
  }, [id, player]);

  // Redirect logic
  useEffect(() => {
    if (!player) {
      history.push(`/login?pending=${id}`);
    } else if (!game) {
      history.replace('/');
    } else if (game && game.players.includes(player)) {
      history.replace(`/game/${id}`);
    }
  }, [player, game, id, history]);

  // Join the game
  const joinGame = useCallback(() => {
    if (game && player && canJoin) {
      api.joinGame(game, player); // Join the game
      history.replace(`/game/${id}`); // Redirect to the game page after joining
    }
  }, [game, player, canJoin, id, history]);

  if (!game) {
    return <div>Loading...</div>; // Show loading until the game is fetched
  }

  return (
    <div>
      <h1>Game #{id}</h1>
      <div>Created by: {game.creator}</div>
      <div>Players: {game.players.join(', ')}</div>
      <div>Available Seats: {game.number_of_players - game.players.length}</div>
      {canJoin && (
        <button onClick={joinGame}>Join</button>
      )}
    </div>
  );
};

export default Pending;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './stores/Store'; 
import { createSelector } from 'reselect';

import * as api from './model/api';
import { is_finished } from '../models/src/model/yahtzee.game';
import 'App.css';

const App: React.FC = () => { 
  const dispatch = useDispatch();
  const ongoingGamesStore = useSelector((state: RootState) => state.ongoingGames);
  const pendingGamesStore = useSelector((state: RootState) => state.pendingGames);
  const playerStore = useSelector((state: RootState) => state.player);

  const [myOngoingGames, setMyOngoingGames] = useState<any[]>([]);
  const [myPendingGames, setMyPendingGames] = useState<any[]>([]);
  const [otherPendingGames, setOtherPendingGames] = useState<any[]>([]);

  useEffect(() => {
    const isParticipant = (g: { players: string[] }) => g.players.indexOf(playerStore.player ?? '') > -1;

    const myOngoingGamesList = ongoingGamesStore.gameList.filter(
      (g: any) => isParticipant(g) && !is_finished(g)
    );
    setMyOngoingGames(myOngoingGamesList);

    const myPendingGamesList = pendingGamesStore.gameList.filter(isParticipant);
    setMyPendingGames(myPendingGamesList);

    const otherPendingGamesList = pendingGamesStore.gameList.filter(
      (g: any) => !isParticipant(g)
    );
    setOtherPendingGames(otherPendingGamesList);

    const ws = new WebSocket('ws://localhost:9090/publish');
    ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe' }));
    ws.onmessage = ({ data: gameJSON }) => {
      const game = JSON.parse(gameJSON);
      if (game.pending) {
        pendingGamesStore.upsert(game);
      } else {
        ongoingGamesStore.upsertGame(game);
        pendingGamesStore.remove(game);
      }
    };

    return () => {
      ws.send(JSON.stringify({ type: 'unsubscribe' }));
      ws.close();
    };
  }, [playerStore.player, ongoingGamesStore, pendingGamesStore]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await api.games();
      games.forEach(ongoingGamesStore.upsert);

      const pending_games = await api.pending_games();
      pending_games.forEach(pendingGamesStore.upsert);
    };

    fetchGames();
  }, [ongoingGamesStore, pendingGamesStore]);

  return (
    <div className="app">
      <h1 className="header">Yahtzee!</h1>
      {playerStore.player && <h2 className="subheader">Welcome player {playerStore.player}</h2>}
      {playerStore.player && (
        <nav>
          <Link className="link" to="/">
            Lobby
          </Link>

          <h2>My Games</h2>
          <h3>Ongoing</h3>
          {myOngoingGames.map((game) => (
            <Link key={game.id} className="link" to={`/game/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}

          <h3>Waiting for players</h3>
          {myPendingGames.map((game) => (
            <Link key={game.id} className="link" to={`/pending/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}

          <h2>Available Games</h2>
          {otherPendingGames.map((game) => (
            <Link key={game.id} className="link" to={`/pending/${game.id}`}>
              Game #{game.id}
            </Link>
          ))}
        </nav>
      )}

    </div>
  );
};

export default App;

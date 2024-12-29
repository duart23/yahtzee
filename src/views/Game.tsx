import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useOngoingGamesStore } from '@/stores/ongoingGamesStore'; // Assuming your Redux store is set up this way
import DiceRoll from '../components/DiceRoll';
import ScoreCard from '../components/ScoreCard';
import { isFinished, scores } from 'models/src/model/yahtzee.game';
import { setPlayer } from '@/store/playerStore'; // Assuming your Redux store for player is set up like this
import './Game.css';

const Game: React.FC = () => {
  const { id: gameIdParam } = useParams<{ id: string }>();
  const [id, setId] = useState<number>(parseInt(gameIdParam));
  const game = useOngoingGamesStore((state) => state.game(id));
  const player = useSelector((state: any) => state.player); // Replace with actual state
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setId(parseInt(gameIdParam));
  }, [gameIdParam]);

  useEffect(() => {
    if (!player) {
      history.push(`/login?game=${id}`);
    } else if (!game) {
      history.replace('/');
    }
  }, [game, player, id, history]);

  const enabled = useMemo(() => game && player === game.players[game.playerInTurn], [game, player]);
  const finished = useMemo(() => !game || isFinished(game), [game]);

  const standings = useMemo(() => {
    if (!game) return [];
    const standings: [string, number][] = scores(game).map((score, index) => [game.players[index], score]);
    standings.sort(([_, score1], [__, score2]) => score2 - score1);
    return standings;
  }, [game]);

  return (
    <div className="game">
      {game && player && (
        <>
          <div className="meta">
            <h1>Game #{id}</h1>
          </div>
          <ScoreCard className="card" game={game} player={player} enabled={enabled} />
          {!finished && <DiceRoll className="roll" game={game} player={player} enabled={enabled} />}
          {finished && (
            <div className="scoreboard">
              <table>
                <thead>
                  <tr>
                    <td>Player</td>
                    <td>Score</td>
                  </tr>
                </thead>
                <tbody>
                  {standings.map(([playerName, score]) => (
                    <tr key={playerName} className={playerName === player ? 'current' : ''}>
                      <td>{playerName}</td>
                      <td>{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;

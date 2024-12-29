import React, { useMemo } from 'react';
import * as api from '../model/api';
import { lower_section_keys, lower_section_slots, sum_upper, total_upper, upper_section_slots, LowerSectionKey } from '../../models/src/model/yahtzee.score';
import { die_values, isDieValue, DieValue } from '../../models/src/model/dice';
import { scores } from '../../models/src/model/yahtzee.score'
import { score } from '../../models/src/model/yahtzee.slots';
import { IndexedYahtzee } from '../model/game';

interface ScoreProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}

const ScoreCard: React.FC<ScoreProps> = ({ game, player, enabled }) => {
  const players = useMemo(() => game.players, [game.players]);
  const upperSections = useMemo(() => game.upper_sections, [game.upper_sections]);
  const lowerSections = useMemo(() => game.lower_sections, [game.lower_sections]);

  const register = (key: DieValue | LowerSectionKey) => {
    if (enabled) {
      api.register(game, key, player);
    }
  };

  const isActive = (p: string) => game.players[game.playerInTurn] === player && player === p;

  const playerScores = (key: DieValue | LowerSectionKey) =>
    isDieValue(key)
      ? players.map((p, i) => ({ player: p, score: upperSections[i].scores[key] }))
      : players.map((p, i) => ({ player: p, score: lowerSections[i].scores[key] }));

  const potentialScore = (key: DieValue | LowerSectionKey) =>
    isDieValue(key)
      ? score(upper_section_slots[key], game.roll)
      : score(lower_section_slots[key], game.roll);

  const displayScore = (score: number | undefined): string =>
    score === undefined ? '' : score === 0 ? '---' : score.toString();

  const activeClass = (p: string) => (p === player ? 'activeplayer' : undefined);

  return (
    <div className="score">
      <table className="scorecard">
        <tbody>
          {/* Upper Section */}
          <tr className="section_header">
            <td colSpan={players.length + 2}>Upper Section</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Target</td>
            {players.map((player, index) => (
              <td key={index} className={activeClass(player)}>
                {player}
              </td>
            ))}
          </tr>
          {die_values.map((val) => (
            <tr key={val}>
              <td>{val}s</td>
              <td>{3 * val}</td>
              {playerScores(val).map(({ player, score }, i) => (
                <td
                  key={i}
                  className={isActive(player) && score === undefined ? 'clickable potential' : isActive(player) ? 'activeplayer' : undefined}
                  onClick={isActive(player) && score === undefined ? () => register(val) : undefined}
                >
                  {displayScore(isActive(player) && score === undefined ? potentialScore(val) : score)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Sum</td>
            <td>63</td>
            {players.map((player, index) => (
              <td key={index} className={activeClass(player)}>
                {sum_upper(upperSections[index].scores)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Bonus</td>
            <td>50</td>
            {players.map((player, index) => (
              <td key={index} className={activeClass(player)}>
                {displayScore(upperSections[index].bonus)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            {players.map((player, index) => (
              <td key={index} className={activeClass(player)}>
                {total_upper(upperSections[index])}
              </td>
            ))}
          </tr>

          {/* Lower Section */}
          <tr className="section_header">
            <td colSpan={players.length + 2}>Lower Section</td>
          </tr>
          {lower_section_keys.map((key) => (
            <tr key={key}>
              <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
              <td></td>
              {playerScores(key).map(({ player, score }, i) => (
                <td
                  key={i}
                  className={isActive(player) && score === undefined ? 'clickable potential' : isActive(player) ? 'activeplayer' : undefined}
                  onClick={isActive(player) ? () => register(key) : undefined}
                >
                  {displayScore(isActive(player) && score === undefined ? potentialScore(key) : score)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td></td>
            {players.map((player, index) => (
              <td key={index} className={activeClass(player)}>
                {scores(game)[index]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScoreCard;

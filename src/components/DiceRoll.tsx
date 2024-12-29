import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../model/api';
import { IndexedYahtzee } from '../model/game';
import 'DiceRoll.css'

interface DiceProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ game, player, enabled }) => {
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);

  const rerollEnabled = useMemo(() => game && game.rolls_left > 0 && enabled, [game, enabled]);

  useEffect(() => {
    if (!rerollEnabled) {
      setHeld([false, false, false, false, false]); // reset held dice when reroll isn't enabled
    }
  }, [rerollEnabled]);

  const handleReroll = async () => {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined) as number[];
    await api.reroll(game, heldIndices, player);
  };

  return (
    <div className="dice">
      {!enabled && <div className="diceheader">{game.players[game.playerInTurn]} is playing</div>}
      <div className="die"></div>
      {game.roll.map((d, index) => (
        <div key={index} className={`die die${d}`}>
          {d}
        </div>
      ))}
      <div className="caption">{enabled && rerollEnabled ? 'Hold:' : ''}</div>
      {enabled && rerollEnabled && game.roll.map((_, i) => (
        <input
          key={i}
          type="checkbox"
          checked={held[i]}
          onChange={() => {
            const newHeld = [...held];
            newHeld[i] = !newHeld[i];
            setHeld(newHeld);
          }}
        />
      ))}
      {enabled && rerollEnabled && (
        <div className="reroll">
          <button onClick={handleReroll}>Re-roll</button>
        </div>
      )}
    </div>
  );
};

export default Dice;

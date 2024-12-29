import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '@/store/playerStore'; // Assuming Redux store for player management
import 'Login.css';

const Login: React.FC = () => {
  const [player, setPlayerName] = useState<string>('');
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const enabled = player !== '';

  const login = () => {
    if (enabled) {
      dispatch(setPlayer(player)); // Store the player in Redux or wherever you're managing the player
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has('game')) {
        history.replace(`/game/${searchParams.get('game')}`);
      } else if (searchParams.has('pending')) {
        history.replace(`/pending/${searchParams.get('pending')}`);
      } else {
        history.replace('/');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (enabled) login();
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={player}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <button onClick={login} disabled={!enabled}>
        Login
      </button>
    </div>
  );
};

export default Login;

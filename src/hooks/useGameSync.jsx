import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

const CHANNEL_NAME = 'rist_gameshow_sync_channel';

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    setChannel(bc);

    bc.onmessage = (event) => {
      if (event.data.type === 'SYNC_STATE') {
        setGameState(event.data.payload);
      } else if (event.data.type === 'REQUEST_STATE') {
        setGameState((current) => {
          if (current) {
            bc.postMessage({ type: 'SYNC_STATE', payload: current });
          }
          return current;
        });
      }
    };

    bc.postMessage({ type: 'REQUEST_STATE' });

    return () => {
      bc.close();
    };
  }, []);

  const syncGameState = useCallback((newState) => {
    setGameState(newState);
    if (channel) {
      channel.postMessage({ type: 'SYNC_STATE', payload: newState });
    }
  }, [channel]);

  const updateGameState = useCallback((updates) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const newState = { ...prev, ...updates };
      if (channel) {
        channel.postMessage({ type: 'SYNC_STATE', payload: newState });
      }
      return newState;
    });
  }, [channel]);

  const resetGame = useCallback(() => {
      setGameState(null);
      if (channel) {
        channel.postMessage({ type: 'SYNC_STATE', payload: null });
      }
  }, [channel]);

  return (
    <GameContext.Provider value={{ gameState, updateGameState, syncGameState, resetGame }}>
      {children}
    </GameContext.Provider> // ensure the rest is well closed
  );
};

export const useGameSync = () => useContext(GameContext);

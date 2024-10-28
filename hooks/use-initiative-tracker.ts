"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

const initialDeck = [
  { id: 1, name: 'Ancient Dragon', initiative: 20, type: 'boss' },
  { id: 2, name: 'Archmage', initiative: 18, type: 'player' },
  { id: 3, name: 'Shadow Assassin', initiative: 16, type: 'player' },
  { id: 4, name: 'Demon Lord', initiative: 15, type: 'boss' },
  { id: 5, name: 'Holy Priest', initiative: 14, type: 'player' },
  { id: 6, name: 'War Chief', initiative: 12, type: 'player' },
  { id: 7, name: 'Dark Knight', initiative: 10, type: 'elite' },
  { id: 8, name: 'Beast Pack', initiative: 8, type: 'minion' },
  { id: 9, name: 'Court Jester', initiative: 7, type: 'player' },
  { id: 10, name: 'Undead Legion', initiative: 6, type: 'elite' },
  { id: 11, name: 'Forest Scout', initiative: 5, type: 'player' },
  { id: 12, name: 'Chaos Spawn', initiative: 4, type: 'boss' },
  { id: 13, name: 'Time Mage', initiative: 19, type: 'player' },
  { id: 14, name: 'Stone Golem', initiative: 3, type: 'elite' },
  { id: 15, name: 'Spirit Healer', initiative: 17, type: 'player' }
];

interface Card {
  id: number;
  name: string;
  initiative: number;
  type: string;
}

interface GameState {
  slots: (Card | null)[];
  deck: Card[];
  discardPile: Card[];
}

export function useInitiativeTracker() {
  const [slots, setSlots] = useState<(Card | null)[]>(Array(10).fill(null));
  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      reconnectionDelayMax: 10000,
      transports: ['websocket']
    });

    // Set up event listeners
    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('updateBoard', (data: GameState) => {
        if (!isInitialLoad) {
          setSlots(data.slots);
          setDeck(data.deck);
          setDiscardPile(data.discardPile);
        }
        setIsInitialLoad(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isInitialLoad]);

  const emitBoardUpdate = useCallback((newSlots: (Card | null)[], newDeck: Card[], newDiscardPile: Card[]) => {
    if (socketRef.current) {
      socketRef.current.emit('updateBoard', {
        slots: newSlots,
        deck: newDeck,
        discardPile: newDiscardPile
      });
    }
  }, []);

  const handleDrop = useCallback((cardId: number, targetIndex: number, sourceType: string, sourceIndex?: number) => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      let newDeck = [...deck];
      let newDiscardPile = [...discardPile];
      let card;

      if (sourceType === 'deck') {
        card = newDeck.find(c => c.id === cardId);
        if (card) {
          newDeck = newDeck.filter(c => c.id !== cardId);
          setDeck(newDeck);
        }
      } else if (sourceType === 'slot' && sourceIndex !== undefined) {
        card = newSlots[sourceIndex];
        newSlots[sourceIndex] = null;
      } else if (sourceType === 'discard') {
        card = newDiscardPile.find(c => c.id === cardId);
        if (card) {
          newDiscardPile = newDiscardPile.filter(c => c.id !== cardId);
          setDiscardPile(newDiscardPile);
        }
      }

      if (card) {
        const existingCard = newSlots[targetIndex];
        if (existingCard) {
          if (sourceType === 'slot') {
            newSlots[sourceIndex!] = existingCard;
          } else {
            setDeck(prev => [...prev, existingCard]);
          }
        }

        newSlots[targetIndex] = card;
        emitBoardUpdate(newSlots, newDeck, newDiscardPile);
      }

      return newSlots;
    });
  }, [deck, discardPile, emitBoardUpdate]);

  const handleDiscard = useCallback((cardId: number, sourceType: string, sourceIndex?: number) => {
    let card;
    let newSlots = [...slots];
    let newDeck = [...deck];

    if (sourceType === 'deck') {
      card = deck.find(c => c.id === cardId);
      if (card) {
        newDeck = deck.filter(c => c.id !== cardId);
        setDeck(newDeck);
      }
    } else if (sourceType === 'slot' && sourceIndex !== undefined) {
      card = slots[sourceIndex];
      newSlots[sourceIndex] = null;
      setSlots(newSlots);
    }

    if (card) {
      const newDiscardPile = [...discardPile, card];
      setDiscardPile(newDiscardPile);
      emitBoardUpdate(newSlots, newDeck, newDiscardPile);
    }
  }, [slots, deck, discardPile, emitBoardUpdate]);

  const handleRecoverFromDiscard = useCallback((cardId: number) => {
    const card = discardPile.find(c => c.id === cardId);
    if (card) {
      const newDiscardPile = discardPile.filter(c => c.id !== cardId);
      const newDeck = [...deck, card];
      
      setDiscardPile(newDiscardPile);
      setDeck(newDeck);
      emitBoardUpdate(slots, newDeck, newDiscardPile);
    }
  }, [slots, deck, discardPile, emitBoardUpdate]);

  const sortDeck = useCallback(() => {
    const sortedDeck = [...deck].sort((a, b) => b.initiative - a.initiative);
    setDeck(sortedDeck);
    emitBoardUpdate(slots, sortedDeck, discardPile);
  }, [deck, slots, discardPile, emitBoardUpdate]);

  return {
    slots,
    deck,
    discardPile,
    handleDrop,
    handleDiscard,
    handleRecoverFromDiscard,
    sortDeck,
  };
}
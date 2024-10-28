"use client";

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PlayerCard from './player-card';

interface SliderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  deck: any[];
  onDiscard: (cardId: number, sourceType: string) => void;
}

export default function SliderPanel({ isOpen, onClose, deck, onDiscard }: SliderPanelProps) {
  return (
    <div className={`slider-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Available Cards</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {deck.map((card) => (
            <PlayerCard
              key={`deck-${card.id}`}
              card={card}
              sourceType="deck"
              onDiscard={onDiscard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
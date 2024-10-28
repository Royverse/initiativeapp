"use client";

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { PanelRightOpen } from 'lucide-react';
import InitiativeSlot from './initiative-slot';
import { useInitiativeTracker } from '@/hooks/use-initiative-tracker';
import SliderPanel from './slider-panel';

export default function GameBoard() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const {
    slots,
    deck,
    discardPile,
    handleDrop,
    handleDiscard,
    handleRecoverFromDiscard,
    sortDeck,
  } = useInitiativeTracker();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Prioritize The Initiatives</h1>
            <Button
              variant="outline"
              onClick={() => setIsSliderOpen(true)}
              className="gap-2"
            >
              <PanelRightOpen className="w-4 h-4" />
              View Available Cards
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {slots.map((slot, index) => (
              <InitiativeSlot
                key={`slot-${index}`}
                index={index}
                card={slot}
                onDrop={handleDrop}
                onDiscard={handleDiscard}
              />
            ))}
          </div>

          {discardPile.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Your Discarded Initiatives</h2>
              <div className="grid grid-cols-2 gap-4">
                {discardPile.map((card) => (
                  <div
                    key={`discard-${card.id}`}
                    className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{card.name}</div>
                      <div className="text-sm text-gray-500">Initiative: {card.initiative}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRecoverFromDiscard(card.id)}
                      className="text-primary"
                    >
                      Recover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <SliderPanel
          isOpen={isSliderOpen}
          onClose={() => setIsSliderOpen(false)}
          deck={deck}
          onDiscard={handleDiscard}
          onSort={sortDeck}
        />
      </div>
    </DndProvider>
  );
}
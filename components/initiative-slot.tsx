"use client";

import { useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function InitiativeSlot({ index, card, onDrop, onDiscard }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { id: number, sourceType: string, sourceIndex: number }) => 
      onDrop(item.id, index, item.sourceType, item.sourceIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`initiative-slot h-32 ${isOver ? 'is-over' : ''} ${card ? 'filled' : ''}`}
    >
      {card ? (
        <div className="card-content h-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-gray-900">
                {index + 1}. {card.name}
              </div>
              <div className="text-sm text-gray-500">Initiative: {card.initiative}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDiscard(card.id, 'slot', index)}
              className="text-gray-400 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Position {index + 1}
        </div>
      )}
    </div>
  );
}
"use client";

import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function PlayerCard({ card, sourceType, sourceIndex, onDiscard }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id: card.id, sourceType, sourceIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="card-content">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-gray-900">{card.name}</div>
            <div className="text-sm text-gray-500">Initiative: {card.initiative}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDiscard(card.id, sourceType)}
            className="text-gray-400 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
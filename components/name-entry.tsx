"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

export default function NameEntry() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('playerName', name);
      router.push('/game');
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <UserCircle className="w-16 h-16 text-indigo-600" />
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to Initiative Tracker
        </h1>
        <p className="text-gray-600 text-center">
          Enter your name to join the game
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          required
        />
        <Button type="submit" className="w-full">
          Join Game
        </Button>
      </form>
    </Card>
  );
}
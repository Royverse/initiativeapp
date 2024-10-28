import NameEntry from '@/components/name-entry';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <NameEntry />
    </div>
  );
}
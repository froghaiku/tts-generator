import TTSForm from '../components/TTSForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Japanese Text-to-Speech Generator
        </h1>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <TTSForm />
        </div>
      </div>
    </main>
  );
}
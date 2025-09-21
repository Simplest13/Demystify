import LegalClarityClient from '@/components/legal-clarity/LegalClarityClient';
import Header from '@/components/legal-clarity/Header';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground">
      <div className="w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <main className="mt-8">
          <LegalClarityClient />
        </main>
      </div>
    </div>
  );
}

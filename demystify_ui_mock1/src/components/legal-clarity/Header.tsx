import { Scale } from 'lucide-react';

const Header = () => (
  <header className="w-full text-center">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Scale className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
        Legal Clarity
      </h1>
    </div>
    <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
      Paste legal text or upload a document to get AI-powered summaries, plain-language translations, and answers to your questions.
    </p>
  </header>
);

export default Header;

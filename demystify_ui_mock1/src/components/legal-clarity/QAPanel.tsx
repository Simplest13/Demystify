
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { askQuestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface QAPanelProps {
  documentText: string;
}

interface QAPair {
  question: string;
  answer: string;
}

export default function QAPanel({ documentText }: QAPanelProps) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<QAPair[]>([]);
  const [isAsking, startAsking] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    startAsking(async () => {
      const { answer, error } = await askQuestion({
        documentText,
        question,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
        });
      } else {
        setHistory((prev) => [...prev, { question, answer }]);
        setQuestion('');
      }
    });
  };

  return (
    <div className="flex flex-col h-[60vh] space-y-4">
      <ScrollArea className="flex-1 p-4 border rounded-lg bg-muted/50" ref={scrollAreaRef}>
        <div className="space-y-6">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground pt-12">
              <p>Ask a question about the document to get started.</p>
              <p className="text-sm">e.g., "What are the termination conditions?"</p>
            </div>
          ) : (
            history.map((qa, index) => (
              <div key={index} className="space-y-4">
                {/* User Question */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground max-w-sm">
                    <p>{qa.question}</p>
                  </div>
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                </div>
                {/* AI Answer */}
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-accent text-accent-foreground"><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-background border max-w-sm">
                    <p className="whitespace-pre-wrap">{qa.answer}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isAsking && handleAskQuestion()}
          disabled={isAsking}
        />
        <Button onClick={handleAskQuestion} disabled={isAsking || !question.trim()}>
          {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
        </Button>
      </div>
    </div>
  );
}

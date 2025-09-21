
'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeText, summarizeFile } from '@/app/actions';
import {
  BookText,
  CalendarDays,
  FileText,
  Loader2,
  MessageCircleQuestion,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AnalysisDisplay from './AnalysisDisplay';
import QAPanel from './QAPanel';
import type { IdentifyDeadlinesOutput } from '@/ai/flows/deadline-identification';

type Deadline = IdentifyDeadlinesOutput['deadlines'][0];

export default function LegalClarityClient() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [activeInputTab, setActiveInputTab] = useState('text');
  
  const [results, setResults] = useState<{
    summary: string | null;
    translation: string | null;
    deadlines: Deadline[] | null;
    originalText: string | null;
  }>({
    summary: null,
    translation: null,
    deadlines: null,
    originalText: null,
  });

  const [isAnalyzing, startTextAnalysis] = useTransition();
  const [isSummarizing, startFileSummarization] = useTransition();
  const { toast } = useToast();

  const handleTextAnalysis = () => {
    startTextAnalysis(async () => {
      const { translation, deadlines, error } = await analyzeText(text);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error,
        });
      } else {
        setResults(prev => ({ ...prev, translation, deadlines, originalText: text }));
        toast({
          title: 'Analysis Complete',
          description: 'Review the results below.',
        });
      }
    });
  };

  const handleFileSummarization = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a document to summarize.',
      });
      return;
    }
    startFileSummarization(() => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const { summary, error } = await summarizeFile({ documentDataUri: dataUri });
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Summarization Failed',
            description: error,
          });
        } else {
          setResults(prev => ({ ...prev, summary }));
          toast({
            title: 'Summarization Complete',
            description: 'The document summary is ready.',
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected file.',
        });
      };
    });
  };

  const hasResults = Object.values(results).some(res => res !== null && (!Array.isArray(res) || res.length > 0));

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analyze Document</CardTitle>
          <CardDescription>
            Choose to paste text for a full analysis or upload a file for a quick summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeInputTab} onValueChange={setActiveInputTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Paste Text</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your legal text here..."
                  className="min-h-[200px] text-base"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={handleTextAnalysis} disabled={isAnalyzing || !text} className="w-full sm:w-auto">
                  {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Text
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="file" className="mt-4">
              <div className="space-y-4">
                <label
                  htmlFor="file-upload"
                  className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                >
                  <div className="text-center">
                    <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF or DOCX</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && <p className="text-sm text-center text-muted-foreground">Selected file: {file.name}</p>}
                <Button onClick={handleFileSummarization} disabled={isSummarizing || !file} className="w-full sm:w-auto">
                  {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Summarize Document
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {(isAnalyzing || isSummarizing) && (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-card border">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Analyzing your document...</h3>
            <p className="text-muted-foreground">This may take a few moments.</p>
        </div>
      )}

      {hasResults && !isAnalyzing && !isSummarizing && (
        <AnalysisDisplay
          summary={results.summary}
          translation={results.translation}
          deadlines={results.deadlines}
          qaPanel={
            results.originalText ? <QAPanel documentText={results.originalText} /> : null
          }
        />
      )}
    </div>
  );
}

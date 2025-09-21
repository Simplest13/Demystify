
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FileText,
  BookText,
  CalendarDays,
  MessageCircleQuestion,
  CalendarClock,
} from 'lucide-react';
import type { IdentifyDeadlinesOutput } from '@/ai/flows/deadline-identification';

type Deadline = IdentifyDeadlinesOutput['deadlines'][0];

interface AnalysisDisplayProps {
  summary: string | null;
  translation: string | null;
  deadlines: Deadline[] | null;
  qaPanel: ReactNode | null;
}

export default function AnalysisDisplay({
  summary,
  translation,
  deadlines,
  qaPanel,
}: AnalysisDisplayProps) {
  const availableTabs = [
    summary && { value: 'summary', label: 'Summary', icon: FileText },
    translation && { value: 'translation', label: 'Plain Language', icon: BookText },
    deadlines && deadlines.length > 0 && { value: 'deadlines', label: 'Deadlines', icon: CalendarDays },
    qaPanel && { value: 'qa', label: 'Q&A', icon: MessageCircleQuestion },
  ].filter(Boolean) as { value: string; label: string; icon: React.ElementType }[];

  if (availableTabs.length === 0) {
    return null;
  }
  
  const defaultTab = availableTabs[0].value;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Here is the breakdown of your legal document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            {availableTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {summary && (
            <TabsContent value="summary" className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            </TabsContent>
          )}

          {translation && (
            <TabsContent value="translation" className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="whitespace-pre-wrap leading-relaxed">{translation}</p>
            </TabsContent>
          )}

          {deadlines && deadlines.length > 0 && (
            <TabsContent value="deadlines" className="mt-4">
              <div className="space-y-4">
                {deadlines.map((deadline, index) => (
                  <Card key={index} className="bg-background">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <CalendarClock className="w-6 h-6 text-destructive" />
                        <span>{deadline.date}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <blockquote className="pl-4 border-l-2">
                        <p className="text-muted-foreground italic">"{deadline.context}"</p>
                      </blockquote>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {qaPanel && (
            <TabsContent value="qa" className="mt-4">
              {qaPanel}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

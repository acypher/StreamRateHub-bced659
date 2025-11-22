import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PlotSummaryProps {
  summary: string;
}

export function PlotSummary({ summary }: PlotSummaryProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
          Plot Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {summary ? (
          <p className="text-base leading-relaxed text-foreground">{summary}</p>
        ) : (
          <p className="text-muted-foreground italic">Plot summary not available</p>
        )}
      </CardContent>
    </Card>
  );
}
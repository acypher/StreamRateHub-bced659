import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ReviewerSummaryProps {
  summary: string;
}

export function ReviewerSummary({ summary }: ReviewerSummaryProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          What Critics Are Saying
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {summary ? (
          <p className="text-base leading-relaxed text-foreground">{summary}</p>
        ) : (
          <p className="text-muted-foreground italic">Reviewer comments not available</p>
        )}
      </CardContent>
    </Card>
  );
}
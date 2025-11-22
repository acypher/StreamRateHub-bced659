import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CastListProps {
  cast: string[];
}

export function CastList({ cast }: CastListProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          Cast
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {cast && cast.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cast.map((member, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-sm px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 hover:from-orange-200 hover:to-red-200 dark:hover:from-orange-900/50 dark:hover:to-red-900/50 transition-all"
              >
                {member}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">Cast information not available</p>
        )}
      </CardContent>
    </Card>
  );
}
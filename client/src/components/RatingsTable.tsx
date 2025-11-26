import { Star, TrendingUp, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Rating } from '@/api/search';

interface RatingsTableProps {
  ratings: Rating[];
}

function getRatingColor(rating: string): string {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  if (percentage >= 75) return 'text-white dark:text-white';
  if (percentage >= 50) return 'text-gray-900 dark:text-gray-900';
  return 'text-white dark:text-white';
}

function getRatingBadgeVariant(rating: string): 'default' | 'secondary' | 'destructive' {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  if (percentage >= 75) return 'default';
  if (percentage >= 50) return 'secondary';
  return 'destructive';
}

function getRatingBadgeClass(rating: string): string {
  const numericRating = parseFloat(rating);
  const percentage = rating.includes('%') ? numericRating : rating.includes('/100') ? numericRating : numericRating * 10;

  // Use green for high ratings, yellow for medium, red for low
  if (percentage >= 75) {
    return 'bg-green-600 dark:bg-green-600 border-green-700 dark:border-green-700';
  }
  if (percentage >= 50) {
    return 'bg-yellow-500 dark:bg-yellow-500 border-yellow-600 dark:border-yellow-600';
  }
  return 'bg-red-600 dark:bg-red-600 border-red-700 dark:border-red-700';
}

function stripRatingUnit(rating: string): string {
  // Remove %, /10, /100 from ratings - just show the number
  return rating.replace(/%|\/10|\/100/g, '').trim();
}

export function RatingsTable({ ratings }: RatingsTableProps) {
  console.log('[RatingsTable] Rendering ratings:', ratings);

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          Ratings Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
              <TableHead className="font-bold text-base">Source</TableHead>
              <TableHead className="font-bold text-base">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Critics Rating
                </div>
              </TableHead>
              <TableHead className="font-bold text-base">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Audience Rating
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.map((rating, index) => {
              const isIMDB = rating.source.toUpperCase() === 'IMDB';
              console.log(`[RatingsTable] Processing ${rating.source} - isIMDB: ${isIMDB}`);

              // For IMDB, use criticsRating as the main score to display in audience column
              const imdbScore = isIMDB ? rating.criticsRating : null;

              return (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                >
                  <TableCell className="font-semibold text-base">{rating.source}</TableCell>
                  <TableCell>
                    {isIMDB ? (
                      <div className="inline-block bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md italic text-base">
                        N/A
                      </div>
                    ) : rating.criticsRating ? (
                      <Badge
                        variant={getRatingBadgeVariant(rating.criticsRating)}
                        className={`text-base px-3 py-1 font-bold ${getRatingColor(rating.criticsRating)} ${getRatingBadgeClass(rating.criticsRating)}`}
                      >
                        {stripRatingUnit(rating.criticsRating)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isIMDB && imdbScore ? (
                      <Badge
                        variant={getRatingBadgeVariant(imdbScore)}
                        className={`text-base px-3 py-1 font-bold ${getRatingColor(imdbScore)} ${getRatingBadgeClass(imdbScore)}`}
                      >
                        {stripRatingUnit(imdbScore)}
                      </Badge>
                    ) : rating.audienceRating ? (
                      <Badge
                        variant={getRatingBadgeVariant(rating.audienceRating)}
                        className={`text-base px-3 py-1 font-bold ${getRatingColor(rating.audienceRating)} ${getRatingBadgeClass(rating.audienceRating)}`}
                      >
                        {stripRatingUnit(rating.audienceRating)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
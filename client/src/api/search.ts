import api from './api';

export interface Rating {
  source: string;
  criticsRating?: string;
  audienceRating?: string;
}

export interface SearchResult {
  title: string;
  year?: string;
  posterUrl?: string;
  ratings: Rating[];
  plotSummary: string;
  cast: string[];
  reviewerSummary: string;
}

// Description: Search for a movie or TV show by name
// Endpoint: POST /api/search
// Request: { query: string }
// Response: { success: boolean, data: SearchResult, message?: string }
export const searchMedia = (query: string): Promise<{ success: boolean; data: SearchResult; message?: string }> => {
  console.log('[API] Searching for media:', query);
  
  // Mocking the response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      // Mock different results based on search query
      if (lowerQuery.includes('crown')) {
        resolve({
          success: true,
          data: {
            title: 'The Crown',
            year: '2016',
            posterUrl: 'https://via.placeholder.com/200x300?text=The+Crown',
            ratings: [
              {
                source: 'Rotten Tomatoes',
                criticsRating: '89%',
                audienceRating: '87%'
              },
              {
                source: 'Metacritic',
                criticsRating: '81/100',
                audienceRating: '8.2/10'
              },
              {
                source: 'IMDB',
                criticsRating: '8.6/10',
                audienceRating: undefined
              }
            ],
            plotSummary: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century. A biographical story about the reign of Queen Elizabeth II, exploring the personal intrigues, romances, and political rivalries behind the great events that shaped the second half of the 20th century.',
            cast: [
              'Claire Foy as Queen Elizabeth II',
              'Matt Smith as Prince Philip',
              'Vanessa Kirby as Princess Margaret',
              'John Lithgow as Winston Churchill',
              'Olivia Colman as Queen Elizabeth II'
            ],
            reviewerSummary: 'Critics praise The Crown for its lavish production values, stellar performances, and nuanced exploration of British royalty. The series is lauded for its attention to historical detail and compelling character development. Some reviewers note the show\'s slower pacing but appreciate its thoughtful approach to depicting complex political and personal relationships. Overall, it\'s considered one of the finest historical dramas on television.'
          }
        });
      } else if (lowerQuery.includes('stranger')) {
        resolve({
          success: true,
          data: {
            title: 'Stranger Things',
            year: '2016',
            posterUrl: 'https://via.placeholder.com/200x300?text=Stranger+Things',
            ratings: [
              {
                source: 'Rotten Tomatoes',
                criticsRating: '93%',
                audienceRating: '91%'
              },
              {
                source: 'Metacritic',
                criticsRating: '76/100',
                audienceRating: '8.9/10'
              },
              {
                source: 'IMDB',
                criticsRating: '8.7/10',
                audienceRating: undefined
              }
            ],
            plotSummary: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back. Set in the 1980s, the series blends mystery, horror, and nostalgia as the town of Hawkins, Indiana faces otherworldly threats.',
            cast: [
              'Millie Bobby Brown as Eleven',
              'Finn Wolfhard as Mike Wheeler',
              'Winona Ryder as Joyce Byers',
              'David Harbour as Jim Hopper',
              'Gaten Matarazzo as Dustin Henderson',
              'Caleb McLaughlin as Lucas Sinclair'
            ],
            reviewerSummary: 'Stranger Things has been widely praised for its nostalgic 1980s atmosphere, compelling storytelling, and strong ensemble cast. Critics highlight the show\'s ability to blend horror, science fiction, and coming-of-age drama seamlessly. The performances, particularly from the young cast, receive consistent acclaim. While some note that later seasons don\'t quite match the freshness of the first, the series remains a cultural phenomenon with broad appeal.'
          }
        });
      } else if (lowerQuery.includes('inception')) {
        resolve({
          success: true,
          data: {
            title: 'Inception',
            year: '2010',
            posterUrl: 'https://via.placeholder.com/200x300?text=Inception',
            ratings: [
              {
                source: 'Rotten Tomatoes',
                criticsRating: '87%',
                audienceRating: '91%'
              },
              {
                source: 'Metacritic',
                criticsRating: '74/100',
                audienceRating: '8.5/10'
              },
              {
                source: 'IMDB',
                criticsRating: '8.8/10',
                audienceRating: undefined
              }
            ],
            plotSummary: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. Dom Cobb is a skilled thief in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.',
            cast: [
              'Leonardo DiCaprio as Dom Cobb',
              'Joseph Gordon-Levitt as Arthur',
              'Ellen Page as Ariadne',
              'Tom Hardy as Eames',
              'Marion Cotillard as Mal',
              'Cillian Murphy as Robert Fischer'
            ],
            reviewerSummary: 'Inception is hailed as a masterpiece of modern cinema, praised for its originality, visual effects, and intricate plot. Critics commend Christopher Nolan\'s ambitious storytelling and the film\'s ability to challenge audiences intellectually while delivering spectacular action sequences. The performances, particularly DiCaprio\'s, are considered top-notch. Some find the complexity overwhelming, but most agree it\'s a thought-provoking and visually stunning achievement.'
          }
        });
      } else if (!lowerQuery.trim()) {
        reject(new Error('Please enter a movie or TV show name'));
      } else {
        reject(new Error(`We couldn't find any streaming shows or movies matching '${query}'. Please try another search.`));
      }
    }, 2000); // Simulate 2 second delay for scraping
  });
  
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/search', { query });
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
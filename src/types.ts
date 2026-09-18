export type ScreenName =
  | 'home'
  | 'search'
  | 'book-details'
  | 'wayfinding'
  | 'my-library'
  | 'profile'
  | 'signin'
  | 'signup'
  | 'forgot-password';

export interface BookCopy {
  id: string;
  code: string;
  location: string;
  shelfLocation: string;
  status: 'available' | 'hold' | 'on-loan' | 'checked-out';
  statusLabel: string;
  dueBack?: string;
  isAvailable: boolean;
}

export interface BookTopic {
  title: string;
  description: string;
  chapterInfo: string;
  badge: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  publishedYear: string;
  category: string;
  tags: string[];
  dewey: string;
  lcCall: string;
  isbn: string;
  rating: number;
  reviewCount: number;
  citationCount: number;
  pages: string;
  language: string;
  coverImage: string;
  isAvailable: boolean;
  statusText: string;
  statusType: 'available' | 'limited' | 'issued';
  copiesTotal: number;
  copiesOnShelf: number;
  location: {
    floor: string;
    floorNumber: number;
    wing: string;
    section: string;
    rack: string;
    shelf: string;
    position?: string;
    bayTier?: string;
    distanceWalkMeters: number;
    beaconId: string;
  };
  synopsisSummary: string;
  synopsisExtended: string;
  topics: BookTopic[];
  copies: BookCopy[];
  isSaved?: boolean;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  dewey: string;
  loanProgressPercent: number;
  dueText: string;
  dueDate: string;
  daysRemaining: number;
  isDueSoon: boolean;
  canRenew: boolean;
}

export interface ActiveHold {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  pickupLocation: string;
  lockerNumber: string;
  holdCode: string;
  expiresInText: string;
  reserved: boolean;
}

export interface UserProfile {
  name: string;
  idNumber: string;
  email: string;
  division: string;
  kioskCardNumber: string;
  avatarUrl: string;
  isGuest?: boolean;
  isLoggedIn: boolean;
  savedBookIds: string[];
  readingGoal: {
    completed: number;
    total: number;
  };
}

export interface FilterState {
  genre: string[];
  availability: 'all' | 'available' | 'limited';
  floors: string[];
  minRating: number;
  sortBy: 'relevance' | 'title' | 'author' | 'rating' | 'recent';
}

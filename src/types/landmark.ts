export type LandmarkCategory = 
  | 'scenic_landscape'
  | 'natural_wonder'
  | 'cultural_heritage'
  | 'mountain_eco'
  | 'island_beach'
  | 'historic_monument';

export type LandmarkTheme = 
  | 'parchment' // Warm archival limestone & paper
  | 'emerald'   // Lush nature & mist
  | 'amber'     // Golden sunset & terracotta
  | 'lapis'     // Deep ocean & lapis lazuli
  | 'imperial'  // Royal bronze & crimson silk
  | 'charcoal'  // Contemporary stark gallery
  | 'stone';    // Cave & karst slate

export interface HighlightItem {
  id?: string;
  title: string;
  description: string;
  tag?: string;
  imageUrl?: string;
}

export interface ItineraryActivity {
  id?: string;
  time: string;
  title: string;
  description: string;
  tip?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  summary: string;
  activities: ItineraryActivity[];
}

export interface GastronomyItem {
  id: string;
  name: string;
  description: string;
  recommendedPlaces?: string;
  imageUrl?: string;
}

export interface PracticalTip {
  id: string;
  category: 'transport' | 'packing' | 'cost' | 'etiquette';
  title: string;
  details: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  author?: string;
}

export interface LandmarkLocation {
  province: string;
  country: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface QuickFacts {
  bestSeason: string;
  idealDuration: string;
  ticketPrice: string;
  openingHours: string;
  suitableFor: string;
  difficultyLevel: 'Dễ dàng' | 'Trung bình' | 'Thử thách';
  weatherNote: string;
}

export interface AudioGuideData {
  title: string;
  script: string;
  durationEstimateMinutes: number;
}

export interface Landmark {
  id: string;
  name: string;
  originalName?: string;
  tagline: string;
  category: LandmarkCategory;
  categoryLabel: string;
  unescoStatus?: string;
  location: LandmarkLocation;
  heroImage: string;
  theme: LandmarkTheme;
  quickFacts: QuickFacts;
  overview: string;
  pullQuote?: string;
  historyLore?: string;
  culturalSignificance?: string;
  highlights: HighlightItem[];
  itinerary: ItineraryDay[];
  gastronomy: GastronomyItem[];
  practicalTips: PracticalTip[];
  gallery: GalleryPhoto[];
  audioGuide: AudioGuideData;
  authorName?: string;
  updatedAt: string;
  isCustom?: boolean;
}

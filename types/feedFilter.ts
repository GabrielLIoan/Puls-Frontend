export type CountryFilter = 'RO' | 'EU' | null;

export interface FeedFilter {
  country: CountryFilter;
  categories: string[];
}

export const EMPTY_FILTER: FeedFilter = {
  country: null,
  categories: [],
};
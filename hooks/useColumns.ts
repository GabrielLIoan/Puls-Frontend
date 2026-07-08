import { useWindowDimensions } from 'react-native';

// Breakpoints
const TABLET_BREAKPOINT = 768;
const LARGE_TABLET_BREAKPOINT = 1024;

export function useColumns(): number {
  const { width } = useWindowDimensions();
  if (width >= LARGE_TABLET_BREAKPOINT) return 3;
  if (width >= TABLET_BREAKPOINT) return 2;
  return 1;
}
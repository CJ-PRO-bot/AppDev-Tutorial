export type Palette = {
  bg: string; card: string; text: string; muted: string; border: string;
  primary: string; primaryDeep: string; tint: string; soft: string; success: string;
  successTint: string; danger: string; codeBg: string; tab: string;
};
export const lightColors: Palette = {
  bg: '#F5F7FC', card: '#FFFFFF', text: '#17213B', muted: '#6B7691', border: '#E7EBF4',
  primary: '#5A55D9', primaryDeep: '#433CBE', tint: '#EFEDFF', soft: '#F0F3F9',
  success: '#15957A', successTint: '#E2F7EF', danger: '#D94E64', codeBg: '#141D33', tab: '#FFFFFF',
};
export const darkColors: Palette = {
  bg: '#101625', card: '#1A2338', text: '#F3F6FF', muted: '#A4B0CB', border: '#2B3852',
  primary: '#9A95FF', primaryDeep: '#6D64E9', tint: '#302B57', soft: '#26314A',
  success: '#65D5B3', successTint: '#18493D', danger: '#FF8794', codeBg: '#0B1120', tab: '#172037',
};

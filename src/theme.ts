// theme.ts - Unica fuente de verdad del diseño
// Regla del proyecto: Ningun componente escribe colores, margenes o tamaños " a mano"
// Si necesitas un valor nuevo, lo agregas aqui y se le pone
import { Platform, StyleSheet } from 'react-native';

export const colors = {
  portalGreen: '#8FD6A8',
  portalGreenSoft: '#E4F6EA',
  portalGreenDeep: '#2E6B4E',
  skyBlue: '#A9DCF2',
  skyBlueSoft: '#E8F5FC',
  lavender: '#C8B9F0',
  lavenderSoft: '#F1ECFD',

  background: '#F4F7FB',
  surface: '#FFFFFF',
  border: '#E3E8EF',

  textPrimary: '#1E2A3A',
  textSecondary: '#5A6678',
  textMuted: '#8C96A6',

  statusAlive: '#4FC284',
  statusAliveSoft: '#E2F6EB',
  statusDead: '#EC7F7F',
  statusDeadSoft: '#FCE8E8',
  statusUnknown: '#AEB6C2',
  statusUnknownSoft: '#EEF1F5',

  errorText: '#B24A4A',
  errorSoft: '#FCE8E8',

  shadow: '#1E2A3A',
  backdrop: 'rgba(30, 42, 58, 0.45)',
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const fontSizes = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  headline: 24,
  display: 32,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const letterSpacings = {
  wide: 1,
} as const;

export const sizes = {
  cardImage: 80,
  detailImage: 200,
  statusDot: 10,
  sheetHandleWidth: 40,
  sheetHandleHeight: 4,
  searchInputHeight: 48,
  messageIcon: 48,
  sheetMaxHeight: '90%',
} as const;

export const pressFeedback = {
  opacity: 0.85,
  scale: 0.98,
} as const;

export const borderWidths = {
  hairline: StyleSheet.hairlineWidth,
  regular: 1,
  thick: 4,
} as const;

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
  sheet: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
    default: {},
  }),
};
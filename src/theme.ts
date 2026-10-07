/**
 * theme.ts — Única fuente de verdad del diseño.
 *
 * En la web solemos tener variables CSS (`--color-primary`) o un tailwind.config.
 * En React Native NO existe CSS: los estilos son objetos de JavaScript.
 * Por eso el "design system" es simplemente un módulo de TypeScript que exporta
 * constantes. Cualquier componente las importa y las usa dentro de StyleSheet.create.
 *
 * Regla del proyecto: ningún componente escribe colores, márgenes o tamaños "a mano".
 * Si necesitas un valor nuevo, se agrega aquí y se le pone nombre.
 *
 * `as const` congela los valores como tipos literales (por ejemplo, '600' en lugar de
 * string). Esto es importante porque React Native tipa `fontWeight` como una unión
 * de literales ('400' | '600' | ...), y un `string` genérico no compilaría.
 */
import { Platform, StyleSheet } from 'react-native';

/* -------------------------------------------------------------------------- */
/*  Colores                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * Paleta pastel inspirada en Rick and Morty:
 * - Verde portal: el remolino verde de la pistola de portales, suavizado.
 * - Celeste: la bata de laboratorio de Rick y el cielo de la Tierra C-137.
 * - Lavanda: los tonos de los fondos interdimensionales.
 * Los textos usan un azul pizarra oscuro (no negro puro) para mantener la suavidad
 * sin perder contraste legible.
 */
export const colors = {
  // Identidad
  portalGreen: '#8FD6A8',
  portalGreenSoft: '#E4F6EA',
  portalGreenDeep: '#2E6B4E',
  skyBlue: '#A9DCF2',
  skyBlueSoft: '#E8F5FC',
  lavender: '#C8B9F0',
  lavenderSoft: '#F1ECFD',

  // Superficies
  background: '#F4F7FB',
  surface: '#FFFFFF',
  border: '#E3E8EF',

  // Texto
  textPrimary: '#1E2A3A',
  textSecondary: '#5A6678',
  textMuted: '#8C96A6',

  // Estado del personaje (indicador de color)
  statusAlive: '#4FC284',
  statusAliveSoft: '#E2F6EB',
  statusDead: '#EC7F7F',
  statusDeadSoft: '#FCE8E8',
  statusUnknown: '#AEB6C2',
  statusUnknownSoft: '#EEF1F5',

  // Feedback
  errorText: '#B24A4A',
  errorSoft: '#FCE8E8',

  // Utilitarios
  shadow: '#1E2A3A',
  // Fondo semitransparente detrás del modal. RN acepta rgba() igual que CSS.
  backdrop: 'rgba(30, 42, 58, 0.45)',
} as const;

/* -------------------------------------------------------------------------- */
/*  Espaciado (grilla de 8)                                                    */
/* -------------------------------------------------------------------------- */
/**
 * Material Design organiza todo sobre una grilla de 8 puntos. Usar siempre
 * múltiplos de 8 produce un ritmo visual consistente sin pensarlo demasiado.
 *
 * Diferencia con la web: en React Native los números no llevan unidad (no hay
 * `px`, `rem` ni `em`; solo se aceptan números o strings de porcentaje como '50%').
 * Un 16 son 16 "density-independent pixels" (dp en Android, points en iOS): el
 * sistema lo escala según la densidad de la pantalla, así que se ve del mismo
 * tamaño físico en cualquier teléfono.
 */
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

/* -------------------------------------------------------------------------- */
/*  Radios de borde                                                            */
/* -------------------------------------------------------------------------- */
export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  // Un valor muy grande produce una "píldora" o un círculo perfecto.
  // (No existe `border-radius: 50%` en React Native.)
  pill: 999,
} as const;

/* -------------------------------------------------------------------------- */
/*  Tipografía                                                                 */
/* -------------------------------------------------------------------------- */
/**
 * Usamos la fuente del sistema (San Francisco en iOS, Roboto en Android), que es
 * la opción por defecto si no se define `fontFamily`.
 */
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
  // Para textos cortos en mayúsculas (etiquetas tipo "overline" de Material).
  wide: 1,
} as const;

/* -------------------------------------------------------------------------- */
/*  Tamaños de elementos concretos                                             */
/* -------------------------------------------------------------------------- */
/**
 * En React Native las imágenes remotas NO tienen tamaño intrínseco: si no les das
 * width y height, miden 0x0 y no se ven. Por eso los tamaños de imagen viven aquí.
 */
export const sizes = {
  cardImage: 80,
  detailImage: 200,
  statusDot: 10,
  sheetHandleWidth: 40,
  sheetHandleHeight: 4,
  searchInputHeight: 48,
  messageIcon: 48,
  // Altura máxima del modal. Los porcentajes se escriben como string ('90%')
  // y son relativos al contenedor padre, igual que en CSS.
  sheetMaxHeight: '90%',
} as const;

/* -------------------------------------------------------------------------- */
/*  Feedback al presionar                                                      */
/* -------------------------------------------------------------------------- */
/**
 * En móvil no hay `:hover` (no hay cursor) ni `:active` de CSS. El feedback se
 * programa con el estado `pressed` de Pressable; estos son los valores que usa.
 */
export const pressFeedback = {
  opacity: 0.85,
  scale: 0.98,
} as const;

export const borderWidths = {
  // hairlineWidth es la línea más fina que la pantalla puede dibujar
  // (1 pixel físico). Es el equivalente al típico "borde de 1px" de la web,
  // pero se ve nítido en pantallas de alta densidad.
  hairline: StyleSheet.hairlineWidth,
  regular: 1,
  thick: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*  Sombras (elevación)                                                        */
/* -------------------------------------------------------------------------- */
/**
 * Una de las diferencias más visibles con la web: no existe un `box-shadow`
 * tradicional que funcione igual en ambas plataformas.
 * - iOS usa las propiedades shadowColor / shadowOffset / shadowOpacity / shadowRadius.
 * - Android ignora esas propiedades y usa `elevation`, un número que imita la
 *   altura de Material Design (el sistema dibuja la sombra por ti).
 *
 * `Platform.select` devuelve el objeto de la plataforma en la que corre la app.
 * Es la forma idiomática de escribir estilos específicos por plataforma.
 *
 * (Nota para curiosos: desde React Native 0.76, con la Nueva Arquitectura, existe la
 * propiedad `boxShadow` que funciona en ambas plataformas con sintaxis tipo CSS.
 * Aquí usamos el enfoque clásico porque es el que van a encontrar en el 90% del
 * código existente y porque deja ver la diferencia entre plataformas.)
 */
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

/**
 * StatusIndicator.tsx — Punto de color + etiqueta con el estado del personaje.
 *
 * Se usa en dos lugares con dos apariencias:
 * - 'inline': punto y texto, discreto, para la tarjeta de la lista.
 * - 'chip': una "píldora" con fondo suave, más visible, para el modal de detalle.
 * Un mismo componente con una prop `variant` evita duplicar la lógica de colores.
 */
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fontWeights, radii, sizes, spacing } from '../theme';
import type { CharacterStatus } from '../types/character';
import { statusPresentationByStatus } from '../utils/characterPresentation';

interface StatusIndicatorProps {
  status: CharacterStatus;
  variant?: 'inline' | 'chip';
}

export const StatusIndicator = ({ status, variant = 'inline' }: StatusIndicatorProps) => {
  const statusPresentation = statusPresentationByStatus[status];
  const isChipVariant = variant === 'chip';

  return (
    // `style` acepta un arreglo: React Native los combina de izquierda a derecha y
    // el último gana (parecido a la cascada de CSS, pero explícito). Los valores
    // `false` o `undefined` se ignoran, lo que permite estilos condicionales.
    <View
      style={[
        styles.container,
        isChipVariant && styles.chipContainer,
        isChipVariant && { backgroundColor: statusPresentation.backgroundColor },
      ]}
    >
      <View
        style={[styles.statusDot, { backgroundColor: statusPresentation.indicatorColor }]}
      />
      {/* Todo texto DEBE estar dentro de <Text>. En la web puedes escribir texto
          suelto dentro de un <div>; en React Native eso lanza un error, porque
          View no sabe dibujar texto: solo Text tiene un motor de texto nativo. */}
      <Text style={[styles.label, isChipVariant && styles.chipLabel]}>
        {statusPresentation.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Diferencia clave con la web: en React Native TODO View es un contenedor flex
  // por defecto, y la dirección por defecto es 'column' (en la web es 'row').
  // Para poner el punto al lado del texto hay que pedir 'row' explícitamente.
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // `gap` funciona como en CSS flexbox (soportado desde React Native 0.71).
    gap: spacing.xs,
  },
  chipContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  // Un círculo: ancho = alto y un radio igual a la mitad (o mayor).
  statusDot: {
    width: sizes.statusDot,
    height: sizes.statusDot,
    borderRadius: radii.pill,
  },
  label: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
  },
  chipLabel: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
});

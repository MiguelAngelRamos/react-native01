/**
 * FeedbackMessage.tsx — Mensaje centrado para los estados "error" y "vacío".
 *
 * Ambos estados se ven igual (ícono, título, descripción y, opcionalmente, un
 * botón), así que comparten componente. La pantalla decide el contenido.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontSizes,
  fontWeights,
  pressFeedback,
  radii,
  sizes,
  spacing,
} from '../theme';

interface FeedbackMessageProps {
  /** Un emoji. Se dibuja como texto, así que no necesitamos una librería de íconos. */
  icon: string;
  title: string;
  description: string;
  /** Si se pasan ambos, se muestra un botón (por ejemplo, "Reintentar"). */
  actionLabel?: string;
  onActionPress?: () => void;
}

export const FeedbackMessage = ({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: FeedbackMessageProps) => {
  const hasAction = actionLabel !== undefined && onActionPress !== undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {hasAction && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // flex: 1 + justifyContent/alignItems 'center' es la receta para centrar algo
  // en todo el espacio disponible (como `display:flex; place-items:center` en CSS,
  // pero aquí `display: flex` ya viene activado en todos los View).
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  icon: {
    fontSize: sizes.messageIcon,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.portalGreen,
  },
  actionButtonPressed: {
    opacity: pressFeedback.opacity,
    transform: [{ scale: pressFeedback.scale }],
  },
  actionLabel: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.portalGreenDeep,
  },
});

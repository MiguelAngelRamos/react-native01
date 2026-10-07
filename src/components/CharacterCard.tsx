/**
 * CharacterCard.tsx — Tarjeta de un personaje en la lista.
 *
 * Layout: imagen a la izquierda, y a la derecha una columna con nombre, especie
 * y estado. Toda la tarjeta es tocable y abre el detalle.
 */
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  borderWidths,
  colors,
  fontSizes,
  fontWeights,
  pressFeedback,
  radii,
  shadows,
  sizes,
  spacing,
} from '../theme';
import type { Character } from '../types/character';
import { StatusIndicator } from './StatusIndicator';

interface CharacterCardProps {
  character: Character;
  /** Se llama con el personaje tocado. El padre decide qué hacer (abrir el modal). */
  onPress: (character: Character) => void;
}

export const CharacterCard = ({ character, onPress }: CharacterCardProps) => {
  const handleCardPress = () => {
    onPress(character);
  };

  return (
    // Pressable es el reemplazo de onClick. En React Native no existe `onClick` ni
    // `<button>`: cualquier zona tocable se envuelve en Pressable y se usa `onPress`.
    //
    // Su prop `style` puede ser una FUNCIÓN que recibe `{ pressed }`. Así damos
    // feedback visual mientras el dedo está apoyado (en la web usaríamos `:active`
    // en CSS, que aquí no existe).
    //
    // Nota: Android ofrece además `android_ripple` (la "onda" de Material Design).
    // Aquí usamos un feedback propio que se ve igual en iOS y Android.
    <Pressable
      onPress={handleCardPress}
      // Accesibilidad: le dice a VoiceOver/TalkBack que esto es un botón y qué hace.
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${character.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* <Image> en lugar de <img>. Para imágenes remotas, `source` recibe un objeto
          { uri } y es OBLIGATORIO darle width y height: a diferencia del navegador,
          React Native no descarga la imagen para averiguar su tamaño, así que sin
          dimensiones mide 0x0 y no se ve nada. */}
      <Image source={{ uri: character.image }} style={styles.characterImage} />

      <View style={styles.infoColumn}>
        {/* numberOfLines reemplaza a `text-overflow: ellipsis` de CSS: corta el texto
            con "..." si no entra en la cantidad de líneas indicada. */}
        <Text style={styles.characterName} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={styles.characterSpecies} numberOfLines={1}>
          {character.species}
        </Text>
        <StatusIndicator status={character.status} />
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
};

/**
 * StyleSheet.create en lugar de CSS:
 * - No hay selectores, clases ni cascada: cada estilo se aplica a mano vía `style`.
 * - Los nombres van en camelCase (`backgroundColor`, no `background-color`).
 * - StyleSheet.create valida las propiedades y TypeScript las autocompleta.
 * Es parecido a CSS-in-JS, pero lo que se genera son estilos nativos, no CSS.
 */
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    // Spread de la sombra del theme: en iOS se expanden las propiedades shadow*,
    // en Android se expande `elevation`. Ver theme.ts.
    ...shadows.card,
  },
  // Estado presionado: se aclara y se encoge apenas, como si se "hundiera".
  // `transform` recibe un ARREGLO de transformaciones (en CSS es un string).
  cardPressed: {
    opacity: pressFeedback.opacity,
    transform: [{ scale: pressFeedback.scale }],
  },
  characterImage: {
    width: sizes.cardImage,
    height: sizes.cardImage,
    borderRadius: radii.sm,
    backgroundColor: colors.lavenderSoft,
  },
  // flex: 1 hace que la columna ocupe todo el espacio sobrante de la fila,
  // empujando la flecha (chevron) hacia el borde derecho.
  infoColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  characterName: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  characterSpecies: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: fontSizes.headline,
    color: colors.textMuted,
  },
});

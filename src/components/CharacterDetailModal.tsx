/**
 * CharacterDetailModal.tsx — Hoja inferior (bottom sheet) con el detalle del personaje.
 *
 * Usamos el <Modal> que trae React Native. En la web un modal suele ser un <div>
 * con `position: fixed` y un z-index alto (o un portal de React). Aquí Modal es un
 * componente NATIVO: el sistema operativo lo dibuja en una capa por encima de toda
 * la app y se encarga de la animación. No hace falta ningún portal ni z-index.
 */
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { formatLocationName, genderLabelByGender } from '../utils/characterPresentation';
import { StatusIndicator } from './StatusIndicator';

interface CharacterDetailModalProps {
  /** Personaje a mostrar. `null` cuando todavía no se tocó ninguno. */
  character: Character | null;
  isVisible: boolean;
  onClose: () => void;
}

export const CharacterDetailModal = ({
  character,
  isVisible,
  onClose,
}: CharacterDetailModalProps) => {
  // useSafeAreaInsets devuelve cuánto espacio ocupan el notch, la barra de estado
  // y la barra de gestos/navegación del sistema. Concepto que no existe en la web:
  // en un teléfono, partes de la pantalla están tapadas por hardware o por el SO.
  // Lo usamos para que el botón "Cerrar" no quede debajo de la barra de gestos.
  const safeAreaInsets = useSafeAreaInsets();

  // El return anticipado va DESPUÉS de los hooks: las reglas de los hooks exigen
  // que se llamen siempre, en el mismo orden, en cada render (igual que en la web).
  if (character === null) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      // 'slide' hace que el contenido suba desde abajo.
      animationType="slide"
      // transparent: el Modal no pinta un fondo propio, así podemos dibujar nuestro
      // fondo oscuro semitransparente y la hoja ocupando solo la parte de abajo.
      transparent
      // Android: el modal se dibuja también detrás de la barra de estado y de la
      // de navegación, para que el fondo oscuro cubra toda la pantalla.
      statusBarTranslucent
      navigationBarTranslucent
      // OBLIGATORIO en la práctica para Android: se llama cuando el usuario usa el
      // botón/gesto "Atrás". Sin esto, el modal no se podría cerrar con "Atrás".
      onRequestClose={onClose}
    >
      {/* Detalle a notar: con animationType 'slide' TODO el contenido sube, incluido
          el fondo oscuro. Para que el fondo aparezca con fade y solo la hoja deslice
          habría que animarlo a mano con la API Animated; lo dejamos simple. */}
      <View style={styles.backdrop}>
        {/* Tocar fuera de la hoja la cierra. StyleSheet.absoluteFill es un atajo
            para `position: absolute` con top/right/bottom/left en 0. */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar detalle"
        />

        {/* Los estilos que dependen de valores en tiempo de ejecución (como los insets,
            que cambian según el teléfono) se pasan como objeto en línea, combinados
            con los estáticos de StyleSheet.create. */}
        <View
          style={[styles.sheet, { paddingBottom: spacing.md + safeAreaInsets.bottom }]}
        >
          <View style={styles.sheetHandle} />

          {/* ScrollView sí es adecuado aquí: el contenido es corto y de tamaño fijo.
              (Para listas largas usamos FlatList; ver CharacterListScreen.)
              Lo usamos por si la pantalla es pequeña y el detalle no entra. */}
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroSection}>
              <Image source={{ uri: character.image }} style={styles.detailImage} />
              <Text style={styles.characterName}>{character.name}</Text>
              <StatusIndicator status={character.status} variant="chip" />
            </View>

            <View style={styles.detailList}>
              <DetailRow label="Especie" value={character.species} />
              <DetailRow label="Género" value={genderLabelByGender[character.gender]} />
              <DetailRow label="Origen" value={formatLocationName(character.origin.name)} />
              <DetailRow
                label="Última ubicación"
                value={formatLocationName(character.location.name)}
              />
              <DetailRow label="Episodios" value={String(character.episode.length)} />
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            >
              <Text style={styles.closeButtonLabel}>Cerrar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* -------------------------------------------------------------------------- */

interface DetailRowProps {
  label: string;
  value: string;
}

/**
 * Una fila "etiqueta → valor". Es un componente pequeño y privado de este archivo:
 * no se exporta porque nadie más lo necesita.
 */
const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Ocupa toda la pantalla y empuja la hoja hacia abajo con 'flex-end'
  // (recuerda: el eje principal por defecto es vertical, así que justifyContent
  // controla la posición vertical).
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  // La hoja: esquinas superiores redondeadas, como un bottom sheet de Material.
  sheet: {
    maxHeight: sizes.sheetMaxHeight,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingTop: spacing.xs,
    ...shadows.sheet,
  },
  // La "manija": una barrita gris que indica visualmente que es una hoja.
  sheetHandle: {
    alignSelf: 'center',
    width: sizes.sheetHandleWidth,
    height: sizes.sheetHandleHeight,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  sheetContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  // Imagen circular con un aro verde: un guiño al portal de Rick.
  detailImage: {
    width: sizes.detailImage,
    height: sizes.detailImage,
    borderRadius: radii.pill,
    borderWidth: borderWidths.thick,
    borderColor: colors.portalGreen,
    backgroundColor: colors.lavenderSoft,
  },
  characterName: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  // Contenedor de las filas con fondo celeste suave para agruparlas visualmente.
  detailList: {
    backgroundColor: colors.skyBlueSoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  // flexShrink + textAlign right: si el valor es largo, se ajusta en lugar de
  // empujar la etiqueta fuera de la pantalla.
  detailValue: {
    flexShrink: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.portalGreen,
  },
  closeButtonPressed: {
    opacity: pressFeedback.opacity,
    transform: [{ scale: pressFeedback.scale }],
  },
  closeButtonLabel: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.semibold,
    color: colors.portalGreenDeep,
  },
});

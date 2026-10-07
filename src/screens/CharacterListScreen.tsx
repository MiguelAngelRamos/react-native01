/**
 * CharacterListScreen.tsx — La única pantalla de la app.
 *
 * Responsabilidades:
 * 1. Cargar los personajes desde la API (y manejar carga / error).
 * 2. Mantener el texto de búsqueda y derivar la lista filtrada.
 * 3. Renderizar la lista con FlatList.
 * 4. Abrir el modal de detalle al tocar una tarjeta.
 *
 * Como no usamos librería de navegación, esta "pantalla" es simplemente un
 * componente que ocupa todo el espacio. En una app con varias pantallas,
 * Expo Router o React Navigation se encargarían de montarlas.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CharacterCard } from '../components/CharacterCard';
import { CharacterDetailModal } from '../components/CharacterDetailModal';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { fetchCharacters, filterCharactersByName } from '../services/characterService';
import {
  borderWidths,
  colors,
  fontSizes,
  fontWeights,
  letterSpacings,
  radii,
  shadows,
  sizes,
  spacing,
} from '../theme';
import type { Character } from '../types/character';

export const CharacterListScreen = () => {
  /* ------------------------------------------------------------------------ */
  /*  Estado                                                                   */
  /* ------------------------------------------------------------------------ */
  // useState funciona exactamente igual que en React web. Lo que cambia es lo que
  // renderizamos (View/Text en lugar de div/span), no la forma de manejar estado.

  // Los personajes descargados de la API (la lista completa, sin filtrar).
  const [characterList, setCharacterList] = useState<Character[]>([]);

  // Arranca en `true` porque lo primero que hace la pantalla es cargar datos.
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);

  // `null` significa "no hubo error". Guardamos el mensaje para mostrarlo.
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  // Contador de intentos de carga. Incrementarlo vuelve a disparar el useEffect
  // de carga (ver más abajo). Es la forma de implementar "Reintentar".
  const [loadAttemptCount, setLoadAttemptCount] = useState(0);

  // Texto del buscador. Es un input CONTROLADO: el valor vive en el estado de React.
  const [searchQuery, setSearchQuery] = useState('');

  // Personaje elegido y visibilidad del modal, en DOS estados separados.
  // ¿Por qué no usar solo `selectedCharacter !== null` para la visibilidad?
  // Porque al cerrar, el modal hace una animación de salida: si borráramos el
  // personaje en ese momento, el contenido desaparecería mientras la hoja baja.
  // Así, al cerrar solo ocultamos el modal y el personaje sigue ahí hasta el próximo.
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*  Efecto: cargar personajes                                                */
  /* ------------------------------------------------------------------------ */
  // useEffect sincroniza el componente con algo externo (aquí, la API).
  // Se ejecuta después del primer render y cada vez que cambia `loadAttemptCount`
  // (su arreglo de dependencias). Igual que en React web.
  useEffect(() => {
    // AbortController permite cancelar la petición en curso. Si el componente se
    // desmonta (o el efecto se vuelve a ejecutar) antes de que llegue la respuesta,
    // la cancelamos para no actualizar el estado de un componente que ya no existe.
    const abortController = new AbortController();

    // useEffect no puede recibir una función async directamente (debe devolver
    // nada o una función de limpieza, no una Promise). Por eso definimos una
    // función async adentro y la llamamos.
    const loadCharacters = async () => {
      try {
        const loadedCharacters = await fetchCharacters(abortController.signal);
        setCharacterList(loadedCharacters);
      } catch (error) {
        // Si la cancelamos nosotros, no es un error que deba ver el usuario.
        if (abortController.signal.aborted) {
          return;
        }
        // En TypeScript estricto, `error` es `unknown`: lo registramos para depurar
        // (aparece en la terminal de Metro) y mostramos un mensaje amable.
        console.warn('No se pudieron cargar los personajes:', error);
        setLoadErrorMessage(
          'No pudimos abrir el portal hacia la API. Revisa tu conexión e inténtalo de nuevo.',
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingCharacters(false);
        }
      }
    };

    loadCharacters();

    // Función de limpieza: React la ejecuta al desmontar o antes de re-ejecutar el
    // efecto. (En desarrollo, React StrictMode monta-desmonta-monta a propósito:
    // gracias a este abort, la primera petición se cancela sin efectos raros.)
    return () => abortController.abort();
  }, [loadAttemptCount]);

  /* ------------------------------------------------------------------------ */
  /*  Datos derivados                                                          */
  /* ------------------------------------------------------------------------ */
  // La lista filtrada NO se guarda en otro useState: se CALCULA a partir del estado
  // que ya tenemos. Guardarla aparte obligaría a mantener dos estados sincronizados.
  // useMemo evita recalcular el filtro en renders donde no cambió ni la lista ni
  // la búsqueda (por ejemplo, al abrir el modal). Es una optimización opcional.
  const filteredCharacterList = useMemo(
    () => filterCharactersByName(characterList, searchQuery),
    [characterList, searchQuery],
  );

  /* ------------------------------------------------------------------------ */
  /*  Manejadores de eventos                                                   */
  /* ------------------------------------------------------------------------ */
  const handleCharacterPress = (character: Character) => {
    setSelectedCharacter(character);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
  };

  const handleRetryPress = () => {
    // Volvemos al estado de "cargando" y disparamos de nuevo el efecto de carga.
    setLoadErrorMessage(null);
    setIsLoadingCharacters(true);
    setLoadAttemptCount((previousAttemptCount) => previousAttemptCount + 1);
  };

  /* ------------------------------------------------------------------------ */
  /*  Render de cada ítem de la lista                                          */
  /* ------------------------------------------------------------------------ */
  // FlatList no recibe hijos: recibe los DATOS (`data`) y una función que sabe
  // dibujar UN elemento (`renderItem`). Así puede decidir cuáles dibujar.
  // ListRenderItem<Character> tipa el argumento `{ item }` automáticamente.
  const renderCharacterItem: ListRenderItem<Character> = ({ item: character }) => (
    <CharacterCard character={character} onPress={handleCharacterPress} />
  );

  /* ------------------------------------------------------------------------ */
  /*  Contenido según el estado: cargando → error → lista (o vacío)            */
  /* ------------------------------------------------------------------------ */
  const renderMainContent = () => {
    if (isLoadingCharacters) {
      return (
        <View style={styles.centeredContainer}>
          {/* ActivityIndicator es el spinner NATIVO de cada plataforma: en iOS se ve
              como el de iOS y en Android como el de Material. No hay que dibujarlo. */}
          <ActivityIndicator size="large" color={colors.portalGreenDeep} />
          <Text style={styles.loadingText}>Abriendo un portal…</Text>
        </View>
      );
    }

    if (loadErrorMessage !== null) {
      return (
        <FeedbackMessage
          icon="🌀"
          title="Algo salió mal"
          description={loadErrorMessage}
          actionLabel="Reintentar"
          onActionPress={handleRetryPress}
        />
      );
    }

    return (
      // ¿Por qué FlatList y no ScrollView + .map()?
      // ScrollView renderiza TODOS sus hijos de una vez, aunque no se vean. Con
      // cientos de tarjetas con imágenes, eso consume mucha memoria y la app se
      // traba. FlatList "virtualiza": solo monta los elementos visibles (más un
      // margen), y va montando/desmontando a medida que haces scroll.
      // En la web el navegador hace scroll de cualquier <div>; en móvil el scroll
      // es un componente explícito y elegir el correcto importa.
      <FlatList
        data={filteredCharacterList}
        renderItem={renderCharacterItem}
        // keyExtractor cumple el papel de la prop `key` en un .map(): le da a cada
        // elemento una identidad estable. Debe devolver un string.
        keyExtractor={(character) => String(character.id)}
        // Separador entre tarjetas (en lugar de un margin en cada una).
        ItemSeparatorComponent={ListItemSeparator}
        // Estado VACÍO: FlatList lo muestra automáticamente cuando `data` es [].
        ListEmptyComponent={
          <FeedbackMessage
            icon="🛸"
            title="Ningún personaje por aquí"
            description={`No encontramos a nadie llamado "${searchQuery.trim()}" en esta dimensión.`}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          // Cuando la lista está vacía, el contenedor crece para que el mensaje
          // de "vacío" pueda centrarse verticalmente.
          filteredCharacterList.length === 0 && styles.listContentEmpty,
        ]}
        // Cerrar el teclado al hacer scroll, y permitir tocar una tarjeta aunque el
        // teclado esté abierto (si no, el primer toque solo cierra el teclado).
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  /* ------------------------------------------------------------------------ */
  /*  JSX de la pantalla                                                       */
  /* ------------------------------------------------------------------------ */
  return (
    // SafeAreaView agrega padding para no quedar debajo del notch o la barra de
    // estado. Usamos el de `react-native-safe-area-context` (el de 'react-native'
    // está deprecado). `edges` indica qué bordes proteger: abajo no, porque
    // queremos que la lista se vea pasar por detrás de la barra de gestos.
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* View es el bloque básico de layout, el equivalente a <div>. No existe
          <div> en React Native porque no hay DOM: cada View se convierte en una
          vista nativa (UIView en iOS, android.view.View en Android). */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Multiverso C-137</Text>
        <Text style={styles.title}>Rick & Morty</Text>
        <Text style={styles.subtitle}>Explorador de personajes</Text>

        {/* TextInput controlado: `value` viene del estado y `onChangeText` lo
            actualiza. Diferencia con la web: `onChangeText` recibe directamente el
            string, sin `event.target.value`. */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por nombre…"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          // Cambia el texto de la tecla "Enter" del teclado del sistema.
          returnKeyType="search"
          // Solo iOS: muestra una "x" para borrar. Android simplemente lo ignora.
          clearButtonMode="while-editing"
          accessibilityLabel="Buscar personaje por nombre"
          // La búsqueda solo tiene sentido cuando ya hay datos.
          editable={!isLoadingCharacters && loadErrorMessage === null}
        />
      </View>

      {renderMainContent()}

      <CharacterDetailModal
        character={selectedCharacter}
        isVisible={isDetailModalVisible}
        onClose={handleDetailModalClose}
      />
    </SafeAreaView>
  );
};

/** Espacio vertical entre tarjetas. Definido fuera para no recrearlo en cada render. */
const ListItemSeparator = () => {
  return <View style={styles.listItemSeparator} />;
};

const styles = StyleSheet.create({
  // flex: 1 hace que la pantalla ocupe todo el alto disponible. En la web el
  // <body> crece con el contenido; en móvil la pantalla tiene un tamaño fijo y hay
  // que pedirle explícitamente a la raíz que lo llene.
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Encabezado con fondo lavanda suave y esquinas inferiores redondeadas.
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.lavenderSoft,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },
  eyebrow: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.portalGreenDeep,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.wide,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  searchInput: {
    height: sizes.searchInputHeight,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: borderWidths.regular,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: fontSizes.subtitle,
    color: colors.textPrimary,
    ...shadows.card,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  // contentContainerStyle estiliza el contenido que se desplaza (la "hoja larga"),
  // mientras que `style` estilizaría la ventana fija de la lista.
  listContent: {
    padding: spacing.md,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  listItemSeparator: {
    height: spacing.sm,
  },
});

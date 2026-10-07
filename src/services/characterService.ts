/**
 * characterService.ts — Capa de acceso a datos.
 *
 * Toda la comunicación con la API vive aquí. Los componentes no saben nada de URLs
 * ni de `fetch`: solo llaman a `fetchCharacters()` y reciben un `Character[]`.
 * Si mañana cambia la API, solo se toca este archivo.
 *
 * Buena noticia para quien viene de la web: `fetch` funciona igual en React Native.
 * No hay que instalar nada (ni axios); el runtime lo trae incorporado.
 */
import type { Character, CharacterPageResponse } from '../types/character';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * La API pagina de a 20 personajes. Cargamos las primeras páginas en paralelo
 * para tener una lista lo bastante larga como para que valga la pena usar FlatList
 * (y para que la búsqueda encuentre algo interesante).
 */
const INITIAL_PAGE_COUNT = 3;

/**
 * Pide una sola página de personajes.
 *
 * @param pageNumber Número de página (la API empieza en 1).
 * @param abortSignal Permite cancelar la petición si el componente se desmonta.
 */
const fetchCharacterPage = async (
  pageNumber: number,
  abortSignal?: AbortSignal,
): Promise<Character[]> => {
  const response = await fetch(`${API_BASE_URL}/character?page=${pageNumber}`, {
    // signal es el cable hasta esta petición. Si quien llamó hace abort(),
    // fetch corta la descarga aquí y rechaza la promesa.
    signal: abortSignal,
  });

  // Igual que en la web: `fetch` NO lanza error ante un 404 o un 500.
  // Solo lanza si falla la red. Por eso revisamos `response.ok` a mano.
  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}`);
  }

  // `response.json()` está tipado como `any`. Lo convertimos explícitamente a
  // nuestra interfaz: es una promesa que le hacemos al compilador de que la API
  // respeta ese contrato. (Validarlo en tiempo de ejecución, por ejemplo con zod,
  // queda fuera del alcance de este ejercicio.)
  const pageResponse = (await response.json()) as CharacterPageResponse;
  return pageResponse.results;
};

/**
 * Carga la lista inicial de personajes (las primeras INITIAL_PAGE_COUNT páginas).
 *
 * Promise.all lanza todas las peticiones a la vez y espera a que terminen todas.
 * Si cualquiera falla, la promesa completa se rechaza y el error llega al
 * try/catch de la pantalla.
 *
 * abortSignal — para qué sirve y cuándo llamarlo
 *
 * fetch, una vez lanzado, sigue hasta que la API responde. Si el usuario ya se
 * fue de la pantalla, esa respuesta no le sirve a nadie: gasta datos y, si el
 * componente intenta guardar el resultado, trabaja sobre una pantalla que ya
 * no está.
 *
 * Qué hace. Quien llama crea un AbortController y pasa controller.signal.
 * El signal es el cable; controller.abort() es el botón. abort() corta las
 * peticiones que llevan ese signal y fetch rechaza la promesa con un error
 * de cancelación. Aquí las tres páginas comparten el mismo signal, así que
 * un solo abort() las corta todas.
 *
 * Cuándo llamarlo. En el cleanup del efecto que pidió los datos, cuando la
 * pantalla se desmonta o el usuario navega hacia atrás:
 *
 *   useEffect(() => {
 *     const controller = new AbortController();
 *     fetchCharacters(controller.signal).then(setCharacters).catch(handleError);
 *     return () => controller.abort();
 *   }, []);
 *
 * Beneficio. La red se detiene en cuanto el resultado ya no se va a usar.
 * Sin signal la petición terminaría igual y el código tendría que ignorar
 * una respuesta que llegó tarde. El parámetro es opcional: si no pasas nada,
 * fetch sigue hasta el final.
 */
export const fetchCharacters = async (abortSignal?: AbortSignal): Promise<Character[]> => {
  const pageNumbers = Array.from(
    { length: INITIAL_PAGE_COUNT },
    (_unused, pageIndex) => pageIndex + 1,
  );

  const characterPages = await Promise.all(
    pageNumbers.map((pageNumber) => fetchCharacterPage(pageNumber, abortSignal)),
  );

  // Unimos [[20 personajes], [20 personajes], ...] en un solo arreglo.
  return characterPages.flat();
};

/**
 * Filtra personajes por nombre, sin distinguir mayúsculas/minúsculas.
 *
 * Decisión didáctica: filtramos en el cliente sobre los datos ya cargados en lugar
 * de llamar a `?name=` de la API. Es más simple de explicar porque:
 * - no hay que esperar la red en cada tecla (ni implementar un "debounce"),
 * - no hay riesgo de que una respuesta vieja pise a una nueva (race condition),
 * - el estado "vacío" es simplemente "el filtro devolvió un arreglo vacío".
 * La contrapartida: solo buscamos entre los personajes descargados, no entre
 * los 800+ que tiene la API. En una app real usaríamos el parámetro `?name=`.
 *
 * Es una función pura (no depende de React), así que se puede probar sola.
 */
export const filterCharactersByName = (
  characterList: Character[],
  searchQuery: string,
): Character[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery === '') {
    return characterList;
  }

  return characterList.filter((character) =>
    character.name.toLowerCase().includes(normalizedQuery),
  );
};

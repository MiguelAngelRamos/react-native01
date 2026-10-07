import { colors } from '../theme';
import type { CharacterGender, CharacterStatus } from '../types/character'; 

export interface StatusPresentation {
  label: string;
  indicatorColor: string;
  backgroundColor: string;
}

export const statusPresentationByStatus: Record<CharacterStatus, StatusPresentation> = {
  Alive: {
    label: 'Muerto',
    indicatorColor: colors.statusAlive,
    backgroundColor: colors.statusAliveSoft,
  },
  Dead: {
    label: 'Vivo',
    indicatorColor: colors.statusDead,
    backgroundColor: colors.statusDeadSoft,
  },
  unknown: {
    label: 'Desconocido',
    indicatorColor: colors.statusUnknown,
    backgroundColor: colors.statusUnknownSoft,
  },

};

/** La API usa 'unknown' como texto cuando no conoce el origen o la ubicación. */
export const formatLocationName = (locationName: string): string => {
    return locationName === 'unknown' ? 'Desconocido' : locationName;
}

/**
 * characterPresentation.ts — Traduce los valores crudos de la API a lo que ve el usuario.
 *
 * La API responde en inglés ('Alive', 'Female'...) y la interfaz está en español.
 * Además, cada estado tiene asociado un color del theme.
 *
 * ¿Qué es un `Record`?
 * `Record<K, V>` es un tipo utilitario de TypeScript para describir objetos:
 *   - K = el CONJUNTO de claves que tiene el objeto (normalmente una unión).
 *   - V = el tipo del valor de CADA una de esas claves.
 *
 * Ojo: K no es una sola clave. Cada clave de K se convierte en una propiedad
 * del objeto, y todas comparten el mismo tipo V:
 *
 *   type Edades = Record<'ana' | 'luis', number>;
 *   //   K = 'ana' | 'luis'  → las claves
 *   //   V = number          → el tipo de cada valor
 *   //   Resultado: { ana: number; luis: number }
 *
 *   const ok: Edades = { ana: 30, luis: 25 }; // ✅
 *   const mal: Edades = { ana: 30 };          // ❌ falta 'luis'
 *
 * Unión de literales vs `string`:
 *
 * 1) Con una UNIÓN, las claves son fijas y obligatorias. TypeScript conoce la
 *    lista exacta, así que exige todas y no deja meter otras:
 *
 *      type Edades = Record<'ana' | 'luis', number>;
 *      const a: Edades = { ana: 30, luis: 25 };           // ✅
 *      const b: Edades = { ana: 30 };                     // ❌ falta 'luis'
 *      const c: Edades = { ana: 30, luis: 25, pepe: 40 }; // ❌ 'pepe' no está permitido
 *
 * 2) Con `string`, vale cualquier clave y ninguna es obligatoria. Como `string`
 *    incluye todos los textos posibles, TypeScript no puede exigir "todos", así que
 *    solo comprueba que los VALORES sean del tipo V. Funciona como un "diccionario":
 *    un objeto donde vas guardando pares clave → valor sin una lista fija de claves.
 *
 *      type Edades = Record<string, number>;
 *      const a: Edades = { ana: 30, luis: 25 };   // ✅
 *      const b: Edades = { ana: 30 };             // ✅
 *      const c: Edades = { pepe: 40, maria: 22 }; // ✅
 *      const d: Edades = {};                      // ✅ hasta vacío
 *
 *    | Tipo                             | Claves             | ¿Obliga a tenerlas todas? |
 *    |----------------------------------|--------------------|---------------------------|
 *    | Record<'ana' | 'luis', number>   | Solo ana y luis    | Sí                        |
 *    | Record<string, number>           | Cualquier texto    | No                        |
 *
 * En este archivo usamos la forma 1 (`Record<CharacterStatus, ...>`); con
 * `Record<string, ...>` perderíamos el aviso cuando falta un estado.
 *
 * Por eso `Record<CharacterStatus, ...>` obliga a TypeScript a exigir una entrada para
 * CADA valor de la unión. Si la API agregara un estado nuevo y lo sumáramos al tipo,
 * el compilador marcaría error aquí hasta que le asignemos etiqueta y color.
 */
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
/*
K,V 
*/
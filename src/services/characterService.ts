import type {Character, CharacterPageResponse} from '../types/character';

const API_BASE_URL = 'https://rickandmortyapi.com/api';
const INITIAL_PAGE_COUNT = 3;

const fetchCharacterPage = async (pageNumber: number, abortSignal:AbortSignal): Promise<Character[]> => {
    const response = await fetch(`${API_BASE_URL}/character?page=${pageNumber}`, {
        signal: abortSignal,
    })

    if(!response.ok) {
        throw new Error('Api respondio con el estado ' + response.status)
    }

    const pageResponse = (await response.json()) as CharacterPageResponse;
    return pageResponse.results;
}
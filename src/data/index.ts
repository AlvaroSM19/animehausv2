// Temporary module wrapper for characters data
import charactersJson from './characters.json'
import type { AnimeCharacter } from '../types/character'

export const charactersData: AnimeCharacter[] = charactersJson as AnimeCharacter[]
export default charactersData

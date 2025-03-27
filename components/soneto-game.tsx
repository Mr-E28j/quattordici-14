"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Info,
  Award,
  Lightbulb,
  Music,
  Type,
  Moon,
  Sun,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"

// Información sobre el soneto
const sonetInfo = {
  structure: "El soneto clásico consta de 14 versos endecasílabos distribuidos en dos cuartetos y dos tercetos.",
  rhymeScheme: "La estructura de rima tradicional es ABBA ABBA CDC DCD, aunque existen variaciones.",
  meter: "Los versos son endecasílabos, es decir, tienen 11 sílabas métricas.",
  history:
    "El soneto es una forma poética que se originó en Italia en el siglo XIII y fue perfeccionada por Petrarca. Se extendió por Europa durante el Renacimiento, convirtiéndose en una de las formas poéticas más importantes de la literatura occidental.",
}

// Palabras que riman para ayudar a los usuarios
const rhymingWords = {
  ante: [
    "amante",
    "brillante",
    "constante",
    "diamante",
    "distante",
    "durante",
    "elegante",
    "gigante",
    "instante",
    "mediante",
  ],
  eto: ["completo", "concreto", "decreto", "discreto", "inquieto", "objeto", "respeto", "secreto", "sujeto", "teto"],
  ando: [
    "amando",
    "buscando",
    "cantando",
    "dando",
    "esperando",
    "hablando",
    "llorando",
    "pensando",
    "soñando",
    "volando",
  ],
  echo: ["derecho", "hecho", "lecho", "pecho", "provecho", "satisfecho", "sospecho", "techo", "trecho"],
  ente: [
    "ardiente",
    "consciente",
    "diferente",
    "evidente",
    "frente",
    "mente",
    "presente",
    "siguiente",
    "urgente",
    "valiente",
  ],
  ida: ["comida", "despedida", "herida", "medida", "partida", "querida", "salida", "seguida", "vida"],
  ado: ["amado", "cansado", "estado", "llamado", "pasado", "pensado", "sagrado", "soldado", "tratado"],
  anza: ["alabanza", "bonanza", "confianza", "danza", "esperanza", "lanza", "mudanza", "pujanza", "semejanza"],
  ura: ["altura", "amargura", "aventura", "cordura", "dulzura", "hermosura", "locura", "ternura", "ventura"],
  ía: ["alegría", "armonía", "fantasía", "melodía", "poesía", "sabiduría", "sinfonía", "valentía"],
}

// Función auxiliar para verificar si dos letras forman un grupo consonántico inseparable
const isInseparableGroup = (char1: string, char2: string): boolean => {
  const group = char1 + char2
  return ["pr", "br", "tr", "cr", "dr", "gr", "fr", "pl", "bl", "cl", "gl", "fl", "ll", "ch", "rr"].includes(group)
}

// Función auxiliar para verificar si dos vocales forman hiato
const checkHiato = (vowel1: string, vowel2: string): boolean => {
  // Vocales fuertes: a, e, o, á, é, ó
  const strongVowels = "aeoáéó"

  // Dos vocales fuertes siempre forman hiato
  if (strongVowels.includes(vowel1) && strongVowels.includes(vowel2)) {
    return true
  }

  // Vocal con acento siempre forma hiato
  if (/[áéíóú]/.test(vowel1) || /[áéíóú]/.test(vowel2)) {
    return true
  }

  // En otros casos, forman diptongo
  return false
}

// Función mejorada para dividir palabras en sílabas
const divideWordIntoSyllables = (word: string): string[] => {
  if (!word || word.trim() === "") return []

  // Normalizar la palabra
  const normalizedWord = word.toLowerCase()

  // Para palabras muy cortas, simplificar
  if (normalizedWord.length <= 2) {
    return [normalizedWord]
  }

  // Definir categorías de vocales
  const vowels = "aeiouáéíóúü"
  const strongVowels = "aeoáéó" // Vocales fuertes
  const weakVowels = "iuíúü" // Vocales débiles
  const accentedVowels = "áéíóú" // Vocales con acento

  // Dividir la palabra en sílabas
  const syllables: string[] = []
  let currentSyllable = ""
  let i = 0

  while (i < normalizedWord.length) {
    // Añadir el carácter actual a la sílaba en construcción
    currentSyllable += normalizedWord[i]

    // Si es una vocal
    if (vowels.includes(normalizedWord[i])) {
      // Verificar si es parte de un diptongo
      if (i + 1 < normalizedWord.length && vowels.includes(normalizedWord[i + 1])) {
        const v1 = normalizedWord[i]
        const v2 = normalizedWord[i + 1]

        // Determinar si es hiato (vocales en sílabas separadas)
        const isHiato =
          // Dos vocales fuertes forman hiato
          (strongVowels.includes(v1) && strongVowels.includes(v2)) ||
          // Vocal débil acentuada + otra vocal forma hiato
          (weakVowels.includes(v1) && accentedVowels.includes(v1)) ||
          (weakVowels.includes(v2) && accentedVowels.includes(v2))

        if (isHiato) {
          // Si forman hiato, terminar la sílaba actual
          syllables.push(currentSyllable)
          currentSyllable = ""
        } else {
          // Si forman diptongo, incluir la siguiente vocal en la sílaba actual
          currentSyllable += normalizedWord[i + 1]
          i++ // Avanzar un carácter extra

          // IMPORTANTE: Después de un diptongo, verificar si hay que cerrar la sílaba
          if (i + 1 < normalizedWord.length && !vowels.includes(normalizedWord[i + 1])) {
            // Si después del diptongo hay una consonante
            if (i + 2 < normalizedWord.length && vowels.includes(normalizedWord[i + 2])) {
              // Si después de la consonante hay una vocal, cerrar la sílaba actual
              syllables.push(currentSyllable)
              currentSyllable = ""
            } else if (i + 2 < normalizedWord.length && !vowels.includes(normalizedWord[i + 2])) {
              // Si hay dos consonantes seguidas después del diptongo
              if (!isInseparableGroup(normalizedWord[i + 1], normalizedWord[i + 2])) {
                // Si no forman grupo inseparable, la primera va con la sílaba actual
                currentSyllable += normalizedWord[i + 1]
                i++
                syllables.push(currentSyllable)
                currentSyllable = ""
              } else {
                // Si forman grupo inseparable, cerrar la sílaba actual
                syllables.push(currentSyllable)
                currentSyllable = ""
              }
            }
          }
        }
      }
      // Si después de la vocal hay una consonante
      else if (i + 1 < normalizedWord.length && !vowels.includes(normalizedWord[i + 1])) {
        // Verificar si hay que cerrar la sílaba
        if (i + 2 < normalizedWord.length) {
          // Si después de la consonante hay una vocal
          if (vowels.includes(normalizedWord[i + 2])) {
            // La consonante va con la siguiente sílaba
            syllables.push(currentSyllable)
            currentSyllable = ""
          }
          // Si hay dos consonantes seguidas
          else if (!vowels.includes(normalizedWord[i + 2])) {
            // Verificar si forman un grupo inseparable
            if (isInseparableGroup(normalizedWord[i + 1], normalizedWord[i + 2])) {
              // Si forman grupo inseparable, cerrar la sílaba actual
              syllables.push(currentSyllable)
              currentSyllable = ""
            } else {
              // Si no forman grupo inseparable, la primera va con la sílaba actual
              currentSyllable += normalizedWord[i + 1]
              i++
              syllables.push(currentSyllable)
              currentSyllable = ""
            }
          }
        } else if (i + 1 === normalizedWord.length - 1) {
          // Si es la última consonante de la palabra, va con la sílaba actual
          currentSyllable += normalizedWord[i + 1]
          i++
          syllables.push(currentSyllable)
          currentSyllable = ""
        }
      }
    }

    i++

    // Si llegamos al final de la palabra
    if (i === normalizedWord.length && currentSyllable) {
      syllables.push(currentSyllable)
    }
  }

  return syllables
}

// Función auxiliar para verificar si dos vocales forman diptongo
const isDiphthong = (vowel1: string, vowel2: string): boolean => {
  // Vocales fuertes: a, e, o, á, é, ó
  const strongVowels = "aeoáéó"
  // Vocales débiles: i, u, í, ú, ü
  const weakVowels = "iuíúü"

  // Dos vocales débiles siempre forman diptongo
  if (weakVowels.includes(vowel1) && weakVowels.includes(vowel2)) {
    return true
  }

  // Una vocal fuerte y una débil sin acento forman diptongo
  if (
    (strongVowels.includes(vowel1) && weakVowels.includes(vowel2) && !/[íúü]/.test(vowel2)) ||
    (strongVowels.includes(vowel2) && weakVowels.includes(vowel1) && !/[íúü]/.test(vowel1))
  ) {
    return true
  }

  return false
}

// Función para normalizar vocales (quitar acentos)
const normalizeVowel = (vowel: string): string => {
  const vowelMap: { [key: string]: string } = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ü: "u",
    a: "a",
    e: "e",
    i: "i",
    o: "o",
    u: "u",
  }
  return vowelMap[vowel.toLowerCase()] || vowel.toLowerCase()
}

// Función para verificar si un asterisco está entre vocales válidas para sinalefa
const isValidSinalefa = (verse: string, asteriskPosition: number): boolean => {
  if (asteriskPosition <= 0 || asteriskPosition >= verse.length - 1) {
    return false
  }

  const vowels = "aeiouáéíóúü"

  // Buscar la vocal anterior al asterisco
  let prevVocalIndex = -1
  for (let i = asteriskPosition - 1; i >= 0; i--) {
    if (verse[i] === " ") continue // Ignorar espacios
    if (vowels.includes(verse[i].toLowerCase())) {
      prevVocalIndex = i
      break
    }
    // Si encontramos una consonante que no es espacio, no hay sinalefa
    if (verse[i] !== " " && !vowels.includes(verse[i].toLowerCase())) {
      return false
    }
  }

  // Buscar la vocal posterior al asterisco
  let nextVocalIndex = -1
  let hasHMuda = false
  for (let i = asteriskPosition + 1; i < verse.length; i++) {
    if (verse[i] === " ") continue // Ignorar espacios

    // Detectar h muda
    if (verse[i].toLowerCase() === "h" && !hasHMuda) {
      hasHMuda = true
      continue
    }

    if (vowels.includes(verse[i].toLowerCase())) {
      nextVocalIndex = i
      break
    }

    // Si encontramos una consonante que no es h o espacio, no hay sinalefa
    if (verse[i] !== " " && verse[i].toLowerCase() !== "h" && !vowels.includes(verse[i].toLowerCase())) {
      return false
    }
  }

  // Verificar que encontramos vocales en ambos lados
  if (prevVocalIndex === -1 || nextVocalIndex === -1) {
    return false
  }

  // Verificar que las vocales son iguales (ignorando acentos)
  const prevVocal = normalizeVowel(verse[prevVocalIndex])
  const nextVocal = normalizeVowel(verse[nextVocalIndex])

  return prevVocal === nextVocal
}

// Implementación simplificada de countMetricalSyllables
const countMetricalSyllables = (
  verse: string,
  forcedSinalefas: boolean[] = [],
): { count: number; syllables: string[]; sinalefas: number[] } => {
  if (!verse.trim()) return { count: 0, syllables: [], sinalefas: [] }

  // Procesar asteriscos (sinalefas manuales)
  const validSinalefaPositions: number[] = []

  // Encontrar posiciones de asteriscos válidos
  for (let i = 0; i < verse.length; i++) {
    if (verse[i] === "*") {
      if (isValidSinalefa(verse, i)) {
        validSinalefaPositions.push(i)
      }
    }
  }

  // Eliminar los asteriscos para el conteo de sílabas
  const processedVerse = verse.replace(/\*/g, "")

  // Dividir el verso en palabras
  const words = processedVerse.trim().split(/\s+/)

  // Dividir cada palabra en sílabas
  const allSyllables: string[] = []
  for (const word of words) {
    const syllables = divideWordIntoSyllables(word)
    allSyllables.push(...syllables)
  }

  // Identificar posiciones de sinalefas (solo para visualización)
  const sinalefaIndices: number[] = []

  // Mapear las posiciones de asteriscos a índices de sílabas
  // Esta es una aproximación simplificada
  if (validSinalefaPositions.length > 0) {
    let syllableIndex = 0
    const charIndex = 0

    for (let i = 0; i < processedVerse.length; i++) {
      // Si esta posición tenía un asterisco antes de eliminarlo
      const originalIndex = i + validSinalefaPositions.filter((pos) => pos < i).length

      if (validSinalefaPositions.includes(originalIndex)) {
        // Marcar la sílaba anterior como sinalefa
        if (syllableIndex > 0) {
          sinalefaIndices.push(syllableIndex - 1)
        }
      }

      // Avanzar el índice de sílaba cuando encontramos una vocal
      // (simplificación del conteo de sílabas)
      const vowels = "aeiouáéíóúü"
      if (vowels.includes(processedVerse[i].toLowerCase())) {
        if (i === 0 || !vowels.includes(processedVerse[i - 1].toLowerCase())) {
          syllableIndex++
        }
      }
    }
  }

  // El conteo métrico es el número de sílabas visuales menos las sinalefas válidas
  const visualSyllableCount = allSyllables.length
  const metricSyllableCount = visualSyllableCount - validSinalefaPositions.length

  return {
    count: metricSyllableCount,
    syllables: allSyllables,
    sinalefas: sinalefaIndices,
  }
}

// Función auxiliar para detectar sinalefas entre palabras (solo para visualización)
const detectSinalefas = (words: string[]): { positions: number[]; syllableIndices: number[] } => {
  const sinalefaPositions: number[] = []
  const syllableIndices: number[] = []
  const vowels = "aeiouáéíóúü"

  let syllableIndex = 0

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i]
    const nextWord = words[i + 1]

    if (!currentWord || !nextWord) {
      // Actualizar índices para la siguiente palabra
      if (currentWord) {
        const currentWordSyllables = divideWordIntoSyllables(currentWord)
        syllableIndex += currentWordSyllables.length
      }
      continue
    }

    const lastChar = currentWord.charAt(currentWord.length - 1)
    const firstChar = nextWord.charAt(0)

    // Verificar si hay sinalefa (última vocal de una palabra + primera vocal de la siguiente)
    // Ignorar la h muda al inicio de la segunda palabra
    const effectiveFirstChar = firstChar === "h" && nextWord.length > 1 ? nextWord.charAt(1) : firstChar

    if (vowels.includes(lastChar) && vowels.includes(effectiveFirstChar)) {
      // Guardar el índice de la sílaba donde ocurre la sinalefa
      const currentWordSyllables = divideWordIntoSyllables(currentWord)
      syllableIndices.push(syllableIndex + currentWordSyllables.length - 1)
    }

    // Actualizar índices para la siguiente palabra
    const currentWordSyllables = divideWordIntoSyllables(currentWord)
    syllableIndex += currentWordSyllables.length
  }

  return { positions: sinalefaPositions, syllableIndices: syllableIndices }
}

// Función para extraer la terminación para rima (desde la última vocal acentuada)
const extractRhyme = (verse: string): string => {
  if (!verse.trim()) return ""

  // Obtener la última palabra
  const words = verse.trim().split(/\s+/)
  const lastWord = words[words.length - 1].toLowerCase().replace(/[.,;:!¡?¿()]/g, "")

  // Encontrar la última vocal acentuada o, si no hay, la última vocal
  const accentedVowelMatch = lastWord.match(/[áéíóú][^aeiouáéíóúü]*$/i)

  if (accentedVowelMatch) {
    // Si hay vocal acentuada, la rima es desde esa vocal hasta el final
    return lastWord.substring(accentedVowelMatch.index)
  } else {
    // Si no hay vocal acentuada, buscar la última vocal
    const lastVowelMatch = lastWord.match(/[aeiou][^aeiouáéíóúü]*$/i)
    if (lastVowelMatch) {
      return lastWord.substring(lastVowelMatch.index)
    }

    // Si no se encuentra ninguna vocal, intentar con la penúltima sílaba
    const vowelMatches = Array.from(lastWord.matchAll(/[aeiouáéíóú]/gi))
    if (vowelMatches.length >= 2) {
      const penultimateVowelIndex = vowelMatches[vowelMatches.length - 2].index
      return lastWord.substring(penultimateVowelIndex)
    }
  }

  return lastWord // Si no se encuentra patrón, devolver la palabra completa
}

// Función para analizar el patrón de rima
const analyzeRhymePattern = (verses: string[]): string[] => {
  if (verses.length === 0) return []

  const rhymes: string[] = verses.map((verse) => extractRhyme(verse))
  const rhymePattern: string[] = []
  const rhymeGroups: { [key: string]: string } = {}
  let nextRhymeCode = "A"

  rhymes.forEach((rhyme) => {
    if (!rhyme) {
      rhymePattern.push("")
      return
    }

    // Verificar si esta rima ya existe en algún grupo
    let foundMatch = false
    for (const existingRhyme in rhymeGroups) {
      // Comparación simplificada de rimas
      if (rhymesMatch(rhyme, existingRhyme)) {
        rhymePattern.push(rhymeGroups[existingRhyme])
        foundMatch = true
        break
      }
    }

    // Si no se encontró coincidencia, crear un nuevo grupo de rima
    if (!foundMatch) {
      rhymeGroups[rhyme] = nextRhymeCode
      rhymePattern.push(nextRhymeCode)

      // Avanzar al siguiente código de rima (A, B, C, D, etc.)
      nextRhymeCode = String.fromCharCode(nextRhymeCode.charCodeAt(0) + 1)
    }
  })

  return rhymePattern
}

// Función para comparar si dos terminaciones riman
const rhymesMatch = (rhyme1: string, rhyme2: string): boolean => {
  // Normalizar: quitar acentos y convertir a minúsculas
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  const norm1 = normalize(rhyme1)
  const norm2 = normalize(rhyme2)

  // Rima consonante: coinciden exactamente los mismos sonidos
  if (norm1 === norm2 || (norm1.length >= 2 && norm2.length >= 2 && norm1.slice(-2) === norm2.slice(-2))) {
    return true
  }

  // Extraer solo las vocales para comprobar rima asonante
  const extractVowels = (text: string) => {
    return text.replace(/[^aeiou]/g, "")
  }

  const vowels1 = extractVowels(norm1)
  const vowels2 = extractVowels(norm2)

  // Rima asonante: coinciden las vocales en las mismas posiciones
  // Nos enfocamos en las últimas 2 vocales como mínimo
  if (vowels1.length >= 1 && vowels2.length >= 1) {
    // Si solo hay una vocal, debe coincidir
    if (vowels1.length === 1 && vowels2.length === 1) {
      return vowels1 === vowels2
    }

    // Comparar las últimas dos vocales (o la última si solo hay una)
    const lastVowels1 = vowels1.slice(-Math.min(2, vowels1.length))
    const lastVowels2 = vowels2.slice(-Math.min(2, vowels2.length))

    // Para rima asonante, las vocales deben coincidir
    return lastVowels1 === lastVowels2
  }

  return false
}

// Función para verificar si el patrón de rima sigue la estructura del soneto
const validateSonnetRhymePattern = (pattern: string[], verses: string[]): boolean => {
  if (pattern.length !== 14) return false

  // Verificar que no haya palabras que rimen consigo mismas
  const lastWords = verses.map((verse) => {
    const words = verse.trim().split(/\s+/)
    return words[words.length - 1].toLowerCase().replace(/[.,;:!¡?¿()]/g, "")
  })

  // Verificar que palabras con el mismo patrón de rima sean diferentes
  for (let i = 0; i < pattern.length; i++) {
    for (let j = i + 1; j < pattern.length; j++) {
      if (pattern[i] === pattern[j]) {
        // Si tienen el mismo patrón de rima, las palabras deben ser diferentes
        if (lastWords[i] === lastWords[j]) {
          return false // Palabra rimando consigo misma
        }
      }
    }
  }

  // Verificar los cuartetos (ABBA ABBA)
  const quartetPattern = pattern.slice(0, 8)

  // Verificar los tercetos (CDC DCD o variaciones como CDE CDE)
  const tercetPattern = pattern.slice(8)

  // Verificar si los cuartetos siguen el patrón esperado
  const quartetStructureValid =
    quartetPattern[0] === quartetPattern[4] &&
    quartetPattern[1] === quartetPattern[5] &&
    quartetPattern[2] === quartetPattern[6] &&
    quartetPattern[3] === quartetPattern[7] &&
    quartetPattern[0] === quartetPattern[3] &&
    quartetPattern[1] === quartetPattern[2]

  // Verificar si los tercetos siguen alguno de los patrones válidos
  const validTercetPatterns = [
    ["C", "D", "C", "D", "C", "D"], // CDC DCD
    ["C", "D", "E", "C", "D", "E"], // CDE CDE
    ["C", "D", "C", "C", "D", "C"], // CDC CDC
  ]

  let tercetStructureValid = false
  for (const validPattern of validTercetPatterns) {
    // Verificar si la estructura coincide, independientemente de las letras específicas
    const structureMatches =
      tercetPattern[0] === tercetPattern[2] &&
      validPattern[0] === validPattern[2] &&
      tercetPattern[1] === tercetPattern[4] &&
      validPattern[1] === validPattern[4] &&
      tercetPattern[3] === tercetPattern[5] &&
      validPattern[3] === validPattern[5]

    if (structureMatches) {
      tercetStructureValid = true
      break
    }
  }

  return quartetStructureValid && tercetStructureValid
}

// Función para sugerir palabras que riman con un verso dado
const suggestRhymingWords = (verse: string): string[] => {
  if (!verse.trim()) return []

  const rhymeEnding = extractRhyme(verse)
  if (!rhymeEnding) return []

  // Buscar en nuestro diccionario de rimas
  for (const ending in rhymingWords) {
    if (rhymesMatch(rhymeEnding, ending)) {
      return rhymingWords[ending as keyof typeof rhymingWords]
    }
  }

  return []
}

// Función para insertar un asterisco entre dos vocales
const insertAsterisk = (verseIndex: number, position: number) => {
  if (verseIndex < 0 || verseIndex >= userVerses.length) return

  const verse = userVerses[verseIndex]
  const vowels = "aeiouáéíóúü"

  // Buscar la vocal anterior a la posición
  let prevVocalIndex = -1
  for (let i = position; i >= 0; i--) {
    if (vowels.includes(verse[i].toLowerCase())) {
      prevVocalIndex = i
      break
    }
  }

  // Buscar la vocal posterior a la posición
  let nextVocalIndex = -1
  for (let i = position; i < verse.length; i++) {
    // Permitir h muda
    if (verse[i].toLowerCase() === "h") continue

    if (vowels.includes(verse[i].toLowerCase())) {
      nextVocalIndex = i
      break
    }
  }

  // Si encontramos vocales en ambos lados y son iguales (ignorando acentos)
  if (prevVocalIndex !== -1 && nextVocalIndex !== -1) {
    const prevVocal = normalizeVowel(verse[prevVocalIndex])
    const nextVocal = normalizeVowel(verse[nextVocalIndex])

    if (prevVocal === nextVocal) {
      // Insertar asterisco después de la primera vocal
      const insertPosition = prevVocalIndex + 1
      const newVerse = verse.substring(0, insertPosition) + "*" + verse.substring(insertPosition)
      handleVerseChange(verseIndex, newVerse)
    }
  }
}

export default function SonetoGame() {
  const { theme, setTheme } = useTheme()
  const [userVerses, setUserVerses] = useState<string[]>(Array(14).fill(""))
  const [verseStatus, setVerseStatus] = useState<("correct" | "incorrect" | "partial" | "empty")[]>(
    Array(14).fill("empty"),
  )
  const [metricsStatus, setMetricsStatus] = useState<number[]>(Array(14).fill(0))
  const [rhymePattern, setRhymePattern] = useState<string[]>(Array(14).fill(""))
  const [score, setScore] = useState<number>(0)
  const [maxScore, setMaxScore] = useState<number>(1400)
  const [activeVerse, setActiveVerse] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [showRhymeSuggestions, setShowRhymeSuggestions] = useState<boolean>(true)
  const [rhymeSuggestions, setRhymeSuggestions] = useState<string[]>([])
  const [gameComplete, setGameComplete] = useState<boolean>(false)
  const [sonetTitle, setSonetTitle] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(14).fill(null))
  // Añadir estado para la división silábica
  const [syllableDivisions, setSyllableDivisions] = useState<string[][]>(Array(14).fill([]))
  const [sinalefaPositions, setSinalefaPositions] = useState<number[][]>(Array(14).fill([]))
  const [forcedSinalefas, setForcedSinalefas] = useState<boolean[][]>(Array(14).fill([]))
  // Añadir estado para el porcentaje de progreso
  const [progressPercentage, setProgressPercentage] = useState(0)
  // Añadir estado para mostrar/ocultar el panel de consejos
  const [showTips, setShowTips] = useState<boolean>(false)
  // Añadir estado para controlar si se detectan sinalefas automáticamente
  const [autoDetectSinalefas, setAutoDetectSinalefas] = useState<boolean>(false)

  const handleVerseChange = (index: number, value: string) => {
    const newUserVerses = [...userVerses]
    newUserVerses[index] = value
    setUserVerses(newUserVerses)

    if (activeVerse === index) {
      // Actualizar sugerencias de rima para el verso activo
      const suggestions = suggestRhymingWords(value)
      setRhymeSuggestions(suggestions)
    }
  }

  useEffect(() => {
    resetGame()
    setScore(0)
    setProgressPercentage(0)
  }, [])

  useEffect(() => {
    // Analizar métricas y rimas cuando cambian los versos
    analyzeVerses()
  }, [userVerses, forcedSinalefas, autoDetectSinalefas])

  useEffect(() => {
    setProgressPercentage(Math.round((score / maxScore) * 100))
  }, [score, maxScore])

  const resetGame = () => {
    setUserVerses(Array(14).fill(""))
    setVerseStatus(Array(14).fill("empty"))
    setMetricsStatus(Array(14).fill(0))
    setRhymePattern(Array(14).fill(""))
    setScore(0)
    setProgressPercentage(0)
    setGameComplete(false)
    setSonetTitle("")
    setSyllableDivisions(Array(14).fill([]))
    setSinalefaPositions(Array(14).fill([]))
    setForcedSinalefas(Array(14).fill([]))
  }

  const analyzeVerses = () => {
    // Analizar métrica de cada verso
    const newMetricsStatus: number[] = []
    const newSyllableDivisions: string[][] = []
    const newSinalefaPositions: number[][] = []

    userVerses.forEach((verse, index) => {
      const { count, syllables, sinalefas } = countMetricalSyllables(verse, forcedSinalefas[index])
      newMetricsStatus.push(count)
      newSyllableDivisions.push(syllables)
      newSinalefaPositions.push(sinalefas)
    })

    setMetricsStatus(newMetricsStatus)
    setSyllableDivisions(newSyllableDivisions)
    setSinalefaPositions(newSinalefaPositions)

    // Analizar patrón de rima
    const newRhymePattern = analyzeRhymePattern(userVerses)
    setRhymePattern(newRhymePattern)

    // Estructura de rima esperada para un soneto clásico
    const expectedRhymePattern = ["A", "B", "B", "A", "A", "B", "B", "A", "C", "D", "C", "D", "C", "D"]

    // Evaluar estado de cada verso
    const newVerseStatus = userVerses.map((verse, index) => {
      if (!verse.trim()) return "empty"

      const metricsCorrect = newMetricsStatus[index] === 11 // Endecasílabo

      // Verificar si la rima coincide con la estructura esperada
      const rhymeCorrect =
        newRhymePattern[index] === expectedRhymePattern[index] ||
        (index >= 8 && newRhymePattern[index] && ["C", "D", "E"].includes(newRhymePattern[index].charAt(0)))

      // Marcar como correcto si cumple con la métrica y la rima esperada
      if (metricsCorrect && rhymeCorrect) {
        return "correct"
      } else if (newMetricsStatus[index] > 0) {
        return "partial"
      } else {
        return "incorrect"
      }
    })

    setVerseStatus(newVerseStatus)
    calculateScore(newVerseStatus, newMetricsStatus, newRhymePattern, userVerses)
  }

  const calculateScore = (statuses: typeof verseStatus, metrics: number[], rhymes: string[], verses: string[]) => {
    // Verificar si hay algún verso escrito
    const hasContent = verses.some((verse) => verse.trim().length > 0)

    // Si no hay contenido, la puntuación es 0
    if (!hasContent) {
      setScore(0)
      return
    }

    let newScore = 0

    // Puntos por métrica correcta
    metrics.forEach((syllables, index) => {
      if (syllables === 11) {
        newScore += 50 // 50 puntos por cada verso con métrica correcta
      } else if (syllables > 0) {
        // Puntos parciales basados en qué tan cerca está de 11 sílabas
        const accuracy = 1 - Math.min(Math.abs(11 - syllables) / 11, 1)
        newScore += Math.floor(accuracy * 25)
      }
    })

    // Puntos por estructura de rima correcta
    if (validateSonnetRhymePattern(rhymes, verses)) {
      newScore += 300 // Bonus por estructura de rima correcta
    } else {
      // Puntos parciales por cuartetos y tercetos correctos
      const quartetPattern = rhymes.slice(0, 8)
      const tercetPattern = rhymes.slice(8)

      // Verificar cuartetos (ABBA ABBA)
      if (
        quartetPattern[0] === quartetPattern[4] &&
        quartetPattern[1] === quartetPattern[5] &&
        quartetPattern[2] === quartetPattern[6] &&
        quartetPattern[3] === quartetPattern[7] &&
        quartetPattern[0] === quartetPattern[3] &&
        quartetPattern[1] === quartetPattern[2]
      ) {
        newScore += 150 // Bonus por cuartetos correctos
      }

      // Verificar tercetos (CDC DCD o variaciones)
      if (
        (tercetPattern[0] === tercetPattern[2] && tercetPattern[3] === tercetPattern[5]) ||
        (tercetPattern[0] === tercetPattern[3] &&
          tercetPattern[1] === tercetPattern[4] &&
          tercetPattern[2] === tercetPattern[5])
      ) {
        newScore += 150 // Bonus por tercetos correctos
      }
    }

    // Bonus por completar todos los versos
    if (statuses.every((status) => status !== "empty")) {
      newScore += 100
    }

    setScore(newScore)

    // Verificar si el soneto está completo y es correcto
    const allVersesComplete = statuses.every((status) => status !== "empty")
    const allMetricsCorrect = metrics.every((syllables) => syllables === 11)
    const rhymeStructureCorrect = validateSonnetRhymePattern(rhymes, verses)

    setGameComplete(allVersesComplete && allMetricsCorrect && rhymeStructureCorrect)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault()
      if (index < 13) {
        inputRefs.current[index + 1]?.focus()
        setActiveVerse(index + 1)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        setActiveVerse(index - 1)
      }
    }
  }

  const getVerseStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30"
      case "partial":
        return "border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
      case "incorrect":
        return "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
      default:
        return "border-input"
    }
  }

  const getVerseStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
      case "partial":
        return <HelpCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      case "incorrect":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      default:
        return null
    }
  }

  const getMetricsDescription = (syllables: number) => {
    if (syllables === 0) return "Sin sílabas"
    if (syllables === 11) return "Endecasílabo (11) ✓"
    return `${syllables} sílabas ${syllables < 11 ? "(-" + (11 - syllables) + ")" : "(+" + (syllables - 11) + ")"}`
  }

  const getMetricsColor = (syllables: number) => {
    if (syllables === 0) return "text-muted-foreground"
    if (syllables === 11) return "text-green-600 dark:text-green-400"
    return "text-yellow-600 dark:text-yellow-400"
  }

  const toggleSinalefa = (verseIndex: number, sinalefaIndex: number) => {
    const newForcedSinalefas = [...forcedSinalefas]

    // Inicializar el array para este verso si no existe
    if (!newForcedSinalefas[verseIndex]) {
      newForcedSinalefas[verseIndex] = []
    }

    // Invertir el valor actual o establecer el valor inicial
    newForcedSinalefas[verseIndex][sinalefaIndex] =
      newForcedSinalefas[verseIndex][sinalefaIndex] === undefined
        ? false
        : !newForcedSinalefas[verseIndex][sinalefaIndex]

    setForcedSinalefas(newForcedSinalefas)
  }

  // Restaurar la función insertAsterisk y asegurarse de que se llama correctamente

  return (
    <div className="bg-card rounded-lg shadow-md p-6 dark:shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif text-card-foreground">Creador de Sonetos</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{score} pts</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setShowInfo(!showInfo)}>
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Información</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Información sobre el soneto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </div>

        {showInfo && (
          <div className="mb-4 p-4 bg-muted rounded-lg border border-border">
            <h3 className="font-serif font-medium mb-2">El Soneto</h3>
            <p className="text-sm text-muted-foreground mb-2">{sonetInfo.structure}</p>
            <p className="text-sm text-muted-foreground mb-2">{sonetInfo.rhymeScheme}</p>
            <p className="text-sm text-muted-foreground">{sonetInfo.meter}</p>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Progreso:</span>
            </div>
            <span className="text-xs text-muted-foreground">{progressPercentage}% completado</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="mb-4">
          <Input
            value={sonetTitle}
            onChange={(e) => setSonetTitle(e.target.value)}
            placeholder="Título de tu soneto (opcional)"
            className="font-serif text-center font-medium"
          />
        </div>

        <Tabs defaultValue="editor" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2 font-serif">
              {userVerses.map((verse, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6 text-right">{index + 1}</span>
                    <div
                      className={`flex-1 relative ${activeVerse === index ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-background" : ""}`}
                    >
                      <Input
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={userVerses[index]}
                        onChange={(e) => handleVerseChange(index, e.target.value)}
                        onFocus={() => setActiveVerse(index)}
                        onBlur={() => setActiveVerse(null)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder={`Escribe el verso ${index + 1}...`}
                        className={`font-serif pl-3 pr-10 py-2 ${getVerseStatusColor(verseStatus[index])}`}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {getVerseStatusIcon(verseStatus[index])}
                      </div>
                    </div>
                  </div>

                  {activeVerse === index && (
                    <div className="mt-1 ml-8 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={getMetricsColor(metricsStatus[index])}>
                          <Music className="h-3 w-3 inline mr-1" />
                          {getMetricsDescription(metricsStatus[index])}
                        </span>

                        {rhymePattern[index] && (
                          <span className="text-blue-600 dark:text-blue-400">
                            <Type className="h-3 w-3 inline mr-1" />
                            Rima: {rhymePattern[index]}
                          </span>
                        )}
                      </div>

                      {showRhymeSuggestions && rhymeSuggestions.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-muted-foreground">Sugerencias de rima: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rhymeSuggestions.map((word, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => {
                                  // Insertar la palabra al final del verso actual
                                  const words = userVerses[index].split(" ")
                                  words.pop() // Quitar la última palabra
                                  const newVerse = [...words, word].join(" ")
                                  handleVerseChange(index, newVerse)
                                }}
                              >
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {syllableDivisions[index] && syllableDivisions[index].length > 0 && (
                        <div className="mt-2 text-xs">
                          <span className="text-muted-foreground">División silábica: </span>
                          <div className="flex flex-wrap gap-1 mt-1 items-center">
                            {syllableDivisions[index].map((syllable, idx) => {
                              const isSinalefa = sinalefaPositions[index].includes(idx)

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`px-1 py-0.5 rounded ${
                                    isSinalefa
                                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                                      : "bg-muted"
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()

                                    // Si hay un espacio después de esta sílaba, insertar asterisco
                                    if (idx < syllableDivisions[index].length - 1) {
                                      // Calcular la posición aproximada para insertar el asterisco
                                      const verse = userVerses[index]
                                      let currentPos = 0
                                      let syllableCount = 0

                                      // Encontrar la posición aproximada después de esta sílaba
                                      for (let i = 0; i < verse.length; i++) {
                                        if (syllableCount === idx + 1) {
                                          currentPos = i
                                          break
                                        }

                                        // Contar sílabas basadas en vocales
                                        const vowels = "aeiouáéíóúü"
                                        if (
                                          vowels.includes(verse[i].toLowerCase()) &&
                                          (i === 0 || !vowels.includes(verse[i - 1].toLowerCase()))
                                        ) {
                                          syllableCount++
                                        }
                                      }

                                      insertAsterisk(index, currentPos)
                                    }

                                    // Mantener el foco en el input actual
                                    inputRefs.current[index]?.focus()
                                  }}
                                >
                                  {syllable}
                                </button>
                              )
                            })}
                            <span className="text-muted-foreground ml-2">
                              ({syllableDivisions[index].length} sílabas visuales, {metricsStatus[index]} métricas)
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Haz clic entre dos sílabas para insertar un asterisco y formar una sinalefa.
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Las sinalefas solo funcionan entre vocales iguales (que*el) o con h muda (que*herido).
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Análisis de tu soneto</h3>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Métrica:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {metricsStatus.map((syllables, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span className="w-5 text-right">{index + 1}.</span>
                      <div className={`flex-1 ${getMetricsColor(syllables)}`}>
                        {userVerses[index]
                          ? userVerses[index].substring(0, 30) + (userVerses[index].length > 30 ? "..." : "")
                          : "Verso vacío"}
                        <span className="ml-2 font-medium">{getMetricsDescription(syllables)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Estructura de rima:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {rhymePattern.map((pattern, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span className="w-5 text-right">{index + 1}.</span>
                      <div className="flex-1">
                        {userVerses[index]
                          ? userVerses[index].substring(0, 30) + (userVerses[index].length > 30 ? "..." : "")
                          : "Verso vacío"}
                        {pattern && (
                          <Badge variant="outline" className="ml-2">
                            {pattern}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 p-2 rounded bg-card">
                  <p className="text-xs">Estructura esperada: ABBA ABBA CDC DCD (o variaciones en los tercetos)</p>
                  <p className="text-xs mt-1">
                    {validateSonnetRhymePattern(rhymePattern, userVerses)
                      ? "✅ La estructura de rima es correcta"
                      : "⚠️ La estructura de rima no sigue el patrón clásico del soneto"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Evaluación general:</h4>
                <div className="p-2 rounded bg-card">
                  <p className="text-xs">
                    {score < 300
                      ? "🔴 Tu soneto necesita más trabajo. Revisa la métrica y la rima."
                      : score < 700
                        ? "🟡 Tu soneto va tomando forma. Mejora la estructura de rima."
                        : score < 1000
                          ? "🟢 Buen trabajo. Tu soneto está casi completo."
                          : "🌟 ¡Excelente! Has creado un soneto que cumple con todas las reglas."}
                  </p>
                  <p className="text-xs mt-1">
                    Puntuación: {score} de {maxScore} puntos posibles.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-6">
          <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Nuevo soneto
          </Button>

          <Button
            onClick={() => {
              setShowRhymeSuggestions(!showRhymeSuggestions)
              setShowTips(!showRhymeSuggestions) // Sincronizar con el estado de las sugerencias
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {showRhymeSuggestions ? "Ocultar sugerencias" : "Mostrar sugerencias"}
          </Button>
        </div>
      </div>

      {gameComplete && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <p>¡Felicidades! Has creado un soneto que cumple con todas las reglas métricas y de rima.</p>
          </div>
          <p className="mt-2 text-sm">
            Puntuación final: {score} de {maxScore} puntos posibles.
          </p>

          <div className="mt-4 p-4 bg-card rounded-lg">
            <h3 className="font-serif font-medium mb-2 text-center">{sonetTitle || "Tu soneto"}</h3>
            <div className="font-serif space-y-1">
              {userVerses.map((verse, index) => (
                <p key={index} className="text-center">
                  {verse.replace(/\*/g, "")}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTips && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-serif mb-2">Consejos</h3>
          <p className="text-sm text-muted-foreground">
            Recuerda que un soneto debe tener 14 versos endecasílabos (11 sílabas) con una estructura de rima
            específica.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Las sinalefas (unión de vocales entre palabras) pueden afectar el conteo de sílabas. Haz clic en ellas para
            ajustar manualmente.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Puedes insertar un asterisco (*) entre dos vocales iguales para formar una sinalefa y reducir el conteo de
            sílabas.
          </p>
        </div>
      )}

      <footer className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
        Hecho por Mr. E
      </footer>
    </div>
  )
}


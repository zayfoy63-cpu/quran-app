import axios from 'axios'

const BASE_URL  = 'https://api.alquran.cloud/v1'
const AUDIO_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy'
const QURANCOM_URL = 'https://api.quran.com/api/v4'

const api       = axios.create({ baseURL: BASE_URL })
const quranCom  = axios.create({ baseURL: QURANCOM_URL })

// In-memory cache
const cache = new Map()
async function cached(key, fetcher) {
  if (cache.has(key)) return cache.get(key)
  const result = await fetcher()
  cache.set(key, result)
  return result
}

export async function getSurahList() {
  return cached('surah_list', async () => {
    const { data } = await api.get('/surah')
    return data.data
  })
}

export async function getSurahArabic(number) {
  return cached(`surah_ar_${number}`, async () => {
    const { data } = await api.get(`/surah/${number}`)
    return data.data
  })
}

export async function getSurahWithAudio(number) {
  return cached(`surah_audio_${number}`, async () => {
    const { data } = await api.get(`/surah/${number}/ar.alafasy`)
    return data.data
  })
}

export async function getSurahTranslation(number) {
  return cached(`surah_fr_${number}`, async () => {
    const { data } = await api.get(`/surah/${number}/fr.hamidullah`)
    return data.data
  })
}

export async function getSurahTransliteration(number) {
  return cached(`surah_trans_${number}`, async () => {
    const { data } = await api.get(`/surah/${number}/en.transliteration`)
    return data.data
  })
}

/**
 * Fetch tajweed-marked Uthmani text from quran.com API v4.
 * Returns a map: verseNumber → tajweedHtml string
 * Tags format: <tajweed class=rule_name>text</tajweed>
 */
export async function getTajweedVerses(surahNumber) {
  return cached(`tajweed_${surahNumber}`, async () => {
    try {
      const { data } = await quranCom.get(
        `/quran/verses/uthmani_tajweed`,
        { params: { chapter_number: surahNumber } }
      )
      const map = {}
      for (const v of data.verses || []) {
        // verse_key is "surah:verse", e.g. "1:1"
        const verseNum = parseInt(v.verse_key.split(':')[1])
        map[verseNum] = v.text_uthmani_tajweed || ''
      }
      return map
    } catch {
      return {} // graceful fallback — VerseDisplay will show plain text
    }
  })
}

export async function getFullSurah(number) {
  const [arabic, audio, translation, transliteration, tajweedMap] = await Promise.all([
    getSurahArabic(number),
    getSurahWithAudio(number),
    getSurahTranslation(number),
    getSurahTransliteration(number),
    getTajweedVerses(number),
  ])

  return {
    ...arabic,
    ayahs: arabic.ayahs.map((ayah, i) => ({
      ...ayah,
      audio: audio.ayahs[i]?.audio || `${AUDIO_BASE}/${ayah.number}.mp3`,
      audioSecondary: audio.ayahs[i]?.audioSecondary || [],
      translation:    translation.ayahs[i]?.text || '',
      transliteration: transliteration.ayahs[i]?.text || '',
      tajweedText:    tajweedMap[ayah.numberInSurah] || '',
    })),
  }
}

export function getAudioUrl(verseNumber) {
  return `${AUDIO_BASE}/${verseNumber}.mp3`
}

export async function searchQuran(query, language = 'fr.hamidullah') {
  const { data } = await api.get(`/search/${encodeURIComponent(query)}/all/${language}`)
  return data.data
}

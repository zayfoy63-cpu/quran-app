// Tajwid rules color-coding engine
// Based on standard Arabic Tajwid rules

export const TAJWID_RULES = {
  ghunna: {
    name: 'Ghunna',
    nameAr: 'غنة',
    description: 'Nasalisation — son nasal sur Nun ou Mim avec shadda',
    color: '#e74c3c',
    className: 'tajwid-ghunna',
  },
  madd: {
    name: 'Madd',
    nameAr: 'مد',
    description: 'Prolongation — allongement de la voyelle',
    color: '#3498db',
    className: 'tajwid-madd',
  },
  idgham: {
    name: 'Idgham',
    nameAr: 'إدغام',
    description: 'Assimilation — fusion de Nun Sakinah avec certaines lettres',
    color: '#9b59b6',
    className: 'tajwid-idgham',
  },
  ikhfa: {
    name: 'Ikhfa',
    nameAr: 'إخفاء',
    description: 'Dissimulation — son de Nun Sakinah partiellement caché',
    color: '#e67e22',
    className: 'tajwid-ikhfa',
  },
  qalqala: {
    name: 'Qalqala',
    nameAr: 'قلقلة',
    description: 'Écho — vibration sur les lettres ق ط ب ج د avec sukun',
    color: '#27ae60',
    className: 'tajwid-qalqala',
  },
  iqlab: {
    name: 'Iqlab',
    nameAr: 'إقلاب',
    description: 'Transformation — Nun Sakinah devient Mim devant Ba',
    color: '#f39c12',
    className: 'tajwid-waqf',
  },
  tafkhim: {
    name: 'Tafkhim',
    nameAr: 'تفخيم',
    description: 'Emphatique — lettres prononcées avec emphase',
    color: '#c0392b',
    className: 'tajwid-tafkhim',
  },
  tarqiq: {
    name: 'Tarqiq',
    nameAr: 'ترقيق',
    description: 'Lettres légères — prononcées sans emphase',
    color: '#2980b9',
    className: 'tajwid-tarqiq',
  },
}

// Arabic Unicode ranges and special characters
const QALQALA_LETTERS = /[\u0642\u0637\u0628\u062C\u062F]/u // ق ط ب ج د
const MADD_CHARS = /[\u0622\u0623\u0625\u0627\u0648\u064A\u0649]/u // ا آ أ إ و ي ى
const EMPHATIC_LETTERS = /[\u062E\u063A\u0636\u0638\u0637\u0642\u0635]/u // خ غ ض ظ ط ق ص
const LIGHT_LETTERS = /[\u0641\u062B\u062D\u0630\u0632\u0633\u0634\u0633]/u

const SHADDA = '\u0651'
const SUKUN = '\u0652'
const FATHAH = '\u064E'
const KASRAH = '\u0650'
const DAMMAH = '\u064F'
const MADDAH = '\u0653'
const TATWEEL = '\u0640'

const NUN = '\u0646'
const MIM = '\u0645'
const BA = '\u0628'

// Idgham letters (ن م و ي ر ل)
const IDGHAM_LETTERS = /[\u0646\u0645\u0648\u064A\u0631\u0644]/u

/**
 * Analyze a word/character for tajwid rules.
 * Returns an array of {char, rule} objects.
 */
export function analyzeTajwid(text) {
  if (!text) return []
  const chars = [...text]
  const result = []

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const next = chars[i + 1] || ''
    const next2 = chars[i + 2] || ''
    const combined = char + next

    let rule = null

    // Ghunna: Mim or Nun with shadda
    if ((char === NUN || char === MIM) && next === SHADDA) {
      rule = 'ghunna'
    }
    // Qalqala: qalqala letter with sukun
    else if (QALQALA_LETTERS.test(char) && (next === SUKUN || i === chars.length - 1)) {
      rule = 'qalqala'
    }
    // Madd: vowel letters
    else if (MADD_CHARS.test(char) && !QALQALA_LETTERS.test(next)) {
      rule = 'madd'
    }
    // Maddah above alef
    else if (next === MADDAH) {
      rule = 'madd'
    }
    // Iqlab: Nun sakinah before Ba
    else if (char === NUN && (next === SUKUN || next === '') && next2 === BA) {
      rule = 'iqlab'
    }
    // Idgham: Nun sakinah before idgham letters
    else if (char === NUN && next === SUKUN && IDGHAM_LETTERS.test(next2)) {
      rule = 'idgham'
    }
    // Tafkhim: emphatic letters
    else if (EMPHATIC_LETTERS.test(char)) {
      rule = 'tafkhim'
    }
    // Tarqiq: light letters
    else if (LIGHT_LETTERS.test(char)) {
      rule = 'tarqiq'
    }

    result.push({ char, rule })
  }

  return result
}

/**
 * Build a list of active tajwid rules found in text.
 */
export function getActiveTajwidRules(text) {
  const analysis = analyzeTajwid(text)
  const active = new Set(analysis.filter(a => a.rule).map(a => a.rule))
  return [...active].map(key => ({ key, ...TAJWID_RULES[key] }))
}

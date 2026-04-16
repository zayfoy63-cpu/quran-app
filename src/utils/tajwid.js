// Tajwid rules color-coding engine

export const TAJWID_RULES = {
  ghunna: {
    name: 'Ghunna',
    nameAr: 'غنة',
    description: 'Nasalisation — Nun ou Mim avec shadda (ّ)',
    color: '#e74c3c',
    className: 'tajwid-ghunna',
  },
  madd: {
    name: 'Madd',
    nameAr: 'مد',
    description: 'Prolongation — alef ا, waw و, ya ي porteur de voyelle longue',
    color: '#3498db',
    className: 'tajwid-madd',
  },
  idgham: {
    name: 'Idgham',
    nameAr: 'إدغام',
    description: 'Assimilation — Nun sakinah/tanwin suivi de ن م و ي ر ل',
    color: '#9b59b6',
    className: 'tajwid-idgham',
  },
  ikhfa: {
    name: 'Ikhfa',
    nameAr: 'إخفاء',
    description: 'Dissimulation — Nun sakinah devant ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
    color: '#e67e22',
    className: 'tajwid-ikhfa',
  },
  qalqala: {
    name: 'Qalqala',
    nameAr: 'قلقلة',
    description: 'Écho — lettres ق ط ب ج د (toujours actif)',
    color: '#27ae60',
    className: 'tajwid-qalqala',
  },
  iqlab: {
    name: 'Iqlab',
    nameAr: 'إقلاب',
    description: 'Transformation — Nun sakinah devient Mim devant ب',
    color: '#f39c12',
    className: 'tajwid-waqf',
  },
  tafkhim: {
    name: 'Tafkhim',
    nameAr: 'تفخيم',
    description: 'Emphatique — lettres خ غ ض ظ ط ق ص',
    color: '#c0392b',
    className: 'tajwid-tafkhim',
  },
}

// ── Unicode constants ─────────────────────────────────────────────────────────
const SHADDA  = '\u0651'
const SUKUN   = '\u0652'
const TANWIN_FATH = '\u064B'
const TANWIN_KASR = '\u064D'
const TANWIN_DAMM = '\u064C'

const NUN = '\u0646'  // ن
const MIM = '\u0645'  // م
const BA  = '\u0628'  // ب

// Qalqala: ق ط ب ج د  — colored whenever they appear
const QALQALA_RE = /[\u0642\u0637\u0628\u062C\u062F]/u

// Madd carriers: ا آ أ إ و ي ى  (long vowel letters)
const MADD_RE = /[\u0622\u0623\u0625\u0627\u0648\u064A\u0649]/u

// Emphatic (tafkhim): خ غ ض ظ ط ق ص
const TAFKHIM_RE = /[\u062E\u063A\u0636\u0638\u0637\u0642\u0635]/u

// Ikhfa letters (after nun sakinah/tanwin): ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
const IKHFA_RE = /[\u062A\u062B\u062C\u062F\u0630\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0641\u0642\u0643]/u

// Idgham letters (after nun sakinah/tanwin): ن م و ي ر ل
const IDGHAM_RE = /[\u0646\u0645\u0648\u064A\u0631\u0644]/u

// Diacritics (skip them as standalone chars when assigning rules)
const DIACRITIC_RE = /[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/u

/**
 * Returns true if char is a diacritic/haraka (not a base letter)
 */
function isDiacritic(c) {
  return DIACRITIC_RE.test(c)
}

/**
 * Check if char at index i is a Nun sakinah OR followed by tanwin
 */
function isNunSakinahOrTanwin(chars, i) {
  const c = chars[i]
  const next = chars[i + 1] || ''
  if (c === NUN && (next === SUKUN || next === '' )) return true
  if ([TANWIN_FATH, TANWIN_KASR, TANWIN_DAMM].includes(next)) return true
  return false
}

/**
 * Analyze Arabic text char by char and return [{char, rule}].
 * Diacritics are merged onto their base letter (same rule as base letter).
 */
export function analyzeTajwid(text) {
  if (!text) return []
  const chars = [...text]
  const result = []

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const next  = chars[i + 1] || ''
    const next2 = chars[i + 2] || ''
    const next3 = chars[i + 3] || ''

    // Skip standalone diacritics — they'll render attached to the previous glyph
    if (isDiacritic(char)) {
      // Attach to previous entry so the diacritic inherits the same color
      if (result.length > 0) {
        result[result.length - 1].char += char
      } else {
        result.push({ char, rule: null })
      }
      continue
    }

    let rule = null

    // 1. Ghunna: ن or م followed immediately by shadda
    if ((char === NUN || char === MIM) && next === SHADDA) {
      rule = 'ghunna'
    }
    // 2. Iqlab: ن sakinah / tanwin before ب
    else if (char === NUN && isNunSakinahOrTanwin(chars, i)) {
      const following = [next, next2, next3].find(c => c && !isDiacritic(c))
      if (following === BA) rule = 'iqlab'
      else if (IDGHAM_RE.test(following)) rule = 'idgham'
      else if (IKHFA_RE.test(following)) rule = 'ikhfa'
    }
    // 3. Qalqala: letters ق ط ب ج د — always highlighted
    else if (QALQALA_RE.test(char)) {
      rule = 'qalqala'
    }
    // 4. Madd: long-vowel carrier letters ا و ي ى آ أ إ
    else if (MADD_RE.test(char)) {
      rule = 'madd'
    }
    // 5. Tafkhim: emphatic letters خ غ ض ظ ط ق ص
    else if (TAFKHIM_RE.test(char)) {
      // ق and ط are already captured by qalqala above, so this catches خ غ ض ظ ص
      rule = 'tafkhim'
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

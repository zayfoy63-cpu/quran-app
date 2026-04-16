/**
 * Tajwid color definitions — Hafs an Asim (narration standard)
 * Colors match the internationally published colored Tajweed Quran
 * (Dar Al-Ma'rifah, Beirut / King Fahd Complex, Madinah).
 *
 * Source tags come from the quran.com API v4 uthmani_tajweed endpoint.
 */

// ── Official color palette ────────────────────────────────────────────────────

export const TAJWEED_COLORS = {
  // ── MADD (مد) — RED ──────────────────────────────────────────────────────
  // All prolongation types are red in the standard colored mushaf
  madda_normal:       { color: '#D32F2F', label: 'Madd Normal (2)',        nameAr: 'مد طبيعي',       group: 'madd' },
  madda_permissible:  { color: '#D32F2F', label: 'Madd Permissible (2/4/6)', nameAr: 'مد جائز',      group: 'madd' },
  madd_muttasil:      { color: '#D32F2F', label: 'Madd Muttasil (4-5)',    nameAr: 'مد متصل واجب',   group: 'madd' },
  madd_munfasil:      { color: '#D32F2F', label: 'Madd Munfasil (4-5)',    nameAr: 'مد منفصل جائز',  group: 'madd' },
  madd_6:             { color: '#D32F2F', label: 'Madd Laazim (6)',        nameAr: 'مد لازم',        group: 'madd' },
  madd_246:           { color: '#D32F2F', label: "Madd 'Aarid / Leen",    nameAr: 'مد عارض / لين',  group: 'madd' },

  // ── GHUNNA (غنة) — BLUE ──────────────────────────────────────────────────
  // Nun / Meem mushaddad — 2 harakat of nasalisation
  ghunnah:            { color: '#1565C0', label: 'Ghunna (2 harakat)',     nameAr: 'غنة',            group: 'ghunna' },

  // ── IDGHAM AVEC GHUNNA (إدغام بغنة) — GREEN ─────────────────────────────
  idghaam_ghunnah:    { color: '#2E7D32', label: 'Idgham avec Ghunna',     nameAr: 'إدغام بغنة',     group: 'idgham_g' },
  idghaam_shafawi:    { color: '#2E7D32', label: 'Idgham Shafawi (مـ)',    nameAr: 'إدغام شفوي',     group: 'idgham_g' },

  // ── IDGHAM SANS GHUNNA (إدغام بلا غنة) — DARK BLUE ───────────────────────
  idghaam_no_ghunnah: { color: '#1A237E', label: 'Idgham sans Ghunna',     nameAr: 'إدغام بلا غنة',  group: 'idgham_ng' },
  idghaam_mutajaanisain: { color: '#1A237E', label: 'Idgham Mutajanisain', nameAr: 'إدغام متجانسين', group: 'idgham_ng' },
  idghaam_mutaqaaribain: { color: '#1A237E', label: 'Idgham Mutaqaribain', nameAr: 'إدغام متقاربين', group: 'idgham_ng' },

  // ── IKHFA (إخفاء) — TEAL ─────────────────────────────────────────────────
  ikhfa:              { color: '#00695C', label: 'Ikhfa Haqiqi',           nameAr: 'إخفاء حقيقي',    group: 'ikhfa' },
  ikhfa_shafawi:      { color: '#00695C', label: 'Ikhfa Shafawi (مـ)',     nameAr: 'إخفاء شفوي',    group: 'ikhfa' },

  // ── IQLAB (إقلاب) — ORANGE ───────────────────────────────────────────────
  iqlab:              { color: '#E65100', label: 'Iqlab (نـ → مـ)',        nameAr: 'إقلاب',          group: 'iqlab' },

  // ── QALQALA (قلقلة) — CYAN ───────────────────────────────────────────────
  qalqalah:           { color: '#00838F', label: 'Qalqala (ق ط ب ج د)',   nameAr: 'قلقلة',          group: 'qalqala' },

  // ── STRUCTURAL — GRAY (Hamzat al-Wasl, Lam Shamsiyya) ───────────────────
  // These are formatting helpers; colored gray so they don't distract
  ham_wasl:           { color: '#9E9E9E', label: 'Hamzat al-Wasl',         nameAr: 'همزة الوصل',     group: 'wasl' },
  hamzat_wasl:        { color: '#9E9E9E', label: 'Hamzat al-Wasl',         nameAr: 'همزة الوصل',     group: 'wasl' },
  laam_shamsiyah:     { color: '#9E9E9E', label: 'Lam Shamsiyya',          nameAr: 'لام شمسية',      group: 'wasl' },
  lam_shamsiyyah:     { color: '#9E9E9E', label: 'Lam Shamsiyya',          nameAr: 'لام شمسية',      group: 'wasl' },

  // ── SILENT — LIGHT GRAY ──────────────────────────────────────────────────
  silent:             { color: '#BDBDBD', label: 'Lettre muette',          nameAr: 'حرف صامت',       group: 'silent' },
}

/**
 * Groups used for the legend (one row per group, not one per tag).
 */
export const TAJWEED_LEGEND = [
  { group: 'madd',      color: '#D32F2F', label: 'Madd — Prolongation',          nameAr: 'مد',       desc: 'Toutes les variantes de prolongation (Normal, Muttasil, Munfasil, Laazim…)' },
  { group: 'ghunna',    color: '#1565C0', label: 'Ghunna — Nasalisation',         nameAr: 'غنة',      desc: 'Nun ou Mim mushaddad : son nasal de 2 harakat' },
  { group: 'idgham_g',  color: '#2E7D32', label: 'Idgham avec Ghunna',            nameAr: 'إدغام بغنة', desc: 'Assimilation avec nasalisation : ن/ت devant ي ن م و' },
  { group: 'idgham_ng', color: '#1A237E', label: 'Idgham sans Ghunna',            nameAr: 'إدغام بلا غنة', desc: 'Assimilation sans nasalisation : ن devant ر ل' },
  { group: 'ikhfa',     color: '#00695C', label: 'Ikhfa — Dissimulation',         nameAr: 'إخفاء',    desc: 'Son de Nun/Tanwin partiellement dissimulé devant 15 lettres' },
  { group: 'iqlab',     color: '#E65100', label: 'Iqlab — Substitution',          nameAr: 'إقلاب',    desc: 'Nun sakinah / Tanwin se transforme en Mim devant ب' },
  { group: 'qalqala',   color: '#00838F', label: 'Qalqala — Écho',                nameAr: 'قلقلة',    desc: 'Son rebondissant sur ق ط ب ج د avec sukun' },
  { group: 'wasl',      color: '#9E9E9E', label: 'Hamzat al-Wasl / Lam Shamsiyya', nameAr: 'همزة الوصل / لام شمسية', desc: 'Marqueurs de liaison et d\'assimilation structurels' },
]

/**
 * Parse <tajweed class=RULE>TEXT</tajweed> HTML string into segments.
 * Returns: Array<{ text: string, rule: string|null }>
 */
export function parseTajweedHtml(html) {
  if (!html) return []
  const segments = []
  // Matches both quoted and unquoted class attributes
  const RE = /<tajweed class=["']?([^"'\s>]+)["']?>([\s\S]*?)<\/tajweed>|([^<]+)/g
  let m
  while ((m = RE.exec(html)) !== null) {
    if (m[1] !== undefined) {
      // Tagged segment
      segments.push({ text: m[2], rule: m[1] })
    } else if (m[3] !== undefined) {
      // Plain text
      segments.push({ text: m[3], rule: null })
    }
  }
  return segments
}

// ── Legacy helpers (kept for backward compat with TajwidPage fallback) ────────

export const TAJWID_RULES = {
  madd:    { name: 'Madd',    nameAr: 'مد',      description: 'Prolongation',          color: '#D32F2F', className: 'tajwid-madd'    },
  ghunna:  { name: 'Ghunna',  nameAr: 'غنة',     description: 'Nasalisation',          color: '#1565C0', className: 'tajwid-ghunna'  },
  idgham:  { name: 'Idgham',  nameAr: 'إدغام',   description: 'Assimilation',          color: '#2E7D32', className: 'tajwid-idgham'  },
  ikhfa:   { name: 'Ikhfa',   nameAr: 'إخفاء',   description: 'Dissimulation',         color: '#00695C', className: 'tajwid-ikhfa'   },
  qalqala: { name: 'Qalqala', nameAr: 'قلقلة',   description: 'Écho — ق ط ب ج د',      color: '#00838F', className: 'tajwid-qalqala' },
  iqlab:   { name: 'Iqlab',   nameAr: 'إقلاب',   description: 'Substitution نـ → مـ',  color: '#E65100', className: 'tajwid-waqf'    },
  tafkhim: { name: 'Tafkhim', nameAr: 'تفخيم',   description: 'Emphatique',            color: '#C62828', className: 'tajwid-tafkhim' },
}

export function analyzeTajwid(text) { return [] }      // replaced by API-based parsing
export function getActiveTajwidRules() { return [] }   // replaced by TAJWEED_LEGEND

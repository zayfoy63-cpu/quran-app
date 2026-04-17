/**
 * Tajwid color definitions — Hafs an Asim (narration standard)
 * Source tags come from alquran.cloud edition "quran-tajweed".
 * Both the short class names (madd, qalqala…) and the long variants
 * (madda_normal, qalqalah…) are mapped so the parser handles either API.
 */

// ── Official color palette (mushaf Hafs, alquran.cloud standard) ─────────────

export const TAJWEED_COLORS = {
  // ── MADD (مد) — RED #C0392B ──────────────────────────────────────────────
  madd:               { color: '#C0392B', label: 'Madd — Prolongation',        nameAr: 'مد',             group: 'madd' },
  madda_normal:       { color: '#C0392B', label: 'Madd Normal (2)',             nameAr: 'مد طبيعي',       group: 'madd' },
  madda_permissible:  { color: '#C0392B', label: 'Madd Permissible (2/4/6)',    nameAr: 'مد جائز',        group: 'madd' },
  madd_muttasil:      { color: '#C0392B', label: 'Madd Muttasil (4-5)',         nameAr: 'مد متصل واجب',   group: 'madd' },
  madd_munfasil:      { color: '#C0392B', label: 'Madd Munfasil (4-5)',         nameAr: 'مد منفصل جائز',  group: 'madd' },
  madd_6:             { color: '#C0392B', label: 'Madd Laazim (6)',             nameAr: 'مد لازم',        group: 'madd' },
  madd_246:           { color: '#C0392B', label: "Madd 'Aarid / Leen",         nameAr: 'مد عارض / لين',  group: 'madd' },

  // ── QALQALA (قلقلة) — DARK BLUE #1A5276 ─────────────────────────────────
  qalqala:            { color: '#1A5276', label: 'Qalqala (ق ط ب ج د)',        nameAr: 'قلقلة',          group: 'qalqala' },
  qalqalah:           { color: '#1A5276', label: 'Qalqala (ق ط ب ج د)',        nameAr: 'قلقلة',          group: 'qalqala' },

  // ── GHUNNA (غنة) — GREEN #1E8449 ────────────────────────────────────────
  ghunna:             { color: '#1E8449', label: 'Ghunna (2 harakat)',          nameAr: 'غنة',            group: 'ghunna' },
  ghunnah:            { color: '#1E8449', label: 'Ghunna (2 harakat)',          nameAr: 'غنة',            group: 'ghunna' },

  // ── IKHFA (إخفاء) — ORANGE #D35400 ─────────────────────────────────────
  ikhfa:              { color: '#D35400', label: 'Ikhfa Haqiqi',               nameAr: 'إخفاء حقيقي',    group: 'ikhfa' },
  ikhfa_shafawi:      { color: '#D35400', label: 'Ikhfa Shafawi (مـ)',          nameAr: 'إخفاء شفوي',     group: 'ikhfa' },

  // ── IDGHAM (إدغام) — LIGHT BLUE #2E86C1 ─────────────────────────────────
  idgham:             { color: '#2E86C1', label: 'Idgham',                     nameAr: 'إدغام',           group: 'idgham' },
  idgham_ghunna:      { color: '#2E86C1', label: 'Idgham avec Ghunna',         nameAr: 'إدغام بغنة',      group: 'idgham' },
  idghaam_ghunnah:    { color: '#2E86C1', label: 'Idgham avec Ghunna',         nameAr: 'إدغام بغنة',      group: 'idgham' },
  idghaam_shafawi:    { color: '#2E86C1', label: 'Idgham Shafawi',             nameAr: 'إدغام شفوي',      group: 'idgham' },
  idghaam_no_ghunnah: { color: '#2E86C1', label: 'Idgham sans Ghunna',         nameAr: 'إدغام بلا غنة',   group: 'idgham' },
  idghaam_mutajaanisain: { color: '#2E86C1', label: 'Idgham Mutajanisain',     nameAr: 'إدغام متجانسين',  group: 'idgham' },
  idghaam_mutaqaaribain: { color: '#2E86C1', label: 'Idgham Mutaqaribain',     nameAr: 'إدغام متقاربين',  group: 'idgham' },

  // ── IQLAB (إقلاب) — PURPLE #7D3C98 ─────────────────────────────────────
  iqlab:              { color: '#7D3C98', label: 'Iqlab (نـ → مـ)',            nameAr: 'إقلاب',           group: 'iqlab' },

  // ── HAM_WASL / LAM SHAMSIYYA — GRAY #888888 ─────────────────────────────
  ham_wasl:           { color: '#888888', label: 'Hamzat al-Wasl',             nameAr: 'همزة الوصل',      group: 'wasl' },
  hamzat_wasl:        { color: '#888888', label: 'Hamzat al-Wasl',             nameAr: 'همزة الوصل',      group: 'wasl' },
  lam_shamsiyah:      { color: '#888888', label: 'Lam Shamsiyya',              nameAr: 'لام شمسية',       group: 'wasl' },
  lam_shamsiyyah:     { color: '#888888', label: 'Lam Shamsiyya',              nameAr: 'لام شمسية',       group: 'wasl' },
  laam_shamsiyah:     { color: '#888888', label: 'Lam Shamsiyya',              nameAr: 'لام شمسية',       group: 'wasl' },

  // ── SILENT — LIGHT GRAY ──────────────────────────────────────────────────
  silent:             { color: '#BDBDBD', label: 'Lettre muette',              nameAr: 'حرف صامت',        group: 'silent' },
}

/**
 * Groups shown in the legend (one row per group).
 */
export const TAJWEED_LEGEND = [
  { group: 'madd',    color: '#C0392B', label: 'Madd — Prolongation',      nameAr: 'مد',          desc: 'Toutes les variantes de prolongation (Normal, Muttasil, Munfasil, Laazim…)' },
  { group: 'qalqala', color: '#1A5276', label: 'Qalqala — Écho',           nameAr: 'قلقلة',       desc: 'Son rebondissant sur ق ط ب ج د avec sukun' },
  { group: 'ghunna',  color: '#1E8449', label: 'Ghunna — Nasalisation',    nameAr: 'غنة',         desc: 'Nun ou Mim mushaddad : son nasal de 2 harakat' },
  { group: 'ikhfa',   color: '#D35400', label: 'Ikhfa — Dissimulation',    nameAr: 'إخفاء',       desc: 'Son de Nun/Tanwin partiellement dissimulé devant 15 lettres' },
  { group: 'idgham',  color: '#2E86C1', label: 'Idgham — Assimilation',    nameAr: 'إدغام',       desc: 'Assimilation avec ou sans ghunna (ن / م devant ي ن م و ر ل)' },
  { group: 'iqlab',   color: '#7D3C98', label: 'Iqlab — Substitution',     nameAr: 'إقلاب',       desc: 'Nun sakinah / Tanwin se transforme en Mim devant ب' },
  { group: 'wasl',    color: '#888888', label: 'Hamzat al-Wasl / Lam ش',   nameAr: 'همزة الوصل',  desc: "Marqueurs de liaison et d'assimilation structurels" },
]

/**
 * Parse <tajweed class=RULE>TEXT</tajweed> HTML string into segments.
 * Returns: Array<{ text: string, rule: string|null }>
 */
export function parseTajweedHtml(html) {
  if (!html) return []
  const segments = []
  const RE = /<tajweed class=["']?([^"'\s>]+)["']?>([\s\S]*?)<\/tajweed>|([^<]+)/g
  let m
  while ((m = RE.exec(html)) !== null) {
    if (m[1] !== undefined) {
      segments.push({ text: m[2], rule: m[1] })
    } else if (m[3] !== undefined) {
      segments.push({ text: m[3], rule: null })
    }
  }
  return segments
}

// ── Legacy helpers (kept for backward compat with TajwidPage) ─────────────────

export const TAJWID_RULES = {
  madd:    { name: 'Madd',    nameAr: 'مد',      description: 'Prolongation',         color: '#C0392B', className: 'tajwid-madd'    },
  ghunna:  { name: 'Ghunna',  nameAr: 'غنة',     description: 'Nasalisation',         color: '#1E8449', className: 'tajwid-ghunna'  },
  idgham:  { name: 'Idgham',  nameAr: 'إدغام',   description: 'Assimilation',         color: '#2E86C1', className: 'tajwid-idgham'  },
  ikhfa:   { name: 'Ikhfa',   nameAr: 'إخفاء',   description: 'Dissimulation',        color: '#D35400', className: 'tajwid-ikhfa'   },
  qalqala: { name: 'Qalqala', nameAr: 'قلقلة',   description: 'Écho — ق ط ب ج د',     color: '#1A5276', className: 'tajwid-qalqala' },
  iqlab:   { name: 'Iqlab',   nameAr: 'إقلاب',   description: 'Substitution نـ → مـ', color: '#7D3C98', className: 'tajwid-iqlab'   },
  tafkhim: { name: 'Tafkhim', nameAr: 'تفخيم',   description: 'Emphatique',           color: '#C0392B', className: 'tajwid-tafkhim' },
}

export function analyzeTajwid(text) { return [] }
export function getActiveTajwidRules() { return [] }

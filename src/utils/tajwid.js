/**
 * Tajwid color definitions — Hafs an Asim (narration standard)
 * Letter codes are the official identifiers used by alquran.cloud
 * "quran-tajweed" edition. API format: [x:XXXX[chars
 */

// ── Official alquran.cloud letter-code palette ────────────────────────────────

export const TAJWEED_LETTER_CODES = {
  // Structural — GRAY #AAAAAA
  h: { color: '#AAAAAA', label: 'Hamza al-Wasl',           nameAr: 'همزة الوصل',      group: 'structural' },
  s: { color: '#AAAAAA', label: 'Lettre silencieuse',       nameAr: 'حرف صامت',        group: 'structural' },
  l: { color: '#AAAAAA', label: 'Lam Shamsiyya',            nameAr: 'لام شمسية',       group: 'structural' },

  // Madd — shades of BLUE
  n: { color: '#537FFF', label: 'Madd Normal (2)',          nameAr: 'مد طبيعي',        group: 'madd' },
  p: { color: '#4050FF', label: 'Madd Permissible (2/4/6)', nameAr: 'مد جائز',         group: 'madd' },
  o: { color: '#2144C1', label: 'Madd Obligatoire (4-5)',   nameAr: 'مد واجب متصل',    group: 'madd' },
  m: { color: '#000EBC', label: 'Madd Nécessaire (6)',      nameAr: 'مد لازم',         group: 'madd' },

  // Qalqala — RED
  q: { color: '#DD0008', label: 'Qalqala',                  nameAr: 'قلقلة',           group: 'qalqala' },

  // Ikhfa — PURPLE
  f: { color: '#9400A8', label: 'Ikhfa Haqiqi',             nameAr: 'إخفاء حقيقي',    group: 'ikhfa' },
  c: { color: '#D500B7', label: 'Ikhfa Shafawi (مـ)',        nameAr: 'إخفاء شفوي',     group: 'ikhfa' },

  // Idgham — GREENS
  a: { color: '#169777', label: 'Idgham avec Ghunna',       nameAr: 'إدغام بغنة',      group: 'idgham' },
  u: { color: '#169200', label: 'Idgham sans Ghunna',       nameAr: 'إدغام بلا غنة',   group: 'idgham' },
  w: { color: '#58B800', label: 'Idgham Shafawi (مـ)',       nameAr: 'إدغام شفوي',      group: 'idgham' },
  d: { color: '#A1A1A1', label: 'Idgham Mutajanisayn',      nameAr: 'إدغام متجانسين',  group: 'idgham' },
  b: { color: '#A1A1A1', label: 'Idgham Mutaqaribayn',      nameAr: 'إدغام متقاربين',  group: 'idgham' },

  // Iqlab — CYAN
  i: { color: '#26BFFD', label: 'Iqlab (نـ → مـ)',           nameAr: 'إقلاب',           group: 'iqlab' },

  // Ghunna — ORANGE
  g: { color: '#FF7E1E', label: 'Ghunna (2 harakat)',        nameAr: 'غنة',             group: 'ghunna' },
}

/**
 * Legend entries — shown under the verse list when Tajwid is enabled.
 */
export const TAJWEED_LEGEND = [
  // Structural
  { group: 'structural', color: '#AAAAAA', label: 'Hamza al-Wasl / Lam ش / Silence', nameAr: 'همزة الوصل', desc: "Hamza de liaison, Lam assimilée, lettres silencieuses [h] [l] [s]" },
  // Madd
  { group: 'madd-n', color: '#537FFF', label: 'Madd Normal (2 voyelles)',             nameAr: 'مد طبيعي',   desc: 'Prolongation ordinaire de 2 voyelles [n]' },
  { group: 'madd-p', color: '#4050FF', label: 'Madd Permissible (2/4/6)',             nameAr: 'مد جائز',    desc: 'Madd munfasil : 2, 4 ou 6 voyelles selon le récitateur [p]' },
  { group: 'madd-o', color: '#2144C1', label: 'Madd Obligatoire (4-5)',               nameAr: 'مد واجب',    desc: 'Madd muttasil : 4 ou 5 voyelles obligatoires [o]' },
  { group: 'madd-m', color: '#000EBC', label: 'Madd Nécessaire (6)',                  nameAr: 'مد لازم',    desc: 'Madd laazim : 6 voyelles obligatoires [m]' },
  // Qalqala
  { group: 'qalqala', color: '#DD0008', label: 'Qalqala — Écho',                     nameAr: 'قلقلة',      desc: 'Son rebondissant sur ق ط ب ج د avec sukun [q]' },
  // Ikhfa
  { group: 'ikhfa-f', color: '#9400A8', label: 'Ikhfa Haqiqi',                       nameAr: 'إخفاء حقيقي', desc: 'Nun/Tanwin dissimulé devant 15 lettres [f]' },
  { group: 'ikhfa-c', color: '#D500B7', label: 'Ikhfa Shafawi (مـ)',                  nameAr: 'إخفاء شفوي', desc: 'Meem sakin dissimulé devant ب [c]' },
  // Idgham
  { group: 'idgham-a', color: '#169777', label: 'Idgham avec Ghunna',                nameAr: 'إدغام بغنة',    desc: 'Assimilation avec nasalisation devant ي ن م و [a]' },
  { group: 'idgham-u', color: '#169200', label: 'Idgham sans Ghunna',                nameAr: 'إدغام بلا غنة', desc: 'Assimilation sans nasalisation devant ر ل [u]' },
  { group: 'idgham-w', color: '#58B800', label: 'Idgham Shafawi (مـ)',               nameAr: 'إدغام شفوي',    desc: 'Meem sakin assimilé devant م [w]' },
  { group: 'idgham-d', color: '#A1A1A1', label: 'Idgham Mutajanisayn',              nameAr: 'إدغام متجانسين', desc: 'Assimilation de deux lettres de même point articulatoire [d]' },
  { group: 'idgham-b', color: '#A1A1A1', label: 'Idgham Mutaqaribayn',              nameAr: 'إدغام متقاربين', desc: 'Assimilation de deux lettres proches dans leurs caractéristiques [b]' },
  // Iqlab
  { group: 'iqlab', color: '#26BFFD', label: 'Iqlab — Substitution',                nameAr: 'إقلاب',       desc: 'Nun sakin / Tanwin → Meem devant ب [i]' },
  // Ghunna
  { group: 'ghunna', color: '#FF7E1E', label: 'Ghunna — Nasalisation',              nameAr: 'غنة',         desc: 'Nun ou Mim mushaddad : son nasal de 2 harakat [g]' },
]

// ── Backward-compat map (for old <tajweed class="..."> HTML format) ───────────

export const TAJWEED_COLORS = {
  madda_normal:          { color: '#537FFF', label: 'Madd Normal',        nameAr: 'مد طبيعي',      group: 'madd' },
  madda_permissible:     { color: '#4050FF', label: 'Madd Permissible',   nameAr: 'مد جائز',       group: 'madd' },
  madd_muttasil:         { color: '#2144C1', label: 'Madd Obligatoire',   nameAr: 'مد واجب',       group: 'madd' },
  madd_munfasil:         { color: '#4050FF', label: 'Madd Permissible',   nameAr: 'مد جائز',       group: 'madd' },
  madd_6:                { color: '#000EBC', label: 'Madd Laazim (6)',    nameAr: 'مد لازم',       group: 'madd' },
  madd_246:              { color: '#4050FF', label: 'Madd 2/4/6',         nameAr: 'مد عارض',       group: 'madd' },
  madd:                  { color: '#537FFF', label: 'Madd',               nameAr: 'مد',            group: 'madd' },
  qalqala:               { color: '#DD0008', label: 'Qalqala',            nameAr: 'قلقلة',         group: 'qalqala' },
  qalqalah:              { color: '#DD0008', label: 'Qalqala',            nameAr: 'قلقلة',         group: 'qalqala' },
  ghunna:                { color: '#FF7E1E', label: 'Ghunna',             nameAr: 'غنة',           group: 'ghunna' },
  ghunnah:               { color: '#FF7E1E', label: 'Ghunna',             nameAr: 'غنة',           group: 'ghunna' },
  ikhfa:                 { color: '#9400A8', label: 'Ikhfa Haqiqi',       nameAr: 'إخفاء حقيقي',  group: 'ikhfa' },
  ikhfa_shafawi:         { color: '#D500B7', label: 'Ikhfa Shafawi',      nameAr: 'إخفاء شفوي',   group: 'ikhfa' },
  idghaam_ghunnah:       { color: '#169777', label: 'Idgham avec Ghunna', nameAr: 'إدغام بغنة',   group: 'idgham' },
  idgham_ghunna:         { color: '#169777', label: 'Idgham avec Ghunna', nameAr: 'إدغام بغنة',   group: 'idgham' },
  idgham:                { color: '#169777', label: 'Idgham',             nameAr: 'إدغام',         group: 'idgham' },
  idghaam_no_ghunnah:    { color: '#169200', label: 'Idgham sans Ghunna', nameAr: 'إدغام بلا غنة', group: 'idgham' },
  idghaam_shafawi:       { color: '#58B800', label: 'Idgham Shafawi',     nameAr: 'إدغام شفوي',   group: 'idgham' },
  idghaam_mutajaanisain: { color: '#A1A1A1', label: 'Idgham Mutajanisayn', nameAr: 'إدغام متجانسين', group: 'idgham' },
  idghaam_mutaqaaribain: { color: '#A1A1A1', label: 'Idgham Mutaqaribayn', nameAr: 'إدغام متقاربين', group: 'idgham' },
  iqlab:                 { color: '#26BFFD', label: 'Iqlab',              nameAr: 'إقلاب',         group: 'iqlab' },
  ham_wasl:              { color: '#AAAAAA', label: 'Hamza al-Wasl',      nameAr: 'همزة الوصل',    group: 'structural' },
  hamzat_wasl:           { color: '#AAAAAA', label: 'Hamza al-Wasl',      nameAr: 'همزة الوصل',    group: 'structural' },
  lam_shamsiyah:         { color: '#AAAAAA', label: 'Lam Shamsiyya',      nameAr: 'لام شمسية',     group: 'structural' },
  lam_shamsiyyah:        { color: '#AAAAAA', label: 'Lam Shamsiyya',      nameAr: 'لام شمسية',     group: 'structural' },
  laam_shamsiyah:        { color: '#AAAAAA', label: 'Lam Shamsiyya',      nameAr: 'لام شمسية',     group: 'structural' },
  silent:                { color: '#AAAAAA', label: 'Lettre muette',       nameAr: 'حرف صامت',      group: 'structural' },
}

export function parseTajweedHtml(html) {
  if (!html) return []
  const segments = []
  const RE = /<tajweed class=["']?([^"'\s>]+)["']?>([\s\S]*?)<\/tajweed>|([^<]+)/g
  let m
  while ((m = RE.exec(html)) !== null) {
    if (m[1] !== undefined) segments.push({ text: m[2], rule: m[1] })
    else if (m[3] !== undefined) segments.push({ text: m[3], rule: null })
  }
  return segments
}

// ── Legacy helpers ────────────────────────────────────────────────────────────

export const TAJWID_RULES = {
  madd:    { name: 'Madd',    nameAr: 'مد',    description: 'Prolongation',         color: '#537FFF' },
  ghunna:  { name: 'Ghunna',  nameAr: 'غنة',   description: 'Nasalisation',         color: '#FF7E1E' },
  idgham:  { name: 'Idgham',  nameAr: 'إدغام', description: 'Assimilation',         color: '#169777' },
  ikhfa:   { name: 'Ikhfa',   nameAr: 'إخفاء', description: 'Dissimulation',        color: '#9400A8' },
  qalqala: { name: 'Qalqala', nameAr: 'قلقلة', description: 'Écho — ق ط ب ج د',    color: '#DD0008' },
  iqlab:   { name: 'Iqlab',   nameAr: 'إقلاب', description: 'Substitution نـ → مـ', color: '#26BFFD' },
}

export function analyzeTajwid() { return [] }
export function getActiveTajwidRules() { return [] }

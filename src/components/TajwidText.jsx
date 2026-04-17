import { TAJWEED_COLORS, TAJWEED_LETTER_CODES } from '../utils/tajwid'

/**
 * Real alquran.cloud quran-tajweed format (verified from API):
 *
 *   بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[لِ]الرَّحْمَ[n[ـَ]نِ
 *
 * Structure: [code:optionalId[colored_chars]normal_text...
 *   - The colored letters are ONLY those between the second [ and the closing ]
 *   - Everything outside these markers is normal text (no color applied)
 *
 * Parser: single .replace() — matches [code:id[chars] and wraps only `chars`
 * in a colored span. All other text passes through unchanged.
 */
function buildStyledHtml(text) {
  if (!text) return ''

  // Legacy HTML format (quran.com API)
  if (text.includes('<tajweed')) {
    return text.replace(
      /<tajweed class=["']?([^"'\s>]+)["']?>([\s\S]*?)<\/tajweed>/g,
      (_, rule, chars) => {
        const def = TAJWEED_COLORS[rule]
        if (!def) return chars
        return `<span style="color:${def.color}" title="${def.label} — ${def.nameAr}">${chars}</span>`
      }
    )
  }

  // alquran.cloud bracket format — only the chars inside [code[...]]] are colored
  return text.replace(
    /\[([a-z])(?::\d+)?\[([^\]]*)\]/g,
    (_, code, chars) => {
      const def = TAJWEED_LETTER_CODES[code]
      if (!def?.color) return chars  // structural codes with null color render plain
      return `<span style="color:${def.color}" title="${def.label} — ${def.nameAr}">${chars}</span>`
    }
  )
}

export default function TajwidText({ html, plainText }) {
  if (!html) return <span>{plainText}</span>
  return <span dangerouslySetInnerHTML={{ __html: buildStyledHtml(html) }} />
}

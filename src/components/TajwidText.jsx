import { TAJWEED_COLORS, TAJWEED_LETTER_CODES } from '../utils/tajwid'

/**
 * Parse tajweed-encoded text and return an HTML string with colored <span>s.
 *
 * Supported formats:
 *   alquran.cloud bracket format : [x:XXXX[chars  (closing delimiter is next [)
 *   alquran.cloud bracket format : [x:XXXX]chars  (closing delimiter is ])
 *   quran.com HTML format        : <tajweed class="rule">chars</tajweed>
 *
 * The split regex uses a character class [\]\[] to accept either ] or [ as
 * the closing character of the marker header, making it format-agnostic.
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

  // alquran.cloud bracket format — split on [code:id] or [code:id[ markers
  // Capture group inside split includes the letter code in the token array.
  // Result pattern: [prefix, code, text, code, text, ...]
  const tokens = text.split(/\[([a-z])(?::\d+)?[\]\[]/)

  let html = tokens[0] // plain text before the first marker (may be empty)

  for (let i = 1; i < tokens.length - 1; i += 2) {
    const code  = tokens[i]
    const chars = tokens[i + 1] ?? ''
    const def   = TAJWEED_LETTER_CODES[code]
    if (def?.color && chars) {
      html += `<span style="color:${def.color}" title="${def.label} — ${def.nameAr}">${chars}</span>`
    } else {
      html += chars
    }
  }

  // If token count is even (shouldn't normally happen), append trailing token
  if (tokens.length % 2 === 0) html += tokens[tokens.length - 1]

  return html
}

export default function TajwidText({ html, plainText }) {
  if (!html) return <span>{plainText}</span>
  return <span dangerouslySetInnerHTML={{ __html: buildStyledHtml(html) }} />
}

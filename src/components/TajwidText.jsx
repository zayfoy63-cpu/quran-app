import { TAJWEED_COLORS, TAJWEED_LETTER_CODES } from '../utils/tajwid'

/**
 * Detect and parse either format from alquran.cloud:
 *
 * New format (quran-tajweed edition): [code:id]chars  e.g. [f:10623]ت[h:10624]و
 *   — split on bracket markers, apply color to following chars per code.
 *
 * Old format (quran.com API): <tajweed class="rule">chars</tajweed>
 *   — regex-replace with inline-colored <span>.
 */
function buildStyledHtml(text) {
  if (!text) return ''

  // Old HTML format from quran.com — replace <tajweed> tags with colored spans
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

  // New bracket format from alquran.cloud quran-tajweed edition
  // Split on markers like [f:10623] or [l] — captured groups interleave with text chunks
  const tokens = text.split(/(\[[a-zA-Z](?::\d+)?\])/)
  let html = ''
  let pendingCode = null

  for (const token of tokens) {
    const m = token.match(/^\[([a-zA-Z])(?::\d+)?\]$/)
    if (m) {
      pendingCode = m[1]
    } else if (pendingCode !== null) {
      const def = TAJWEED_LETTER_CODES[pendingCode]
      if (def?.color && token) {
        html += `<span style="color:${def.color}" title="${def.label} — ${def.nameAr}">${token}</span>`
      } else {
        html += token
      }
      pendingCode = null
    } else {
      html += token
    }
  }

  return html
}

export default function TajwidText({ html, plainText }) {
  if (!html) return <span>{plainText}</span>
  return <span dangerouslySetInnerHTML={{ __html: buildStyledHtml(html) }} />
}

import { TAJWEED_COLORS } from '../utils/tajwid'

/**
 * Replace <tajweed class=rule>text</tajweed> with inline-colored <span>,
 * then render via dangerouslySetInnerHTML so all remaining HTML tags
 * (verse-end markers, <span class=end>, etc.) also render correctly.
 */
function buildStyledHtml(html) {
  return html.replace(
    /<tajweed class=["']?([^"'\s>]+)["']?>([\s\S]*?)<\/tajweed>/g,
    (_, rule, text) => {
      const def = TAJWEED_COLORS[rule]
      if (!def) return text
      const title = `${def.label} — ${def.nameAr}`
      return `<span style="color:${def.color}" title="${title}">${text}</span>`
    }
  )
}

export default function TajwidText({ html, plainText }) {
  if (!html) return <span>{plainText}</span>
  return <span dangerouslySetInnerHTML={{ __html: buildStyledHtml(html) }} />
}

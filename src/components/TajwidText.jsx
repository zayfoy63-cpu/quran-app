import React from 'react'
import { parseTajweedHtml, TAJWEED_COLORS } from '../utils/tajwid'

export default function TajwidText({ html, plainText }) {
  if (!html) return <span>{plainText}</span>

  const segments = parseTajweedHtml(html)
  if (!segments.length) return <span>{plainText}</span>

  return (
    <span>
      {segments.map((seg, i) => {
        const colorDef = seg.rule ? TAJWEED_COLORS[seg.rule] : null
        if (colorDef) {
          return (
            <span
              key={i}
              style={{ color: colorDef.color }}
              title={`${colorDef.label} — ${colorDef.nameAr}`}
            >
              {seg.text}
            </span>
          )
        }
        return <span key={i}>{seg.text}</span>
      })}
    </span>
  )
}

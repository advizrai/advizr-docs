import { ImageResponse } from 'next/og'

import { loadOgFonts, OG_COLORS as C } from '@/lib/og'

/**
 * Site-default OG card — Instrument Grade (PR-F): the same band-world
 * vocabulary as app/api/og/route.tsx (hairline frame, corner ticks, coral
 * port-dot eyebrow, Geist 600 title) with the site strapline as body copy.
 */

export const alt = 'Advizr Documentation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const tick = {
    position: 'absolute' as const,
    width: '16px',
    height: '16px',
    borderColor: C.text3,
    borderStyle: 'solid',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: C.band,
          padding: '48px',
          fontFamily: 'Geist',
        }}
      >
        {/* Hairline frame + corner ticks (FigureFrame grammar) */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            right: '32px',
            bottom: '32px',
            border: `1px solid ${C.bandHairline}`,
            display: 'flex',
          }}
        />
        <div style={{ ...tick, top: '31px', left: '31px', borderWidth: '2px 0 0 2px' }} />
        <div style={{ ...tick, top: '31px', right: '31px', borderWidth: '2px 2px 0 0' }} />
        <div style={{ ...tick, bottom: '31px', left: '31px', borderWidth: '0 0 2px 2px' }} />
        <div style={{ ...tick, bottom: '31px', right: '31px', borderWidth: '0 2px 2px 0' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            padding: '0 72px',
          }}
        >
          {/* Eyebrow — coral port-dot + mono uppercase */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '9999px',
                background: C.signal,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: 'Geist Mono',
                fontSize: '22px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: C.text3,
              }}
            >
              ADVIZR — DOCUMENTATION
            </span>
          </div>

          {/* Title — Geist 600 */}
          <div
            style={{
              marginTop: '28px',
              fontSize: '66px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: C.text1,
              display: 'flex',
            }}
          >
            Advizr Docs
          </div>

          <div
            style={{
              marginTop: '24px',
              fontSize: '26px',
              lineHeight: 1.45,
              color: C.text2,
              maxWidth: '760px',
              display: 'flex',
            }}
          >
            Guides, courses, and technical reference for business owners
          </div>
        </div>

        {/* Footer row — hairline-t, wordmark + domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${C.bandHairline}`,
            margin: '0 72px',
            padding: '24px 0 28px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: C.text1,
            }}
          >
            Advizr
          </span>
          <span
            style={{
              fontFamily: 'Geist Mono',
              fontSize: '18px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.text3,
            }}
          >
            docs.advizr.ca
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: (await loadOgFonts()) as unknown as NonNullable<
        ConstructorParameters<typeof ImageResponse>[1]
      >['fonts'],
    }
  )
}

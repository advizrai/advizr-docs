import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

import { loadOgFonts, ogEyebrowFor, OG_COLORS as C } from '@/lib/og'

/**
 * Per-page OG card — Instrument Grade (PR-F). Band world pinned: flat
 * #0F0E0C field inside a hairline frame with machinist corner ticks
 * (FigureFrame grammar), mono uppercase section eyebrow behind a coral
 * port-dot (the ONE signal mark), Geist 600 title, hairline footer row with
 * the wordmark and domain. No gradients, no glow.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Documentation'
  const section = searchParams.get('section')
  const eyebrow = ogEyebrowFor(section)

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
          {/* Section eyebrow — coral port-dot + mono uppercase RefCode */}
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
              {eyebrow}
            </span>
          </div>

          {/* Title — Geist 600 */}
          <div
            style={{
              marginTop: '28px',
              fontSize: title.length > 34 ? '52px' : '66px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: C.text1,
              maxWidth: '960px',
              display: 'flex',
            }}
          >
            {title}
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
      width: 1200,
      height: 630,
      fonts: (await loadOgFonts()) as unknown as NonNullable<
        ConstructorParameters<typeof ImageResponse>[1]
      >['fonts'],
    }
  )
}

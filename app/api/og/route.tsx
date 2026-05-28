import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Documentation'
  const section = searchParams.get('section') || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0A1F33 0%, #0F172A 50%, #143D66 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #3399FF, #5CADFF, #3399FF)',
          }}
        />

        {/* Section badge */}
        {section && (
          <div
            style={{
              display: 'flex',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                color: '#5CADFF',
                fontSize: '20px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {section}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? '48px' : '64px',
            fontWeight: 700,
            color: '#F8FAFC',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#3399FF',
            }}
          >
            Advizr
          </span>
          <span
            style={{
              fontSize: '20px',
              color: '#64748B',
            }}
          >
            docs.advizr.ca
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

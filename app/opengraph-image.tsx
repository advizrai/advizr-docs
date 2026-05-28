import { ImageResponse } from 'next/og'

export const alt = 'Advizr Documentation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#F8FAFC',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          Advizr Documentation
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94A3B8',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          Guides, courses, and technical reference for business owners
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
    { ...size }
  )
}

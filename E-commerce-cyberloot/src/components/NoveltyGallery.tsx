function NoveltyGallery() {
  return (
    <section style={{ background: '#1D1D1B', width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', padding: '1.5rem 0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1rem',
            alignItems: 'start'
          }}
        >
          <div style={{ 
            borderRadius: 10, 
            overflow: 'hidden', 
            background: '#0f0f0f',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <img
              src="https://picsum.photos/id/1060/800/450"
              alt="Featured gaming setup"
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '300px', 
                objectFit: 'cover', 
                display: 'block' 
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              borderRadius: 10, 
              overflow: 'hidden', 
              background: '#0f0f0f',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '140px'
            }}>
              <img
                src="https://picsum.photos/id/1050/400/300"
                alt="Action figure on desk"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '140px', 
                  objectFit: 'cover', 
                  display: 'block' 
                }}
              />
            </div>
            <div style={{ 
              borderRadius: 10, 
              overflow: 'hidden', 
              background: '#0f0f0f',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '140px'
            }}>
              <img
                src="https://picsum.photos/id/1040/400/300"
                alt="RGB keyboard night shot"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '140px', 
                  objectFit: 'cover', 
                  display: 'block' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NoveltyGallery



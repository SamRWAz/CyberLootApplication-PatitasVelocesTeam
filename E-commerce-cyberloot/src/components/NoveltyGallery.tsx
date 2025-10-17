function NoveltyGallery() {
  return (
    <section style={{ background: '#1D1D1B', width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', padding: '1.5rem 0' }}>
      <div className="container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 7
        }}
      >
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#0f0f0f', display: 'inline-block', margin: '0 auto', padding: 0 }}>
          <img
              src="https://picsum.photos/id/1060/800/450"
            style={{ width: 'min(100%, 420px)', height: 'auto', maxHeight: 260, objectFit: 'contain', display: 'block' }}
          />
        </div>
        <div style={{ display: 'grid', gap: 7 }}>
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#0f0f0f', display: 'inline-block', margin: '0 auto', padding: 0 }}>
            <img
                src="https://picsum.photos/id/1050/400/300"
              style={{ width: 'min(100%, 280px)', height: 'auto', maxHeight: 180, objectFit: 'contain', display: 'block' }} 
            />
          </div>
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#0f0f0f', display: 'inline-block', margin: '0 auto', padding: 0 }}>
            <img
                src="https://picsum.photos/id/1040/400/300"
              style={{ width: 'min(100%, 280px)', height: 'auto', maxHeight: 180, objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default NoveltyGallery



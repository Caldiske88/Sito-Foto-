import { useEffect, useState } from 'react';

export default function PhotoWall() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data.photos || []);
      setLoading(false);
    }
    fetchPhotos();
    // Aggiorna ogni 10 secondi la lista foto visibili
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{maxWidth: 800, margin: 'auto'}}>
      <h2>Photowall</h2>
      {loading ? (
        <p>Caricamento foto…</p>
      ) : photos.length === 0 ? (
        <p>Nessuna foto visibile in questo momento.</p>
      ) : (
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20}}>
          {photos.map(photo => (
            <div key={photo._id} style={{background: "#fff", borderRadius: 10, padding: 12, boxShadow: "0 2px 8px #0001", textAlign: "center"}}>
              <img src={photo.url} alt="" style={{width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 7, marginBottom: 8}} />
              <div style={{fontSize: 13, color: "#555"}}>
                Visibile fino a:<br />
                <b>{new Date(photo.visibleUntil).toLocaleString()}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

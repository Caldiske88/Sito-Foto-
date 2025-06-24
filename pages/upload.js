import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [minutes, setMinutes] = useState(5);
  const [message, setMessage] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    setMessage('Caricamento in corso...');
    if (!file) {
      setMessage('Seleziona una foto!');
      return;
    }
    // Converti l'immagine in base64
    const reader = new FileReader();
    reader.onload = async function(ev) {
      const imageBase64 = ev.target.result.split(',')[1];
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, displayTimeMinutes: minutes })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Foto caricata! Ora sarà visibile nel Photowall per ' + minutes + ' minuti.');
        setFile(null);
      } else {
        setMessage('Errore: ' + (data.error || 'riprovare'));
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{maxWidth: 400, margin: '30px auto', background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #0001'}}>
      <h2>Carica una Foto Anonima</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{marginBottom: 10}} /><br />
        <label>
          Tempo di visualizzazione (minuti, da 1 a 30):<br />
          <input type="number" value={minutes} min={1} max={30} onChange={e => setMinutes(e.target.value)} required style={{width: 60, marginTop: 4, marginBottom: 12}} />
        </label><br />
        <button type="submit" style={{padding: '8px 18px', fontSize: 16, cursor: 'pointer'}}>Carica foto</button>
      </form>
      {message && <div style={{marginTop: 18, color: message.startsWith('Errore') ? 'red' : 'green'}}>{message}</div>}
    </div>
  );
}

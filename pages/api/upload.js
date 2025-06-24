import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'fotoanonime';

// Funzione per caricare la foto su ImgBB e restituire l'URL diretto
async function uploadToImgbb(imageBase64) {
  const apiKey = process.env.IMGBB_API_KEY;
  const formData = new URLSearchParams();
  formData.append('key', apiKey);
  formData.append('image', imageBase64);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error('Caricamento ImgBB fallito.');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { imageBase64, displayTimeMinutes } = req.body;
      if (!imageBase64 || !displayTimeMinutes) {
        return res.status(400).json({ error: "Dati mancanti" });
      }
      // Limita il tempo tra 1 e 30 minuti.
      const minutes = Math.max(1, Math.min(30, parseInt(displayTimeMinutes)));
      // Carica su ImgBB
      const url = await uploadToImgbb(imageBase64);

      // Calcola l'ora di scadenza
      const now = new Date();
      const visibleUntil = new Date(now.getTime() + minutes * 60000);

      // Salva nel database
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('photos');
      await collection.insertOne({
        url,
        uploadTime: now,
        visibleUntil,
        displayTimeMinutes: minutes
      });
      await client.close();

      res.status(200).json({ success: true, url, visibleUntil });
    } catch (e) {
      res.status(500).json({ error: e.message || 'Errore upload' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}

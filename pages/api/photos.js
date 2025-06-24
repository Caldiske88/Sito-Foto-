import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'fotoanonime';

async function getPhotos() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('photos');
  const now = new Date();
  // Mostra solo quelle non scadute
  const photos = await collection.find({ visibleUntil: { $gte: now } })
    .sort({ uploadTime: -1 })
    .toArray();
  await client.close();
  return photos;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const photos = await getPhotos();
      res.status(200).json({ photos });
    } catch (e) {
      res.status(500).json({ error: 'Errore nel recupero delle foto' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}

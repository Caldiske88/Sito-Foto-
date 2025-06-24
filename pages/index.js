import Link from 'next/link';
import PhotoWall from '../components/PhotoWall';

export default function Home() {
  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Sito Web Foto Anonime</h1>
      <div style={{ display:'flex', justifyContent: 'center', margin: 16 }}>
        <Link href="/upload">
          <button style={{
            background: '#185cff',
            color: '#fff',
            border: 0,
            borderRadius: 6,
            padding: '10px 24px',
            fontSize: 18,
            cursor: 'pointer',
            boxShadow:'0 1px 6px #0001'
          }}>
            Carica Foto
          </button>
        </Link>
      </div>
      <PhotoWall />
    </div>
  );
}

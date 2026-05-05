import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl font-extrabold bg-hero-gradient bg-clip-text text-transparent">404</div>
      <h1 className="mt-4 text-2xl font-bold">העמוד לא נמצא</h1>
      <p className="mt-2 text-ink-500">בדקו את הכתובת או חזרו לדף הבית</p>
      <Link to="/" className="mt-6 btn-primary btn-md">חזרה לבית</Link>
    </div>
  );
}

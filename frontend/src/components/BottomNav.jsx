import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/90 dark:bg-surface-container-high/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(26,46,26,0.05)]">
      <Link to="/" className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 py-1.5 transition-all duration-300 scale-95">
        <span className="material-symbols-outlined" data-icon="home">home</span>
        <span className="font-label-caps text-[10px] uppercase">Home</span>
      </Link>
      <Link to="/results" className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/60 px-4 py-1.5 transition-all duration-300">
        <span className="material-symbols-outlined" data-icon="center_focus_strong">center_focus_strong</span>
        <span className="font-label-caps text-[10px] uppercase">Scan</span>
      </Link>
      <div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/60 px-4 py-1.5 transition-all duration-300">
        <span className="material-symbols-outlined" data-icon="potted_plant">potted_plant</span>
        <span className="font-label-caps text-[10px] uppercase">Library</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/60 px-4 py-1.5 transition-all duration-300">
        <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
        <span className="font-label-caps text-[10px] uppercase">Expert</span>
      </div>
    </nav>
  );
}

import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_30px_rgb(26,46,26,0.08)]">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link to="/" className="flex flex-col hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="eco">eco</span>
            <h1 className="font-h2 text-h2 font-semibold text-primary dark:text-primary-fixed">CropGuard AI</h1>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">Disease Detection System</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6 items-center">
            <Link to="/" className="font-label-caps text-label-caps text-primary dark:text-primary-fixed border-b-2 border-secondary transition-all duration-200">Home</Link>
            <Link to="/results" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant/70 hover:text-secondary transition-colors duration-300">Scan</Link>
            <a href="#" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant/70 hover:text-secondary transition-colors duration-300">Library</a>
            <a href="#" className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant/70 hover:text-secondary transition-colors duration-300">Expert</a>
          </nav>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-secondary/10">
            <span className="material-symbols-outlined text-[16px]" data-icon="auto_awesome">auto_awesome</span>
            <span className="font-label-caps text-[10px]">Powered by Local AI</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" data-icon="account_circle">account_circle</span>
        </div>
        {/* Mobile UI Indicator */}
        <div className="md:hidden">
          <span className="material-symbols-outlined text-primary" data-icon="menu">menu</span>
        </div>
      </div>
    </header>
  );
}

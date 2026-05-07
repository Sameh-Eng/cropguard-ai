import { Link, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Results() {
  const location = useLocation();
  const { data, image } = location.state || {};

  // If no data is available (e.g. user navigated directly to /results), redirect to home
  if (!data) {
    return <Navigate to="/" replace />;
  }

  // Determine colors based on status or urgency
  const isHealthy = data.status && data.status.toLowerCase() === 'healthy';
  const statusColorClass = isHealthy ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error';
  const urgencyColorClass = data.urgency && data.urgency.toLowerCase() === 'immediate' ? 'text-error' : 'text-primary';

  return (
    <>
      <Header />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 pb-32">
        {/* Analysis Hero Section */}
        <section className="relative rounded-xl overflow-hidden bg-primary-container text-on-primary mb-12 shadow-[0_8px_30px_rgb(26,46,26,0.08)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {image && <img alt="Analyzed plant detail" className="w-full h-full object-cover" src={image}/>}
          </div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-secondary-fixed-dim font-label-caps tracking-widest bg-white/10 px-3 py-1 rounded-full">{data.cropType || 'Unknown Crop'}</span>
                <span className={`${statusColorClass} font-label-caps px-3 py-1 rounded-full uppercase text-[10px]`}>{data.status || 'Analyzed'}</span>
              </div>
              <h1 className="font-h1 text-h1 text-white italic">{data.diseaseName || 'Analysis Complete'}</h1>
              {data.cause && <p className="text-primary-fixed opacity-90 max-w-xl font-body-lg">{data.cause}</p>}
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <button className="bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300">
                <span className="material-symbols-outlined" data-icon="ios_share">ios_share</span>
                Share Report
              </button>
            </div>
          </div>
        </section>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined" data-icon="warning">warning</span>
              <h3 className="font-label-caps">Severity</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-h2 text-h2 text-primary">{data.severity || 'N/A'}</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
              <h3 className="font-label-caps">Affected Area</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-h2 text-h2 text-primary">{data.affectedArea || 'N/A'}</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined" data-icon="alarm">alarm</span>
              <h3 className="font-label-caps">Urgency</h3>
            </div>
            <div className={`flex items-baseline gap-2 ${urgencyColorClass}`}>
              <span className="font-h2 text-h2">{data.urgency || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Diagnosis & Treatment */}
          <div className="lg:col-span-8 space-y-12">
            {/* Confidence Bar */}
            <div className="bg-white p-8 rounded-xl border border-outline-variant/20 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-h3 text-h3 text-primary">AI Confidence Score</h3>
                <span className="font-bold text-secondary text-xl">{data.confidence || 0}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-tertiary-fixed-dim rounded-full"
                  style={{ width: `${data.confidence || 0}%` }}
                ></div>
              </div>
              <p className="mt-4 text-on-surface-variant text-sm italic">Analysis verified against the CropGuard AI model.</p>
            </div>

            {/* Diagnosis */}
            {data.diagnosis && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] bg-secondary"></span>
                  <h2 className="font-h2 text-h2">Detailed Diagnosis</h2>
                </div>
                <div className="bg-white p-8 rounded-xl border border-outline-variant/20 shadow-sm prose prose-slate max-w-none">
                  <p className="font-body-lg text-on-surface-variant italic leading-relaxed">
                    "{data.diagnosis}"
                  </p>
                </div>
              </section>
            )}

            {/* Treatment */}
            {!isHealthy && data.treatments && data.treatments.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] bg-secondary"></span>
                  <h2 className="font-h2 text-h2">Treatment Plan</h2>
                </div>
                <div className="space-y-4">
                  {data.treatments.map((treatment, index) => (
                    <div key={index} className="flex gap-6 bg-surface-container-low p-6 rounded-lg border-l-4 border-secondary shadow-sm">
                      <span className="font-h2 text-primary opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
                      <div>
                        <p className="text-on-surface-variant">{treatment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Prevention */}
            {data.prevention && (
              <div className="bg-primary-container text-on-primary p-8 rounded-xl shadow-xl">
                <h3 className="font-h3 text-h3 mb-6 border-b border-white/10 pb-4">Prevention Strategy</h3>
                <p className="text-sm opacity-90 leading-relaxed">{data.prevention}</p>
              </div>
            )}

            {/* Expert Contact */}
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-3xl" data-icon="psychology">psychology</span>
              </div>
              <h4 className="font-h3 text-h3 mb-2">Need an Expert?</h4>
              <p className="text-on-surface-variant text-sm mb-6">Schedule a virtual consultation for a secondary verification.</p>
              <button className="w-full py-3 border-2 border-secondary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-white transition-all duration-300">
                Request Expert Review
              </button>
            </div>

            {/* Ghost Action Button */}
            <Link to="/" className="w-full flex items-center justify-center gap-3 py-6 text-on-surface-variant font-label-caps tracking-widest border-2 border-dashed border-outline-variant hover:border-secondary hover:text-secondary transition-all rounded-xl group">
              <span className="material-symbols-outlined group-hover:-translate-y-1 transition-transform" data-icon="upload">upload</span>
              Analyze Another Crop
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
      
      {/* Navigation Drawer (Desktop/Side Anchor) */}
      <aside className="hidden xl:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-surface border-r border-outline-variant/10 z-40">
        <div className="flex flex-col gap-10 items-center">
          <Link to="/">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="eco">eco</span>
          </Link>
          <nav className="flex flex-col gap-6">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer" data-icon="dashboard">dashboard</span>
            <span className="material-symbols-outlined text-secondary font-bold" data-icon="history" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer" data-icon="menu_book">menu_book</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer" data-icon="map">map</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer" data-icon="settings">settings</span>
          </nav>
        </div>
      </aside>
    </>
  );
}

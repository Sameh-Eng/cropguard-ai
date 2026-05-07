import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload a plant photo first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        navigate('/results', { state: { data: result.data, image: selectedImage } });
      } else {
        alert("Analysis failed: " + result.error);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to connect to the analysis server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary font-label-caps text-label-caps px-4 py-1.5 rounded-full mb-6 border border-secondary/20">
            <span className="material-symbols-outlined text-[14px]" data-icon="bolt" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            AI-Powered Analysis
          </div>
          <h2 className="font-h1 text-h1 text-on-surface mb-6 max-w-3xl mx-auto">
            Identify Crop Diseases <i className="text-secondary font-normal">Instantly.</i>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Upload a photo of your plant leaves to receive a scientific-grade diagnosis, treatment recommendations, and localized severity impact within seconds.
          </p>
        </section>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Features */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_30px_rgb(26,46,26,0.04)] border border-outline-variant/30 hover:translate-y-[-4px] transition-transform duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl" data-icon="microscope">magnification_small</span>
              </div>
              <h3 className="font-h3 text-h3 mb-2">Instant Diagnosis</h3>
              <p className="text-on-surface-variant font-body-md">Advanced computer vision identifies over 400 common agricultural pathogens and nutrient deficiencies.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_30px_rgb(26,46,26,0.04)] border border-outline-variant/30 hover:translate-y-[-4px] transition-transform duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-secondary/5 flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-secondary text-2xl" data-icon="medical_services">medical_services</span>
              </div>
              <h3 className="font-h3 text-h3 mb-2">Treatment Plans</h3>
              <p className="text-on-surface-variant font-body-md">Get organic and chemical-based remedial suggestions tailored to your specific crop variety and climate.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_30px_rgb(26,46,26,0.04)] border border-outline-variant/30 hover:translate-y-[-4px] transition-transform duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/10 flex items-center justify-center mb-4 group-hover:bg-tertiary-fixed/20 transition-colors">
                <span className="material-symbols-outlined text-tertiary text-2xl" data-icon="analytics">analytics</span>
              </div>
              <h3 className="font-h3 text-h3 mb-2">Severity Rating</h3>
              <p className="text-on-surface-variant font-body-md">Understand the exact risk level and predicted yield impact based on current disease progression.</p>
            </div>
          </div>

          {/* Right Side: Upload Canvas */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(26,46,26,0.08)] p-4 md:p-8 border border-outline-variant/40">
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <div 
                className="relative w-full aspect-video md:aspect-[16/9] rounded-xl border-2 border-dashed border-secondary/40 bg-surface-container-low flex flex-col items-center justify-center gap-4 transition-all hover:bg-surface-container group cursor-pointer overflow-hidden"
                onClick={handleContainerClick}
              >
                {selectedImage ? (
                  <div className="absolute inset-0">
                    <img className="w-full h-full object-cover" alt="Uploaded plant" src={selectedImage} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white text-primary px-4 py-2 rounded-full font-label-caps">Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      {/* Optional default background texture could go here */}
                    </div>
                    <div className="z-10 flex flex-col items-center text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-3xl" data-icon="photo_camera">photo_camera</span>
                      </div>
                      <h4 className="font-h3 text-h3 text-primary mb-2">Drop your plant photo here</h4>
                      <p className="font-body-md text-on-surface-variant mb-6">Supports JPEG, PNG and HEIC up to 20MB</p>
                      <button className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-label-caps tracking-wide hover:bg-secondary-container hover:text-on-secondary-container transition-all shadow-lg active:scale-95 pointer-events-none">
                        Choose Photo
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-8">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`w-full bg-primary-container text-on-primary-fixed py-5 rounded-xl font-h3 text-h3 flex items-center justify-center gap-3 transition-colors group shadow-xl cursor-pointer ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary'}`}>
                  {isAnalyzing ? (
                    <>
                      <span className="material-symbols-outlined text-primary-fixed animate-spin" data-icon="autorenew">autorenew</span>
                      Analyzing Crop Health...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary-fixed group-hover:rotate-12 transition-transform" data-icon="search">search</span>
                      Analyze Crop Health
                    </>
                  )}
                </button>
              </div>

              {/* Trust Bar */}
              <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]" data-icon="verified_user">verified_user</span>
                  <span className="font-label-caps">98.2% Precision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]" data-icon="local_florist">local_florist</span>
                  <span className="font-label-caps">Botany Experts Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]" data-icon="security">security</span>
                  <span className="font-label-caps">Private Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      
      <BottomNav />

      {/* Background Subtle Textures */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary-fixed/20 blur-[100px]"></div>
      </div>
    </>
  );
}

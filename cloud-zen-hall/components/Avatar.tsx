import React, { useState, useEffect, useRef } from 'react';

interface AvatarProps {
  isTalking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isTalking }) => {
  // Primary: A high-quality Golden Buddha Image
  // Using a vertical/portrait friendly image if possible, but this one works well cropped
  const defaultImage = "https://img.freepik.com/premium-photo/golden-buddha-statue-meditation-with-glowing-aura_124507-44263.jpg";
  // Backup
  const backupImage = "https://images.unsplash.com/photo-1620389709822-53314a493d77?auto=format&fit=crop&w=600&h=800&q=80";

  const [imgSrc, setImgSrc] = useState(defaultImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom avatar from local storage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('custom_avatar');
    if (savedAvatar) {
      setImgSrc(savedAvatar);
    }
  }, []);

  const handleError = () => {
    // If the current image fails and it's not already the backup, switch to backup
    if (imgSrc !== backupImage && !imgSrc.startsWith('data:')) {
      setImgSrc(backupImage);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImgSrc(result);
        try {
            // Attempt to save to local storage
            localStorage.setItem('custom_avatar', result);
        } catch (err) {
            console.warn("Image too large to save to local storage", err);
            alert("您选择的图片较大，仅在本次会话生效，无法保存到下次访问。");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex flex-col items-center justify-end z-10 mt-4 mb-0 group w-full max-w-3xl mx-auto h-[40vh] min-h-[250px]">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Background Aura/Glow Effects - Adjusted for larger size */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-400 opacity-10 blur-3xl animate-pulse pointer-events-none`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-buddha-gold opacity-20 blur-2xl transition-opacity duration-1000 ${isTalking ? 'opacity-40 scale-105' : 'opacity-20 scale-100'} pointer-events-none`}></div>

      {/* Main Avatar Container with Edge Blending */}
      <div 
        className={`relative w-full h-full transition-transform duration-700 ease-in-out ${isTalking ? 'scale-[1.01]' : 'scale-100'}`}
        style={{
            // Softened mask to show more of the image while keeping edges faded
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
        }}
      >
         <img 
            src={imgSrc}
            alt="Golden Buddha Avatar" 
            onError={handleError}
            // Using object-contain to ensure full 16:9 image is visible
            className="w-full h-full object-contain object-center opacity-90 brightness-110 sepia-[0.1]"
         />
         
         {/* Interactive Overlay for Upload (Visible on Hover) */}
         <button 
            onClick={triggerFileInput}
            className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20"
            style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)' }}
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white mb-2 drop-shadow-lg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span className="text-white text-sm font-serif tracking-widest drop-shadow-md">更换法相</span>
         </button>
      </div>
    </div>
  );
};

export default Avatar;
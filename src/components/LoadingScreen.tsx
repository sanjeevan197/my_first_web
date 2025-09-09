import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vata via-pitta to-kapha flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 animate-pulse-glow">
          <img src="/nadi-icon.svg" alt="Nadi Pariksha" className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Nadi Pariksha</h1>
        <p className="text-white/80">Loading...</p>
      </div>
    </div>
  );
};
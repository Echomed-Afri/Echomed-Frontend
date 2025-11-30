import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Language } from '../../types';
import { t } from '../../utils/translations';

export default function SplashScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLanguageSelect = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'tw' as Language, name: 'Twi' },
    { code: 'ee' as Language, name: 'Ewe' },
    { code: 'ga' as Language, name: 'Ga' },
    { code: 'ha' as Language, name: 'Hausa' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-24 h-24 mx-auto"
          >
            <Stethoscope className="w-24 h-24 text-white/20" />
          </motion.div>
          <Heart className="w-24 h-24 text-white mx-auto relative z-10" />
        </div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {t('appName', state.currentLanguage)}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/90 text-lg"
        >
          Healthcare for Everyone
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <h2 className="text-white text-center mb-4 font-semibold">Select Language</h2>
        <div className="space-y-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                state.currentLanguage === lang.code
                  ? 'bg-white text-emerald-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="font-medium">{lang.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 flex space-x-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-white/60 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
}
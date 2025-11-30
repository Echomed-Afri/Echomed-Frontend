import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Video, CreditCard, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

const onboardingSlides = [
  {
    icon: Video,
    titleKey: 'onboarding1',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    icon: CreditCard,
    titleKey: 'onboarding2',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    icon: Mic,
    titleKey: 'onboarding3',
    image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function OnboardingScreen() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-sm w-full"
          >
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={onboardingSlides[currentSlide].image}
                  alt="Onboarding"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                {React.createElement(onboardingSlides[currentSlide].icon, {
                  className: "w-8 h-8 text-emerald-600"
                })}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
              {t(onboardingSlides[currentSlide].titleKey, state.currentLanguage)}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="flex space-x-2 mb-8">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-emerald-500 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full transition-all duration-200 ${
            currentSlide === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={skipToAuth}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          Skip
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors duration-200 shadow-lg"
        >
          {currentSlide === onboardingSlides.length - 1 ? (
            <span className="px-4 font-medium">{t('getStarted', state.currentLanguage)}</span>
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
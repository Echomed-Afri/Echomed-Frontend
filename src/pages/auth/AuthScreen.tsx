import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PatientLoginForm } from '../../features/auth/PatientLoginForm';
import { DoctorLoginForm } from '../../features/auth/DoctorLoginForm';
import Card from '../../components/ui/Card';

export default function AuthScreen() {
  const [isDoctorMode, setIsDoctorMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card padding="lg">
          {isDoctorMode ? (
            <DoctorLoginForm onSwitchMode={() => setIsDoctorMode(false)} />
          ) : (
            <PatientLoginForm onSwitchMode={() => setIsDoctorMode(true)} />
          )}
        </Card>
      </motion.div>
    </div>
  );
}
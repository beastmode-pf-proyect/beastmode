"use client";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  show: boolean;
  onClose: () => void;
  userName?: string;
}

const WelcomeModal = ({ show, onClose, userName }: WelcomeModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-red-900 to-red-950 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="mb-5 text-5xl">🎉</div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                ¡Bienvenido{userName ? `, ${userName}` : ''}!
              </h2>
              
              <p className="text-gray-300 mb-6">
                Estamos emocionados de tenerte en nuestra comunidad fitness.
                ¿Listo para comenzar tu viaje BeastMode?
              </p>

              <div className="flex flex-col gap-3">
                
                <button
                  onClick={onClose}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;

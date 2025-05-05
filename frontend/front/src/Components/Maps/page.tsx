"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const MapWithMarkers = dynamic(() => import("./maps"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
    </div>
  ),
});

export default function FloatingMapButton() {
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-red-700 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-all">
        <MapPin className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && isClient && (
          <motion.div
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl h-[70vh] bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#5e1914] flex flex-col">
              <div className="flex justify-between items-center px-4 py-2 bg-[#5e1914] border-b">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <h1 className="text-lg font-semibold text-white">
                    Nuestras sedes.
                  </h1>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-gray-300 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-hidden">
                <MapWithMarkers open={open} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

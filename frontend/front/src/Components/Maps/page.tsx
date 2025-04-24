"use client"
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-[70%] lg:w-[50%] z-50 bg-white shadow-2xl rounded-l-2xl overflow-hidden border-l-4 border-red-700 flex flex-col">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-600 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow px-4 pb-4 overflow-hidden">
              <MapWithMarkers open={open} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

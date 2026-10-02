import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function SOSButton({ onTrigger }) {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);
  const controls = useAnimation();

  const startHold = () => {
    setIsHolding(true);
    setCountdown(3);
    controls.start({
      scale: 0.9,
      boxShadow: "0px 0px 0px 0px rgba(220, 38, 38, 0)",
      transition: { duration: 3, ease: "linear" }
    });

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTrigger();
          setIsHolding(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsHolding(false);
    setCountdown(3);
    controls.start({
      scale: 1,
      boxShadow: "0px 0px 40px 10px rgba(220, 38, 38, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        animate={controls}
        initial={{ boxShadow: "0px 0px 40px 10px rgba(220, 38, 38, 0.4)" }}
        className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-red-600 flex flex-col items-center justify-center text-white select-none relative overflow-hidden"
      >
        {isHolding && (
          <motion.div 
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-0 left-0 w-full bg-red-800 opacity-50 pointer-events-none"
          />
        )}
        <span className="text-5xl sm:text-7xl font-black tracking-widest z-10">SOS</span>
        {isHolding ? (
          <span className="text-2xl font-bold mt-2 z-10">{countdown}s</span>
        ) : (
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-4 text-red-200 z-10 text-center px-4">
            Press & Hold
          </span>
        )}
      </motion.button>
    </div>
  );
}

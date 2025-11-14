'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Clock className="w-4 h-4" />
      <div className="font-mono text-sm">
        <span className="font-semibold">
          {time.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
        <span className="mx-2"></span>
        <span className="text-green-600 font-bold">
          {time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
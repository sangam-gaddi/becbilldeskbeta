'use client';

import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import Button from './Button';
import AnimatedTitle from './AnimatedTitle';

const generateNotifications = () => {
  const notifications = [
    { id: 1, text: 'BEC 1YEAR COLLEGE FEE LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 2, text: 'BEC 4YEAR COLLEGE FEE LINK CLOSED', status: 'Closed', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 3, text: 'HOSTEL, MESS LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 4, text: 'SEE FEES LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 5, text: 'ALL LINKS CLOSED', status: 'Closed', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 6, text: 'BEC 2YEAR COLLEGE FEE LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 7, text: 'BEC 3YEAR COLLEGE FEE LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 8, text: 'DEVELOPMENT FEE LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 9, text: 'EXAMINATION FEE LINK OPENED', status: 'Active', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
  ];
  return notifications;
};

const NotificationScroll = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(generateNotifications());
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;
    const scrollAnimation = gsap.to(scrollRef.current, {
      y: `-=${notifications.length * 120}`,
      duration: notifications.length * 3,
      ease: 'none',
      repeat: -1,
    });
    return () => scrollAnimation.kill();
  }, [notifications]);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getDotColor = (status: string) => {
    return status === 'Active' ? 'bg-green-400' : 'bg-red-400';
  };

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg border-hsla bg-black/70 backdrop-blur-xl">
      <div ref={scrollRef} className="space-y-5 p-6">
        {[...notifications, ...notifications].map((notification, index) => (
          <div key={`${notification.id}-${index}`} className="rounded-lg bg-violet-300/20 p-6 border-2 border-white/30 hover:bg-violet-300/30 transition-all backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full ${getDotColor(notification.status)} animate-pulse shadow-lg`} />
              </div>
              <p className="font-general text-lg text-white font-bold uppercase tracking-wide flex-1">{notification.text}</p>
              <TiLocationArrow className="text-white flex-shrink-0 w-6 h-6" />
            </div>
            <div className="flex items-center justify-between pl-8">
              <p className="font-circular-web text-sm text-white/80 font-medium">{notification.timestamp}</p>
              <div className={`px-3 py-1 rounded-full border ${getStatusColor(notification.status)}`}>
                <span className="font-general text-xs uppercase font-semibold">{notification.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
};

const Story = ({ onFeeStructureClick }: { onFeeStructureClick?: () => void }) => {
  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50 py-20">
      <div className="container mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="font-general text-sm uppercase md:text-[10px] mb-5">Live Payment Updates</p>
          <AnimatedTitle title="ongo<b>i</b>ng <br /> notificati<b>o</b>ns" containerClass="mb-8" />
          <p className="max-w-2xl mx-auto font-circular-web text-lg text-violet-50 opacity-70">
            Stay updated with real-time fee payment notifications. Track deadlines, payment windows, and important announcements all in one place.
          </p>
        </div>
        <div className="max-w-5xl mx-auto mb-16">
          <NotificationScroll />
        </div>
        <div className="flex justify-center">
          <Button id="fee-structure-btn" title="Fee Structures" containerClass="bg-yellow-300" onClick={onFeeStructureClick} />
        </div>
      </div>
    </div>
  );
};

export default Story;
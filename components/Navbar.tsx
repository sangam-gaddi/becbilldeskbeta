'use client';

import clsx from 'clsx';
import gsap from 'gsap';
import { useWindowScroll } from 'react-use';
import { useEffect, useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import Button from './Button';

const navItems = [
  { name: 'Payment Methods', id: 'features' },
  { name: 'Fee Structure', id: 'fee-structure' },
  { name: 'Login', id: 'about' },
  { name: 'Contact', id: 'contact' },
];

const Navbar = ({ onFeeStructureClick }: { onFeeStructureClick?: () => void }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const { y: currentScrollY } = useWindowScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current?.play();
    } else {
      audioElementRef.current?.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      navContainerRef.current?.classList.remove('floating-nav');
    } else {
      navContainerRef.current?.classList.add('floating-nav');
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  const handleNavClick = (item: any) => {
    if (item.name === 'Fee Structure' && onFeeStructureClick) {
      onFeeStructureClick();
    } else if (item.id) {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={navContainerRef} className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Button
              id="notification-button"
              title="Notifications"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              onClick={() => {
                const storySection = document.getElementById('story');
                if (storySection) {
                  storySection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>

          <div className="flex h-full items-center gap-7">
            <div className="hidden md:flex items-center">
              {navItems.map((item, index) => (
                <button key={index} onClick={() => handleNavClick(item)} className="nav-hover-btn">
                  {item.name}
                </button>
              ))}
            </div>

            <button onClick={toggleAudioIndicator} className="flex items-center space-x-0.5">
              <audio ref={audioElementRef} className="hidden" src="/audio/loop.mp3" loop />
              {[1, 2, 3, 4].map((bar) => (
                <div key={bar} className={clsx('indicator-line', { active: isIndicatorActive })} style={{ animationDelay: `${bar * 0.1}s` }} />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
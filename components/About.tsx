'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import AnimatedTitle from './AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: '#clip',
        start: 'center center',
        end: '+=800 center',
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to('.mask-clip-path', {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
    });

    clipAnimation.to(
      '.login-form-container',
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
      },
      0
    );
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to BecBillDESK
        </p>

        <AnimatedTitle
          title="l<b>o</b>gin to the world's <br /> largest shared p<b>a</b>yment"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>please, remember your USN registered with your account</p>
          <p className="text-gray-500">
            use LTE+ network for fast & seamless transactions...
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="/img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
          
          <div className="login-form-container absolute inset-0 flex items-center justify-center">
            <div className="login-card w-full max-w-md mx-4">
              <div className="space-y-6 text-center">
                <a 
                  href="/login"
                  className="block w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                >
                  Login to Continue
                </a>
                <p className="text-sm text-white/80">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/signup"
                    className="text-green-400 font-semibold hover:underline"
                  >
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
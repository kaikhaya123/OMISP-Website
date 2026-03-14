'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import microsoftLogo from '@/assets/microsoft-logo.png';

const Footer = () => {
  return (
    <footer
      className='footer-bg relative border h-fit w-[95%] mx-auto mb-8 rounded-lg overflow-hidden radial-gradient-bg font-tanker
                   [--gradient-center:#f3f4f6] [--gradient-edge:#f3f4f6]
                   dark:[--gradient-center:#02081765] dark:[--gradient-edge:#020817]'
    >
      <div className='gap-10 lg:flex justify-between p-5 2xl:py-10 py-5 dark:bg-black bg-black rounded-xs rounded-b-none text-white'>
        <div className='w-fit flex-col flex justify-center'>
          <div className='2xl:w-24 2xl:h-24 w-20 h-20 ml-3 bg-white rounded-xs before:absolute relative before:w-full before:h-full before:bg-white/50 before:rounded-md before:-top-3 before:-left-3'>
            <img src="/logo/Omisp.png" alt="OMISP" className="w-full h-full object-contain p-2" />
          </div>
          <article className='py-2 2xl:w-80 w-64 space-y-3'>
            <h1 className='newFont text-3xl font-bold text-white'>OMISP</h1>
            <p className='text-sm leading-[120%] text-gray-300'>
              One Move. Infinite Power. Empowering founders with AI-driven tools for pitching, 
              validation, and growth. Building the future of entrepreneurship, one startup at a time.
            </p>
            {/* Microsoft Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg">
              <img src={microsoftLogo.src} alt="Microsoft" className="w-5 h-5 object-contain" />
              <div className="text-left">
                <p className="text-xs font-medium text-white">Microsoft for Startups</p>
                <p className="text-[10px] text-gray-300">Founders Hub Member</p>
              </div>
            </div>
          </article>
        </div>

        {/* Navigation Links */}
        <div className='flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 my-6 lg:my-0 lg:mx-8'>
          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/capital" className="hover:text-white transition-colors">OMISP Capital</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Features</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/omi-chat" className="hover:text-white transition-colors">Omi Chat</Link></li>
              <li><Link to="/pitch-gauntlet" className="hover:text-white transition-colors">Pitch Gauntlet</Link></li>
              <li><Link to="/revenue-architect" className="hover:text-white transition-colors">Revenue Architect</Link></li>
              <li><Link to="/ideaverse" className="hover:text-white transition-colors">Ideaverse Hub</Link></li>
              <li><Link to="/build-a-biz" className="hover:text-white transition-colors">Build-a-Biz Game</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className='sm:block flex sm:mt-0 mt-4 gap-2 sm:w-auto w-full sm:space-y-2 relative z-1'>
          <a
            href='https://twitter.com/omisp'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-gray-100 sm:w-auto w-full grid place-content-center 2xl:h-40 h-32 2xl:p-10 p-5 rounded-lg hover:bg-gray-200 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='70'
              height='62'
              viewBox='0 0 70 62'
              fill='none'
              className='sm:w-24 w-full text-black'
            >
              <path
                d='M55.1291 0H65.8629L42.4127 26.2626L70 62H48.3994L31.481 40.3254L12.1226 62H1.38228L26.4646 33.9092L0 0H22.149L37.4417 19.8114L55.1291 0ZM51.3619 55.7046H57.3096L18.9172 5.96472H12.5347L51.3619 55.7046Z'
                fill='currentColor'
              ></path>
            </svg>
          </a>
          <a
            href='https://tiktok.com/@omisp'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-gray-100 sm:w-auto w-full grid place-content-center 2xl:h-40 h-32 2xl:p-10 p-5 rounded-lg hover:bg-gray-200 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='100%'
              height='100%'
              viewBox='0 0 24 24'
              fill='none'
              className='sm:w-24 w-full text-black'
            >
              <path
                d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
                fill='currentColor'
              ></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Section with Copyright */}
      <div className="px-8 pb-6 pt-4 border-t border-gray-200 bg-white mx-5 rounded-xs">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-black text-sm">
            © {new Date().getFullYear()} OMISP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import {
  IoFastFoodOutline,
  IoFastFoodSharp,
  IoHomeSharp,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoInformationCircleSharp,
} from 'react-icons/io5';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Tab() {
  const [_tabs, setTab] = useState(menuIcons);
  const [scrollUp, setScrollUp] = useState(false);

  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrollUp(prevScrollpos > currentScrollPos);
      prevScrollpos = currentScrollPos;
    };
    return () => {
      setTab(undefined);
    };
  }, []);

  const selectedTab = (iconId) => () => {
    setTab((pTabs) =>
      pTabs.map((t) => {
        t.active = false;
        if (t.id == iconId) t.active = true;
        return t;
      })
    );
  };

  return (
    <div
      className={`bg-white fixed bottom-0 w-full lg:hidden ${
        scrollUp ? 'block' : 'hidden'
      }`}
    >
      <div className='flex mx-auto w-1/2 space-x-5'>
        {_tabs.map((icon, i) => {
          return icon.href.includes('http') ? (
            <a href={icon.href} target='_blank' rel='noReferrer' key={`tab-${i}`}>
              <IconTab icon={icon} selectedTab={selectedTab} />
            </a>
          ) : (
            <Link href={icon.href} key={`tab-${i}`}>
              <a>
                <IconTab icon={icon} selectedTab={selectedTab} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const menuIcons = [
  {
    id: 1,
    iconComp: { inactive: IoHomeOutline, active: IoHomeSharp },
    name: 'Home',
    active: true,
    href: '/',
  },
  {
    id: 2,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
    href: '/',
  },
  {
    id: 3,
    iconComp: {
      inactive: IoInformationCircleOutline,
      active: IoInformationCircleSharp,
    },
    name: 'Info',
    active: false,
    href: 'https://www.cineplex.com.ec/home/',
  },
];

const IconTab = ({ icon, selectedTab }) => {
  const {
    iconComp: { inactive: IconCompIn, active: IconCompAc },
  } = icon;
  return (
    <div
      className='p-2 flex flex-col items-center justify-end'
      onClick={selectedTab(icon.id)}
    >
      {icon.active ? (
        <IconCompAc className='text-3xl' />
      ) : (
        <IconCompIn className='text-3xl' />
      )}
      <span className={`block ${icon.active ? 'font-bold' : ''}`}>
        {icon.name}
      </span>
    </div>
  );
};

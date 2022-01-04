import {
  IoFastFoodOutline,
  IoFastFoodSharp,
  IoHomeSharp,
  IoHomeOutline,
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
      <div className='grid grid-cols-4 '>
        {_tabs.map((icon, i) => {
          const {
            iconComp: { inactive: IconCompIn, active: IconCompAc },
          } = icon;
          return (
            <Link href={icon.href} key={`tab-${i}`}>
              <a>
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
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
    href: '/',
  },
  {
    id: 4,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
    href: '/',
  },
];

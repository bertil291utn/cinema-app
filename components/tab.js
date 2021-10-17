import {
  IoFastFoodOutline,
  IoFastFoodSharp,
  IoHomeSharp,
  IoHomeOutline,
} from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { refreshData } from '../utils/refresh';

export default function Tab() {
  const [_tabs, setTab] = useState(menuIcons);
  const [scrollUp, setScrollUp] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrollUp(prevScrollpos > currentScrollPos);
      prevScrollpos = currentScrollPos;
    };
  }, []);

  const selectedTab = (iconId) => () => {
    setTab((pTabs) =>
      pTabs.map((t) => {
        if (t.id == iconId) t.active = true;
        else t.active = false;
        return t;
      })
    );
    // refreshData(router);
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
            <div
              key={`tab-${i}`}
              className='p-2 flex flex-col items-center justify-end'
              onClick={selectedTab(icon.id)}
            >
              {icon.active ? (
                <IconCompAc className='text-4xl' />
              ) : (
                <IconCompIn className='text-3xl' />
              )}
              <span className={`block ${icon.active ? 'font-bold' : ''}`}>
                {icon.name}
              </span>
            </div>
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
  },
  {
    id: 2,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
  },
  {
    id: 3,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
  },
  {
    id: 4,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
  },
];

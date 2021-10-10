import { IoFastFoodOutline } from 'react-icons/io5';
import { IoFastFoodSharp } from 'react-icons/io5';
import { useState } from 'react';

export default function Footer() {
  const [_tabs, setTab] = useState(menuIcons);

  const selectedTab = (iconId) => () => {
    console.log(iconId);
    _tabs.forEach((t) => {
      t.active = false;
    });

    const index=_tabs.findIndex((t) => t.id == iconId)
    _tabs[index].active = true;
    setTab(_tabs);
    console.log(_tabs);
  };

  return (
    <div className='bg-white sticky bottom-0'>
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
              <span className={`block ${icon.active?'font-bold text-lg':''}`}>{icon.name}</span>
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
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
    active: false,
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

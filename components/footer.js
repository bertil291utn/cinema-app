import { IoFastFoodOutline } from 'react-icons/io5';
import { IoFastFoodSharp } from 'react-icons/io5';

export default function Footer() {
  const menuIcons = [
    {
      id: 1,
      iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
      name: 'Snacks',
    },
    {
      id: 2,
      iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
      name: 'Snacks',
    },
    {
      id: 3,
      iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
      name: 'Snacks',
    },
  ];
  return (
    <div className='flex flex-col justify-around sticky bottom-0'>
      <div className='w-full border-box bottom-0'>
        <div className='bg-blue-500 flex justify-around text-white w-full h-full'>
          {menuIcons.map((icon, i) => {
            const {
              iconComp: { inactive: IconComp },
            } = icon;
            return (
              <div
                key={i}
                className='below-menu-holder w-1/4 flex duration-700 justify-around'
              >
                <IconComp />
                <span className='block'>{icon.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

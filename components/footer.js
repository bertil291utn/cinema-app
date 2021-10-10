import { IoFastFoodOutline } from 'react-icons/io5';
import { IoFastFoodSharp } from 'react-icons/io5';

export default function Footer() {
  
  return (
    <div className='flex flex-col justify-around sticky bottom-0'>
      <div className='bg-white w-full bottom-0 p-3'>
        <div className='flex justify-around w-full h-full'>
          {menuIcons.map((icon, i) => {
            const {
              iconComp: { inactive: IconComp },
            } = icon;
            return (
              <div
                key={i}
                className='flex flex-col items-center'
              >
                <IconComp className='text-3xl'/>
                <span className='block'>{icon.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const menuIcons = [
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
  {
    id: 4,
    iconComp: { inactive: IoFastFoodOutline, active: IoFastFoodSharp },
    name: 'Snacks',
  },
];
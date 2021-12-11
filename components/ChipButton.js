import { useState } from 'react';

const ChipButton = ({ onClick, items }) => {
  const [_items, setItems] = useState(items);

  const selectByItem = (itemId) => () => {
    onClick(itemId);
    setItems((pItems) => pItems.map((c) => ({ ...c, active: c.id == itemId })));
  };

  return _items.map((item, i) => (
    <button
      key={`item-${i}`}
      onClick={selectByItem(item.id)}
      className={`rounded-full border border-black px-3 py-1 mr-3 mb-3 capitalize ${
        item.active ? 'bg-black text-white' : ''
      }`}
    >
      {item.name}
    </button>
  ));
};

export default ChipButton;

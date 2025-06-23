// components/ItemsTab.jsx
import React, { memo, useMemo } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { OptimizedImage } from "src/utils/imageOptimizer";

const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => {
  const isSelected = item?.key === selectedItem;
  const tooltipId = `${item?.key}-${i}`;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
      onClick={() => onSelect("item", item?.key)}
    >
      <ReactTltp variant="item" content={item} id={tooltipId} />
      <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
        <OptimizedImage
          alt={item?.name}
          width={84}
          height={84}
          src={item?.imageUrl}
          className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
          data-tooltip-id={tooltipId}
          loading="lazy"
          priority={i < 6}
          sizes="(max-width: 768px) 50vw, 84px"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
            <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
          </div>
        )}
      </div>
    </div>
  );
});

const ItemsTab = memo(({ items, selectedItem, onFilterChange }) => {
  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  return (
    <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2 max-h-[155px] md:max-h-full overflow-y-auto">
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-1 lg:gap-4">
        {filteredItems.slice(0, 50).map((item, i) => (
          <div
            key={`item-${item.key}-${i}`}
            className="w-full max-w-[50px] sm:max-w-[60px] md:max-w-[84px]"
          >
            <ItemIcon
              item={item}
              selectedItem={selectedItem}
              onSelect={onFilterChange}
              i={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default ItemsTab;

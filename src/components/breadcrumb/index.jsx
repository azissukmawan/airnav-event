import React from "react";
const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className=" rounded-md">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLastItem ? (
                <span className="text-sm text-primary font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.link} className="text-sm text-gray-600 hover:underline">
                  {item.label}
                </a>
              )}

              {!isLastItem && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

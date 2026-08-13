import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-8 md:py-10">
      <div className="flex flex-col gap-xl">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;

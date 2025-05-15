import { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

interface Page {
  id: string;
  name: string;
  imageUrl: string;
}

interface PageSwitcherProps {
  pages: Page[];
  initialPageIndex?: number;
  onPageChange?: (page: Page) => void;
}

export default function PageSwitcher({ 
  pages, 
  initialPageIndex = 0, 
  onPageChange 
}: PageSwitcherProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentPage = pages[currentPageIndex];

  const changePage = (direction: 'next' | 'prev') => {
    setIsAnimating(true);
    setTimeout(() => {
      const newIndex =
        direction === 'next'
          ? (currentPageIndex + 1) % pages.length
          : (currentPageIndex - 1 + pages.length) % pages.length;

      setCurrentPageIndex(newIndex);
      onPageChange?.(pages[newIndex]);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (pages.length === 0) {
      console.warn("No pages provided to PageSwitcher component");
    }
  }, [pages]);

  if (pages.length === 0) {
    return <div className="text-red-500">No pages provided</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 mb-4">
        <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
          <img 
            src={currentPage.imageUrl || "/api/placeholder/400/320"} 
            alt={currentPage.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Arrows animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            {['left', 'right', 'top', 'bottom'].map((position) => (
              <div
                key={position}
                className={`absolute ${
                  position === 'left' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-4' :
                  position === 'right' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-4' :
                  position === 'top' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-4' :
                  'bottom-0 left-1/2 -translate-x-1/2 translate-y-4'
                } transform`}
              >
                <div className={`rounded-full bg-gray-800 bg-opacity-70 p-2 ${isAnimating ? 'animate-spin' : ''}`}>
                  <RotateCw size={24} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button 
          onClick={() => changePage('prev')}
          disabled={isAnimating}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          aria-disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => changePage('next')}
          disabled={isAnimating}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          aria-disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">{currentPage.name}</h3>
        <p className="text-sm text-gray-500">
          {currentPageIndex + 1} / {pages.length}
        </p>
      </div>
    </div>
  );
}

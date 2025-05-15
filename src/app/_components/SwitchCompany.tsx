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
  
  const goToNextPage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const nextIndex = (currentPageIndex + 1) % pages.length;
      setCurrentPageIndex(nextIndex);
      if (onPageChange) {
        onPageChange(pages[nextIndex]);
      }
      setTimeout(() => setIsAnimating(false), 300);
    }, 500);
  };
  
  const goToPrevPage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const prevIndex = (currentPageIndex - 1 + pages.length) % pages.length;
      setCurrentPageIndex(prevIndex);
      if (onPageChange) {
        onPageChange(pages[prevIndex]);
      }
      setTimeout(() => setIsAnimating(false), 300);
    }, 500);
  };
  
  // Demo pages if none provided
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
        {/* Image Container with rounded corners */}
        <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
          <img 
            src={currentPage.imageUrl || "/api/placeholder/400/320"} 
            alt={currentPage.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated Sync Arrows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full h-full">
              {/* Left Arrow */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
                <div className={`rounded-full bg-gray-800 bg-opacity-70 p-2 ${isAnimating ? 'animate-spin' : ''}`}>
                  <RotateCw size={24} className="text-white" />
                </div>
              </div>
              
              {/* Right Arrow */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
                <div className={`rounded-full bg-gray-800 bg-opacity-70 p-2 ${isAnimating ? 'animate-spin' : ''}`}>
                  <RotateCw size={24} className="text-white" />
                </div>
              </div>
              
              {/* Top Arrow */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className={`rounded-full bg-gray-800 bg-opacity-70 p-2 ${isAnimating ? 'animate-spin' : ''}`}>
                  <RotateCw size={24} className="text-white" />
                </div>
              </div>
              
              {/* Bottom Arrow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
                <div className={`rounded-full bg-gray-800 bg-opacity-70 p-2 ${isAnimating ? 'animate-spin' : ''}`}>
                  <RotateCw size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={goToPrevPage}
          disabled={isAnimating}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={goToNextPage}
          disabled={isAnimating}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Page Name */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">{currentPage.name}</h3>
        <p className="text-sm text-gray-500">
          {currentPageIndex + 1} / {pages.length}
        </p>
      </div>
    </div>
  );
}

// Demo component with example pages
function PageSwitcherDemo() {
  const demoPages = [
    { id: '1', name: 'Dashboard', imageUrl: '/api/placeholder/400/320' },
    { id: '2', name: 'Analytics', imageUrl: '/api/placeholder/400/320' },
    { id: '3', name: 'Settings', imageUrl: '/api/placeholder/400/320' },
  ];
  
  return (
    <div className="p-8 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Page Switcher</h2>
      <PageSwitcher 
        pages={demoPages}
        onPageChange={(page) => console.log('Changed to page:', page.name)} 
      />
    </div>
  );
}

// Export the demo for preview
export { PageSwitcherDemo };

// Return the demo for immediate display
return <PageSwitcherDemo />;

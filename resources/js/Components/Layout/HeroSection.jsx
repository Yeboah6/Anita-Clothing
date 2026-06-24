import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="Elegant fashion model wearing minimalist clothing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto flex h-full items-center px-4">
        <div className="max-w-xl space-y-6 text-white">
          <h1 className="font-display text-5xl font-medium leading-tight md:text-6xl lg:text-7xl">
            Timeless
            <br />
            Elegance
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Discover our curated collection of refined essentials designed for the modern woman.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            
            <a href="/collections"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-black transition-colors hover:bg-white/90"
            >
              Explore Collections
            </a>
            
            <a  href="/collections?filter=new"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              New Arrivals
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
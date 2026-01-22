import { useState } from "react";

interface CarouselProps {
  images: {
    url: string;
    main: string;
    filename: string;
  }[];
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="group relative m-auto h-[400px] w-full max-w-[600px] px-4 py-4">
      <div
        style={{ backgroundImage: `url(${images[currentIndex].main})` }}
        className="h-full w-full rounded-2xl bg-contain bg-center bg-no-repeat duration-500"
      ></div>
      {/* Left Arrow */}
      {images.length > 1 && (
        <button onClick={prevSlide} type="button">
          <div className="absolute top-[50%] left-5 -translate-y-[-50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ❮
          </div>
        </button>
      )}
      {/* Right Arrow */}
      {images.length > 1 && (
        <button onClick={nextSlide} type="button">
          <div className="absolute top-[50%] right-5 -translate-y-[-50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ❯
          </div>
        </button>
      )}
      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center py-2">
          {images.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`mx-1 cursor-pointer text-2xl ${
                currentIndex === slideIndex ? "text-blue-500" : "text-gray-300"
              }`}
            >
              •
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

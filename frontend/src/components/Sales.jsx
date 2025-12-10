import { useState } from "react";

function Sales() {
  const [index, setIndex] = useState(0); // estado para el slide activo
  const slides = [
    "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
  ];

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-6 w-[1000px]">
      <h1 className="text-lg font-bold ">Ofertas</h1>
      <div className="carousel w-full">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`carousel-item relative w-full ${
              i === index ? "block" : "hidden"
            }`}
          >
            <img src={src} className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <button className="btn btn-circle" onClick={prevSlide}>❮</button>
              <button className="btn btn-circle" onClick={nextSlide}>❯</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sales;

import { Carousel } from "@material-tailwind/react";
 
export function CarouselCard({images}) {
  return (
    <Carousel
      className="rounded-xl w-full h-[400px] bg-gray-500"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4  z-50 flex -translate-x-2/4 gap-2 ">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl  w-full transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {images.map((i, index) => {
  return <img key={index} src={i} className="h-full w-full object-contain" />;
})
}
      
    </Carousel>
  );
}
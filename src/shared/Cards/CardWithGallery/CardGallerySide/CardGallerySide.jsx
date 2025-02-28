import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import CustomImage from "../../../ImageComponents/CustomImage";

export default function CardGallerySide({ gallery, thumbnailImage = "" }) {
  const [thumbsSwiper, setThumbsSwiper] = useState < any > null;

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} // Only pass thumbs if thumbsSwiper is set
        zoom={true}
        modules={[FreeMode, Navigation, Thumbs, Zoom]}
        className="card_gallery min-h-[170px] mt-8"
        watchSlidesProgress={true}
      >
        {gallery.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <CustomImage
              imageKey={item?.image}
              alt={"image"}
              className="h-[350px] w-full object-cover"
              width={600}
              height={500}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {gallery && gallery.length > 0 && (
        <Swiper
          onSwiper={setThumbsSwiper} // Set the thumbsSwiper instance here
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="card_gallery_thumbs"
        >
          {gallery.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              <CustomImage
                imageKey={item.image}
                alt={"thumbnail"}
                className="h-[150px] w-full object-cover"
                width={600}
                height={500}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

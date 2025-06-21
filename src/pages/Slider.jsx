import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Slider() {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const prevRef = useRef(null);
   const nextRef = useRef(null);

   useEffect(() => {
      axios
         .get("https://libraffdata-atilla.onrender.com/Slider")
         .then((res) => {
            if (Array.isArray(res.data)) {
               setData(res.data);
            } else {
               setError("Invalid data format");
            }
         })
         .catch(() => setError("Failed to load slider data"))
         .finally(() => setLoading(false));
   }, []);

   if (loading) {
      return <div className="flex justify-center items-center h-[50svh] bg-gray-100 text-gray-500">Loading...</div>;
   }

   if (error) {
      return <div className="flex justify-center items-center h-[50svh] bg-red-100 text-red-600">{error}</div>;
   }

   return (
      <div className="relative w-full h-[60svh]">
         <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation={{
               prevEl: prevRef.current,
               nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
               swiper.params.navigation.prevEl = prevRef.current;
               swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{ delay: 5500 }}
            // pagination={{ clickable: true }}
            loop
            className="w-full h-full"
         >
            {data.map((item, index) => (
               <SwiperSlide key={index}>
                  <div className="w-full h-full relative overflow-hidden">
                     <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />

                     <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20 z-10"></div>

                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
                        <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-2">{item.title}</h2>
                        <p className="text-md md:text-lg opacity-90 max-w-3xl">{item.description}</p>
                     </div>
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
}

export default Slider;

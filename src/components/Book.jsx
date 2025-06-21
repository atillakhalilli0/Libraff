import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useBookContext } from "../context/BookContext";

function Book({ id, title, author, price, image, category, subcategory, language, stockCount, sold, viewed }) {
   const { addToBasket, toggleFavorite, isFavorite } = useBookContext();

   const handleAddToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (stockCount <= 0) return;

      const bookItem = {
         id,
         title,
         author,
         price,
         image,
         category,
         subcategory,
         language,
         stockCount,
         sold,
         viewed,
      };

      addToBasket(bookItem);
   };

   const handleToggleFavorite = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const bookItem = {
         id,
         title,
         author,
         price,
         image,
         category,
         subcategory,
         language,
         stockCount,
         sold,
         viewed,
      };

      toggleFavorite(bookItem);
   };

   return (
      <Link
         to={`/book/${id}`}
         className="w-[250px] h-[600px] flex flex-col justify-between rounded-3xl p-4 border border-white/30 backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden cursor-pointer"
         style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            boxShadow: `
          inset 1px 1px 1px rgba(255,255,255,0.2),
          0 8px 32px rgba(0,0,0,0.15)
        `,
         }}
      >
         <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{
               background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
            }}
         ></div>

         <button onClick={handleToggleFavorite} className="absolute top-4 right-4 z-[20] p-2 rounded-full bg-white/20 backdrop-blur-md text-black hover:bg-white/30 transition-all duration-200">
            <Heart className={`w-5 h-5 transition-all duration-200 ${isFavorite(id) ? "fill-red-500 text-red-500 scale-110" : "hover:text-red-400"}`} />
         </button>

         <div className="flex flex-col flex-grow z-10">
            <div className="flex justify-center mb-4">
               <img className="w-[200px] h-[270px] object-cover rounded-xl border border-white/20 shadow-lg" src={image} alt={title} />
            </div>

            <div className="flex flex-col justify-between flex-grow space-y-3 text-black">
               <div>
                  <h2 className="text-lg font-bold leading-snug line-clamp-2">{title}</h2>
                  <p className="text-sm text-black mt-1">by {author}</p>
                  <p className="text-xs text-black italic mt-1 capitalize">
                     {category} / {subcategory?.join(", ")}
                  </p>
               </div>

               <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-emerald-600">${parseFloat(price).toFixed(2)}</span>
                  <span className="bg-white/20 text-xs text-black px-3 py-1 rounded-full">{stockCount > 0 ? "Stokda" : "Bitib"}</span>
               </div>

               <div className="grid grid-cols-2 gap-2 text-sm text-black p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <div className="flex gap-2">
                     <span className="font-medium">Dil:</span>
                     <span>{language?.join("/")}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-medium">Stok:</span>
                     <span>{stockCount}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-medium">Satılıb:</span>
                     <span>{sold}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="font-medium">Baxış:</span>
                     <span>{viewed}</span>
                  </div>
               </div>
            </div>

            <button onClick={handleAddToCart} disabled={stockCount <= 0} className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition">
               <ShoppingCart className="w-4 h-4" />
               <span>{stockCount > 0 ? "Səbətə əlavə et" : "Stokda yoxdur"}</span>
            </button>
         </div>
      </Link>
   );
}

export default Book;

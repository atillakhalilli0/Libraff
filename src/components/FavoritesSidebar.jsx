import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

function FavoritesSidebar({ isOpen, onClose, favorites, removeFromFavorites, addToBasket }) {
   const handleAddToBasket = (item) => {
      if (item.stockCount <= 0) return;
      addToBasket(item);
      console.log(`${item.title} favorilerden səbətə əlavə olundu`);
   };

   return (
      <>
         <div className={`fixed inset-0 z-40 ${isOpen ? "bg-black/50" : "bg-opacity-0 pointer-events-none"}`} onClick={onClose} />

         <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b bg-red-50">
               <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">❤️ Sevimlilərim</h2>
               <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl">
                  &times;
               </button>
            </div>

            {favorites.length === 0 ? (
               <div className="p-4 text-gray-500 text-center">
                  <div className="text-6xl mb-4">💔</div>
                  <p>Hələ sevimli kitabınız yoxdur.</p>
                  <p className="text-sm mt-2">Kitabların üzərindəki ♥ simvoluna basaraq əlavə edin!</p>
               </div>
            ) : (
               <div className="p-4 space-y-4 overflow-y-auto max-h-full">
                  {favorites.map((item) => (
                     <div key={item.id} className="flex gap-3 items-center border rounded-lg p-3 hover:shadow-md transition">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                           <div className="font-semibold text-sm line-clamp-2">{item.title}</div>
                           <div className="text-xs text-gray-600">by {item.author}</div>
                           <div className="text-sm text-emerald-600 font-semibold">${parseFloat(item.price).toFixed(2)}</div>
                           <div className="text-xs text-gray-500">{item.stockCount > 0 ? `Stok: ${item.stockCount}` : "Stokda yoxdur"}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                           <button onClick={() => handleAddToBasket(item)} disabled={item.stockCount <= 0} className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition" title="Səbətə əlavə et">
                              <ShoppingCart className="w-4 h-4" />
                           </button>

                           <button onClick={() => removeFromFavorites(item.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition" title="Sevimlilərdən sil">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {favorites.length > 0 && (
               <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-red-50">
                  <div className="text-center text-sm text-gray-600">Toplam {favorites.length} sevimli kitab</div>
               </div>
            )}
         </div>
      </>
   );
}

export default FavoritesSidebar;

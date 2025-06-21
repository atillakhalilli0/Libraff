import { useBookContext } from "../context/BookContext";
import { ShoppingCart, Trash2 } from "lucide-react";

function Favorites() {
   const { favorites, addToBasket, removeFromFavorites } = useBookContext();

   const handleAddToBasket = (item) => {
      if (item.stockCount <= 0) return;
      addToBasket(item);
      console.log(`${item.title} favorilerden səbətə əlavə olundu`);
   };

   return (
      <div className="max-w-4xl mx-auto px-4 pt-30 pb-8">
         <h1 className="text-3xl font-bold text-red-600 mb-6">❤️ Sevimlilərim</h1>

         {favorites.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
               <div className="text-6xl mb-4">💔</div>
               <p>Hələ sevimli kitabınız yoxdur.</p>
               <p className="text-sm mt-2">Kitabların üzərindəki ♥ simvoluna basaraq əlavə edin!</p>
            </div>
         ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {favorites.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 flex flex-col shadow hover:shadow-md transition">
                     <div className="aspect-[3/4] w-full mb-3">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                     </div>

                     <h2 className="font-semibold text-sm line-clamp-2">{item.title}</h2>
                     <p className="text-xs text-gray-600 mb-1">by {item.author}</p>
                     <p className="text-sm text-emerald-600 font-semibold mb-1">${parseFloat(item.price).toFixed(2)}</p>
                     <p className="text-xs text-gray-500 mb-3">{item.stockCount > 0 ? `Stok: ${item.stockCount}` : "Stokda yoxdur"}</p>

                     <div className="flex justify-between mt-auto gap-2">
                        <button onClick={() => handleAddToBasket(item)} disabled={item.stockCount <= 0} className="flex-1 p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition" title="Səbətə əlavə et">
                           <ShoppingCart className="w-4 h-4 mx-auto" />
                        </button>

                        <button onClick={() => removeFromFavorites(item.id)} className="flex-1 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition" title="Sevimlilərdən sil">
                           <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default Favorites;

import React from "react";
import { useBookContext } from "../context/BookContext";
import { Trash2, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function Basket() {
   const { basket, removeFromBasket, updateBasketCount } = useBookContext();

   const getTotalPrice = () => {
      return basket.reduce((total, item) => total + parseFloat(item.price) * item.count, 0).toFixed(2);
   };

   const handleDecrease = (item) => {
      if (item.count > 1) {
         updateBasketCount(item.id, item.count - 1);
      }
   };

   const handleIncrease = (item) => {
      if (item.count < item.stockCount) {
         updateBasketCount(item.id, item.count + 1);
      }
   };

   return (
      <div className="max-w-4xl mx-auto px-4 pt-30 pb-8">
         <h1 className="text-3xl font-bold text-emerald-600 mb-6">🛒 Səbətiniz</h1>

         {basket.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
               <div className="text-6xl mb-4">🧺</div>
               <p>Səbətiniz boşdur.</p>
            </div>
         ) : (
            <>
               <div className="space-y-4">
                  {basket.map((item) => (
                     <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border rounded-xl shadow p-4 hover:shadow-md transition">
                        <img src={item.image} alt={item.title} className="w-full sm:w-[100px] h-[200px] sm:h-[150px] object-cover rounded-lg" />

                        <div className="flex-1 w-full">
                           <div className="font-semibold text-base">{item.title}</div>
                           <div className="text-xs text-gray-500">by {item.author}</div>
                           <div className="text-sm font-semibold text-emerald-600 mt-1">${parseFloat(item.price).toFixed(2)}</div>

                           <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => handleDecrease(item)} className="p-1 bg-gray-200 hover:bg-gray-300 rounded" disabled={item.count <= 1}>
                                 <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.count}</span>
                              <button onClick={() => handleIncrease(item)} className="p-1 bg-gray-200 hover:bg-gray-300 rounded" disabled={item.count >= item.stockCount}>
                                 <Plus className="w-4 h-4" />
                              </button>
                           </div>
                        </div>

                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                           <button onClick={() => removeFromBasket(item.id)} className="w-full sm:min-w-[80px] p-2 bg-red-500 text-white rounded flex items-center justify-center gap-1 hover:bg-red-600 transition">
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm hidden sm:inline">Sil</span>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 border-t pt-4 text-center sm:text-right">
                  <div className="text-lg font-bold mb-2">
                     Toplam: <span className="text-emerald-600">${getTotalPrice()}</span>
                  </div>
                  <Link to="/order" className="mt-2 w-full sm:w-auto bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
                     Sifarişi tamamla
                  </Link>
               </div>
            </>
         )}
      </div>
   );
}

export default Basket;

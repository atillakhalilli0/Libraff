import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose, basket, removeFromBasket }) {
   const getTotalPrice = () => {
      return basket.reduce((total, item) => total + parseFloat(item.price) * item.count, 0).toFixed(2);
   };

   return (
      <>
         <div className={`fixed inset-0 transition-opacity duration-300 z-40 ${isOpen ? "bg-black/50" : "bg-opacity-0 pointer-events-none"}`} onClick={onClose} />

         <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
               <h2 className="text-xl font-bold">Səbətiniz</h2>
               <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl">
                  &times;
               </button>
            </div>

            {basket.length === 0 ? (
               <div className="p-4 text-gray-500 text-center">Səbətiniz boşdur.</div>
            ) : (
               <>
                  <div className="p-4 pb-20 space-y-4 overflow-y-auto max-h-[calc(100%-120px)]">
                     {basket.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center border p-2 rounded">
                           <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                           <div className="flex-1">
                              <div className="font-semibold text-sm">{item.title}</div>
                              <div className="text-xs text-gray-600">by {item.author}</div>
                              <div className="text-sm text-emerald-600">${parseFloat(item.price).toFixed(2)}</div>
                              <div className="text-xs text-gray-500">Sayı: {item.count}</div>
                           </div>
                           <button onClick={() => removeFromBasket(item.id)} className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded">
                              Sil
                           </button>
                        </div>
                     ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                     <div className="flex justify-between items-center mb-3">
                        <span className="font-bold">Toplam:</span>
                        <span className="font-bold text-emerald-600">${getTotalPrice()}</span>
                     </div>
                     <Link to="/order" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">
                        Sifarişi tamamla
                     </Link>
                  </div>
               </>
            )}
         </div>
      </>
   );
}

export default Sidebar;

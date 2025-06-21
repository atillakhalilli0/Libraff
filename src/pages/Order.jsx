import React, { useState } from "react";
import { useBookContext } from "../context/BookContext";
import { ShoppingCart, Package, Trash2, Plus, Minus, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function Order() {
   const { basket, books, updateBook, setBasket } = useBookContext();
   const [isProcessing, setIsProcessing] = useState(false);
   const [orderComplete, setOrderComplete] = useState(false);
   const [orderErrors, setOrderErrors] = useState([]);

   const updateBasketItemCount = (itemId, newCount) => {
      if (newCount < 1) {
         return;
      }

      const updatedBasket = basket.map((item) => (item.id === itemId ? { ...item, count: newCount } : item));
      setBasket(updatedBasket);
   };

   const removeFromBasket = (itemId) => {
      const updatedBasket = basket.filter((item) => item.id !== itemId);
      setBasket(updatedBasket);
   };

   const handleFinishOrder = async () => {
      setIsProcessing(true);
      setOrderErrors([]);

      const errors = [];

      for (const item of basket) {
         const book = books.find((b) => b.id === item.id);
         if (!book) {
            errors.push(`Kitab tapılmadı: ${item.title || "Naməlum"}`);
            continue;
         }

         const newStock = book.stockCount - item.count;
         const newSold = book.sold + item.count;

         if (newStock < 0) {
            errors.push(`"${book.title}" üçün kifayət qədər stok yoxdur! (Stokda: ${book.stockCount}, Tələb: ${item.count})`);
            continue;
         }

         try {
            await updateBook({ ...book, stockCount: newStock, sold: newSold });
         } catch (error) {
            errors.push(`"${book.title}" yenilənərkən xəta baş verdi`);
         }
      }

      setIsProcessing(false);

      if (errors.length > 0) {
         setOrderErrors(errors);
      } else {
         setBasket([]);
         setOrderComplete(true);
         setTimeout(() => setOrderComplete(false), 5000);
      }
   };

   const totalCount = basket.reduce((total, item) => total + item.count, 0);
   const totalPrice = basket.reduce((total, item) => {
      const book = books.find((b) => b.id === item.id);
      return total + (book?.price || 0) * item.count;
   }, 0);

   if (orderComplete) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-auto transform animate-pulse">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
               </div>
               <h2 className="text-3xl font-bold text-gray-800 mb-4">Sifariş Tamamlandı!</h2>
               <p className="text-gray-600 mb-8">Sifarişiniz uğurla emal olundu. Təşəkkür edirik!</p>
               <Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
                  Yeni Sifariş
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-red-100 pt-28 px-4 md:px-12 pb-12">
         {basket.length > 0 ? (
            <div className="max-w-6xl mx-auto space-y-8">
               <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-red-600" />
                     </div>
                     <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-red-600 bg-clip-text text-transparent">Sifariş Məlumatları</h1>
                  </div>
                  <p className="text-gray-600 text-lg">Sifarişinizi nəzərdən keçirin və tamamlayın</p>
               </div>

               {orderErrors.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                     <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 mr-3" />
                        <div>
                           <h3 className="text-lg font-medium text-red-800 mb-2">Sifariş xətaları:</h3>
                           <ul className="text-red-700 space-y-1">
                              {orderErrors.map((error, index) => (
                                 <li key={index} className="text-sm">
                                    • {error}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Seçilmiş Kitablar ({totalCount} ədəd)
                     </h2>

                     <div className="space-y-4">
                        {basket.map((item) => {
                           const book = books.find((b) => b.id === item.id);
                           if (!book) return null;

                           const isLowStock = book.stockCount < item.count;
                           const itemTotal = (book.price || 0) * item.count;

                           return (
                              <div key={item.id} className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 hover:shadow-lg ${isLowStock ? "border-red-200 bg-red-50" : "border-gray-100 hover:border-indigo-200"}`}>
                                 <div className="flex gap-6">
                                    <div className="flex-shrink-0">
                                       <img src={book.image || "https://via.placeholder.com/120x160"} alt={book.title} className="w-20 h-28 object-cover rounded-xl shadow-sm" />
                                    </div>

                                    <div className="flex-grow space-y-3">
                                       <div>
                                          <h3 className="text-xl font-semibold text-gray-800 leading-tight">{book.title}</h3>
                                          <p className="text-gray-600">Müəllif: {book.author || "Naməlum"}</p>
                                          {book.price && <p className="text-lg font-medium text-indigo-600">{book.price.toFixed(2)} AZN</p>}
                                       </div>

                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                             <span className="text-gray-700 font-medium">Say:</span>
                                             <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                <button onClick={() => updateBasketItemCount(item.id, item.count - 1)} disabled={item.count <= 1} className="w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
                                                   <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-800">{item.count}</span>
                                                <button onClick={() => updateBasketItemCount(item.id, item.count + 1)} disabled={item.count >= book.stockCount} className="w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                   <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                             </div>
                                          </div>

                                          <div className="text-right">
                                             <p className="text-sm text-gray-500">
                                                Stokda: {book.stockCount} {isLowStock && <span className="text-red-500 font-medium">(Çatışmır!)</span>}
                                             </p>
                                             {book.price && <p className="text-lg font-bold text-gray-800">{itemTotal.toFixed(2)} AZN</p>}
                                          </div>
                                       </div>
                                    </div>

                                    <button onClick={() => removeFromBasket(item.id)} className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors">
                                       <Trash2 className="w-5 h-5" />
                                    </button>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  <div className="lg:col-span-1">
                     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sticky top-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sifariş Xülasəsi</h3>

                        <div className="space-y-4 mb-6">
                           <div className="flex justify-between items-center py-3 border-b border-gray-100">
                              <span className="text-gray-700">Kitab sayı:</span>
                              <span className="font-semibold text-gray-800">{totalCount} ədəd</span>
                           </div>

                           <div className="flex justify-between items-center py-3 border-b border-gray-100">
                              <span className="text-gray-700">Cəmi məbləğ:</span>
                              <span className="text-2xl font-bold text-indigo-600">{totalPrice.toFixed(2)} AZN</span>
                           </div>
                        </div>

                        <button
                           onClick={handleFinishOrder}
                           disabled={
                              isProcessing ||
                              basket.some((item) => {
                                 const book = books.find((b) => b.id === item.id);
                                 return book && book.stockCount < item.count;
                              })
                           }
                           className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"}`}
                        >
                           {isProcessing ? (
                              <div className="flex items-center justify-center gap-3">
                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                 Emal olunur...
                              </div>
                           ) : (
                              "Sifarişi Tamamla"
                           )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">Sifarişi tamamlamaqla şərtləri qəbul etmiş olursunuz</p>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
               <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
               </div>
               <h2 className="text-3xl font-bold text-gray-800 mb-4">Səbət Boşdur</h2>
               <p className="text-gray-600 text-lg mb-8">Hələ heç bir kitab seçməmisiniz</p>
               <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Kitablara Qayıt
               </Link>
            </div>
         )}
      </div>
   );
}

export default Order;

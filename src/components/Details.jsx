import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowLeft, Eye, TrendingUp, MessageCircle, Calendar, User } from "lucide-react";
import { useBookContext } from "../context/BookContext";

function Details() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { books, addToBasket, toggleFavorite, isFavorite } = useBookContext();

   const book = books?.find((book) => book.id === parseInt(id));

   const handleAddToCart = () => {
      if (!book || book.stockCount <= 0) return;
      addToBasket(book);
      console.log(`${book.title} səbətə əlavə olundu`);
   };

   const handleToggleFavorite = () => {
      if (!book) return;
      toggleFavorite(book);
      console.log(`${book.title} ${isFavorite(book.id) ? "favorilerden çıxarıldı" : "favorilərə əlavə olundu"}`);
   };

   if (!book) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Kitab tapılmadı</h1>
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
               <ArrowLeft className="w-4 h-4" />
               Ana səhifəyə qayıt
            </button>
         </div>
      );
   }

   const bookIsFavorite = isFavorite(book.id);

   return (
      <div className="min-h-screen bg-[#ddd] pt-30 pb-20">
         <div className="max-w-6xl mx-auto px-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition">
               <ArrowLeft className="w-4 h-4" />
               Geri
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
               <div className="flex justify-center">
                  <div className="relative w-[80%] sm:w-[70%] lg:w-[75%]">
                     <img className="w-full h-[400px] md:h-[600px] object-cover rounded-2xl shadow-2xl border border-white/20" src={book.image} alt={book.title} />
                     <button onClick={handleToggleFavorite} className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition">
                        <Heart className={`w-6 h-6 ${bookIsFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 hover:text-red-400"}`} />
                     </button>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{book.title}</h1>
                     <p className="text-lg text-gray-600">by {book.author}</p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                     <span className="text-2xl font-bold text-emerald-600">${book.price}</span>
                     <span className={`px-3 py-1 rounded-full text-sm text-center w-fit ${book.stockCount > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{book.stockCount > 0 ? `${book.stockCount} stokda` : "Bitib"}</span>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
                     <h3 className="text-lg font-semibold mb-4">Kitab məlumatları</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <span className="font-medium text-gray-600">Kateqoriya:</span>
                           <p>{book.category}</p>
                        </div>
                        <div>
                           <span className="font-medium text-gray-600">Alt kateqoriya:</span>
                           <p>{book.subcategory?.join(", ") || "N/A"}</p>
                        </div>
                        <div>
                           <span className="font-medium text-gray-600">Dil:</span>
                           <p>{book.language?.join(", ") || "N/A"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <div>
                           <p className="text-sm text-gray-600">Satılıb</p>
                           <p className="text-xl font-bold text-gray-800">{book.sold || 0}</p>
                        </div>
                     </div>
                     <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                        <Eye className="w-8 h-8 text-purple-600" />
                        <div>
                           <p className="text-sm text-gray-600">Baxış</p>
                           <p className="text-xl font-bold text-gray-800">{book.viewed || 0}</p>
                        </div>
                     </div>
                  </div>

                  <button onClick={handleAddToCart} disabled={book.stockCount <= 0} className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition">
                     <ShoppingCart className="w-5 h-5" />
                     <span>{book.stockCount > 0 ? "Səbətə əlavə et" : "Stokda yoxdur"}</span>
                  </button>
               </div>
            </div>

            {book.comments && book.comments.length > 0 && (
               <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                     <MessageCircle className="w-6 h-6 text-emerald-600" />
                     <h3 className="text-2xl font-bold text-gray-800">Şərhlər ({book.comments.length})</h3>
                  </div>

                  <div className="space-y-4">
                     {book.comments.map((comment, index) => (
                        <div key={index} className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                 <User className="w-5 h-5 text-gray-600" />
                                 <span className="font-semibold text-gray-800">{comment.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                 <Calendar className="w-4 h-4" />
                                 <span>{comment.date}</span>
                              </div>
                           </div>
                           <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default Details;

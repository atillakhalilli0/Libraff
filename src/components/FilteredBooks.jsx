import React from "react";
import Book from "./Book";

function FilteredBooks({ books, addToBasket, toggleFavorite, favorites, viewMode }) {
   if (books.length === 0) {
      return (
         <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
               <h3 className="text-lg font-medium text-gray-900 mb-2">Heç bir kitab tapılmadı</h3>
               <p className="text-gray-500 mb-6">Bu kateqoriyaya uyğun kitab mövcud deyil.</p>
            </div>
         </div>
      );
   }

   return (
      <div className={viewMode === "grid" ? "flex flex-wrap justify-center sm:justify-between gap-3" : "space-y-4"}>
         {books.map((book) => (
            <Book key={book.id} {...book} addToBasket={addToBasket} toggleFavorite={toggleFavorite} isFavorite={favorites.some((fav) => fav.id === book.id)} viewMode={viewMode} />
         ))}
      </div>
   );
}

export default FilteredBooks;

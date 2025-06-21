import React from "react";
import Book from "../components/Book";
import Loader from "../components/Loader";
import Slider from "./Slider";
import Sidebar from "../components/Sidebar";
import FavoritesSidebar from "../components/FavoritesSidebar";
import { useBookContext } from "../context/BookContext";

function Home() {
   const { books, basketOpen, favoritesOpen, basket, favorites, setBasketOpen, setFavoritesOpen, addToBasket, removeFromBasket, toggleFavorite, removeFromFavorites, isFavorite } = useBookContext();

   if (!books.length) {
      return <Loader />;
   }

   return (
      <div>
         <div className="py-20">
            <Sidebar isOpen={basketOpen} onClose={() => setBasketOpen(false)} basket={basket} removeFromBasket={removeFromBasket} />
            <FavoritesSidebar isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} favorites={favorites} removeFromFavorites={removeFromFavorites} addToBasket={addToBasket} />
            <Slider />
            <div className="w-[90%] mx-auto flex gap-5 flex-wrap justify-center sm:justify-between items-center my-10">
               {books.map((item) => (
                  <Book key={item.id} {...item} addToBasket={addToBasket} toggleFavorite={toggleFavorite} isFavorite={isFavorite(item.id)} />
               ))}
            </div>
         </div>
      </div>
   );
}

export default Home;

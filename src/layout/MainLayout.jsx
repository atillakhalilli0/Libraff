import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import FavoritesSidebar from "../components/FavoritesSidebar";
import { useBookContext } from "../context/BookContext";

function MainLayout() {
   const { basketOpen, favoritesOpen, basket, favorites, setBasketOpen, setFavoritesOpen, removeFromBasket, removeFromFavorites, addToBasket } = useBookContext();

   return (
      <div className="bg-[#ddd]">
         <Navbar />

         <Sidebar isOpen={basketOpen} onClose={() => setBasketOpen(false)} basket={basket} removeFromBasket={removeFromBasket} />
         <FavoritesSidebar isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} favorites={favorites} removeFromFavorites={removeFromFavorites} addToBasket={addToBasket} />

         <Outlet />
         <Footer />
      </div>
   );
}

export default MainLayout;

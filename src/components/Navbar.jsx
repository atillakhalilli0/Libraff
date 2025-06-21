import { NavLink } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "../../img/logo.png";
import { useBookContext } from "../context/BookContext";

function Navbar() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const { basketOpen, favoritesOpen, toggleBasket, toggleFavorites, getTotalItemCount, getFavoritesCount } = useBookContext();

   const basketCount = getTotalItemCount();
   const favoritesCount = getFavoritesCount();

   const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
   };

   const closeMobileMenu = () => {
      setMobileMenuOpen(false);
   };

   return (
      <>
         <nav
            className="fixed w-full px-4 md:px-6 py-4 border-b border-white/30 shadow-lg z-40"
            style={{
               background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.02) 100%)",
               backdropFilter: "blur(16px)",
               boxShadow: `
             inset 1px 1px 0 rgba(255,255,255,0.5),
             inset -1px -1px 0 rgba(255,255,255,0.1),
             0 8px 24px rgba(0,0,0,0.08),
             0 2px 8px rgba(0,0,0,0.04)
           `,
            }}
         >
            <div
               className="absolute top-0 left-0 w-full h-full pointer-events-none"
               style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 20%, transparent 40%)",
               }}
            ></div>

            <div className="relative z-10 flex items-center justify-between">
               <div className="flex items-center space-x-2 md:space-x-8">
                  <NavLink to="/" className="flex items-center">
                     <img className="h-8 md:h-12 w-auto object-contain" src={Logo} alt="logo" />
                  </NavLink>

                  <div className="hidden md:flex items-center space-x-8">
                     <NavLink to="/" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Home
                     </NavLink>

                     <NavLink to="/slider" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Slider
                     </NavLink>

                     <NavLink to="/categories" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Kateqoriyalar
                     </NavLink>

                     <NavLink to="/favourites" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Sevimliler
                     </NavLink>

                     <NavLink to="/basket" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Sebet
                     </NavLink>

                     <NavLink to="/admin" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Admin
                     </NavLink>
                     <NavLink to="/order" className={({ isActive }) => `px-3 py-1 rounded-md font-medium transition duration-200 ${isActive ? "text-blue-700" : "text-gray-800 hover:text-blue-500"}`}>
                        Order
                     </NavLink>
                  </div>
               </div>

               <div className="flex items-center space-x-2 md:space-x-4">
                  <button onClick={toggleFavorites} className={`relative p-2 rounded-full backdrop-blur-md transition ${favoritesOpen ? "bg-red-100 text-red-600" : "bg-white/20 text-gray-800 hover:bg-white/30"}`}>
                     <Heart className={`w-5 h-5 md:w-6 md:h-6 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                     {favoritesCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-[10px] md:text-xs">{favoritesCount}</span>}
                  </button>

                  <button onClick={toggleBasket} className={`relative p-2 rounded-full backdrop-blur-md transition ${basketOpen ? "bg-emerald-100 text-emerald-600" : "bg-white/20 text-gray-800 hover:bg-white/30"}`}>
                     <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                     {basketCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-[10px] md:text-xs">{basketCount}</span>}
                  </button>

                  <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-full bg-white/20 text-gray-800 hover:bg-white/30 backdrop-blur-md transition">
                     {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
               </div>
            </div>
         </nav>

         <div className={`fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={closeMobileMenu} />

         <div
            className={`fixed top-20 left-4 right-4 z-50 md:hidden rounded-xl shadow-2xl transform transition-all duration-300 ${mobileMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"}`}
            style={{
               backdropFilter: "blur(16px)",
               background: "rgba(255,255,255,0.95)",
            }}
         >
            <div className="p-4 space-y-2">
               <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Home
               </NavLink>
               <NavLink to="/slider" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Slider
               </NavLink>
               <NavLink to="/categories" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Kateqoriyalar
               </NavLink>
               <NavLink to="/favourites" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Sevimliler
               </NavLink>
               <NavLink to="/basket" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Sebet
               </NavLink>
               <NavLink to="/admin" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition duration-200 ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"}`}>
                  Admin
               </NavLink>
            </div>
         </div>
      </>
   );
}

export default Navbar;

import React from "react";
import { Route, Routes } from "react-router-dom";
import { BookProvider } from "./context/BookContext";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Slider from "./pages/Slider";
import Details from "./components/Details";
import Category from "./pages/Category";
import Favourites from "./pages/Favourites";
import Basket from "./pages/Basket";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";
import Order from "./pages/Order";

function App() {
   return (
      <BookProvider>
         <ScrollToTop />
         <Routes>
            <Route path="/" element={<MainLayout />}>
               <Route index element={<Home />} />
               <Route path="/slider" element={<Slider />} />
               <Route path="/admin" element={<Admin />} />
               <Route path="/categories" element={<Category />} />
               <Route path="/categories/:category" element={<Category />} />
               <Route path="/categories/:category/:subcategory" element={<Category />} />
               <Route path="/favourites" element={<Favourites />} />
               <Route path="/basket" element={<Basket />} />
               <Route path="/book/:id" element={<Details />} />
               <Route path="/order" element={<Order />} />
            </Route>
         </Routes>
      </BookProvider>
   );
}

export default App;

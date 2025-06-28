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
import ScrollToTop from "./components/ScrollToTop";
import Order from "./pages/Order";
import PrivateRoute from "./layout/privateRoute";
import Admin from "./pages/Admin";

function App() {
   return (
      <BookProvider>
         <ScrollToTop />
         <Routes>
            <Route path="/" element={<MainLayout />}>
               <Route index element={<Home />} />
               <Route path="/slider" element={<Slider />} />
               <Route path="/categories" element={<Category />} />
               <Route path="/categories/:category" element={<Category />} />
               <Route path="/categories/:category/:subcategory" element={<Category />} />
               <Route path="/favourites" element={<Favourites />} />
               <Route path="/basket" element={<Basket />} />
               <Route path="/book/:id" element={<Details />} />
               <Route path="/order" element={<Order />} />
            </Route>

            <Route
               path="/admin"
               element={
                  <PrivateRoute>
                     <Admin />
                  </PrivateRoute>
               }
            />
         </Routes>
      </BookProvider>
   );
}

export default App;

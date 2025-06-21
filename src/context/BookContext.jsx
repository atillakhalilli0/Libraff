/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://libraffdata-atilla.onrender.com/kitablar";

export const BookProvider = ({ children }) => {
   const [books, setBooks] = useState([]);
   const [basket, setBasket] = useState([]);
   const [favorites, setFavorites] = useState([]);
   const [basketOpen, setBasketOpen] = useState(false);
   const [favoritesOpen, setFavoritesOpen] = useState(false);

   useEffect(() => {
      async function fetchBooks() {
         try {
            const res = await fetch(`${BASE_URL}`);
            if (!res.ok) throw new Error("API ilə problem yarandı!");
            const data = await res.json();
            setBooks(Array.isArray(data) ? data : []);
         } catch (error) {
            console.error(`Kitabları yükləmə xətası: ${error.message}`);
            setBooks([]);
         }
      }
      fetchBooks();
   }, []);

   useEffect(() => {
      try {
         const savedBasket = localStorage.getItem("basket");
         const savedFavorites = localStorage.getItem("favorites");
         if (savedBasket) setBasket(JSON.parse(savedBasket));
         if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
         console.error("Yerel yaddaşdan oxuma xətası:", err);
      }
   }, []);

   useEffect(() => {
      localStorage.setItem("basket", JSON.stringify(basket));
   }, [basket]);

   useEffect(() => {
      localStorage.setItem("favorites", JSON.stringify(favorites));
   }, [favorites]);

   const toggleBasket = () => {
      setBasketOpen(!basketOpen);
      setFavoritesOpen(false);
   };

   const toggleFavorites = () => {
      setFavoritesOpen(!favoritesOpen);
      setBasketOpen(false);
   };

   const addToBasket = (bookItem) => {
      setBasket((prevBasket) => {
         const existing = prevBasket.find((item) => item.id === bookItem.id);
         const stockLimit = bookItem.stockCount;

         if (existing) {
            const newCount = existing.count + 1;
            if (newCount > stockLimit) return prevBasket;
            return prevBasket.map((item) => (item.id === bookItem.id ? { ...item, count: newCount } : item));
         }

         return [...prevBasket, { ...bookItem, count: 1 }];
      });
   };

   const updateBasketCount = (id, newCount) => {
      if (newCount <= 0) {
         removeFromBasket(id);
      } else {
         setBasket((prevBasket) => prevBasket.map((item) => (item.id === id ? { ...item, count: newCount } : item)));
      }
   };

   const removeFromBasket = (bookId) => {
      setBasket((prevBasket) => prevBasket.filter((item) => item.id !== bookId));
   };

   const toggleFavorite = (bookItem) => {
      setFavorites((prevFavorites) => {
         const isFav = prevFavorites.some((item) => item.id === bookItem.id);
         return isFav ? prevFavorites.filter((item) => item.id !== bookItem.id) : [...prevFavorites, bookItem];
      });
   };

   const removeFromFavorites = (bookId) => {
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== bookId));
   };

   const isFavorite = (bookId) => {
      return favorites.some((item) => item.id === bookId);
   };

   const getTotalItemCount = () => {
      return basket.reduce((total, item) => total + item.count, 0);
   };

   const getFavoritesCount = () => favorites.length;

   const createBook = async (newBook) => {
      try {
         const res = await axios.post(`${BASE_URL}`, newBook, {
            headers: { "Content-Type": "application/json" },
         });
         if (res.status === 200 || res.status === 201) {
            const created = res.data;
            setBooks((prev) => [...prev, created]);
            return { ok: true, newBook: created };
         }
         throw new Error(`Status: ${res.status}`);
      } catch (err) {
         console.error("Create book error:", err);
         return { ok: false, error: err.message };
      }
   };

   const updateBook = async (updatedBook) => {
      try {
         const res = await axios.put(`${BASE_URL}/${updatedBook.id}`, updatedBook, {
            headers: { "Content-Type": "application/json" },
         });
         if (res.status === 200) {
            const updated = res.data;
            setBooks((prev) => prev.map((book) => (book.id === updated.id ? updated : book)));
            return { ok: true, updatedBook: updated };
         }
         throw new Error(`Status: ${res.status}`);
      } catch (err) {
         console.error("Update book error:", err);
         return { ok: false, error: err.message };
      }
   };

   const deleteBook = async (bookId) => {
      try {
         const res = await axios.delete(`${BASE_URL}/${bookId}`);
         if (res.status === 200 || res.status === 204) {
            setBooks((prev) => prev.filter((book) => book.id !== bookId));
            return { ok: true };
         }
         throw new Error(`Status: ${res.status}`);
      } catch (err) {
         console.error("Delete book error:", err);
         return { ok: false, error: err.message };
      }
   };

   axios.interceptors.response.use(
      (res) => res,
      (err) => {
         if (err.response?.status === 401) {
            console.warn("Yetkilendirme xətası");
         }
         return Promise.reject(err);
      }
   );

   return (
      <BookContext.Provider
         value={{
            books,
            setBooks,
            basket,
            setBasket,
            favorites,
            basketOpen,
            favoritesOpen,
            toggleBasket,
            toggleFavorites,
            addToBasket,
            removeFromBasket,
            updateBasketCount,
            toggleFavorite,
            removeFromFavorites,
            isFavorite,
            getTotalItemCount,
            getFavoritesCount,
            setBasketOpen,
            setFavoritesOpen,
            createBook,
            updateBook,
            deleteBook,
         }}
      >
         {children}
      </BookContext.Provider>
   );
};

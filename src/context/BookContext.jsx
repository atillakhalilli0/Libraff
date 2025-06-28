/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

const BASE_URL = "https://libraffdata-atilla.onrender.com";

export const BookProvider = ({ children }) => {
   const [books, setBooks] = useState([]);
   const [basket, setBasket] = useState([]);
   const [favorites, setFavorites] = useState([]);
   const [basketOpen, setBasketOpen] = useState(false);
   const [favoritesOpen, setFavoritesOpen] = useState(false);
   const [profileOpen, setProfileOpen] = useState(false);
   const [user, setUser] = useState(null);
   const [authLoading, setAuthLoading] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedin") === "true");

   useEffect(() => {
      async function fetchBooks() {
         try {
            const res = await fetch(`${BASE_URL}/kitablar`);
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

   useEffect(() => {
      try {
         const savedUser = localStorage.getItem("user");
         if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
         console.error("Kullanıcı bilgilerini okuma hatası:", err);
      }
   }, []);

   useEffect(() => {
      if (user) {
         localStorage.setItem("user", JSON.stringify(user));
         localStorage.setItem("loggedin", "true");
         setIsLoggedIn(true);
      } else {
         localStorage.removeItem("user");
         localStorage.removeItem("loggedin");
         setIsLoggedIn(false);
      }
   }, [user]);

   const toggleBasket = () => {
      setBasketOpen(!basketOpen);
      setProfileOpen(false);
      setFavoritesOpen(false);
   };

   const toggleFavorites = () => {
      setFavoritesOpen(!favoritesOpen);
      setProfileOpen(false);
      setBasketOpen(false);
   };

   const toggleProfile = () => {
      setProfileOpen(!profileOpen);
      setBasketOpen(false);
      setFavoritesOpen(false);
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
         const res = await axios.post(`${BASE_URL}/kitablar`, newBook, {
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
         const res = await axios.put(`${BASE_URL}/kitablar/${updatedBook.id}`, updatedBook, {
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
         const res = await axios.delete(`${BASE_URL}/kitablar/${bookId}`);
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

   const createUser = async (newUser) => {
      try {
         setAuthLoading(true);
         const res = await axios.post(`${BASE_URL}/users`, newUser, {
            headers: { "Content-Type": "application/json" },
         });
         if (res.status === 200 || res.status === 201) {
            const created = res.data;
            setUser(created);
            setProfileOpen(false);
            return { ok: true, user: created };
         }
         throw new Error(`Status: ${res.status}`);
      } catch (err) {
         console.error("Create user error:", err);
         return { ok: false, error: err.response?.data?.message || err.message };
      } finally {
         setAuthLoading(false);
      }
   };

   const loginUser = async (credentials) => {
      try {
         setAuthLoading(true);
         const res = await axios.get(`${BASE_URL}/users`);
         const users = res.data;

         const foundUser = users.find((user) => user.email === credentials.email && user.password === credentials.password);

         if (foundUser) {
            setUser(foundUser);
            setProfileOpen(false);
            return { ok: true, user: foundUser };
         } else {
            return { ok: false, error: "Email və ya şifrə yalnışdır" };
         }
      } catch (err) {
         console.error("Login error:", err);
         return { ok: false, error: "Giriş zamanı xəta baş verdi" };
      } finally {
         setAuthLoading(false);
      }
   };

   const logoutUser = () => {
      setUser(null);
      setAuthLoading(false);
   };

   return (
      <BookContext.Provider
         value={{
            books,
            setBooks,
            basket,
            user,
            authLoading,
            createUser,
            loginUser,
            logoutUser,
            toggleProfile,
            setBasket,
            favorites,
            basketOpen,
            favoritesOpen,
            profileOpen,
            setProfileOpen,
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
            isLoggedIn,
            setIsLoggedIn,
         }}
      >
         {children}
      </BookContext.Provider>
   );
};

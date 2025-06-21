import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, BookOpen, ChevronDown, Grid, List, X } from "lucide-react";
import { useBookContext } from "../context/BookContext";
import FilteredBooks from "../components/FilteredBooks";
import { useParams, useNavigate } from "react-router-dom";

function Category() {
   const { category: selectedCategory, subcategory: selectedSubcategory } = useParams();
   const navigate = useNavigate();
   const { books, addToBasket, toggleFavorite, favorites } = useBookContext();

   const [filteredBooks, setFilteredBooks] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [sortBy, setSortBy] = useState("name");
   const [viewMode, setViewMode] = useState("grid");
   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
   const [expandedCategories, setExpandedCategories] = useState(new Set());

   const safeBooks = useMemo(() => {
      return Array.isArray(books) ? books : [];
   }, [books]);

   const categories = Array.from(new Set(safeBooks.map((book) => book.category).filter(Boolean)));

   const getSubcategories = useCallback(
      (category) => {
         const subSet = new Set();
         safeBooks
            .filter((b) => b.category === category)
            .forEach((b) => {
               if (Array.isArray(b.subcategory)) {
                  b.subcategory.forEach((sc) => subSet.add(sc));
               }
            });
         return Array.from(subSet);
      },
      [safeBooks]
   );

   const toggleCategoryExpanded = (category) => {
      setExpandedCategories((prev) => {
         const newExpanded = new Set(prev);
         if (newExpanded.has(category)) {
            newExpanded.delete(category);
         } else {
            newExpanded.add(category);
         }
         return newExpanded;
      });
   };

   useEffect(() => {
      let result = [...safeBooks];

      if (selectedCategory) {
         result = result.filter((b) => b.category?.toLowerCase() === selectedCategory.toLowerCase());
      }

      if (selectedSubcategory) {
         result = result.filter((b) => Array.isArray(b.subcategory) && b.subcategory.some((sc) => sc.toLowerCase() === selectedSubcategory.toLowerCase()));
      }

      if (searchTerm.trim()) {
         const searchLower = searchTerm.toLowerCase().trim();
         result = result.filter((b) => b.title?.toLowerCase().includes(searchLower) || b.author?.toLowerCase().includes(searchLower));
      }

      result.sort((a, b) => {
         switch (sortBy) {
            case "name":
               return (a.title || "").localeCompare(b.title || "");
            case "author":
               return (a.author || "").localeCompare(b.author || "");
            case "price":
               return (Number(a.price) || 0) - (Number(b.price) || 0);
            default:
               return 0;
         }
      });

      setFilteredBooks(result);
   }, [safeBooks, selectedCategory, selectedSubcategory, searchTerm, sortBy]);

   const clearFilters = () => {
      setSearchTerm("");
      navigate("/categories");
   };

   useEffect(() => {
      const handleEscape = (e) => {
         if (e.key === "Escape") {
            setIsMobileFilterOpen(false);
         }
      };

      if (isMobileFilterOpen) {
         document.addEventListener("keydown", handleEscape);
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }

      return () => {
         document.removeEventListener("keydown", handleEscape);
         document.body.style.overflow = "unset";
      };
   }, [isMobileFilterOpen]);

   const FilterSidebar = ({ isMobile = false }) => (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ${isMobile ? "h-full" : ""}`}>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-red-600" />
               Kateqoriyalar
            </h2>
            {(selectedCategory || selectedSubcategory) && (
               <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                  <X className="w-4 h-4" />
                  Təmizlə
               </button>
            )}
         </div>

         <div
            className={`cursor-pointer p-3 rounded-lg transition-all duration-200 mb-2 ${!selectedCategory ? "bg-red-50 text-red-700 border-l-4 border-red-500" : "hover:bg-gray-50 text-gray-700"}`}
            onClick={() => {
               navigate("/categories");
               if (isMobile) setIsMobileFilterOpen(false);
            }}
         >
            <div className="font-medium">Bütün kitablar</div>
            <div className="text-sm text-gray-500">{safeBooks.length} kitab</div>
         </div>

         <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
            {categories.map((cat) => {
               const subcategories = getSubcategories(cat);
               const isExpanded = expandedCategories.has(cat);
               const categoryBooks = safeBooks.filter((b) => b.category === cat);

               return (
                  <div key={cat} className="border-b border-gray-50 last:border-b-0 pb-2">
                     <div
                        className={`cursor-pointer p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${selectedCategory === cat.toLowerCase() ? "bg-red-50 text-red-700 border-l-4 border-red-500" : "hover:bg-gray-50 text-gray-700"}`}
                        onClick={() => {
                           navigate(`/categories/${encodeURIComponent(cat.toLowerCase())}`);
                           if (subcategories.length > 0) {
                              toggleCategoryExpanded(cat);
                           }
                           if (isMobile) setIsMobileFilterOpen(false);
                        }}
                     >
                        <div className="flex-1 min-w-0">
                           <div className="font-medium capitalize truncate">{cat}</div>
                           <div className="text-sm text-gray-500">{categoryBooks.length} kitab</div>
                        </div>
                        {subcategories.length > 0 && <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${isExpanded ? "rotate-180" : ""}`} />}
                     </div>

                     {isExpanded && subcategories.length > 0 && (
                        <div className="ml-4 mt-2 max-h-[200px] overflow-y-auto pr-1 space-y-1">
                           {subcategories.map((sub) => (
                              <div
                                 key={sub}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/categories/${encodeURIComponent(cat.toLowerCase())}/${encodeURIComponent(sub.toLowerCase())}`);
                                    if (isMobile) setIsMobileFilterOpen(false);
                                 }}
                                 className={`cursor-pointer p-2 rounded-md transition-all duration-200 ${selectedSubcategory === sub.toLowerCase() ? "bg-red-100 text-red-700 font-medium" : "hover:bg-gray-50 text-gray-600"}`}
                              >
                                 <div className="text-sm capitalize truncate">{sub}</div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-30">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-6 sm:mb-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                     <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Kitab Kataloqu</h1>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
                           <span>Ana səhifə</span>
                           <span>/</span>
                           <span>Kateqoriyalar</span>
                           {selectedCategory && (
                              <>
                                 <span>/</span>
                                 <span className="text-red-600 capitalize font-medium truncate">{selectedCategory}</span>
                              </>
                           )}
                           {selectedSubcategory && (
                              <>
                                 <span>/</span>
                                 <span className="text-red-600 capitalize font-medium truncate">{selectedSubcategory}</span>
                              </>
                           )}
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div className="relative flex-1 min-w-0">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input type="text" placeholder="Kitab və ya müəllif axtar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
                        </div>

                        <div className="flex gap-3 items-center">
                           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm">
                              <option value="name">Ada görə</option>
                              <option value="author">Müəllifə görə</option>
                              <option value="price">Qiymətə görə</option>
                           </select>

                           <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                              <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`} aria-label="Grid view">
                                 <Grid className="w-4 h-4" />
                              </button>
                              <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`} aria-label="List view">
                                 <List className="w-4 h-4" />
                              </button>
                           </div>

                           <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                              <Filter className="w-4 h-4" />
                              Filter
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-6 lg:gap-8">
               <div className="hidden lg:block w-80 flex-shrink-0">
                  <FilterSidebar />
               </div>

               {isMobileFilterOpen && (
                  <div className="lg:hidden fixed inset-0 z-50 flex">
                     <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsMobileFilterOpen(false)} aria-hidden="true" />

                     <div className="relative w-80 max-w-[85vw] bg-white shadow-xl">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                           <h3 className="font-semibold text-gray-900">Filtrlər</h3>
                           <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close filters">
                              <X className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100vh-64px)]">
                           <div className="p-4">
                              <FilterSidebar isMobile={true} />
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               <div className="flex-1 min-w-0">
                  <div className="mb-4 sm:mb-6 flex items-center justify-between">
                     <p className="text-sm sm:text-base text-gray-600">
                        <span className="font-semibold text-gray-900">{filteredBooks.length}</span> kitab tapıldı
                     </p>
                  </div>

                  {safeBooks.length === 0 ? (
                     <div className="bg-white rounded-xl p-8 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Hələ ki kitab əlavə edilməyib.</p>
                     </div>
                  ) : filteredBooks.length === 0 ? (
                     <div className="bg-white rounded-xl p-8 text-center">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Axtarış nəticəsi tapılmadı</p>
                        <button onClick={clearFilters} className="text-red-600 hover:text-red-700 text-sm font-medium">
                           Filtrlər təmizlə
                        </button>
                     </div>
                  ) : (
                     <FilteredBooks books={filteredBooks} addToBasket={addToBasket} toggleFavorite={toggleFavorite} favorites={favorites} viewMode={viewMode} />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Category;

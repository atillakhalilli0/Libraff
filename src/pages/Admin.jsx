import React, { useState } from "react";
import { useBookContext } from "../context/BookContext";
import { Search, Plus, Edit2, Trash2, Eye, BookOpen, Users, TrendingUp } from "lucide-react";
import Swal from "sweetalert2";

const Admin = () => {
   const { books, createBook, updateBook, deleteBook } = useBookContext();

   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingBook, setEditingBook] = useState(null);
   const [formData, setFormData] = useState({
      title: "",
      author: "",
      price: "",
      image: "",
      category: "",
      subcategory: [],
      language: [],
      stockCount: "",
      description: "",
   });

   const resetForm = () => {
      setFormData({
         title: "",
         author: "",
         price: "",
         image: "",
         category: "",
         subcategory: [],
         language: [],
         stockCount: "",
         description: "",
      });
      setEditingBook(null);
   };

   const openModal = (book = null) => {
      if (book) {
         setFormData({
            title: book.title || "",
            author: book.author || "",
            price: book.price || "",
            image: book.image || "",
            category: book.category || "",
            subcategory: book.subcategory || [],
            language: book.language || [],
            stockCount: book.stockCount || "",
            description: book.description || "",
         });
         setEditingBook(book);
      } else {
         resetForm();
      }
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      resetForm();
   };

   const handleSubmit = async () => {
      const bookData = {
         ...formData,
         price: parseFloat(formData.price),
         stockCount: parseInt(formData.stockCount),
         subcategory: Array.isArray(formData.subcategory) ? formData.subcategory : formData.subcategory.split(",").map((s) => s.trim()),
         language: Array.isArray(formData.language) ? formData.language : formData.language.split(",").map((s) => s.trim()),
         sold: editingBook?.sold || 0,
         viewed: editingBook?.viewed || 0,
         comments: editingBook?.comments || [],
      };

      try {
         let result;
         if (editingBook) {
            result = await updateBook({ ...bookData, id: editingBook.id });
         } else {
            result = await createBook(bookData);
         }

         if (result.ok) {
            Swal.fire({
               icon: "success",
               title: editingBook ? "Kitab yeniləndi!" : "Kitab əlavə edildi!",
               showConfirmButton: false,
               timer: 1500,
            });
            closeModal();
         } else {
            Swal.fire({
               icon: "error",
               title: "Xəta!",
               text: result.error || "Əməliyyat uğursuz oldu",
            });
         }
      } catch (error) {
         Swal.fire({
            icon: "error",
            title: "Xəta!",
            text: "Gözlənilməz xəta baş verdi",
         });
      }
   };

   const handleDelete = async (book) => {
      const result = await Swal.fire({
         title: "Əminsiniz?",
         text: `"${book.title}" kitabını silmək istədiyinizdən əminsiniz?`,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Bəli, sil!",
         cancelButtonText: "Ləğv et",
      });

      if (result.isConfirmed) {
         const deleteResult = await deleteBook(book.id);
         if (deleteResult.ok) {
            Swal.fire({
               icon: "success",
               title: "Silindi!",
               text: "Kitab uğurla silindi.",
               showConfirmButton: false,
               timer: 1500,
            });
         } else {
            Swal.fire({
               icon: "error",
               title: "Xəta!",
               text: "Silmə əməliyyatı uğursuz oldu",
            });
         }
      }
   };

   const filteredBooks = books.filter((book) => {
      const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
   });

   const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];
   const totalStock = books.reduce((sum, book) => sum + (book.stockCount || 0), 0);
   const totalSold = books.reduce((sum, book) => sum + (book.sold || 0), 0);

   return (
      <div className="min-h-screen bg-gray-50 p-6 pt-30">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitab Admin Paneli</h1>
               <p className="text-gray-600">Kitabları idarə edin və statistikaları izləyin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                     <BookOpen className="h-8 w-8 text-blue-600" />
                     <div className="ml-4">
                        <p className="text-sm text-gray-600">Ümumi Kitab</p>
                        <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                     </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                     <TrendingUp className="h-8 w-8 text-green-600" />
                     <div className="ml-4">
                        <p className="text-sm text-gray-600">Satılan</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSold}</p>
                     </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                     <Users className="h-8 w-8 text-purple-600" />
                     <div className="ml-4">
                        <p className="text-sm text-gray-600">Stok</p>
                        <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                     </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                     <Eye className="h-8 w-8 text-orange-600" />
                     <div className="ml-4">
                        <p className="text-sm text-gray-600">Kateqoriya</p>
                        <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Kitab və ya müəllif axtar..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                     </div>
                     <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Bütün kateqoriyalar</option>
                        {categories.map((category) => (
                           <option key={category} value={category}>
                              {category}
                           </option>
                        ))}
                     </select>
                  </div>
                  <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                     <Plus className="h-4 w-4" />
                     Yeni Kitab
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kitab</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müəllif</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qiymət</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satılan</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kateqoriya</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Əməliyyatlar</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks.map((book) => (
                           <tr key={book.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <img className="h-10 w-10 rounded object-cover" src={book.image} alt={book.title} />
                                    <div className="ml-4">
                                       <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.price} ₼</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span className={`inline-flex px-2 py-1 text-xs rounded-full ${book.stockCount > 10 ? "bg-green-100 text-green-800" : book.stockCount > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{book.stockCount}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.sold || 0}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <button onClick={() => openModal(book)} className="text-blue-600 hover:text-blue-900 mr-3">
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button onClick={() => handleDelete(book)} className="text-red-600 hover:text-red-900">
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {isModalOpen && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                     <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">{editingBook ? "Kitabı Redaktə Et" : "Yeni Kitab Əlavə Et"}</h2>
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Başlıq *</label>
                                 <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Müəllif *</label>
                                 <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət *</label>
                                 <input type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Stok Sayı *</label>
                                 <input type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.stockCount} onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })} />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya *</label>
                                 <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil URL</label>
                                 <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                              </div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Alt kateqoriyalar (vergüllə ayırın)</label>
                              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={Array.isArray(formData.subcategory) ? formData.subcategory.join(", ") : formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Dillər (vergüllə ayırın)</label>
                              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={Array.isArray(formData.language) ? formData.language.join(", ") : formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Təsvir</label>
                              <textarea rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                           </div>
                           <div className="flex justify-end gap-3 pt-4">
                              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                 Ləğv et
                              </button>
                              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                 {editingBook ? "Yenilə" : "Əlavə et"}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Admin;

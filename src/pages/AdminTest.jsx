import { useState } from "react";
import { useBookContext } from "../context/BookContext";

function AdminTest() {
   const { books, setBooks, createBook, updateBook, deleteBook } = useBookContext();
   const [postModal, setPostModal] = useState(false);
   const [editModal, setEditModal] = useState(false);
   const [selectedBook, setSelectedBook] = useState(null);

   function handleModal() {
      setPostModal(!postModal);
   }

   async function handlePost() {
      const newBook = {
         id: "",
         title: "salam",
         author: "atilla",
         price: 20,
         image: "https://picsum.photos/seed/book1/1000/1000",
      };
      const res = await createBook(newBook);
      console.log(res);
   }

   function handleEditClick(book) {
      setSelectedBook(book);
      setEditModal(true);
   }

   async function handleEdit() {
      const updatedBook = {
         ...selectedBook,
         title: document.querySelector('input[name="title"]').value,
         author: document.querySelector('input[name="author"]').value,
         price: parseFloat(document.querySelector('input[name="price"]').value),
         image: document.querySelector('input[name="image"]').value,
      };
      updateBook(updatedBook);
   }

   async function handleDelete(id) {
      deleteBook(id).then((res) => {
         console.log(res);
         setBooks(books.filter((item) => item.id !== id));
      });
   }

   return (
      <div className="pt-50 text-center">
         {postModal && (
            <div className="w-[70%] mx-auto">
               <input type="hidden" name="id" value="1" />

               <div>
                  <label className="block">Title</label>
                  <input name="title" defaultValue="Axırıncı Qartal" className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Author</label>
                  <input name="author" defaultValue="Lev Tolstoy" className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Price</label>
                  <input name="price" type="number" defaultValue={22} className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Image URL</label>
                  <input name="image" defaultValue="https://picsum.photos/seed/book1/1000/1000" className="w-full border rounded p-2" />
               </div>
               <button onClick={handlePost} className="px-8 py-2 my-10 rounded-2xl text-white font-semibold text-lg bg-green-600">
                  Add Book
               </button>
               <button onClick={handleEdit} className="px-8 py-2 my-10 rounded-2xl text-white font-semibold text-lg bg-green-600">
                  Edit Book
               </button>
            </div>
         )}
         {editModal && selectedBook && (
            <div className="w-[70%] mx-auto">
               <div>
                  <label className="block">Title</label>
                  <input name="title" defaultValue={selectedBook.title} className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Author</label>
                  <input name="author" defaultValue={selectedBook.author} className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Price</label>
                  <input name="price" type="number" defaultValue={selectedBook.price} className="w-full border rounded p-2" />
               </div>

               <div>
                  <label className="block">Image URL</label>
                  <input name="image" defaultValue={selectedBook.image} className="w-full border rounded p-2" />
               </div>

               <button onClick={handleEdit} className="px-8 py-2 my-10 rounded-2xl text-white font-semibold text-lg bg-blue-600">
                  Save Changes
               </button>
            </div>
         )}

         <button onClick={handleModal} className="mb-10 px-4 py-2 text-white font-medium bg-teal-500 rounded-lg text-xl capitalize">
            add new book
         </button>
         <div className="grid grid-cols-5 gap-10">
            {books.map((item) => (
               <a key={item.id} className="p-3 flex flex-col items-center justify-center gap-5 bg-slate-400 rounded-xl">
                  <h1>{item.title}</h1>
                  <div className="flex gap-5">
                     <button onClick={() => handleEditClick(item)} className="px-2 border-1 rounded-md bg-sky-400">
                        Edit
                     </button>
                     <button onClick={() => handleDelete(item.id)} className="px-2 border-1 border-black rounded-md bg-red-500 text-white">
                        Delete
                     </button>
                  </div>
               </a>
            ))}
         </div>
      </div>
   );
}

export default AdminTest;

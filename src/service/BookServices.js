import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

async function getAllBooks() {
   try {
      const res = await axios.get(BASE_URL);
      return res.data;
   } catch (error) {
      console.log(error.message);
   }
}

export default getAllBooks;

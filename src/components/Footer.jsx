import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Logo from "../../img/logo.png";

function Footer() {
   return (
      <footer
         className="relative w-full mt-20 text-gray-900 text-sm"
         style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
            backdropFilter: "blur(16px)",
            boxShadow: `
          inset 1px 1px 0 rgba(255,255,255,0.3),
          inset -1px -1px 0 rgba(255,255,255,0.1),
          0 8px 24px rgba(0,0,0,0.05),
          0 2px 8px rgba(0,0,0,0.03)
        `,
         }}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <img src={Logo} alt="logo" className="h-10" />
                  </div>
                  <p className="text-gray-700 mb-4">Bədii ədəbiyyat sevənlər üçün unikal seçimlər. Keyfiyyətli, orijinal və dəyərli nəşrlər.</p>
                  <div className="flex space-x-4 text-gray-600">
                     <a href="#">
                        <Facebook size={20} className="hover:text-blue-600" />
                     </a>
                     <a href="#">
                        <Instagram size={20} className="hover:text-pink-500" />
                     </a>
                     <a href="#">
                        <Twitter size={20} className="hover:text-blue-400" />
                     </a>
                     <a href="#">
                        <Youtube size={20} className="hover:text-red-600" />
                     </a>
                  </div>
               </div>

               <div>
                  <h3 className="text-lg font-semibold mb-4">Menyu</h3>
                  <ul className="space-y-2 text-gray-700">
                     <li>
                        <a href="#" className="hover:text-blue-700">
                           Ana Səhifə
                        </a>
                     </li>
                     <li>
                        <a href="#" className="hover:text-blue-700">
                           Kitablar
                        </a>
                     </li>
                     <li>
                        <a href="#" className="hover:text-blue-700">
                           Endirimlər
                        </a>
                     </li>
                     <li>
                        <a href="#" className="hover:text-blue-700">
                           Haqqımızda
                        </a>
                     </li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-lg font-semibold mb-4">Əlaqə</h3>
                  <ul className="space-y-3 text-gray-700">
                     <li className="flex items-start">
                        <MapPin className="w-4 h-4 mt-1 mr-2" />
                        <span>Bakı şəhəri, Yasamal rayonu, Xiyabani küçəsi 15</span>
                     </li>
                     <li className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>+994 50 123 45 67</span>
                     </li>
                     <li className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>info@kitabstore.az</span>
                     </li>
                  </ul>
               </div>

               <div>
                  <h3 className="text-lg font-semibold mb-4">İş saatları</h3>
                  <ul className="space-y-2 text-gray-700">
                     <li className="flex justify-between">
                        <span>B.e - Cümə:</span>
                        <span>09:00 - 19:00</span>
                     </li>
                     <li className="flex justify-between">
                        <span>Şənbə:</span>
                        <span>10:00 - 17:00</span>
                     </li>
                     <li className="flex justify-between">
                        <span>Bazar:</span>
                        <span>Bağlıdır</span>
                     </li>
                  </ul>
                  <div className="mt-4">
                     <h4 className="font-medium mb-1 text-gray-700">Sifariş üçün:</h4>
                     <a href="tel:*7272" className="text-lg font-bold text-blue-700 hover:text-blue-600 transition-colors">
                        *7272
                     </a>
                  </div>
               </div>
            </div>

            <div className="border-t border-white/20 mt-10 pt-6 text-gray-600 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
               <p>© {new Date().getFullYear()} KitabStore. Bütün hüquqlar qorunur.</p>
               <div className="flex gap-4 flex-wrap justify-center">
                  <a href="#" className="hover:text-blue-700">
                     Gizlilik siyasəti
                  </a>
                  <a href="#" className="hover:text-blue-700">
                     İstifadə şərtləri
                  </a>
                  <a href="#" className="hover:text-blue-700">
                     Çatdırılma qaydaları
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}

export default Footer;

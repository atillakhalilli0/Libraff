import React, { useState } from "react";
import { X, User, LogOut, Settings, Heart, ShoppingBag, Eye, EyeOff, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { useBookContext } from "../context/BookContext";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";


function Profile({ isOpen, onClose }) {
   const [isLogin, setIsLogin] = useState(true);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [loginData, setLoginData] = useState({ email: "", password: "" });
   const [signupData, setSignupData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { user, logoutUser, getTotalItemCount, getFavoritesCount, loginUser, createUser } = useBookContext();

   const handleSwitchToSignup = () => {
      setIsLogin(false);
      setError("");
   };

   const handleSwitchToLogin = () => {
      setIsLogin(true);
      setError("");
   };

   const handleLogout = () => {
      Swal.fire({
         title: "Çıxış etmək istədiyinizə əminsiniz?",
         text: "Hesabınızdan çıxış edəcəksiniz",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#dc2626",
         cancelButtonColor: "#6b7280",
         confirmButtonText: "Bəli, çıxış et",
         cancelButtonText: "Ləğv et",
      }).then((result) => {
         if (result.isConfirmed) {
            logoutUser();
            onClose();
            Swal.fire({
               title: "Çıxış edildi!",
               text: "Hesabınızdan uğurla çıxış etdiniz",
               icon: "success",
               timer: 2000,
               showConfirmButton: false,
            });
         }
      });
   };

   const handleLoginChange = (e) => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
      setError("");
   };

   const handleSignupChange = (e) => {
      setSignupData({ ...signupData, [e.target.name]: e.target.value });
      setError("");
   };

   const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const result = await loginUser(loginData);
         if (!result.ok) {
            setError(result.error || "Giriş xətası baş verdi");
            Swal.fire({
               title: "Giriş xətası!",
               text: result.error || "Giriş xətası baş verdi",
               icon: "error",
               confirmButtonColor: "#dc2626",
            });
         } else {
            // Close the sidebar after successful login
            onClose();
            Swal.fire({
               title: "Xoş gəlmisiniz!",
               text: "Hesabınıza uğurla daxil oldunuz",
               icon: "success",
               timer: 2000,
               showConfirmButton: false,
            });
         }
      } catch (err) {
         setError("Giriş zamanı xəta baş verdi");
         Swal.fire({
            title: "Xəta!",
            text: "Giriş zamanı xəta baş verdi",
            icon: "error",
            confirmButtonColor: "#dc2626",
         });
      } finally {
         setLoading(false);
      }
   };

   // Check if email or phone already exists using existing API
   const checkForDuplicates = async (email, phone) => {
      try {
         const res = await fetch("https://libraffdata-atilla.onrender.com/users");
         if (!res.ok) throw new Error("İstifadəçi məlumatları yüklənə bilmədi");

         const users = await res.json();

         const emailExists = users.some((user) => user.email === email);
         const phoneExists = users.some((user) => user.phone === phone);

         return { emailExists, phoneExists };
      } catch (error) {
         console.error("Mövcudluq yoxlanışı zamanı xəta:", error);
         // Əgər yoxlama alınmasa, qeydiyyatın qarşısını almaq istəmirik
         return { emailExists: false, phoneExists: false };
      }
   };

   const validateSignupForm = async () => {
      // Basic validation
      if (signupData.password !== signupData.confirmPassword) {
         setError("Şifrələr uyğun gəlmir");
         Swal.fire({
            title: "Şifrə xətası!",
            text: "Şifrələr uyğun gəlmir",
            icon: "error",
            confirmButtonColor: "#dc2626",
         });
         return false;
      }
      if (signupData.password.length < 6) {
         setError("Şifrə ən azı 6 simvol olmalıdır");
         Swal.fire({
            title: "Şifrə çox qısadır!",
            text: "Şifrə ən azı 6 simvol olmalıdır",
            icon: "error",
            confirmButtonColor: "#dc2626",
         });
         return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupData.email)) {
         setError("Düzgün email formatı daxil edin");
         Swal.fire({
            title: "Email xətası!",
            text: "Düzgün email formatı daxil edin",
            icon: "error",
            confirmButtonColor: "#dc2626",
         });
         return false;
      }

      // Phone format validation (optional, adjust regex as needed)
      if (signupData.phone && signupData.phone.trim() !== "") {
         // Add phone validation if needed
      }

      // Check for duplicates
      try {
         const duplicateCheck = await checkForDuplicates(signupData.email, signupData.phone);

         if (duplicateCheck.emailExists) {
            setError("Bu email artıq istifadə olunur");
            Swal.fire({
               title: "Email mövcuddur!",
               text: "Bu email artıq istifadə olunur",
               icon: "error",
               confirmButtonColor: "#dc2626",
            });
            return false;
         }

         if (signupData.phone && duplicateCheck.phoneExists) {
            setError("Bu telefon nömrəsi artıq istifadə olunur");
            Swal.fire({
               title: "Telefon mövcuddur!",
               text: "Bu telefon nömrəsi artıq istifadə olunur",
               icon: "error",
               confirmButtonColor: "#dc2626",
            });
            return false;
         }
      } catch (error) {
         console.warn("Duplicate check failed:", error);
         // Allow registration to proceed if check fails
      }

      return true;
   };

   const handleSignupSubmit = async (e) => {
      e.preventDefault();

      const isValid = await validateSignupForm();
      if (!isValid) return;

      setLoading(true);
      setError("");

      try {
         const userData = {
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            phone: signupData.phone,
            password: signupData.password,
         };

         const result = await createUser(userData);
         if (!result.ok) {
            setError(result.error || "Qeydiyyat xətası baş verdi");
            Swal.fire({
               title: "Qeydiyyat xətası!",
               text: result.error || "Qeydiyyat xətası baş verdi",
               icon: "error",
               confirmButtonColor: "#dc2626",
            });
         } else {
            // Close the sidebar after successful registration
            onClose();
            Swal.fire({
               title: "Qeydiyyat tamamlandı!",
               text: "Hesabınız uğurla yaradıldı",
               icon: "success",
               timer: 2000,
               showConfirmButton: false,
            });
         }
      } catch (err) {
         setError("Qeydiyyat zamanı xəta baş verdi");
         Swal.fire({
            title: "Xəta!",
            text: "Qeydiyyat zamanı xəta baş verdi",
            icon: "error",
            confirmButtonColor: "#dc2626",
         });
      } finally {
         setLoading(false);
      }
   };

   const showSettingsAlert = () => {
      Swal.fire({
         title: "Tənzimləmələr",
         text: "Bu funksiya hələ hazırlanmaqdadır",
         icon: "info",
         confirmButtonColor: "#2563eb",
      });
   };

   const showOrdersAlert = () => {
      Swal.fire({
         title: "Sifarişlərim",
         text: "Bu funksiya hələ hazırlanmaqdadır",
         icon: "info",
         confirmButtonColor: "#2563eb",
      });
   };

   if (!isOpen) return null;

   return (
      <>
         {/* Backdrop */}
         <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onClose} />

         {/* Profile Sidebar */}
         <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
               {/* Header */}
               <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">{user ? "Profil" : "Giriş / Qeydiyyat"}</h2>
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                     }}
                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                     type="button"
                  >
                     <X className="w-5 h-5 text-gray-600" />
                  </button>
               </div>

               {/* Content */}
               <div className="flex-1 overflow-y-auto p-6">
                  {user ? (
                     /* User is logged in */
                     <div className="space-y-6">
                        {/* User Info */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                           <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-8 h-8 text-white" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 truncate">
                                 {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-gray-600 text-sm truncate">{user.email}</p>
                              {user.phone && <p className="text-gray-600 text-sm truncate">{user.phone}</p>}
                           </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-red-50 rounded-lg text-center">
                              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-red-600">{getFavoritesCount()}</div>
                              <div className="text-sm text-gray-600">Sevimli</div>
                           </div>
                           <div className="p-4 bg-green-50 rounded-lg text-center">
                              <ShoppingBag className="w-6 h-6 text-green-500 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-600">{getTotalItemCount()}</div>
                              <div className="text-sm text-gray-600">Səbətdə</div>
                           </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-2">
                           <button onClick={showSettingsAlert} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                              <Settings className="w-5 h-5 text-gray-500" />
                              <span className="text-gray-700">Tənzimləmələr</span>
                           </button>

                           <button onClick={showOrdersAlert} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                              <ShoppingBag className="w-5 h-5 text-gray-500" />
                              <span className="text-gray-700">Sifarişlərim</span>
                           </button>
                        </div>

                        {/* Logout Button */}
                        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                           <LogOut className="w-5 h-5" />
                           <span>Çıxış</span>
                        </button>
                     </div>
                  ) : (
                     /* User is not logged in - Show Login/Signup Forms */
                     <div>
                        {isLogin ? (
                           /* Login Form */
                           <div className="w-full">
                              <div className="text-center mb-6">
                                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Xoş gəlmisiniz</h3>
                                 <p className="text-gray-600">Hesabınıza daxil olun</p>
                              </div>

                              <form onSubmit={handleLoginSubmit} className="space-y-4">
                                 {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

                                 <div className="space-y-2">
                                    <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
                                       Email
                                    </label>
                                    <div className="relative">
                                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input type="email" id="loginEmail" name="email" value={loginData.email} onChange={handleLoginChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" placeholder="email@example.com" />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
                                       Şifrə
                                    </label>
                                    <div className="relative">
                                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input
                                          type={showPassword ? "text" : "password"}
                                          id="loginPassword"
                                          name="password"
                                          value={loginData.password}
                                          onChange={handleLoginChange}
                                          required
                                          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                          placeholder="Şifrənizi daxil edin"
                                       />
                                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                       </button>
                                    </div>
                                 </div>

                                 <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                    {loading ? (
                                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                       <>
                                          <span>Daxil ol</span>
                                          <ArrowRight className="w-4 h-4" />
                                       </>
                                    )}
                                 </button>

                                 <div className="text-center">
                                    <p className="text-gray-600 text-sm">
                                       Hesabınız yoxdur?{" "}
                                       <button type="button" onClick={handleSwitchToSignup} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                          Qeydiyyatdan keçin
                                       </button>
                                    </p>
                                 </div>
                              </form>
                           </div>
                        ) : (
                           /* Signup Form */
                           <div className="w-full">
                              <div className="text-center mb-6">
                                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Qeydiyyat</h3>
                                 <p className="text-gray-600">Yeni hesab yaradın</p>
                              </div>

                              <form onSubmit={handleSignupSubmit} className="space-y-4">
                                 {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                          Ad
                                       </label>
                                       <div className="relative">
                                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input type="text" id="firstName" name="firstName" value={signupData.firstName} onChange={handleSignupChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" placeholder="Adınız" />
                                       </div>
                                    </div>

                                    <div className="space-y-2">
                                       <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                          Soyad
                                       </label>
                                       <div className="relative">
                                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input type="text" id="lastName" name="lastName" value={signupData.lastName} onChange={handleSignupChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" placeholder="Soyadınız" />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">
                                       Email
                                    </label>
                                    <div className="relative">
                                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input type="email" id="signupEmail" name="email" value={signupData.email} onChange={handleSignupChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" placeholder="email@example.com" />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                       Telefon
                                    </label>
                                    <div className="relative">
                                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input type="tel" id="phone" name="phone" value={signupData.phone} onChange={handleSignupChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" placeholder="+994 XX XXX XX XX" />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">
                                       Şifrə
                                    </label>
                                    <div className="relative">
                                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input
                                          type={showPassword ? "text" : "password"}
                                          id="signupPassword"
                                          name="password"
                                          value={signupData.password}
                                          onChange={handleSignupChange}
                                          required
                                          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                          placeholder="Ən azı 6 simvol"
                                       />
                                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                       </button>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                       Şifrəni təsdiq edin
                                    </label>
                                    <div className="relative">
                                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                       <input
                                          type={showConfirmPassword ? "text" : "password"}
                                          id="confirmPassword"
                                          name="confirmPassword"
                                          value={signupData.confirmPassword}
                                          onChange={handleSignupChange}
                                          required
                                          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                          placeholder="Şifrəni təkrar edin"
                                       />
                                       <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                       </button>
                                    </div>
                                 </div>

                                 <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                    {loading ? (
                                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                       <>
                                          <span>Qeydiyyatdan keç</span>
                                          <ArrowRight className="w-4 h-4" />
                                       </>
                                    )}
                                 </button>

                                 <div className="text-center">
                                    <p className="text-gray-600 text-sm">
                                       Artıq hesabınız var?{" "}
                                       <button type="button" onClick={handleSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                          Daxil olun
                                       </button>
                                    </p>
                                 </div>
                              </form>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </>
   );
}

export default Profile;

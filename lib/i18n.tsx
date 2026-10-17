"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "ar" | "fr" | "en";
export const LOCALES: Locale[] = ["ar", "fr", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

const dict = {
  announcement: {
    ar: "التوصيل لجميع مدن المغرب — الدفع عند الاستلام",
    fr: "Livraison vers toutes les villes du Maroc — Paiement à la livraison",
    en: "Delivery to all Moroccan cities — Cash on delivery",
  },
  announcement2: {
    ar: "بوكس الأحلام: هدية العلم الأجمل لمن تحب",
    fr: "Dream Box : le plus beau cadeau de savoir",
    en: "Dream Box: the finest gift of knowledge",
  },
  navHome: { ar: "الرئيسية", fr: "Accueil", en: "Home" },
  navBooks: { ar: "الكتب", fr: "Livres", en: "Books" },
  navBundles: { ar: "البوكسات", fr: "Coffrets", en: "Bundles" },
  navAuthors: { ar: "المؤلفون", fr: "Auteurs", en: "Authors" },
  navTracking: { ar: "تتبع الطلب", fr: "Suivi", en: "Tracking" },
  navAbout: { ar: "من نحن", fr: "À propos", en: "About" },
  searchPlaceholder: {
    ar: "ابحث عن كتاب، مؤلف، دار نشر...",
    fr: "Rechercher un livre, auteur, éditeur...",
    en: "Search a book, author, publisher...",
  },
  heroBadge: {
    ar: "مكتبة متجولة للكتب الشرعية",
    fr: "Librairie itinérante du livre religieux",
    en: "A travelling Islamic bookstore",
  },
  heroTitle: {
    ar: "هنا حيث الكُتُب",
    fr: "Ici vivent les livres",
    en: "Here is where books live",
  },
  heroSubtitle: {
    ar: "مكتبة يُسر — نشارك معكم رحلة تبدأ بكتاب: كتب شرعية، قصص ملهمة، تربية ووعي، بتغليف يليق بالعلم وتوصيل سريع حتى باب البيت.",
    fr: "Yusr Books — un voyage qui commence par un livre : éditions soignées d'Aqida, Fiqh, Sira et Tafsir, livrées jusqu'à votre porte.",
    en: "Yusr Books — a journey starting with a book: hand-picked editions of Aqeedah, Fiqh, Seerah and Tafsir, delivered to your door.",
  },
  heroCtaBooks: { ar: "تصفح الكتب", fr: "Voir les livres", en: "Browse books" },
  heroCtaBundles: {
    ar: "اكتشف البوكسات",
    fr: "Découvrir les coffrets",
    en: "Explore bundles",
  },
  heroTrust1: { ar: "توصيل لجميع المدن", fr: "Livraison partout", en: "Delivery everywhere" },
  heroTrust2: {
    ar: "الدفع عند الاستلام",
    fr: "Paiement à la livraison",
    en: "Cash on delivery",
  },
  heroTrust3: {
    ar: "تغليف فاخر آمن",
    fr: "Emballage soigné",
    en: "Premium packaging",
  },
  categoriesTitle: {
    ar: "الأقسام السريعة",
    fr: "Catégories",
    en: "Quick categories",
  },
  categoriesSub: {
    ar: "اختر طريقك في طلب العلم",
    fr: "Choisissez votre voie",
    en: "Choose your path of knowledge",
  },
  bestSellersTitle: {
    ar: "الكتب الأكثر طلباً",
    fr: "Meilleures ventes",
    en: "Best sellers",
  },
  bestSellersSub: {
    ar: "مختارات زبائننا التي لا تخيب",
    fr: "Les favoris de nos clients",
    en: "Our customers' favourites",
  },
  viewAll: { ar: "عرض الكل", fr: "Tout voir", en: "View all" },
  bundleTitle: {
    ar: "بوكسات الكتب وهدايا العلم",
    fr: "Coffrets & cadeaux",
    en: "Book boxes & gifts",
  },
  bundleSub: {
    ar: "مجموعات متكاملة لطالب العلم، جاهزة للإهداء مع تغليف فاخر وبطاقة إهداء",
    fr: "Des collections complètes, prêtes à offrir avec une carte dédicace",
    en: "Complete collections, gift-ready with a dedication card",
  },
  testimonialsTitle: {
    ar: "آراء العائلات والعملاء",
    fr: "Avis de nos clients",
    en: "What families say",
  },
  testimonialsSub: {
    ar: "ثقة زبنائنا سرّ نجاحنا",
    fr: "La confiance de nos clients",
    en: "Our customers' trust",
  },
  authorsTitle: {
    ar: "كبار المؤلفين والسلاسل",
    fr: "Auteurs & séries",
    en: "Authors & series",
  },
  deliveryCalcTitle: {
    ar: "احسب سعر التوصيل",
    fr: "Calculer la livraison",
    en: "Delivery calculator",
  },
  deliveryCalcSub: {
    ar: "اختر مدينتك وطريقة التوصيل لمعرفة السعر قبل إتمام الطلب",
    fr: "Choisissez votre ville et le mode de livraison",
    en: "Pick your city and delivery mode",
  },
  homeDelivery: {
    ar: "توصيل للمنزل",
    fr: "À domicile",
    en: "Home delivery",
  },
  officeDelivery: {
    ar: "توصيل للمكتب",
    fr: "Au bureau",
    en: "Office pickup",
  },
  addToCart: {
    ar: "أضف إلى السلة",
    fr: "Ajouter au panier",
    en: "Add to cart",
  },
  quickOrder: {
    ar: "اطلب الآن بنقرة واحدة",
    fr: "Commander en 1 clic",
    en: "One-click order",
  },
  inStock: { ar: "متوفر", fr: "En stock", en: "In stock" },
  outOfStock: {
    ar: "نفد المخزون",
    fr: "Rupture de stock",
    en: "Out of stock",
  },
  notifyMe: {
    ar: "نبهني عند التوفر",
    fr: "Me notifier",
    en: "Notify me",
  },
  notifyDone: {
    ar: "تم تسجيل طلبك، سنتصل بك فور توفر الكتاب",
    fr: "C'est noté, on vous appellera dès sa disponibilité",
    en: "Noted — we'll call you when it's back",
  },
  author: { ar: "المؤلف", fr: "Auteur", en: "Author" },
  publisher: { ar: "دار النشر", fr: "Éditeur", en: "Publisher" },
  reviewer: { ar: "المحقق", fr: "Vérificateur", en: "Editor" },
  volumes: { ar: "المجلدات", fr: "Volumes", en: "Volumes" },
  pages: { ar: "الصفحات", fr: "Pages", en: "Pages" },
  coverType: { ar: "التجليد", fr: "Reliure", en: "Binding" },
  category: { ar: "التصنيف", fr: "Catégorie", en: "Category" },
  aboutBook: {
    ar: "نبذة عن الكتاب",
    fr: "À propos du livre",
    en: "About this book",
  },
  bookIndex: {
    ar: "عاين الفهرس قبل الشراء",
    fr: "Aperçu du sommaire",
    en: "Preview the index",
  },
  galleryPackaging: {
    ar: "طريقة التغليف",
    fr: "Emballage",
    en: "Packaging",
  },
  relatedBooks: { ar: "كتب ذات صلة", fr: "Livres liés", en: "Related books" },
  backToBooks: {
    ar: "العودة إلى الكتب",
    fr: "Retour aux livres",
    en: "Back to books",
  },
  reviewsCount: { ar: "تقييم", fr: "avis", en: "reviews" },
  cart: { ar: "السلة", fr: "Panier", en: "Cart" },
  cartEmpty: {
    ar: "سلتك فارغة... العلم ينتظرك",
    fr: "Votre panier est vide...",
    en: "Your cart is empty...",
  },
  cartCta: {
    ar: "ابدأ رحلة القراءة",
    fr: "Commencer",
    en: "Start reading",
  },
  qty: { ar: "الكمية", fr: "Qté", en: "Qty" },
  subtotal: { ar: "المجموع الفرعي", fr: "Sous-total", en: "Subtotal" },
  deliveryFee: { ar: "التوصيل", fr: "Livraison", en: "Delivery" },
  total: { ar: "المجموع", fr: "Total", en: "Total" },
  coupon: { ar: "قسيمة الخصم", fr: "Coupon", en: "Coupon" },
  apply: { ar: "تطبيق", fr: "Appliquer", en: "Apply" },
  couponOk: {
    ar: "تم تطبيق الخصم بنجاح",
    fr: "Coupon appliqué",
    en: "Coupon applied",
  },
  couponBad: {
    ar: "القسيمة غير صالحة",
    fr: "Coupon invalide",
    en: "Invalid coupon",
  },
  toCheckout: {
    ar: "إتمام الشراء",
    fr: "Commander",
    en: "Checkout",
  },
  checkoutTitle: {
    ar: "إتمام الطلب",
    fr: "Finaliser la commande",
    en: "Checkout",
  },
  fullName: { ar: "الاسم الكامل", fr: "Nom complet", en: "Full name" },
  phone: { ar: "رقم الهاتف", fr: "Téléphone", en: "Phone" },
  wilaya: { ar: "المدينة", fr: "Ville", en: "City" },
  commune: { ar: "الحي", fr: "Quartier", en: "District" },
  address: { ar: "العنوان", fr: "Adresse", en: "Address" },
  errName: { ar: "الاسم الكامل مطلوب", fr: "Nom complet requis", en: "Full name is required" },
  errPhone: {
    ar: "رقم هاتف مغربي صحيح (05/06/07...)",
    fr: "Numéro marocain valide (05/06/07...)",
    en: "Valid Moroccan number (05/06/07...)",
  },
  errPhone2: { ar: "رقم هاتف مغربي صحيح", fr: "Numéro marocain valide", en: "Valid Moroccan number" },
  errCommune: { ar: "الحي مطلوب", fr: "Quartier requis", en: "District is required" },
  errField: {
    ar: "يرجى ملء هذا الحقل بشكل صحيح",
    fr: "Veuillez remplir ce champ correctement",
    en: "Please fill this field correctly",
  },
  phName: { ar: "مثال: محمد بن أحمد", fr: "ex. Mohammed ben Ahmed", en: "e.g. Mohammed ben Ahmed" },
  phGiftNote: { ar: "اكتب كلماتك الطيبة...", fr: "Écrivez vos mots doux...", en: "Write your kind words..." },
  deliveryType: {
    ar: "نوع التوصيل",
    fr: "Mode de livraison",
    en: "Delivery type",
  },
  payment: { ar: "الدفع", fr: "Paiement", en: "Payment" },
  cod: {
    ar: "الدفع عند الاستلام",
    fr: "Paiement à la livraison",
    en: "Cash on delivery",
  },
  giftWrap: {
    ar: "تغليف هدية + بطاقة إهداء",
    fr: "Emballage cadeau + carte",
    en: "Gift wrap + card",
  },
  giftNote: {
    ar: "نص الإهداء",
    fr: "Message de dédicace",
    en: "Dedication message",
  },
  notes: { ar: "ملاحظات", fr: "Notes", en: "Notes" },
  confirmOrder: { ar: "تأكيد الطلب", fr: "Confirmer", en: "Confirm order" },
  orderSummary: {
    ar: "ملخص الطلب",
    fr: "Résumé",
    en: "Order summary",
  },
  thanksTitle: {
    ar: "شكراً لثقتكم! تم استلام طلبكم",
    fr: "Merci ! Commande reçue",
    en: "Thank you! Order received",
  },
  thanksSub: {
    ar: "سنتصل بك قريباً للتأكيد. احتفظ برقم الطلب لتتبع طلبك.",
    fr: "Nous vous appellerons pour confirmer. Gardez votre numéro pour le suivi.",
    en: "We'll call you to confirm. Keep your order number for tracking.",
  },
  orderNumber: { ar: "رقم الطلب", fr: "N° commande", en: "Order no." },
  trackCta: {
    ar: "تتبع الطلبية",
    fr: "Suivre la commande",
    en: "Track order",
  },
  verifyTitle: {
    ar: "تأكيد الطلبية",
    fr: "Vérification",
    en: "Order verification",
  },
  verifySub: {
    ar: "أدخل رمز التحقق المذكور في صفحة الشكر",
    fr: "Entrez le code indiqué sur la page de remerciement",
    en: "Enter the code shown on the thank-you page",
  },
  verifyBtn: { ar: "تأكيد", fr: "Vérifier", en: "Verify" },
  verifyOk: {
    ar: "تم تأكيد طلبك بنجاح، جارٍ تحضيره",
    fr: "Commande confirmée, en préparation",
    en: "Order confirmed, being prepared",
  },
  verifyBad: {
    ar: "الرمز غير صحيح، حاول مجدداً",
    fr: "Code incorrect",
    en: "Wrong code",
  },
  trackingTitle: {
    ar: "تتبع الطلبية",
    fr: "Suivi de commande",
    en: "Track your order",
  },
  trackingSub: {
    ar: "أدخل رقم الطلب أو رقم الهاتف",
    fr: "Entrez le N° ou le téléphone",
    en: "Enter order number or phone",
  },
  trackingBtn: { ar: "بحث", fr: "Rechercher", en: "Search" },
  trackingNotFound: {
    ar: "لم نجد طلباً بهذه المعلومات",
    fr: "Aucune commande trouvée",
    en: "No order found",
  },
  statusPending: { ar: "قيد المراجعة", fr: "En révision", en: "Under review" },
  statusConfirmed: { ar: "مؤكد", fr: "Confirmée", en: "Confirmed" },
  statusPacked: { ar: "تم التغليف", fr: "Emballée", en: "Packed" },
  statusShipped: {
    ar: "في طريق التوصيل",
    fr: "En livraison",
    en: "On the way",
  },
  statusDelivered: { ar: "تم التوصيل", fr: "Livrée", en: "Delivered" },
  statusReturned: { ar: "مرتجع", fr: "Retournée", en: "Returned" },
  wishlist: { ar: "المفضلة", fr: "Favoris", en: "Wishlist" },
  wishlistEmpty: {
    ar: "لا توجد كتب محفوظة بعد",
    fr: "Aucun favori pour le moment",
    en: "No saved books yet",
  },
  footerAbout: {
    ar: "مكتبة يُسر — كتب شرعية، قصص ملهمة، تربية ووعي. نشارك معكم رحلة تبدأ بكتاب، مع توصيل لجميع مدن المغرب وأوروبا.",
    fr: "Yusr Books — livres religieux, histoires inspirantes et éducation, livrés dans toutes les villes du Maroc et en Europe.",
    en: "Yusr Books — religious books, inspiring stories and education, delivered across Morocco and Europe.",
  },
  footerShop: { ar: "المتجر", fr: "Boutique", en: "Shop" },
  footerHelp: { ar: "المساعدة", fr: "Aide", en: "Help" },
  footerContact: { ar: "تواصل معنا", fr: "Contact", en: "Contact" },
  linkAbout: { ar: "من نحن", fr: "À propos", en: "About us" },
  linkTerms: {
    ar: "الشروط والأحكام",
    fr: "Conditions générales",
    en: "Terms & conditions",
  },
  linkDelivery: {
    ar: "سياسة التوصيل",
    fr: "Politique de livraison",
    en: "Delivery policy",
  },
  linkPrivacy: {
    ar: "سياسة الخصوصية",
    fr: "Confidentialité",
    en: "Privacy policy",
  },
  rights: {
    ar: "جميع الحقوق محفوظة لمكتبة يُسر",
    fr: "Tous droits réservés à Yusr Books",
    en: "All rights reserved to Yusr Books",
  },
  designedBy: {
    ar: "صُمم بواسطة K.Haithem",
    fr: "Conçu par K.Haithem",
    en: "Designed by K.Haithem",
  },
  catalogTitle: { ar: "مكتبة الكتب", fr: "Catalogue", en: "Catalog" },
  filterCategory: { ar: "التصنيف", fr: "Catégorie", en: "Category" },
  filterPublisher: {
    ar: "دار النشر",
    fr: "Éditeur",
    en: "Publisher",
  },
  filterPrice: { ar: "السعر", fr: "Prix", en: "Price" },
  filterBinding: { ar: "التجليد", fr: "Reliure", en: "Binding" },
  all: { ar: "الكل", fr: "Tous", en: "All" },
  sortNew: { ar: "الأحدث", fr: "Nouveautés", en: "Newest" },
  sortCheap: {
    ar: "السعر: من الأقل",
    fr: "Prix croissant",
    en: "Price: low",
  },
  sortExp: {
    ar: "السعر: من الأعلى",
    fr: "Prix décroissant",
    en: "Price: high",
  },
  sortTop: { ar: "الأعلى تقييماً", fr: "Mieux notés", en: "Top rated" },
  noResults: {
    ar: "لا توجد نتائج مطابقة لبحثك",
    fr: "Aucun résultat",
    en: "No matching results",
  },
  bundlesTitle: {
    ar: "مجموعات طالب العلم",
    fr: "Collections",
    en: "Student bundles",
  },
  bundlesSub: {
    ar: "خطط قراءة وباقات جاهزة بسعر أقل من مجموع الكتب",
    fr: "Des packs prêts à prix réduit",
    en: "Ready packs cheaper than separate books",
  },
  bundleIncludes: { ar: "يشمل", fr: "Inclut", en: "Includes" },
  booksWord: { ar: "كتب", fr: "livres", en: "books" },
  saveWord: { ar: "وفّر", fr: "Économisez", en: "Save" },
  authorsSub: {
    ar: "تصفح حسب المؤلف أو السلسلة",
    fr: "Par auteur ou série",
    en: "Browse by author or series",
  },
  seriesTitle: {
    ar: "السلاسل والمجلدات",
    fr: "Séries",
    en: "Series",
  },
  aboutTitle: { ar: "من نحن", fr: "À propos", en: "About us" },
  termsTitle: {
    ar: "الشروط والأحكام",
    fr: "Conditions générales",
    en: "Terms & conditions",
  },
  deliveryTitle: {
    ar: "سياسة التوصيل",
    fr: "Livraison",
    en: "Delivery policy",
  },
  privacyTitle: {
    ar: "سياسة الخصوصية",
    fr: "Confidentialité",
    en: "Privacy policy",
  },
  adminLogin: {
    ar: "دخول الإدارة",
    fr: "Espace admin",
    en: "Admin login",
  },
  email: { ar: "البريد", fr: "E-mail", en: "Email" },
  password: { ar: "كلمة السر", fr: "Mot de passe", en: "Password" },
  login: { ar: "دخول", fr: "Connexion", en: "Sign in" },
  logout: { ar: "خروج", fr: "Déconnexion", en: "Sign out" },
  dash: { ar: "لوحة القيادة", fr: "Tableau de bord", en: "Dashboard" },
  tabAnalytics: { ar: "الإحصائيات", fr: "Stats", en: "Analytics" },
  tabProducts: { ar: "المنتجات", fr: "Produits", en: "Products" },
  tabOrders: { ar: "الطلبات", fr: "Commandes", en: "Orders" },
  tabCustomers: { ar: "العملاء والآراء", fr: "Clients & avis", en: "Customers" },
  tabShipping: { ar: "الشحن", fr: "Expédition", en: "Shipping" },
  tabReturns: { ar: "المرتجعات", fr: "Retours", en: "Returns" },
  statRevenue: { ar: "المبيعات", fr: "Revenus", en: "Revenue" },
  statOrders: { ar: "الطلبات", fr: "Commandes", en: "Orders" },
  statBooks: { ar: "الكتب", fr: "Livres", en: "Books" },
  statPending: { ar: "قيد المراجعة", fr: "En attente", en: "Pending" },
  newOrder: { ar: "طلب جديد", fr: "Nouvelle commande", en: "New order" },
  topBooks: {
    ar: "الكتب الأكثر مبيعاً",
    fr: "Top ventes",
    en: "Top selling books",
  },
  exportCsv: {
    ar: "تصدير CSV",
    fr: "Exporter CSV",
    en: "Export CSV",
  },
  printLabel: {
    ar: "طباعة الملصق",
    fr: "Imprimer l'étiquette",
    en: "Print label",
  },
  changeStatus: {
    ar: "تغيير الحالة",
    fr: "Changer le statut",
    en: "Change status",
  },
  remove: { ar: "حذف", fr: "Supprimer", en: "Delete" },
  edit: { ar: "تعديل", fr: "Modifier", en: "Edit" },
  save: { ar: "حفظ", fr: "Enregistrer", en: "Save" },
  cancel: { ar: "إلغاء", fr: "Annuler", en: "Cancel" },
  close: { ar: "إغلاق", fr: "Fermer", en: "Close" },
  free: { ar: "مجاني", fr: "Gratuit", en: "Free" },
  da: { ar: "درهم", fr: "MAD", en: "MAD" },
  addedToast: {
    ar: "أُضيف إلى السلة",
    fr: "Ajouté au panier",
    en: "Added to cart",
  },
  otpLabel: { ar: "رمز التحقق", fr: "Code OTP", en: "OTP code" },
  continueShopping: {
    ar: "مواصلة التسوق",
    fr: "Continuer mes achats",
    en: "Continue shopping",
  },
  home: { ar: "الرئيسية", fr: "Accueil", en: "Home" },
  notFoundTitle: {
    ar: "الصفحة غير موجودة",
    fr: "Page introuvable",
    en: "Page not found",
  },
  notFoundSub: {
    ar: "يبدو أنك سلكت طريقاً لا يؤدي إلى العلم... لنعد معاً.",
    fr: "Ce chemin ne mène nulle part... revenons ensemble.",
    en: "This path leads nowhere... let's head back.",
  },
  buyNow: { ar: "اشتري الآن", fr: "Acheter", en: "Buy now" },
  phone2: { ar: "رقم هاتف ثانٍ (اختياري)", fr: "2e téléphone (optionnel)", en: "Second phone (optional)" },
  carrierLabel: { ar: "شركة التوصيل", fr: "Transporteur", en: "Carrier" },
  printReceipt: { ar: "طباعة الوصل", fr: "Imprimer le reçu", en: "Print receipt" },
  navFaq: { ar: "الأسئلة الشائعة", fr: "FAQ", en: "FAQ" },
  overview: { ar: "الرئيسية", fr: "Aperçu", en: "Overview" },
  manageBooks: { ar: "إدارة الكتب والكتالوج", fr: "Livres & catalogue", en: "Books & catalog" },
  ordersHub: { ar: "إدارة الطلبيات", fr: "Commandes", en: "Orders" },
  deliveryHub: { ar: "الشحن والتوصيل", fr: "Livraison", en: "Shipping" },
  offersHub: { ar: "العروض والبوكسات", fr: "Offres & coffrets", en: "Offers & bundles" },
  customersTab: { ar: "الزبناء والمراجعات", fr: "Clients & avis", en: "Customers & reviews" },
  contentPages: { ar: "الصفحات والمحتوى", fr: "Pages & contenu", en: "Pages & content" },
  storeSettings: { ar: "إعدادات المتجر", fr: "Paramètres", en: "Store settings" },
  quickSearch: { ar: "بحث سريع...", fr: "Recherche rapide...", en: "Quick search..." },
  viewStore: { ar: "المتجر", fr: "Boutique", en: "Store" },
  confirmOrd: { ar: "تأكيد الطلب", fr: "Confirmer", en: "Confirm" },
  cancelOrd: { ar: "إلغاء", fr: "Annuler", en: "Cancel" },
  orderDetails: { ar: "تفاصيل الطلب", fr: "Détails", en: "Order details" },
  pickListBtn: { ar: "قائمة التحضير", fr: "Pick list", en: "Pick list" },
  ratesBtn: { ar: "أسعار التوصيل", fr: "Tarifs", en: "Rates" },
  reportBtn: { ar: "تقرير المبيعات", fr: "Rapport ventes", en: "Sales report" },
  lowStockAlert: { ar: "تنبيه: مخزون منخفض", fr: "Stock bas", en: "Low stock" },
  todaySales: { ar: "مبيعات اليوم", fr: "Ventes du jour", en: "Today sales" },
  pendingOrdersLbl: { ar: "طلبيات قيد التجهيز", fr: "En préparation", en: "Pending orders" },
  stockBooks: { ar: "الكتب في المخزن", fr: "Livres en stock", en: "Books in stock" },
  uploadImg: { ar: "رفع صورة الغلاف", fr: "Photo de couverture", en: "Upload cover" },
  pdfFile: { ar: "ملف المعاينة PDF", fr: "Fichier PDF", en: "Preview PDF" },
  catSeriesLbl: { ar: "التصنيفات والسلاسل", fr: "Catégories & séries", en: "Categories & series" },
  saveChanges: { ar: "حفظ التغييرات", fr: "Enregistrer", en: "Save changes" },
  invoiceBtn: { ar: "الفاتورة", fr: "Facture", en: "Invoice" },
  labelBtn: { ar: "الملصق", fr: "Étiquette", en: "Label" },
  giftCardBtn: { ar: "بطاقة الإهداء", fr: "Carte cadeau", en: "Gift card" },
  newOrdersLbl: { ar: "طلبات جديدة", fr: "Nouvelles commandes", en: "New orders" },
  customerData: { ar: "بيانات الزبون", fr: "Client", en: "Customer" },
  codAmount: { ar: "المبلغ عند الاستلام", fr: "Montant COD", en: "COD amount" },
  lightMode: { ar: "الوضع الفاتح", fr: "Mode clair", en: "Light mode" },
  darkMode: { ar: "الوضع الداكن", fr: "Mode sombre", en: "Dark mode" },
  addNew: { ar: "إضافة جديد", fr: "Ajouter", en: "Add new" },
} as const;

export type DictKey = keyof typeof dict;

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: DictKey) => string;
  dir: "rtl" | "ltr";
}

const Ctx = createContext<I18nCtx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => dict[k][DEFAULT_LOCALE],
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("yusr-locale") as Locale | null;
      if (saved && LOCALES.includes(saved)) setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("yusr-locale", locale);
    } catch {}
  }, [locale]);

  const t = useCallback((k: DictKey) => dict[k][locale], [locale]);

  const value = useMemo<I18nCtx>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t,
      dir: locale === "ar" ? "rtl" : "ltr",
    }),
    [locale, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

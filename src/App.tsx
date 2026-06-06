import React, { useState, useEffect, useRef, FormEvent, MouseEvent } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Scissors,
  Heart,
  User,
  MapPin,
  Maximize2,
  ChevronRight,
  X,
  Check,
  RotateCcw,
  Clock,
  ArrowRight,
  Search,
  Gift,
  Eye,
  Info,
  Calendar,
  Truck,
  FileText,
  BadgeAlert,
  Printer
} from 'lucide-react';

// --- DATA STRUCTURES ---

interface Product {
  id: number;
  name: string;
  category: 'outerwear' | 'dresses' | 'suiting' | 'knitwear' | 'shirts';
  gender: 'men' | 'women';
  price: number;
  description: string;
  fabric: {
    type: string;
    origin: string;
    threadCount?: string;
    weight?: string;
    care: string;
  };
  image: string;
  colors: { name: string; hex: string }[];
}

interface CartItem {
  id: string; // Unique configuration ID
  product: Product;
  size: string;
  color: { name: string; hex: string };
  sleeveOption: string;
  monogram: string;
  giftWrap: { name: string; price: number };
  quantity: number;
}

// --- CURATED PREMIUM PRODUCTS (Indian Rupees ₹) ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "The Cashmere Wrap Coat",
    category: "outerwear",
    gender: "women",
    price: 24500,
    description: "An iconic belted wrap silhouette drape tailored from dual-brushed Himalayan cashmere fibers. Effortless style meets majestic winter defense.",
    fabric: {
      type: "100% Grade-A Mongolian Cashmere Wool",
      origin: "Ethically hand-gathered from Ladakh High Plains",
      threadCount: "350 Yarn Count Double-Sided",
      weight: "Heavyweight (480 GSM)",
      care: "Dry Clean Only with Specialized Silk Guard"
    },
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Oyster Charcoal", hex: "#2C2A29" },
      { name: "Pure Camel Luxe", hex: "#C5A079" },
      { name: "Saffron Bronze", hex: "#9E6D43" }
    ]
  },
  {
    id: 2,
    name: "The Whisper Silk Slip Dress",
    category: "dresses",
    gender: "women",
    price: 15900,
    description: "Bias-cut drapes flowing naturally across the silhouette, featuring subtle French lace scalloping and adjustable silk cords.",
    fabric: {
      type: "100% Organic Mulberry Peace Silk",
      origin: "Mill-spun under standard supervision in Varanasi",
      threadCount: "19 Momme Lustrous Satin Finish",
      weight: "Featherweight (80 GSM)",
      care: "Mild Handwash or Deluxe Green Dry Clean"
    },
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Champagne Pearl", hex: "#EADDC9" },
      { name: "Crimson Velvet", hex: "#7E1E2D" },
      { name: "Midnight Obsidian", hex: "#111111" }
    ]
  },
  {
    id: 3,
    name: "Mélange Merino Knit Sweater",
    category: "knitwear",
    gender: "women",
    price: 9800,
    description: "Subtle micro-ribbed knit design with flared cuffs, offering premium warmth, effortless drape, and seamless shoulder curves.",
    fabric: {
      type: "85% Australian Merino, 15% Pure Cashmere blend",
      origin: "Crafted in the certified mills of Himachal Pradesh",
      threadCount: "12-Spun Gauged Seamless Weave",
      weight: "Medium-light (220 GSM)",
      care: "Handwash Cold, Dry Flat in Natural Shade"
    },
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Alabaster Cream", hex: "#F3ECE0" },
      { name: "Muted Forest", hex: "#3A4D39" },
      { name: "Dusty Rosewood", hex: "#9E7675" }
    ]
  },
  {
    id: 4,
    name: "Imperial Linen Pleated Pants",
    category: "suiting",
    gender: "women",
    price: 11200,
    description: "Wide-leg draped tailored trousers with structural forward pleats and double-fastened hidden French waistband hardware.",
    fabric: {
      type: "70% Organic Flax Linen, 30% Mulberry Silk",
      origin: "Loomed by master artisans in Courtrai, Belgium",
      threadCount: "Artisanal Twill Weave",
      weight: "Spring Breathable (310 GSM)",
      care: "Delicate Steamed Pressing Required"
    },
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Oatmeal Beige", hex: "#DDD3C1" },
      { name: "Slate Charcoal", hex: "#3E4142" },
      { name: "Sea Grass Green", hex: "#606C5D" }
    ]
  },
  {
    id: 5,
    name: "The Italian Suede Field Jacket",
    category: "outerwear",
    gender: "men",
    price: 29900,
    description: "Sumptuous sand-washed Italian calfskin suede tailored into a utility safari coat, finished with custom handcrafted horn closure buttons.",
    fabric: {
      type: "100% Genuine Full-Grain Italian Calf Suede",
      origin: "Tanned and cured by hand in Florence, Italy",
      threadCount: "Hand-brushed Premium Nappa Reverse",
      weight: "Premium Leather Weight (680 GSM)",
      care: "Professional Suede Dry Clean Treatment Only"
    },
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Tuscan Brown", hex: "#835C43" },
      { name: "Espresso Tint", hex: "#3D3028" },
      { name: "Olive Field", hex: "#4C5140" }
    ]
  },
  {
    id: 6,
    name: "The French Cuff Linen Shirt",
    category: "shirts",
    gender: "men",
    price: 7500,
    description: "A clean staple of masculine elegance, introducing high ventilation, double French cuffs, and genuine Australian Mother of Pearl buttons.",
    fabric: {
      type: "100% European Flax Linen Certified Organic",
      origin: "Belgian fields weave finalized in Bangalore bespoke mills",
      threadCount: "210 Thread Count Premium Plain Weave",
      weight: "Light breezy (160 GSM)",
      care: "Friendly Standard Handwash, Hang to Air-Dry"
    },
    image: "https://images.unsplash.com/photo-1621572474936-d621927f238a?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Glistening White", hex: "#FDFDFD" },
      { name: "Mist Blue", hex: "#CBDADE" },
      { name: "Faded Sand", hex: "#E4DCCF" }
    ]
  },
  {
    id: 7,
    name: "Bespoke Wool Tweed Blazer",
    category: "suiting",
    gender: "men",
    price: 21400,
    description: "Unstructured soft shoulder form, featuring masterfully rolled lapels, dual-vented backs, and premium Japanese Cupro silk lining.",
    fabric: {
      type: "80% Pure Virgin Wool Tweed, 20% Mulberry Silk lining",
      origin: "Virgin wool spun by hand in the Outer Hebrides",
      threadCount: "Dual-thread Herringbone Tweed Weave",
      weight: "Structured (400 GSM)",
      care: "Deluxe Dry Clean and Cedar Storage Only"
    },
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Herringbone Grey", hex: "#5C5D5F" },
      { name: "Highland Amber", hex: "#6E4E37" },
      { name: "Midnight Navy", hex: "#1C2433" }
    ]
  },
  {
    id: 8,
    name: "Cashmere Quarter-Zip Pullover",
    category: "knitwear",
    gender: "men",
    price: 13800,
    description: "Perfect transient-weather layering element featuring hand-burnished solid brass zippers with custom brown calf leather zipper tags.",
    fabric: {
      type: "90% Ultra-Fine Merino Wool, 10% Tibetan Cashmere",
      origin: "Sourced from the premium high altitude mills in Tibet",
      threadCount: "16-Spun Gauge Premium Compact Ribbing",
      weight: "Soft Lightweight (260 GSM)",
      care: "Gently Handwash Cold, Never Tumble Dry"
    },
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Vintage Charcoal", hex: "#323334" },
      { name: "Cream Oatmeal", hex: "#E8E2D5" },
      { name: "Forest Moss", hex: "#2A362B" }
    ]
  },
  {
    id: 9,
    name: "The Double-Faced Alpaca Cape",
    category: "outerwear",
    gender: "women",
    price: 27800,
    description: "An open-front enveloping cape tailored from ultra-soft baby alpaca blend fibers, presenting a majestic draped fluid shoulder line.",
    fabric: {
      type: "80% Peruvian Baby Alpaca, 20% Virgin Wool",
      origin: "Sheared and spun at historic mills in Arequipa, Peru",
      threadCount: "Brushed Dual-Face Weave",
      weight: "Heavyweight (420 GSM)",
      care: "Dry Clean Only, Hang on Broad Wooden Hanger"
    },
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Alabaster Beige", hex: "#E8DCC4" },
      { name: "Sable Melange", hex: "#4E4033" }
    ]
  },
  {
    id: 10,
    name: "Charcoal Savoy Double-Breasted Jacket",
    category: "suiting",
    gender: "men",
    price: 32000,
    description: "Impeccably tailored double-breasted block silhouette with sharp peak lapels, featuring a structured floating canvas and horn fasteners.",
    fabric: {
      type: "100% Super 150s Merino Worsted Wool",
      origin: "Woven in Yorkshire, England by heritage weavers",
      threadCount: "Super 150s Worsted Twill",
      weight: "Mediumweight (290 GSM)",
      care: "Professional Press and Dry Clean Only"
    },
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "London Charcoal", hex: "#323639" },
      { name: "Midnight Navy", hex: "#1D232F" }
    ]
  },
  {
    id: 11,
    name: "The Soft Suede Utility Jacket",
    category: "outerwear",
    gender: "men",
    price: 26500,
    description: "Combining structural modern utility with peerless hand-feel, this lamb suede hybrid works wonderfully as a transition lifestyle statement.",
    fabric: {
      type: "100% Selected Velour Lamb Suede",
      origin: "Tanned using traditional organic chestnut methods in Milan",
      threadCount: "Hand-sanded Brushed Grain",
      weight: "Structured (340 GSM)",
      care: "Suede Brush and Specialty Protection Fluid"
    },
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Warm Ochre", hex: "#C68E56" },
      { name: "Deep Chocolate", hex: "#4A3225" }
    ]
  },
  {
    id: 12,
    name: "Ribbed Mulberry Silk Mock-Neck",
    category: "knitwear",
    gender: "women",
    price: 12500,
    description: "An elegant slim-fit layering piece spun from long-staple mulberry silk threads, displaying a subtle luster and refined rib-knit texture.",
    fabric: {
      type: "70% Spun Mulberry Silk, 30% Fine Cotton",
      origin: "Woven in specialized ateliers in Kyoto, Japan",
      threadCount: "18-Gauge Flat-Bed Pointelle Knit",
      weight: "Lightweight (180 GSM)",
      care: "Wash with Silk Soap, Lay Flat to Dry"
    },
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Eggshell White", hex: "#F3EFE9" },
      { name: "Burnt Sienna", hex: "#A0583C" },
      { name: "Teal Noir", hex: "#143D3F" }
    ]
  },
  {
    id: 13,
    name: "Lustrous Silk Cowl-Neck Blouse",
    category: "shirts",
    gender: "women",
    price: 11800,
    description: "Bias-cut cowl neckline beautifully framing the decolletage, falling with fluid satin drapery and sophisticated barrel cuffs.",
    fabric: {
      type: "100% Heavy Crepe de Chine Silk",
      origin: "Loom-spun in Lyon, France with satin finish",
      threadCount: "22 Momme Heavy Charmeuse",
      weight: "Fluid Midweight (120 GSM)",
      care: "Dry Clean Preferred, Steam Low Temperature"
    },
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Pearl Ivory", hex: "#FAF6EF" },
      { name: "Saffron Marigold", hex: "#DFA451" },
      { name: "Smoky Graphite", hex: "#404245" }
    ]
  },
  {
    id: 14,
    name: "Monolithic Linen-Blend Jumpsuit",
    category: "dresses",
    gender: "women",
    price: 18900,
    description: "A singular structural declaration of ease, merging relaxed wide trouser legs with a minimal surplice mock wrap-around bodice.",
    fabric: {
      type: "60% Organic Flax Linen, 40% Tencel Lyocell",
      origin: "Eco-harvested and spun in Flanders, Belgium",
      threadCount: "Breathable Basketweave",
      weight: "Flowing Midweight (320 GSM)",
      care: "Delicate Machine Wash Cold"
    },
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    colors: [
      { name: "Desert Sage", hex: "#8DA399" },
      { name: "Terracotta Earth", hex: "#B85C42" }
    ]
  }
];

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'home' | 'showroom' | 'story' | 'care'>('home');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization & Details modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customSize, setCustomSize] = useState('M');
  const [customColor, setCustomColor] = useState<{ name: string; hex: string } | null>(null);
  const [sleeveOption, setSleeveOption] = useState('Standard');
  const [monogramInitials, setMonogramInitials] = useState('');
  const [giftWrapping, setGiftWrapping] = useState({ name: 'Minimal Cotton Sack (Complementary)', price: 0 });

  // Cart, Profile, & Favorites (Wishlist) States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
  // Persistent Favorites load from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('atelier_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persistent Favorites save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Prevent background page body scroll when modal or drawer is open
  useEffect(() => {
    const isAnyOverlayOpen = isCartOpen || isProfileOpen || isFavoritesOpen || (selectedProduct !== null);
    if (isAnyOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isProfileOpen, isFavoritesOpen, selectedProduct]);
  
  // Bespoke User Profile Measurements (extremely interactive element)
  const [userProfile, setUserProfile] = useState({
    name: "Vishrut Potdar",
    email: "vishrutpotdar@gmail.com",
    tier: "Platinum Bespoke Patron",
    spendPoints: 14500,
    chest: 102,
    waist: 86,
    sleeve: 66,
    inseam: 81,
    height: 182
  });
  
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [specForm, setSpecForm] = useState({ ...userProfile });

  // UI Micro-interactions
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
  const [justAddedProduct, setJustAddedProduct] = useState<string | null>(null);

  // Active spotlight product showcased in the Home Hero block
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightProducts = PRODUCTS.slice(0, 3);

  // Ref to showroom section for smooth scroll navigation
  const showroomRef = useRef<HTMLDivElement>(null);

  // Interactive Lookbook Reveal Slider States
  const [revealPercent, setRevealPercent] = useState(50);
  const [revealMousePos, setRevealMousePos] = useState({ x: 50, y: 50 });
  const revealContainerRef = useRef<HTMLDivElement>(null);

  const handleRevealMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!revealContainerRef.current) return;
    const rect = revealContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setRevealMousePos({ x, y });
  };

  // Rotate spotlight product automatically to feel super live & interactive
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Initialize selected custom color when modal launches
  useEffect(() => {
    if (selectedProduct) {
      setCustomColor(selectedProduct.colors[0]);
      setCustomSize('M');
      setSleeveOption('Standard');
      setMonogramInitials('');
      setGiftWrapping({ name: 'Minimal Cotton Sack (Complementary)', price: 0 });
    }
  }, [selectedProduct]);

  // Handle smooth scroll
  const handleScrollToProducts = () => {
    setActiveTab('showroom');
    setTimeout(() => {
      showroomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Dynamic Favorites Toggle
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Recommended size engine helper based on client's custom bespoke specs
  const getBespokeSizeRecommendation = () => {
    const chestVal = userProfile.chest;
    if (chestVal < 92) return "S";
    if (chestVal >= 92 && chestVal < 100) return "M";
    if (chestVal >= 100 && chestVal < 108) return "L";
    return "XL";
  };

  // --- ACTIONS ---
  
  // Add personalized item to cart
  const handleAddToCart = (directBuy = false) => {
    if (!selectedProduct || !customColor) return;

    // Generate unique ID based on customization options
    const configId = `${selectedProduct.id}-${customSize}-${customColor.name}-${sleeveOption}-${monogramInitials || 'none'}-${giftWrapping.name}`;
    
    // Calculate customization upcharge standardizer
    let configCost = 0;
    if (sleeveOption === 'Premium French Cuffs (+₹1,200)') configCost += 1200;
    if (monogramInitials && monogramInitials.length > 0) configCost += 800; // Monogramming charge

    const newItem: CartItem = {
      id: configId,
      product: selectedProduct,
      size: customSize,
      color: customColor,
      sleeveOption,
      monogram: monogramInitials,
      giftWrap: giftWrapping,
      quantity: 1
    };

    setCart(prev => {
      const existing = prev.find(item => item.id === configId);
      if (existing) {
        return prev.map(item => item.id === configId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, newItem];
    });

    // Visual animation confirm
    setJustAddedProduct(selectedProduct.name);
    setTimeout(() => setJustAddedProduct(null), 3000);

    setSelectedProduct(null); // Close modal

    if (directBuy) {
      setIsCartOpen(true);
    }
  };

  // Modify quantity inside cart
  const updateQuantity = (id: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Remove single configured item
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Save customized user measurements specs
  const handleSaveSpecs = (e: FormEvent) => {
    e.preventDefault();
    setUserProfile({ ...specForm });
    setIsEditingSpecs(false);
  };

  // Calculate high integrity granular prices
  const getCartTotals = () => {
    const baseItemsTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Add bespoke features
    const modificationsTotal = cart.reduce((sum, item) => {
      let addVal = 0;
      if (item.sleeveOption.includes('French')) addVal += 1200;
      if (item.monogram) addVal += 800;
      addVal += item.giftWrap.price;
      return sum + (addVal * item.quantity);
    }, 0);

    const subtotal = baseItemsTotal + modificationsTotal;
    const luxuryTax = Math.round(subtotal * 0.12); // Standard Indian Clothes GST @ 12%
    const packagingFee = cart.reduce((sum, item) => sum + (item.giftWrap.price > 0 ? item.giftWrap.price : 0), 0) > 0 ? 350 : 0; // prestige delivery surcharge
    
    // Free delivery for premium clients over 10000 Rupees
    const shipping = subtotal > 15000 ? 0 : 450; 
    const finalTotal = subtotal + luxuryTax + packagingFee + shipping;

    return {
      subtotal,
      luxuryTax,
      packagingFee,
      shipping,
      finalTotal
    };
  };

  const totals = getCartTotals();

  // Filter Catalog
  const filteredProducts = PRODUCTS.filter(prod => {
    // Gender toggle
    if (selectedGender !== 'all' && prod.gender !== selectedGender) return false;
    // Category toggle
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return prod.name.toLowerCase().includes(q) || 
             prod.description.toLowerCase().includes(q) ||
             prod.fabric.type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] font-sans flex flex-col selection:bg-[#C5A880] selection:text-white relative overflow-hidden">
      
      {/* Screen-only layout wrapper (hidden on print) */}
      <div className="print:hidden flex flex-col min-h-screen flex-grow">
      
      {/* Decorative Warm Ambient Lighting Element (Not too dark, not too bright, subtle golden glow) */}
      <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#F2EDE4] to-transparent opacity-40 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#EADCC9] opacity-20 blur-3xl -z-10 pointer-events-none" />

      {/* --- FLOATING STATUS BANNER TO CONFIRM BESPOKE ACTION --- */}
      {justAddedProduct && (
        <div id="toast-added" className="fixed top-24 right-4 md:right-8 bg-[#1C1A17] text-[#FAF8F5] border border-[#C5A880] px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C5A880] animate-ping" />
          <p className="text-sm font-medium">
            <span className="text-[#C5A880] italic">“{justAddedProduct}”</span> successfully tailored & added to your suite.
          </p>
        </div>
      )}

      {/* --- BESPOKE HEADER PANEL --- */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#FAF9F6] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Slogan Area */}
          <div className="flex items-center gap-3">
            <button 
              id="btn-brand-logo"
              className="text-2xl font-serif font-semibold tracking-[0.25em] text-[#1C1A17] hover:text-[#C5A880] transition-colors duration-300 text-left"
              onClick={() => setActiveTab('home')}
            >
              ATELIER NOUVEAU
              <span className="block text-[8px] font-sans font-light tracking-[0.45em] text-[#5E5A54] mt-0.5 uppercase">Bespoke Couture House</span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${activeTab === 'home' ? 'text-[#C5A880]' : 'text-[#1C1A17] hover:text-[#C5A880]'}`}
            >
              The Maison
              {activeTab === 'home' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A880]" />}
            </button>
            <button 
              id="nav-showroom"
              onClick={() => {
                setActiveTab('showroom');
                setTimeout(() => showroomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${activeTab === 'showroom' ? 'text-[#C5A880]' : 'text-[#1C1A17] hover:text-[#C5A880]'}`}
            >
              Bespoke Showroom
              {activeTab === 'showroom' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A880]" />}
            </button>
            <button 
              id="nav-story"
              onClick={() => setActiveTab('story')}
              className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${activeTab === 'story' ? 'text-[#C5A880]' : 'text-[#1C1A17] hover:text-[#C5A880]'}`}
            >
              Our Heritage
              {activeTab === 'story' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A880]" />}
            </button>
            <button 
              id="nav-care"
              onClick={() => setActiveTab('care')}
              className={`text-xs uppercase tracking-widest transition-colors font-medium relative py-1 ${activeTab === 'care' ? 'text-[#C5A880]' : 'text-[#1C1A17] hover:text-[#C5A880]'}`}
            >
              Garment Care
              {activeTab === 'care' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A880]" />}
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Search - Showroom mode quick trigger */}
            <div className="relative hidden lg:block w-48">
              <input
                id="search-header-input"
                type="text"
                placeholder="Search fibers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'showroom') setActiveTab('showroom');
                }}
                className="w-full text-xs bg-[#F2EDE4]/60 border border-[#FAF9F6] focus:border-[#C5A880] rounded-none py-1.5 pl-8 pr-3 outline-none text-[#1C1A17] placeholder-[#5E5A54]/60 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#5E5A54] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Profile trigger */}
            <button 
              id="btn-profile-trigger"
              onClick={() => setIsProfileOpen(true)}
              className="p-2 text-[#1C1A17] hover:text-[#C5A880] transition-colors relative"
              title="Tailor Specifications Profile"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A880]" />
            </button>

            {/* Favorites Curation trigger */}
            <button 
              id="btn-favorites-trigger"
              onClick={() => setIsFavoritesOpen(true)}
              className="p-2 text-[#1C1A17] hover:text-[#C5A880] transition-colors relative"
              title="Curated Favorites"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A880] text-white text-[9px] font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF8F5] animate-pulse">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart trigger */}
            <button 
              id="btn-cart-trigger"
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#1C1A17] hover:text-[#C5A880] transition-colors relative"
              title="Bespoke Suite"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A880] text-white text-[9px] font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF8F5]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN ROOT SECTIONS --- */}
      <main className="flex-grow">
        
        {/* ================= SECTION A: HOME / THE MAISON ================= */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            
            {/* HERO BLOCK WITH EXPLICIT BRAND STORY & COMPREHENSIVE SPOTLIGHT COVER */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Brand Pitch & Slogan */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2EDE4] rounded-none text-[#8E7557] text-xs tracking-widest uppercase font-medium">
                    <Sparkles className="w-3 h-3 text-[#C5A880]" />
                    ESTABLISHED IN BESPOKE EXCELLENCE
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] text-[#1C1A17]">
                    The Master of <span className="italic text-[#C5A880]">Quiet Luxury</span> &amp; Golden Fiber
                  </h1>
                  
                  <p className="text-[#5E5A54] leading-relaxed text-sm md:text-base">
                    Atelier Nouveau redefines modern wardrobes with bespoke patternmaking, heirloom materials, and dedicated handcrafting. Every coat, blazer, and dress is individually created upon order. We harvest peace-grown silk, hand-brushed Himalayan cashmere wool, and premium Belgian flax to wrap you in unmatched sensory perfection.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {/* EXPLORE PRODUCT RANGE BUTTON PLACED ABOVE PROMINENTLY */}
                    <button
                      id="hero-explore-btn"
                      onClick={handleScrollToProducts}
                      className="px-8 py-4 bg-[#1C1A17] text-white rounded-none text-xs uppercase tracking-widest font-medium hover:bg-[#C5A880] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                    >
                      Explore Our Product Range
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                    
                    <button
                      id="hero-story-btn"
                      onClick={() => setActiveTab('story')}
                      className="px-8 py-4 border border-[#1C1A17] text-[#1C1A17] rounded-none text-xs uppercase tracking-widest font-medium hover:bg-[#1C1A17] hover:text-[#FAF8F5] transition-all duration-300"
                    >
                      Bespoke Philosophy
                    </button>
                  </div>

                  {/* Brand Trust Metrics */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#F2EDE4]">
                    <div>
                      <span className="block text-xl font-serif text-[#C5A880]">01 / 01</span>
                      <span className="text-[10px] uppercase font-semibold text-[#5E5A54] tracking-wider">Tailored Code</span>
                    </div>
                    <div>
                      <span className="block text-xl font-serif text-[#C5A880]">12%</span>
                      <span className="text-[10px] uppercase font-semibold text-[#5E5A54] tracking-wider">True Luxury Tax</span>
                    </div>
                    <div>
                      <span className="block text-xl font-serif text-[#C5A880]">GST INCL</span>
                      <span className="text-[10px] uppercase font-semibold text-[#5E5A54] tracking-wider">Pure Indian Rupees</span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC FOCUS LIGHT & PRODUCT SPOTLIGHT REVEAL COMPONENT */}
                <div className="lg:col-span-7 bg-[#F4F1EC] p-6 sm:p-8 rounded-none border border-[#E8DDCD] relative overflow-hidden flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-center border-b border-[#E8DDCD]/80 pb-3">
                    <span className="text-[10px] text-[#C5A880] font-sans tracking-[0.25em] font-extrabold uppercase">
                      ★ TACTILE EXPERIENTIAL PREVIEW ★
                    </span>
                    <span className="text-[10px] text-[#5E5A54] font-mono uppercase tracking-widest">
                      Atelier Lookbook Reveal
                    </span>
                  </div>

                  {/* INTERACTIVE WEAVE REVEAL CANVAS WITH REAL-TIME FOCUS LIGHT PROJECTION */}
                  <div className="space-y-4">
                    <div 
                      id="interactive-lookbook-container"
                      ref={revealContainerRef}
                      onMouseMove={handleRevealMouseMove}
                      className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#1C1A17] overflow-hidden group border border-[#E8DDCD] shadow-2xl cursor-crosshair rounded-sm"
                    >
                      {/* Underlay Image: Silk Dress (id: 2) */}
                      <div className="absolute inset-0">
                        <img 
                          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200" 
                          alt="Undergarment: Elegant Whisper Silk Slip Dress" 
                          className="w-full h-full object-cover object-center select-none"
                        />
                        {/* Silk overlay layer info tag */}
                        <div className="absolute bottom-4 left-4 bg-[#1C1A17]/85 backdrop-blur-xs text-[#EADDC9] text-[9px] uppercase tracking-widest px-3 py-1.5 font-semibold border-l-2 border-[#C5A880] select-none">
                          Revealed: Whisper Silk Dress (₹15,900)
                        </div>
                      </div>

                      {/* Overlapping Primary Layer: Cashmere Wrap Coat (id: 1) with custom Clip-path clip to the left of revealPercent */}
                      <div 
                        className="absolute inset-0 select-none transition-all duration-75 ease-out"
                        style={{ clipPath: `polygon(0 0, ${revealPercent}% 0, ${revealPercent}% 100%, 0 100%)` }}
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200" 
                          alt="Outerwear: Premium Cashmere Wrap Coat" 
                          className="w-full h-full object-cover object-center select-none"
                        />
                        {/* Coat overlay layer info tag */}
                        <div className="absolute bottom-4 left-4 bg-white/95 text-[#1C1A17] text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold shadow select-none">
                          Overlay: Cashmere Wrap Coat (₹24,500)
                        </div>
                      </div>

                      {/* Moving Thin Golden Needle Split Indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C5A880] via-[#FAF8F5] to-[#C5A880] pointer-events-none z-20 shadow-md"
                        style={{ left: `${revealPercent}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-[#1C1A17] border border-[#C5A880] text-[#C5A880] w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] select-none shadow-lg">
                          ⇄
                        </div>
                      </div>

                      {/* Simulated Moving Focus Light overlay layer */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 bg-transparent"
                        style={{
                          background: `radial-gradient(circle 140px at ${revealMousePos.x}% ${revealMousePos.y}%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 238, 204, 0.18) 25%, rgba(28, 26, 23, 0.45) 75%, rgba(28, 26, 23, 0.75) 100%)`,
                          mixBlendMode: 'multiply'
                        }}
                      />

                      {/* Ambient Glowing Lens Beam */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-15 mix-blend-color-dodge transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle 90px at ${revealMousePos.x}% ${revealMousePos.y}%, rgba(197, 168, 128, 0.35) 0%, rgba(197, 168, 128, 0.1) 60%, transparent 100%)`
                        }}
                      />
                    </div>

                    {/* Highly premium layout selector control */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs px-1">
                        <span className="font-serif italic text-[#C5A880]">The Reveal Slider</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#5E5A54] font-mono">
                          Slide position: {revealPercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1A17]">Dress under</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={revealPercent} 
                          onChange={(e) => setRevealPercent(parseInt(e.target.value))}
                          className="flex-grow accent-[#1C1A17] cursor-pointer h-1 bg-[#E8DDCD] outline-none"
                        />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C1A17]">Coat over</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed actions for the reveal items */}
                  <div className="bg-white/80 p-4 border border-[#E8DDCD]/80 space-y-3">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[#1C1A17] flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
                      Direct Bespoke Ordering Options
                    </h4>
                    <p className="text-[11px] text-[#5E5A54] leading-relaxed">
                      Experience the seamless translation of fibers. Buy either our dual-brushed Himalayan wrap coat or the Peace silk slip dress directly with custom monogramming.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button 
                        id="btn-reveal-buy-coat"
                        onClick={() => setSelectedProduct(PRODUCTS[0])}
                        className="px-4 py-2.5 bg-[#1C1A17] hover:bg-[#C5A880] text-white text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer"
                      >
                        Order Wrap Coat
                      </button>
                      <button 
                        id="btn-reveal-buy-dress"
                        onClick={() => setSelectedProduct(PRODUCTS[1])}
                        className="px-4 py-2.5 border border-[#1C1A17] text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer"
                      >
                        Order Silk Dress
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* HIGH END PROMOTION CARD GRID (CATEGORIZED TILES) */}
            <section className="bg-[#F2EDE4]/40 py-20 border-y border-[#FAF9F6]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                  <h2 className="text-3xl font-serif text-[#1C1A17]">Shop By Bespoke Silhouette</h2>
                  <p className="text-xs text-[#5E5A54] uppercase tracking-widest font-medium">Divided specifically for absolute luxury fitting</p>
                  <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Women Category Tile */}
                  <div 
                    id="tile-category-women"
                    className="relative group aspect-[16/10] overflow-hidden rounded-xl cursor-pointer shadow-lg"
                    onClick={() => {
                      setSelectedGender('women');
                      setActiveTab('showroom');
                      setTimeout(() => showroomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800" 
                      alt="Women Collection at Atelier" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-8 left-8 right-8 z-20 text-[#FAF8F5] flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">Varanasi Silk & Cashmere</span>
                        <h3 className="text-3xl font-serif font-light tracking-wide">WOMEN’S ATELIER</h3>
                      </div>
                      <div className="p-3 bg-[#C5A880] text-[#1C1A17] rounded-full group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Men Category Tile */}
                  <div 
                    id="tile-category-men"
                    className="relative group aspect-[16/10] overflow-hidden rounded-xl cursor-pointer shadow-lg"
                    onClick={() => {
                      setSelectedGender('men');
                      setActiveTab('showroom');
                      setTimeout(() => showroomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
                    <img 
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
                      alt="Men Collection at Atelier" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-8 left-8 right-8 z-20 text-[#FAF8F5] flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">Hand-Cured Italian Suede & Tweed</span>
                        <h3 className="text-3xl font-serif font-light tracking-wide">MEN’S ATELIER</h3>
                      </div>
                      <div className="p-3 bg-[#C5A880] text-[#1C1A17] rounded-full group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ================= SECTION B: SHOWROOM (STORES & ITEMS) ================= */}
        {activeTab === 'showroom' && (
          <div ref={showroomRef} className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Showroom Header & Interactive Filter Area */}
            <div className="border-b border-[#F2EDE4] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] text-[#C5A880] font-bold uppercase tracking-widest">Bespoke Couture Catalog</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17]">The Luxury Wardrobe</h2>
                <p className="text-xs text-[#5E5A54] max-w-lg">
                  Every product card is individual fabric craft. Click to view custom sizing recomms based on your bespoke profile. Pricing displays standard GST.
                </p>
              </div>

              {/* Dynamic Gender Filter Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="tab-gender-all"
                  onClick={() => setSelectedGender('all')}
                  className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${selectedGender === 'all' ? 'bg-[#1C1A17] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#5E5A54] border border-[#F2EDE4] hover:border-[#C5A880] hover:text-[#C5A880]'}`}
                >
                  All Haute
                </button>
                <button
                  id="tab-gender-women"
                  onClick={() => setSelectedGender('women')}
                  className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${selectedGender === 'women' ? 'bg-[#1C1A17] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#5E5A54] border border-[#F2EDE4] hover:border-[#C5A880] hover:text-[#C5A880]'}`}
                >
                  Women Suite
                </button>
                <button
                  id="tab-gender-men"
                  onClick={() => setSelectedGender('men')}
                  className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${selectedGender === 'men' ? 'bg-[#1C1A17] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#5E5A54] border border-[#F2EDE4] hover:border-[#C5A880] hover:text-[#C5A880]'}`}
                >
                  Men Suite
                </button>
              </div>
            </div>

            {/* Additional Sub-Category Buttons Row */}
            <div className="flex flex-wrap gap-2 mb-8 items-center justify-between">
              
              <div className="flex flex-wrap gap-1.5">
                {['all', 'outerwear', 'dresses', 'knitwear', 'suiting', 'shirts'].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      id={`btn-cat-filter-${cat}`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-none text-[10px] uppercase font-bold tracking-widest transition-all ${isActive ? 'bg-[#C5A880] text-white' : 'bg-[#F2EDE4]/65 text-[#5E5A54] hover:bg-[#EBDDC5] hover:text-[#1C1A17]'}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                <input
                  id="catalog-search"
                  type="text"
                  placeholder="Filter by fiber or weave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-white border border-[#E8DDCD] focus:border-[#C5A880] py-2 pl-8 pr-3 outline-none rounded-none text-[#1C1A17] placeholder-[#5E5A54]/60"
                />
                <Search className="w-3.5 h-3.5 text-[#5E5A54] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button 
                    id="btn-clear-search"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#5E5A54] hover:text-black font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>

            {/* --- PRODUCTS GRID WITH SPOTLIGHT GLOW EFFECT --- */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#F2EDE4]/30 rounded-xl border border-dashed border-[#E8DDCD] max-w-md mx-auto space-y-3">
                <BadgeAlert className="w-8 h-8 text-[#C5A880] mx-auto opacity-75" />
                <h4 className="text-lg font-serif">Maison Fiber Not Located</h4>
                <p className="text-xs text-[#5E5A54] px-4">
                  We could not locate items matching &ldquo;{searchQuery}&rdquo;. Try filtering by basic collections or fiber terms like &ldquo;cashmere&rdquo; or &ldquo;silk&rdquo;.
                </p>
                <button
                  id="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedGender('all');
                  }}
                  className="px-4 py-2 bg-[#1C1A17] text-[#FAF8F5] text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A880]"
                >
                  Reset Catalog Selection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((prod) => {
                  const isFavorited = favorites.includes(prod.id);
                  const isHovered = hoveredCardId === prod.id;
                  
                  return (
                    <div
                      id={`product-card-${prod.id}`}
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="group flex flex-col justify-between h-full bg-[#F2EDE4]/35 p-3 rounded-xl border border-[#FAF9F6] cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300 relative"
                      onMouseEnter={() => setHoveredCardId(prod.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      {/* Interactive Spotlight Glow Frame around the focused product */}
                      {isHovered && (
                        <div className="absolute inset-0 border-2 border-[#C5A880] rounded-xl pointer-events-none z-10 transition-all shadow-md shadow-[#C5A880]/15" />
                      )}

                      <div className="space-y-4">
                        
                        {/* Image Holder */}
                        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 relative shadow-inner">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          
                          {/* Sizing Recommendation Tag overlay directly on card */}
                          <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-sm shadow px-2 py-1 flex items-center gap-1">
                            <Scissors className="w-2.5 h-2.5 text-[#C5A880]" />
                            <span className="text-[8px] font-bold tracking-widest uppercase text-[#1C1A17]">Rec Size: {getBespokeSizeRecommendation()}</span>
                          </div>

                          {/* Favorite button */}
                          <button
                            id={`btn-fav-prod-${prod.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(prod.id);
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-[#FAF8F5]/90 text-[#1C1A17] hover:bg-white hover:text-red-500 shadow-sm transition-colors z-20"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500 stroke-red-500 text-red-500' : 'text-[#1C1A17]'}`} />
                          </button>

                          {/* Quick view text overlay */}
                          <div className="absolute inset-0 bg-[#1C1A17]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 bg-[#FAF8F5]/95 text-[#1C1A17] font-extrabold text-[9px] uppercase tracking-[0.15em] shadow-lg border border-[#E8DDCD]">
                              Tap to Custom Fit
                            </span>
                          </div>
                        </div>

                        {/* Description & Details Below */}
                        <div className="space-y-1.5 px-1">
                          
                          {/* Categorized and Gender indicators and fabric tag */}
                          <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#5E5A54] font-semibold">
                            <span>{prod.category} — {prod.gender}</span>
                            <span className="text-[#C5A880] italic">Premium Loom</span>
                          </div>

                          <h3 className="text-sm font-bold text-[#1C1A17] group-hover:text-[#C5A880] transition-colors line-clamp-1">
                            {prod.name}
                          </h3>

                          {/* Short Description */}
                          <p className="text-xs text-[#5E5A54] font-light line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>

                        </div>

                      </div>

                      {/* Pricing Tag of Rupees and direct details button */}
                      <div className="border-t border-[#FAF9F6] pt-3.5 mt-4 flex items-center justify-between px-1">
                        <div className="text-[#1C1A17] font-serif font-bold text-base">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] group-hover:text-[#1C1A17] transition-colors flex items-center gap-1">
                          Configure Specs
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ================= SECTION C: BRAND HERITAGE / STORY ================= */}
        {activeTab === 'story' && (
          <div className="animate-fade-in max-w-4xl mx-auto px-4 py-16 space-y-12 text-[#1C1A17]">
            <div className="text-center space-y-4">
              <span className="text-[10px] text-[#C5A880] font-bold uppercase tracking-widest">Slow Fashion Manifest</span>
              <h1 className="text-4xl sm:text-5xl font-serif">Quiet Luxury, Dedicated Time</h1>
              <div className="w-20 h-[1px] bg-[#C5A880] mx-auto mt-4" />
            </div>

            <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000" 
                alt="Bespoke tailors working on fine suits" 
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-6 text-sm text-[#5E5A54] leading-relaxed">
              <p className="font-serif italic text-lg text-[#1C1A17] text-center max-w-2xl mx-auto">
                &ldquo;We do not hold warehouses. We hold fibers. We draft layouts only when we secure you as our patron.&rdquo;
              </p>
              
              <h3 className="text-xl font-serif text-[#1C1A17] border-b border-[#F2EDE4] pb-2">The Golden Loom Philosophy</h3>
              <p>
                Atelier Nouveau operates outside the standard seasonal calendars. Our fabric suppliers harvested cotton crops organically, shearing cashmere sheep strictly during high altitude seasons in Ladakh and high parts of Tibet. The spinning processes happen entirely within verified clean water mills to retain raw elasticity.
              </p>

              <h3 className="text-xl font-serif text-[#1C1A17] border-b border-[#F2EDE4] pb-2">Crafting in Deep Silence</h3>
              <p>
                Our patterns are individually adjusted for each customer manually. When you register details in your profile panel, our pattern recommendation adjusts breast line margins, hip parameters, and overall hem length automatically. This ensures when you shop XS to XL, there are tailored variables designed directly inside.
              </p>

              <h3 className="text-xl font-serif text-[#1C1A17] border-b border-[#F2EDE4] pb-2">Honoring Indian Pricing Standards</h3>
              <p>
                As a premium brand serving local and global clients, we render all rates directly in Indian Rupees ₹. No foreign conversion noise. A dedicated luxury tax standardizes premium care, enabling us to pay our sewing communities wages far above standard marketplace rates.
              </p>
            </div>

            <div className="bg-[#F2EDE4] p-8 text-center rounded-xl space-y-4">
              <h4 className="font-serif text-[#1C1A17] text-xl">Ready to order your first commission?</h4>
              <p className="text-xs text-[#5E5A54] max-w-md mx-auto">
                Choose custom monogramming, pick high detail wooden chests, and witness patternmaking reports live inside your bespoke cart timeline details.
              </p>
              <button
                id="btn-story-showroom-redirect"
                onClick={() => {
                  setActiveTab('showroom');
                  setTimeout(() => showroomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className="px-6 py-3 bg-[#1C1A17] hover:bg-[#C5A880] text-xs uppercase text-[#FAF8F5] tracking-widest font-semibold transition-colors"
              >
                Go to Bespoke Showroom
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION D: GARMENT CARE GUIDE ================= */}
        {activeTab === 'care' && (
          <div className="animate-fade-in max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[10px] text-[#C5A880] font-bold uppercase tracking-widest">Atelier Longevity Protocol</span>
              <h1 className="text-4xl sm:text-5xl font-serif text-[#1C1A17]">Preserving Heirloom Fibers</h1>
              <div className="w-20 h-[1px] bg-[#C5A880] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              
              <div className="p-6 bg-white border border-[#F2EDE4] space-y-4 rounded-xl">
                <div className="w-10 h-10 bg-[#FAF8F5] flex items-center justify-center rounded-full text-[#C5A880]">
                  <Scissors className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-[#1C1A17]">How to treat Cashmere &amp; Fine Wool</h3>
                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  Never hang warm knitwear on wire support structures; this stretches shoulder points out of alignment permanently. Always lay items completely flat over lightweight organic towels away from solar rays. Wash exclusively with pH-neutral hair shampoo or specialized wool guards in cold water.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#F2EDE4] space-y-4 rounded-xl">
                <div className="w-10 h-10 bg-[#FAF8F5] flex items-center justify-center rounded-full text-[#C5A880]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-[#1C1A17]">Managing Pure Mulberry Silk</h3>
                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  Avoid applying active perfume droplets directly on silk threads to prevent local stain points. When packing for luxury journeys, cushion folding areas using delicate white tissue sheets to block structural creases. Steam heat only from reasonable distances, never letting hot metal touch the weave.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#F2EDE4] space-y-4 rounded-xl">
                <div className="w-10 h-10 bg-[#FAF8F5] flex items-center justify-center rounded-full text-[#C5A880]">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-[#1C1A17]">Belgian Linen Wrinkle Pride</h3>
                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  Linen celebrates life through organic creased textures. To smooth deep packaging creases, lightly mist the garment surface with mineral water and allow it to hang naturally outside in soft morning winds. A mild hand wash will slowly improve fiber drape parameters over time.
                </p>
              </div>

              <div className="p-6 bg-white border border-[#F2EDE4] space-y-4 rounded-xl">
                <div className="w-10 h-10 bg-[#FAF8F5] flex items-center justify-center rounded-full text-[#C5A880]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-[#1C1A17]">Professional Cleaning Bookings</h3>
                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  We render premium preservation pick-ups for elite patrons within Mumbai, Delhi, and Bangalore zones. Simply book a dispatch appointment using our helpline below, and we will collect, refresh, and wooden-box return your garments.
                </p>
              </div>

            </div>

            <div className="border border-[#E4DCCF] p-8 text-center rounded-xl max-w-2xl mx-auto space-y-4">
              <h4 className="font-serif text-lg text-[#1C1A17]">Need instant cloth preservation guidelines?</h4>
              <p className="text-xs text-[#5E5A54]">
                Reach our bespoke service line via email: <span className="text-[#1C1A17] font-semibold">{userProfile.email}</span>. We reply with fiber analysis reports directly drawn from our weavers.
              </p>
            </div>
            
          </div>
        )}

      </main>

      {/* ================= SECTION E: THE BESPOKE FLOATING SYSTEM (PRODUCT CUSTOM DETAILS WINDOW) ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-[#C5A880]/30 animate-scale-up max-h-[90vh] flex flex-col md:flex-row">
            
            {/* Modal Image block with Fabric Details */}
            <div className="md:w-1/2 bg-[#F2EDE4] p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-none">
              
              <div className="space-y-4">
                <button 
                  id="btn-modal-back-showroom"
                  onClick={() => setSelectedProduct(null)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#5E5A54] hover:text-[#C5A880] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Back to boutique
                </button>
                
                {/* Product zoom image */}
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-md">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>

              {/* Fabric Specs Profile Area */}
              <div className="space-y-3 mt-6 pt-6 border-t border-[#E8DDCD]">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#C5A880] flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Certified Fabric Profile
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-[11px] text-[#5E5A54]">
                  <div>
                    <span className="block font-semibold uppercase text-[9px] text-[#A69988]">COMPOSITION</span>
                    <span>{selectedProduct.fabric.type}</span>
                  </div>
                  <div>
                    <span className="block font-semibold uppercase text-[9px] text-[#A69988]">FIBER ORIGIN</span>
                    <span>{selectedProduct.fabric.origin}</span>
                  </div>
                  {selectedProduct.fabric.threadCount && (
                    <div>
                      <span className="block font-semibold uppercase text-[9px] text-[#A69988]">THREAD SPEC</span>
                      <span>{selectedProduct.fabric.threadCount}</span>
                    </div>
                  )}
                  <div>
                    <span className="block font-semibold uppercase text-[9px] text-[#A69988]">GARMENT GSM</span>
                    <span>{selectedProduct.fabric.weight || '300 GSM Premium'}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5]/80 p-3 text-[10px] text-[#5E5A54] border-l-2 border-[#C5A880]">
                  <strong className="text-[#1C1A17] uppercase block tracking-wide text-[9px] mb-0.5">MAISON CARE PROTOCOL:</strong>
                  {selectedProduct.fabric.care}
                </div>
              </div>

            </div>

            {/* Customizer Option controls */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-none flex flex-col justify-between space-y-6">
              
              {/* Heading */}
              <div className="flex justify-between items-start border-b border-[#F2EDE4] pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#C5A880] uppercase font-bold tracking-widest">{selectedProduct.gender}&rsquo;s {selectedProduct.category}</span>
                  <h3 className="text-2xl font-serif text-[#1C1A17]">{selectedProduct.name}</h3>
                  <div className="text-lg font-bold text-[#1C1A17] pt-1">₹{selectedProduct.price.toLocaleString('en-IN')}</div>
                </div>
                <button
                  id="btn-close-modal"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-[#5E5A54] hover:text-[#1C1A17] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bespoke Size Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#1C1A17] uppercase tracking-wider">Select Size</span>
                  <span className="text-[#C5A880] italic flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5" />
                    Atelier Match: {getBespokeSizeRecommendation()} recommended
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map((s) => {
                    const isRec = s === getBespokeSizeRecommendation();
                    return (
                      <button
                        id={`size-opt-${s}`}
                        key={s}
                        onClick={() => setCustomSize(s)}
                        className={`py-2 text-xs font-bold transition-all border ${customSize === s ? 'bg-[#1C1A17] text-white border-[#1C1A17]' : 'bg-white text-[#5E5A54] border-[#E8DDCD] hover:border-[#C5A880]'} ${isRec ? 'ring-1 ring-[#C5A880] ring-offset-1' : ''}`}
                      >
                        {s}
                        {isRec && <span className="block text-[7px] text-[#C5A880] uppercase tracking-tight">Best Fit</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Warm Color selection swatches */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Select Atelier Shade</span>
                <div className="flex items-center gap-4">
                  {selectedProduct.colors.map((colorObj) => {
                    const isSelected = customColor?.name === colorObj.name;
                    return (
                      <button
                        id={`color-opt-${colorObj.name}`}
                        key={colorObj.name}
                        onClick={() => setCustomColor(colorObj)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${isSelected ? 'border-[#C5A880] bg-[#F2EDE4]/60' : 'border-[#E8DDCD] bg-white text-[#5E5A54] hover:border-[#C5A880]'}`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block" 
                          style={{ backgroundColor: colorObj.hex }} 
                        />
                        <span className="font-medium text-[10px]">{colorObj.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C5A880]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bespoke Custom Sleeve adjustments */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Sleeve Customization</span>
                <select
                  id="sleeve-customization-select"
                  value={sleeveOption}
                  onChange={(e) => setSleeveOption(e.target.value)}
                  className="w-full border border-[#E8DDCD] p-2 bg-white text-xs outline-none focus:border-[#C5A880]"
                >
                  <option value="Standard">Standard Drapery Length</option>
                  <option value="Premium French Cuffs (+₹1,200)">Premium French Cuffs (+₹1,200)</option>
                  <option value="Delicate Italian Rolled Hem (+₹800)">Delicate Italian Rolled Hem (+₹800)</option>
                </select>
              </div>

              {/* Premium Initials Monogramming Option */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#1C1A17] uppercase tracking-wider">Gold Monogramming (+₹800)</span>
                  <span className="text-[10px] text-[#5E5A54] italic">Optional Interior lining stitch</span>
                </div>
                <input
                  id="monogram-input"
                  type="text"
                  placeholder="Enter initials (e.g. V.P. — Max 4 letters)"
                  maxLength={4}
                  value={monogramInitials}
                  onChange={(e) => setMonogramInitials(e.target.value.toUpperCase())}
                  className="w-full border border-[#E8DDCD] p-2 text-xs bg-white focus:border-[#C5A880] outline-none rounded-none placeholder-gray-400 font-mono tracking-widest text-[#1C1A17]"
                />
              </div>

              {/* Luxury Gift Packaging System */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Luxury Preservation Box</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="giftbox-minimal"
                    type="button"
                    onClick={() => setGiftWrapping({ name: 'Minimal Cotton Sack (Complementary)', price: 0 })}
                    className={`p-3 text-left border text-xs transition-all ${giftWrapping.price === 0 ? 'bg-white border-[#C5A880] ring-1 ring-[#C5A880]' : 'bg-[#FAF8F5] border-[#E8DDCD] opacity-75'}`}
                  >
                    <span className="font-bold block text-[#1C1A17] uppercase text-[10px]">STANDARD SACK</span>
                    <span className="text-[#5E5A54] block text-[9px] mt-0.5">Organic protective cloth bag</span>
                    <span className="text-[#C5A880] font-semibold text-[9px] block mt-1">Free</span>
                  </button>

                  <button
                    id="giftbox-prestige"
                    type="button"
                    onClick={() => setGiftWrapping({ name: 'Bespoke Wooden Cedar Chest (+₹1,500)', price: 1500 })}
                    className={`p-3 text-left border text-xs transition-all ${giftWrapping.price === 1500 ? 'bg-white border-[#C5A880] ring-1 ring-[#C5A880]' : 'bg-[#FAF8F5] border-[#E8DDCD] opacity-75'}`}
                  >
                    <span className="font-bold block text-[#1C1A17] uppercase text-[10px]">PRESTIGE CHEST</span>
                    <span className="text-[#5E5A54] block text-[9px] mt-0.5">Handcrafted fragrant cedar chest</span>
                    <span className="text-[#C5A880] font-semibold text-[9px] block mt-1">+₹1,500</span>
                  </button>
                </div>
              </div>

              {/* Direct Buttons for action */}
              <div className="pt-6 grid grid-cols-2 gap-3 border-t border-[#F2EDE4]">
                <button
                  id="btn-add-to-suite"
                  onClick={() => handleAddToCart(false)}
                  className="py-3 bg-transparent hover:bg-[#F2EDE4] border border-[#1C1A17] text-[#1C1A17] font-semibold text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Add to Suite
                </button>
                
                <button
                  id="btn-direct-buy"
                  onClick={() => handleAddToCart(true)}
                  className="py-4 bg-[#1C1A17] hover:bg-[#C5A880] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  Direct Buy
                  <ArrowRight className="w-4 h-4 text-[#FAF8F5]" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= SECTION F: SIDE DRAWER FOR CART (BESPOKE CHECKOUT) ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#C5A880]/30 animate-slide-left overflow-y-auto">
            
            {/* Cart Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                <h3 className="text-xl font-serif text-[#1C1A17]">Your Bespoke Suite</h3>
                <span className="bg-[#F2EDE4] text-xs font-bold text-[#1C1A17] px-2 py-0.5">
                  {cart.length}
                </span>
              </div>
              <button
                id="btn-close-cart"
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutSuccessful(false);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5E5A54] hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-grow my-6 overflow-y-auto space-y-4">
              
              {checkoutSuccessful ? (
                /* Tailor Checkout Complete Module */
                <div id="checkout-success-block" className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#F2EDE4] text-[#C5A880] rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
                    <Scissors className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif text-[#1C1A17]">Commission Placed</h4>
                    <p className="text-[11px] text-[#A69988] uppercase tracking-widest font-bold">Incorruptible Order Ref: #AN-2026-894</p>
                    <p className="text-xs text-[#5E5A54] leading-relaxed px-4">
                      Patron <span className="text-black font-semibold">{userProfile.name}</span>, your bespoke tailored suit order has passed initial pattern drafting logic. Handcrafters have been scheduled.
                    </p>
                  </div>

                  {/* Dynamic tracking map estimate timeline */}
                  <div className="bg-[#F2EDE4]/70 p-4 rounded-xl border border-[#FAF9F6] text-left space-y-4 text-xs">
                    <span className="font-bold text-[#C5A880] text-[10px] uppercase tracking-widest block">Loom Allocation & Delivery timeline</span>
                    
                    <div className="relative border-l border-[#C5A880] ml-3 pl-5 space-y-4">
                      
                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 bg-[#C5A880] text-white rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <div className="font-semibold text-black">Day 1: Drafting Pattern</div>
                        <div className="text-[10px] text-[#5E5A54]">Translating metrics (Chest: {userProfile.chest}cm) into drafting layout prints</div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 bg-[#C5A880] text-white rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <div className="font-semibold text-black">Day 2-3: Golden Looming</div>
                        <div className="text-[10px] text-[#5E5A54]">Weaving primary fabrics in Indian certified quiet mills</div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 bg-yellow-600 text-white rounded-full p-0.5 animate-pulse">
                          <Clock className="w-2.5 h-2.5" />
                        </span>
                        <div className="font-semibold text-yellow-800">Day 4-5: Personalized Stitching</div>
                        <span className="text-[10px] text-yellow-700 font-medium">French sleeve upgrades & Initial monograms inside lining</span>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 bg-gray-400 text-white rounded-full p-0.5">
                          <Truck className="w-2.5 h-2.5" />
                        </span>
                        <div className="font-semibold text-gray-500">Day 6: Complementary Air Freight Dispatch</div>
                        <p className="text-[10px] text-[#5E5A54]">
                          Expected arrival in Mumbai via high-priority air express by <span className="font-bold text-black border-b border-[#C5A880]">{new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>.
                        </p>
                      </div>

                    </div>
                  </div>

                  <button
                    id="btn-dismiss-success"
                    onClick={() => {
                      setCart([]);
                      setCheckoutSuccessful(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 bg-[#1C1A17] text-white hover:bg-[#C5A880] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Close & Track Suite
                  </button>
                </div>
              ) : cart.length === 0 ? (
                /* Open cart empty state */
                <div className="text-center py-20 bg-white border border-[#F2EDE4] rounded-xl flex flex-col justify-center items-center p-6 space-y-4">
                  <div className="w-12 h-12 bg-[#FAF8F5] text-[#C5A880] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 stroke-[1.25]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif text-[#1C1A17]">Suite is Vacant</h4>
                    <p className="text-xs text-[#5E5A54] leading-relaxed mt-1">
                      No custom commissions have been allocated. Explore products in the Showroom to configure size, shade, and inner initials.
                    </p>
                  </div>
                  <button
                    id="btn-empty-cart-showroom-go"
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('showroom');
                    }}
                    className="px-6 py-2.5 bg-[#1C1A17] text-white text-[10px] uppercase font-bold tracking-widest hover:bg-[#C5A880]"
                  >
                    View Showroom Designs
                  </button>
                </div>
              ) : (
                /* Active cart list items */
                <div className="space-y-4">
                  {cart.map((item) => {
                    const hasCuffAdded = item.sleeveOption.includes('French');
                    const hasMonogramAdded = item.monogram.length > 0;
                    
                    return (
                      <div 
                        id={`cart-item-row-${item.id}`}
                        key={item.id} 
                        className="bg-white p-4 border border-[#F2EDE4] rounded-xl space-y-3"
                      >
                        <div className="flex items-start gap-4">
                          
                          {/* Item Thumbnail */}
                          <div className="w-16 h-20 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover object-top" />
                          </div>

                          {/* Info Area */}
                          <div className="flex-grow space-y-1">
                            <div className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">
                              {item.product.gender} &bull; {item.product.category}
                            </div>
                            <h4 className="text-xs font-bold text-[#1C1A17] line-clamp-1">{item.product.name}</h4>
                            
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#5E5A54] mt-1.5">
                              <span className="bg-[#FAF8F5] px-1.5 py-0.5 border border-[#FAF9F6]">Size {item.size}</span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color.hex }} />
                                {item.color.name}
                              </span>
                            </div>
                          </div>

                          {/* Delete Item completely */}
                          <button
                            id={`btn-del-cart-item-${item.id}`}
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-[#5E5A54] hover:text-[#7E1E2D]"
                            title="Remove design"
                          >
                            <X className="w-4 h-4" />
                          </button>

                        </div>

                        {/* Customized Elements breakdown inside item box */}
                        <div className="bg-[#FAF8F5] p-2.5 rounded-lg text-[10.5px] space-y-1.5 text-[#5E5A54]">
                          <div className="flex justify-between">
                            <span>Base Tailoring Rate</span>
                            <span className="font-medium text-[#1C1A17]">₹{item.product.price.toLocaleString('en-IN')}</span>
                          </div>
                          
                          {hasCuffAdded && (
                            <div className="flex justify-between text-[#8E7557] font-medium">
                              <span>Custom Double French Cuffs</span>
                              <span>+₹1,200</span>
                            </div>
                          )}

                          {hasMonogramAdded && (
                            <div className="flex justify-between text-[#8E7557] font-medium">
                              <span>Gold Accent Monogram &ldquo;{item.monogram}&rdquo;</span>
                              <span>+₹800</span>
                            </div>
                          )}

                          {item.giftWrap.price > 0 && (
                            <div className="flex justify-between text-[#8E7557] font-medium">
                              <span>Prestige Cedar Wood Chest</span>
                              <span>+₹1,500</span>
                            </div>
                          )}
                        </div>

                        {/* Sizing Recommend Match Indicator */}
                        <div className="text-[9px] text-[#A69988] flex items-center justify-between border-t border-[#F2EDE4]/60 pt-2 px-1">
                          <span className="flex items-center gap-1 text-[#606C5D] font-semibold">
                            <Check className="w-3 h-3 stroke-2 text-[#606C5D]" /> Match configured logic
                          </span>
                          
                          {/* Quantity selection counter */}
                          <div className="flex items-center gap-2 bg-slate-100 rounded">
                            <button
                              id={`counter-minus-${item.id}`}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-0.5 text-xs text-[#1C1A17] hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono">{item.quantity}</span>
                            <button
                              id={`counter-plus-${item.id}`}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-0.5 text-xs text-[#1C1A17] hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Price breakdown and Estimated Delivery in collapsed Cart footer */}
            {!checkoutSuccessful && cart.length > 0 && (
              <div className="border-t border-[#F2EDE4] pt-4 space-y-4">
                
                {/* Granular Cost Invoice */}
                <div className="space-y-2 text-xs text-[#5E5A54] bg-[#F2EDE4]/40 p-4 rounded-xl">
                  <span className="font-bold text-[#1C1A17] text-[10px] uppercase tracking-widest block mb-2">Bespoke Patron Invoice</span>
                  
                  <div className="flex justify-between">
                    <span>Base Apparel &amp; Sizing Subtotal</span>
                    <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Atelier Handcrafted Luxury Wrap Fee</span>
                    <span>{totals.packagingFee > 0 ? `₹${totals.packagingFee.toLocaleString('en-IN')}` : 'Complementary'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      True Luxury Indian Wear GST (12%)
                    </span>
                    <span>₹{totals.luxuryTax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Maison Dispatch Air Carrier Fee</span>
                    <span>{totals.shipping === 0 ? 'Complementary' : `₹${totals.shipping.toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="border-t border-[#E8DDCD] pt-2 mt-2 flex justify-between font-serif text-sm font-bold text-[#1C1A17]">
                    <span>Total Due (Rupees)</span>
                    <span className="text-base text-[#1C1A17] font-sans">₹{totals.finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Highly structured delivery estimate statement */}
                <div className="p-3.5 bg-white border border-[#E8DDCD] rounded-lg text-[10.5px] text-[#5E5A54] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-black">
                    <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                    Estimated Dispatch Speed
                  </div>
                  <p className="line-clamp-2 leading-relaxed">
                    Due to manual weaving queue delays in Himachal, your shipment is estimated mock dispatch on high-priority express jet routing. Standard delivery arrival estimate is: 
                  </p>
                  <p className="font-bold text-[#1C1A17] bg-[#FAF8F5] p-2 text-center rounded border border-[#F2EDE4]">
                    {new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* Purchase buttons */}
                <div className="space-y-2">
                  <button
                    id="btn-place-bespoke-commission"
                    onClick={() => setCheckoutSuccessful(true)}
                    className="w-full py-4 bg-[#1C1A17] hover:bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
                  >
                    Place Blackbox Commission
                  </button>
                  <button
                    id="btn-continue-shopping-close"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2.5 text-center text-[10px] text-[#5E5A54] uppercase tracking-widest font-bold hover:text-black"
                  >
                    Continue Commission Exploration
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= SECTION G: TAILOR SPECIFICATIONS SIDE DRAWER (PROFILE) ================= */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#C5A880]/30 animate-slide-left overflow-y-auto">
            
            <div className="space-y-6 flex-grow">
              
              {/* Profile Header */}
              <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C5A880]" />
                  <h3 className="text-xl font-serif text-[#1C1A17]">Tailor Specifications</h3>
                </div>
                <button
                  id="btn-close-profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-[#5E5A54] hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Loyalty Status & Details Card */}
              <div className="bg-gradient-to-tr from-[#1D1B18] to-[#2D2924] p-5 text-white rounded-xl space-y-4 shadow-xl border border-[#C5A880]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#C5A880] bg-[#FAF8F5]/10 px-2.5 py-1">
                    {userProfile.tier}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C5A880] animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-serif tracking-wide">{userProfile.name}</h4>
                  <p className="text-[10px] text-[#A69988]">{userProfile.email}</p>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10 uppercase font-mono text-[#A69988]">
                  <span>ATELIER CREDITS</span>
                  <span className="text-base text-[#FAF8F5] font-sans font-bold">₹{userProfile.spendPoints.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Main Custom Tailoring Size Parameters Editor Form */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#F2EDE4]/60 p-3 rounded border border-[#FAF9F6]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1A17]">Your Fabric Measurement Specs</span>
                  <button
                    id="btn-toggle-edit-specs"
                    onClick={() => {
                      setIsEditingSpecs(!isEditingSpecs);
                      setSpecForm({ ...userProfile });
                    }}
                    className="text-xs font-bold text-[#C5A880] hover:text-[#9E7D51]"
                  >
                    {isEditingSpecs ? 'Discard' : 'Adjust Spec Values'}
                  </button>
                </div>

                {isEditingSpecs ? (
                  <form onSubmit={handleSaveSpecs} className="space-y-4 bg-white p-4 rounded-xl border border-[#E8DDCD]">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="block text-gray-600 font-semibold">Chest Circum (cm)</label>
                        <input
                          id="edit-spec-chest"
                          type="number"
                          value={specForm.chest}
                          onChange={(e) => setSpecForm({ ...specForm, chest: parseInt(e.target.value) || 0 })}
                          className="w-full border p-1.5 focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-600 font-semibold">Waist Line (cm)</label>
                        <input
                          id="edit-spec-waist"
                          type="number"
                          value={specForm.waist}
                          onChange={(e) => setSpecForm({ ...specForm, waist: parseInt(e.target.value) || 0 })}
                          className="w-full border p-1.5 focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-600 font-semibold">Sleeve Length (cm)</label>
                        <input
                          id="edit-spec-sleeve"
                          type="number"
                          value={specForm.sleeve}
                          onChange={(e) => setSpecForm({ ...specForm, sleeve: parseInt(e.target.value) || 0 })}
                          className="w-full border p-1.5 focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-600 font-semibold">Inseam Drop (cm)</label>
                        <input
                          id="edit-spec-inseam"
                          type="number"
                          value={specForm.inseam}
                          onChange={(e) => setSpecForm({ ...specForm, inseam: parseInt(e.target.value) || 0 })}
                          className="w-full border p-1.5 focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-save-specs-form"
                      type="submit"
                      className="w-full py-2 bg-[#1C1A17] text-white hover:bg-[#C5A880] text-xs uppercase font-bold"
                    >
                      Lock New Specifications
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-[#FAF9F6]">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                      <div className="p-3 bg-[#FAF8F5] text-center border">
                        <span className="block text-[10px] text-[#A69988] font-bold uppercase tracking-wider">CHEST</span>
                        <span className="text-base font-bold text-black font-mono">{userProfile.chest} cm</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F5] text-center border">
                        <span className="block text-[10px] text-[#A69988] font-bold uppercase tracking-wider">WAIST</span>
                        <span className="text-base font-bold text-black font-mono">{userProfile.waist} cm</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F5] text-center border">
                        <span className="block text-[10px] text-[#A69988] font-bold uppercase tracking-wider">SLEEVE</span>
                        <span className="text-base font-bold text-black font-mono">{userProfile.sleeve} cm</span>
                      </div>
                      <div className="p-3 bg-[#FAF8F5] text-center border">
                        <span className="block text-[10px] text-[#A69988] font-bold uppercase tracking-wider">INSEAM</span>
                        <span className="text-base font-bold text-black font-mono">{userProfile.inseam} cm</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-[#FAF9F6] border-l-2 border-[#C5A880] text-[10.5px] leading-relaxed text-[#5E5A54]">
                      <strong className="text-black uppercase block tracking-wide text-[9px] mb-0.5">SIZE RECOMMENDATION NOTICE</strong>
                      Based on continuous drafting parameters, your recommended baseline template is <strong className="text-black">Template size {getBespokeSizeRecommendation()}</strong>.
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="border-t border-[#F2EDE4] pt-4 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A69988]">MEMBERSHIP SINCE 2026</span>
              <p className="text-xs text-[#5E5A54] mt-1 italic">
                Atelier Nouveau honors slow apparel patterns worldwide.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ================= SECTION H: CURATED FAVORITES SIDE DRAWER (WISHLIST) ================= */}
      {isFavoritesOpen && (
        <div className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#C5A880]/30 animate-slide-left overflow-y-auto">
            <div className="space-y-6 flex-grow flex flex-col">
              
              {/* Favorites Header */}
              <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-5 flex-none">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#C5A880] fill-[#C5A880]" />
                  <h3 className="text-xl font-serif text-[#1C1A17]">Your Private Curation</h3>
                </div>
                <button
                  id="btn-close-favorites"
                  onClick={() => setIsFavoritesOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-[#5E5A54] hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Favorites Content (Scrollable list of favorited garments) */}
              <div className="flex-grow overflow-y-auto pr-1 space-y-4">
                {favorites.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                    <Heart className="w-12 h-12 text-[#E8DDCD] stroke-[1]" />
                    <p className="text-sm font-serif italic text-[#5E5A54] max-w-xs">
                      No garments have been selected for your curated list yet. Visit our Bespoke Showroom to tag your favorite pieces.
                    </p>
                    <button
                      id="btn-fav-go-showroom"
                      onClick={() => {
                        setIsFavoritesOpen(false);
                        setActiveTab('showroom');
                        setTimeout(() => showroomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="px-5 py-2.5 bg-[#1C1A17] text-white text-[10px] uppercase tracking-widest font-bold font-sans hover:bg-[#C5A880] transition-colors cursor-pointer"
                    >
                      Browse Showroom
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-xs bg-[#F2EDE4]/60 p-3 rounded-sm border border-[#FAF9F6]">
                      <span className="font-bold text-[#1C1A17] text-[10px] uppercase tracking-widest block mb-1">Curation Privileges</span>
                      Your selection has been curated according to the <strong>{userProfile.tier}</strong> status. Sizing is automatically cross-referenced with your registered measurements.
                    </div>

                    <div className="space-y-3">
                      {favorites.map(id => {
                        const prod = PRODUCTS.find(p => p.id === id);
                        if (!prod) return null;
                        return (
                          <div id={`fav-drawer-item-${prod.id}`} key={prod.id} className="flex gap-4 p-3 bg-white border border-[#E8DDCD]/60 rounded-none relative group hover:border-[#C5A880]/60 transition-all">
                            <div className="w-16 h-20 bg-slate-100 overflow-hidden rounded-none flex-none border border-[#E8DDCD]/50">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="text-xs font-serif font-bold text-[#1C1A17]">{prod.name}</h4>
                                <span className="block text-[9px] text-[#A69988] font-mono mt-0.5">{prod.fabric.type}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-[#1C1A17] font-semibold font-sans">₹{prod.price.toLocaleString('en-IN')}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    id={`btn-fav-order-${prod.id}`}
                                    onClick={() => {
                                      setSelectedProduct(prod);
                                      setIsFavoritesOpen(false);
                                    }}
                                    className="text-[10px] uppercase font-bold text-[#C5A880] hover:text-[#1C1A17] transition-colors cursor-pointer"
                                  >
                                    Custom Fit
                                  </button>
                                  <span className="text-gray-300 text-[9px]">|</span>
                                  <button
                                    id={`btn-fav-remove-${prod.id}`}
                                    onClick={() => toggleFavorite(prod.id)}
                                    className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Favorites Footer Actions */}
              {favorites.length > 0 && (
                <div className="border-t border-[#F2EDE4] pt-4 mt-auto space-y-3 flex-none">
                  {/* PRINT-READY EXPORT BUTTON */}
                  <button
                    id="btn-print-favorites-pdf"
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-3.5 bg-[#1C1A17] hover:bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#1C1A17]"
                  >
                    <Printer className="w-4 h-4 text-[#C5A880]" />
                    Export Lookbook PDF
                  </button>

                  <p className="text-[10px] text-center text-[#5E5A54] leading-relaxed">
                    This will open your system's print portal. Choose <strong className="text-black">“Save as PDF”</strong> to export your customized lookbook as a print-ready summary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDITORIAL SEAMLESS FOOTER ================= */}
      <footer className="bg-[#1C1A17] text-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-16 border-t border-[#FAF9F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Manifesto */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-serif text-2xl tracking-[0.2em] font-semibold text-white">ATELIER NOUVEAU</h3>
            <p className="text-xs text-[#A69988] max-w-sm leading-relaxed">
              Constructed in deep tribute to silence, quiet luxury, and sustainable patternmaking. We design individual items for each patron using local certified water mill threads from Ladakh, Kashmir, and Belgium.
            </p>
            <p className="text-[11px] font-mono text-[#C5A880]">
              Development Zone &bull; Vishrut Potdar Premium Account
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C5A880]">Useful Links</h4>
            <ul className="space-y-2 text-xs text-[#A69988]">
              <li>
                <button id="foot-showroom" onClick={() => { setActiveTab('showroom'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-left py-0.5 block">
                  Haute Showroom Selection
                </button>
              </li>
              <li>
                <button id="foot-story" onClick={() => { setActiveTab('story'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-left py-0.5 block">
                  Mill Heritage &amp; Handcrafting
                </button>
              </li>
              <li>
                <button id="foot-care" onClick={() => { setActiveTab('care'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-left py-0.5 block">
                  Garment Care Preservations
                </button>
              </li>
              <li>
                <a href="https://vishrutpotdar.at" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block py-0.5">
                  Private Patron Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Address & Trust Badge */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C5A880]">The Couture Office</h4>
            <p className="text-xs text-[#A69988] leading-relaxed">
              Atelier Nouveaux India Ltd.<br />
              Taj Mahal Palace Lane, Suite 48B<br />
              Apollo Bandar, Colaba, Mumbai, India
            </p>
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#FAF8F5]/10 rounded border border-white/10 text-[9px] text-[#C5A880] uppercase tracking-widest font-mono">
              <Check className="w-3 h-3 text-[#C5A880]" /> Verified Indian Rupee (₹) Checkout
            </div>
          </div>

        </div>

        {/* Outer bottom row */}
        <div className="max-w-7xl mx-auto h-px bg-white/10 my-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#A69988] uppercase tracking-wider">
          <p>© 2026 Atelier Nouveau. Hand-commissioned. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Security Cert</span>
            <span>&bull;</span>
            <span className="hover:text-white cursor-pointer">Bespoke Terms</span>
          </div>
        </div>
      </footer>

      </div> {/* Encapsulate all screen-only element views */}

      {/* ================= PRINT-ONLY BESPOKE PDF/PRINT PORTFOLIO DOCUMENT ================= */}
      <div className="hidden print:block bg-white text-[#1C1A17] font-serif p-12 max-w-[210mm] mx-auto min-h-screen space-y-8 print:p-8">
        
        {/* Document Header Panel */}
        <div className="border-b-4 border-[#1C1A17] pb-6 relative text-center">
          <h1 className="text-4xl tracking-[0.3em] font-light uppercase text-[#1C1A17]">ATELIER NOUVEAU</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#5E5A54] mt-2 font-sans">Bespoke Couture House &bull; Private Patron Portfolio</p>
          
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-sans text-[#5E5A54] mt-6 border-t border-[#F2EDE4] pt-4">
            <span className="font-semibold text-[#1C1A17]">Taj Mahal Palace Suite 48B, Mumbai</span>
            <span>Est. 2026</span>
            <span className="font-semibold text-[#1C1A17]">curation.atelier.nouveau</span>
          </div>
        </div>

        {/* Curation Title & Slogan */}
        <div className="text-center space-y-2 py-2">
          <h2 className="text-2xl italic text-[#C5A880] font-serif">Curated Masterpiece Lookbook</h2>
          <p className="text-xs text-[#5E5A54] max-w-lg mx-auto font-sans leading-relaxed">
            A private compilation of individual, slow-weave hand-tailored garments reserved for your consideration and subsequent pattern drafting.
          </p>
        </div>

        {/* Grid of Patron Measurements & Lookbook Metadata */}
        <div className="grid grid-cols-2 gap-8 border-y-2 border-[#1C1A17]/10 py-6 text-xs font-sans">
          
          {/* Column 1: Private Patron Specifications */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1C1A17] border-l-2 border-[#C5A880] pl-2">
              Patron Profile & Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-[#5E5A54]">
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">PATRON NAME</span>
                <span className="font-semibold text-[#1C1A17] text-xs">{userProfile.name}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">TIER PRIVILEGE</span>
                <span className="font-semibold text-[#C5A880] text-xs font-serif italic">{userProfile.tier}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">EMAIL CONTACT</span>
                <span className="text-[#1C1A17] text-xs">{userProfile.email}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">RECOMMENDED BLUEPRINT</span>
                <span className="font-semibold text-[#1C1A17] text-xs">Size {getBespokeSizeRecommendation()}</span>
              </div>
            </div>

            {/* Custom Sizing Specific Metrics listed neatly */}
            <div className="mt-3 pt-3 border-t border-[#F2EDE4] space-y-1">
              <span className="block text-[9px] text-[#A69988] font-bold uppercase">Registered Drafting Coordinates</span>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center bg-[#FAF8F5] p-2 border border-[#E8DDCD]/60">
                <div>
                  <div className="text-[#A69988] text-[8px] font-sans">CHEST</div>
                  <div className="font-bold text-[#1C1A17]">{userProfile.chest}cm</div>
                </div>
                <div>
                  <div className="text-[#A69988] text-[8px] font-sans">WAIST</div>
                  <div className="font-bold text-[#1C1A17]">{userProfile.waist}cm</div>
                </div>
                <div>
                  <div className="text-[#A69988] text-[8px] font-sans">SLEEVE</div>
                  <div className="font-bold text-[#1C1A17]">{userProfile.sleeve}cm</div>
                </div>
                <div>
                  <div className="text-[#A69988] text-[8px] font-sans">INSEAM</div>
                  <div className="font-bold text-[#1C1A17]">{userProfile.inseam}cm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Lookbook Specifications */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1C1A17] border-l-2 border-[#C5A880] pl-2">
              Curation Portfolio Metadata
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-[#5E5A54]">
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">DATE PRINTED</span>
                <span className="font-semibold text-[#1C1A17] text-xs">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">CURATED TOTAL</span>
                <span className="font-semibold text-[#1C1A17] text-xs">{favorites.length} Garments Reserved</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">DWELL TIMEFRAME</span>
                <span className="text-[#1C1A17] text-xs">Standard 90 Days Reserve Queue</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#A69988] font-bold uppercase font-sans">MAISON SPECIALIST</span>
                <span className="font-semibold text-[#1C1A17] text-xs italic font-serif">M. C. Nouveau</span>
              </div>
            </div>

            <div className="bg-[#1C1A17] text-white p-3 text-[10px] leading-relaxed border border-[#C5A880] mt-3">
              <span className="font-bold uppercase tracking-wide text-[#C5A880] block text-[8px] mb-0.5">EXCLUSIVE PATRON PRIVILEGE</span>
              Garments printed in this private lookbook bypass general production waiting periods, allowing swift track scheduling within the next 48 hours.
            </div>
          </div>

        </div>

        {/* Curated Favorites List (Highly elegant catalog styling) */}
        <div className="space-y-8 pt-4">
          <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-center text-[#1C1A17] font-sans">
            &mdash; EXHIBIT: SPECIFIED GARMENTS &mdash;
          </h3>

          {favorites.length === 0 ? (
            <div className="text-center py-12 text-sm text-[#5E5A54] italic">
              Your curated portfolio is currently empty. Please tag your desired items inside the lookbook first.
            </div>
          ) : (
            <div className="space-y-6">
              {favorites.map((id, index) => {
                const prod = PRODUCTS.find(p => p.id === id);
                if (!prod) return null;
                return (
                  <div key={prod.id} className="flex gap-6 p-4 border border-[#FAF9F6] bg-white rounded-none break-inside-avoid shadow-xs">
                    
                    {/* Item Image with styling for crisp printing */}
                    <div className="w-24 h-32 bg-gray-100 flex-none border border-[#E8DDCD]">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover object-top select-none" />
                    </div>

                    {/* Detailed Product Curation specs */}
                    <div className="flex-grow space-y-2 text-xs">
                      
                      <div className="flex justify-between items-baseline border-b border-[#F2EDE4] pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#C5A880] font-bold">0{index + 1}</span>
                          <span className="font-serif text-base font-bold text-[#1C1A17]">{prod.name}</span>
                        </div>
                        <span className="font-sans font-bold text-[#1C1A17] text-sm">₹{prod.price.toLocaleString('en-IN')}</span>
                      </div>

                      <p className="text-[#5E5A54] leading-relaxed text-[11px] italic">
                        {prod.description}
                      </p>

                      {/* Fabric specifications table */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 p-2 bg-[#FAF8F5] border border-[#E8DDCD]/40 text-[10px] text-[#5E5A54] font-sans">
                        <div>
                          <strong className="text-[#1C1A17] font-semibold">Weave Type:</strong> {prod.fabric.type}
                        </div>
                        <div>
                          <strong className="text-[#1C1A17] font-semibold">Origin:</strong> {prod.fabric.origin}
                        </div>
                        {prod.fabric.threadCount && (
                          <div>
                            <strong className="text-[#1C1A17] font-semibold">Specification:</strong> {prod.fabric.threadCount}
                          </div>
                        )}
                        {prod.fabric.weight && (
                          <div>
                            <strong className="text-[#1C1A17] font-semibold">Material Weight:</strong> {prod.fabric.weight}
                          </div>
                        )}
                        <div className="col-span-2 border-t border-[#F2EDE4]/60 pt-1 mt-1">
                          <strong className="text-[#1C1A17] font-semibold">Preservation Care:</strong> {prod.fabric.care}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Handcrafted sign-off verify block */}
        <div className="pt-8 border-t border-[#1C1A17]/10 space-y-6 break-inside-avoid">
          <p className="text-[10px] text-[#5E5A54] leading-relaxed font-sans text-center max-w-lg mx-auto">
            Atelier Nouveau guarantees high-integrity execution for all selections. Please submit this physical or digital print summary configuration directly to your specialist at Taj Mahal Palace Lane for custom fiber drafting.
          </p>

          <div className="grid grid-cols-2 gap-12 font-sans pt-4 max-w-md mx-auto text-[10px] uppercase text-[#1C1A17] tracking-widest text-center">
            <div className="space-y-8">
              <div className="border-b border-[#1C1A17]/50 h-8 font-serif italic text-xs flex items-end justify-center text-[#C5A880]">
                {userProfile.name}
              </div>
              <div className="font-bold">Patron Signature</div>
            </div>
            <div className="space-y-8">
              <div className="border-b border-[#1C1A17]/50 h-8 font-serif italic text-xs flex items-end justify-center text-[#C5A880]">
                M. C. Nouveau
              </div>
              <div className="font-bold">Maison Verification</div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="text-center pt-8 border-t border-[#FAF9F6] text-[8px] uppercase tracking-[0.3em] text-[#A69988] font-sans">
          Printed Specially For &mdash; Patron {userProfile.email} via Couture Client Engine &mdash; Est. 2026
        </div>

      </div>

    </div>
  );
}

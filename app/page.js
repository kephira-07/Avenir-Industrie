'use client';
import React, { useState, useEffect, useRef,useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Plane, Ship, X, CheckCircle, ArrowRight, ShoppingCart, 
  Menu, Search, Facebook, Instagram, ArrowLeft, Truck, Send, 
  Loader2, Heart, Bell, Phone, MapPin, User, Mail, ShieldCheck, 
  History, FileText, ChevronDown, ListChecks, Globe, ChevronRight,
  Settings, Plus, Minus, Edit3, Image as ImageIcon, Save, Lock, Trash2, Info, LogOut,Sparkles,Zap,CircleQuestionMark,BookOpen, Laptop,Maximize2,ChevronLeft,
} from 'lucide-react';


/**
 * CONFIGURATION SUPABASE & CLOUDINARY
 * Remplacez les chaînes vides par vos clés réelles.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""; 
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""; 
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""; 
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
 // Remplacez par votre numéro WhatsApp complet avec indicatif pays


// --- LOGIQUE API SUPABASE ---
const createApi = (supabase) => ({
  async getCategories() {
    const { data } = await supabase.from('categories').select('*').order('display_order');
    return data || [];
  },
  async addCategory(name) {
    const { error } = await supabase.from('categories').insert([{ name, display_order: 99 }]);
    return !error;
  },
  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
  },
  async getProducts() {
    const { data } = await supabase.from('products').select('*');
    return data || [];
  },
  async upsertProduct(product) {
    const { error } = await supabase.from('products').upsert([product]);
    return !error;
  },
  async deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  },
  async postOrder(order) {
    const { error } = await supabase.from('orders').insert([order]);
    return !error;
  },
  async postProspect(pseudo, email) {
    const { error } = await supabase.from('prospects').insert([{ pseudo, email }]);
    return !error;
  }
});

// --- COMPOSANTS ---

const Nudge = ({ api }) => {
  const [visible, setVisible] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('afri_nudge_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 15000); // 15 secondes
      return () => clearTimeout(timer);
    }
  }, []);

  const submit = async () => {
    if (!pseudo || !email || !api) return;
    setSent(true);
    await api.postProspect(pseudo, email);
    setTimeout(() => {
      localStorage.setItem('afri_nudge_dismissed', 'true');
      setVisible(false);
    }, 3000);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-sm z-[800] animate-fade-in font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-[#D0A050] p-8 relative overflow-hidden">
        <button onClick={() => setVisible(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
        {!sent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-2xl text-[#D0A050]"><Bell size={24} className="animate-bounce" /></div>
              <h4 className="font-black text-[#002D5A] text-xl tracking-tight">Voulez-vous les pépites ?</h4>
            </div>
            <p className="text-sm text-gray-500">Laisse-nous ton email pour recevoir les nouveaux arrivages USA en exclusivité !</p>
            <input type="text" placeholder="Ton pseudo" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#D0A050]" value={pseudo} onChange={e => setPseudo(e.target.value)} />
            <input type="email" placeholder="Ton email" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#D0A050]" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={submit} className="w-full bg-[#D0A050] text-[#002D5A] py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all uppercase">M'inscrire</button>
          </div>
        ) : (
          <div className="py-6 text-center animate-fade-in">
            <CheckCircle size={50} className="text-green-500 mx-auto mb-4" />
            <h4 className="font-black text-[#002D5A]">C'est noté, {pseudo} !</h4>
          </div>
        )}
      </div>
    </div>
  );
};
// --- COMPOSANT HERO DÉSIGNER AVEC IMAGES ANIMÉES ---
const HeroSection = ({ onScrollToCategories }) => {
  // Images représentatives pour les colonnes
  const col1Images = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop", // Tech
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", // Gadget
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Audio
    "https://images.unsplash.com/photo-1526170315870-efffd09636f7?q=80&w=800&auto=format&fit=crop"  // Caméra
  ];

  const col2Images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop", // Bag
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"  // Fashion
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
        .animate-vertical-up { animation: scrollUp 30s linear infinite; }
        .animate-vertical-down { animation: scrollDown 30s linear infinite; }
        .designer-title { font-family: 'Syne', sans-serif; letter-spacing: -0.04em; }
        .designer-body { font-family: 'Inter', sans-serif; }
      `}} />

      <section className="relative overflow-hidden bg-blue-100 py-16 lg:py-20 min-h-[85vh] flex items-center">
        {/* IMAGE DE FOND DU HERO */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20"
            alt="Background Logistics"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07101ac4] via-[#0F172A]/60 to-transparent"></div>
        </div>

        <div className="max-w-10xl mx-auto p-5 px-10 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* TEXTE & CTA */}
            <div className="w-full lg:w-1/2 space-y-10  animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest designer-body">
                <Globe size={14} />
                <span>Import direct &middot; Produit diponible en boutique</span>
              </div>
              
              <h1 className="text-3xl md:text-6xl font-Karla text-white leading-[1.1] uppercase m-0">
              Commandez vos produits <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Chez nous.</span>
              </h1>
              
              <p className="text-sm md:text-base text-white max-w-lg leading-relaxed designer-body font-light">
                La plateforme qui vous permet de commander des produits locaux et internationaux, avec une livraison fiable partout en Afrique.
                Accédez à des articles sélectionnés, provenant de fournisseurs locaux et de l’étranger, en toute simplicité.
              </p>


              {/* Badges de confiance */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={18} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter designer-body">Paiement Sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="text-blue-500" size={18} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter designer-body">Suivi Temps Réel</span>
                </div>
              </div>
            </div>

            {/* VISUEL DYNAMIQUE (BOX AVEC IMAGES) */}
            <div className="w-full lg:w-1/2 h-[500px] relative">
              <div className="grid grid-cols-2 gap-3 h-full overflow-hidden rounded-[2.5rem] border-8 border-slate-800/50 shadow-2xl bg-slate-900">
                
                {/* Colonne 1 : Monte */}
                <div className="space-y-3 animate-vertical-up">
                  {[...col1Images, ...col1Images].map((img, i) => (
                    <div key={i} className="h-56 w-full relative overflow-hidden rounded-2xl group">
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Product" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Colonne 2 : Descend */}
                <div className="space-y-3 animate-vertical-down pt-10">
                  {[...col2Images, ...col2Images].map((img, i) => (
                    <div key={i} className="h-56 w-full relative overflow-hidden rounded-2xl group">
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Product" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Filtre de fondu pour le haut et le bas */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A] opacity-80"></div>
              </div>

             </div>

          </div>
        </div>
      </section>
    </>
  );
};

const AboutPage = ({ onBack, sectionId }) => {
  useEffect(() => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionId]);

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-20">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-6 py-4 border-b flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><ArrowLeft size={20}/></button>
        <h2 className="text-xl font-black text-[#135290] google-sans-header">À Propos</h2>
      </div>
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-24 font-sans">

        <section id="nous" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#D0A050] rounded-2xl flex items-center justify-center"><CircleQuestionMark size={24}/></div>
            <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Qui somme nous</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <span className="text-3xl font-black text-[#D0A050]">01</span>
              <p className="text-gray-600">Les industries de l'avenir est une plateforme de vente et d’importation créée pour simplifier l’accès aux produits du monde entier, tout en proposant des articles disponibles localement..</p>
            </div>
             <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <span className="text-3xl font-black text-[#D0A050]">03</span>
              <p className="text-gray-600"> Nous combinons :importation directe depuis les usines (USA & Chine) vente locale sur le terrain accompagnement personnalisé</p>
            </div>

          </div>
        </section>
        
  
        <section id="processus" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#D0A050] rounded-2xl flex items-center justify-center"><Globe size={24}/></div>
            <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Processus Importation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <span className="text-3xl font-black text-[#D0A050]">01</span>
              <p className="text-gray-600">Sourcing direct auprès des usines internationales.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <span className="text-3xl font-black text-[#D0A050]">02</span>
              <p className="text-gray-600">Transport au choix : Avion (rapide) ou Bateau (économique).</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
              <span className="text-3xl font-black text-[#D0A050]">03</span>
              <p className="text-gray-600">Dédouanement et livraison locale assurée.</p>
            </div>
          </div>
        </section>

        <section id="suivi" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#D0A050] rounded-2xl flex items-center justify-center"><History size={24}/></div>
            <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Suivi de Commande</h2>
          </div>
          <div className="bg-[#002D5A] p-10 rounded-[3rem] text-white">
             <p className="text-lg opacity-80 mb-8">Consultez le statut de votre expédition avec votre code de suivi.</p>
             <button className="bg-[#D0A050] text-[#002D5A] px-8 py-4 rounded-2xl font-black active:scale-95">SUIVRE COLIS</button>
          </div>
        </section>

        <section id="legal" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#D0A050] rounded-2xl flex items-center justify-center"><ShieldCheck size={24}/></div>
            <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Mentions Légales</h2>
          </div>
          <div className="prose text-gray-500 space-y-4">
             <p>L'INDUSTRIE DE L'AVENIR. RCCM ABJ-2024-B-XXXX.</p>
             <p>Tous les équipements électroniques bénéficient d'une garantie SAV locale de 12 mois.</p>
          </div>
        </section>
      </div>
    </div>
  );
};


const ProductDetail = ({ product, onBack, onAddToCart }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  
  const isOrder = product.type_dispo === 'COMMANDE';
  // Si c'est sur commande, on affiche le prix de base (souvent le prix avion ou min)
  const price = isOrder ? product.prix_avion : product.prix_standard;

  const nextImg = () => setActiveImgIndex((prev) => (prev + 1) % product.image_urls.length);
  const prevImg = () => setActiveImgIndex((prev) => (prev - 1 + product.image_urls.length) % product.image_urls.length);

  const handleAddToCart = () => {
    onAddToCart(product, isOrder ? 'WHATSAPP' : 'STOCK', price, qty);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-20 font-sans overflow-x-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#0A1A3A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#D4AF37] animate-fade-in-up">
          <div className="bg-[#D4AF37] p-1 rounded-full text-[#0A1A3A]"><CheckCircle size={16}/></div>
          <p className="font-bold text-sm uppercase tracking-widest">Produit ajouté au panier !</p>
        </div>
      )}

      {/* Galerie Plein Écran */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-4xl aspect-square md:aspect-auto md:h-[80vh] flex items-center justify-center">
            <img 
              src={product.image_urls[activeImgIndex]} 
              className="max-w-full max-h-full object-contain animate-fade-in" 
              alt="Fullscreen view" 
            />
            
            <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-0 p-4 text-white hover:scale-110 transition-transform">
              <ChevronLeft size={48} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-0 p-4 text-white hover:scale-110 transition-transform">
              <ChevronRight size={48} />
            </button>
          </div>

          <div className="absolute bottom-10 text-white font-black uppercase tracking-[0.4em] text-xs">
            {activeImgIndex + 1} / {product.image_urls.length}
          </div>
        </div>
      )}

      {/* Header Interne */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[700] px-4 md:px-6 py-4 border-b flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-[#0A1A3A] hover:text-white transition-all active:scale-90">
          <ArrowLeft size={20}/>
        </button>
        <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">Afri-Tech Luxury Store</span>
        <div className="w-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* ZONE IMAGES */}
          <div className="space-y-6">
            <div 
              onClick={() => setIsFullscreen(true)}
              className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border shadow-2xl cursor-zoom-in group"
            >
              <img src={product.image_urls[activeImgIndex]} alt={product.nom} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
              <div className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={24} />
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
              {product.image_urls?.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImgIndex(i)} 
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 shrink-0 transition-all ${activeImgIndex === i ? 'border-[#D4AF37] scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-80'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* ZONE TEXTE */}
          <div className="space-y-10 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF37]"></span>
                <span className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.4em]">{product.categorie}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#0A1A3A] designer-title leading-tight uppercase tracking-tighter">
                {product.nom}
              </h1>
              {/* Changement couleur : Noir profond pour la lisibilité */}
              <p className="text-[#0A1A3A] font-medium leading-relaxed text-lg md:text-xl designer-body border-l-4 border-[#D4AF37] pl-8 py-2">
                {product.description}
              </p>
            </div>

            <div className="p-8 md:p-12 bg-gray-50 rounded-[3.5rem] space-y-10 shadow-inner">
              <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-[#0A1A3A] uppercase tracking-[0.2em]">SÉLECTION QUANTITÉ</p>
                 <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-[1.5rem] shadow-sm border border-gray-100">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[#0A1A3A] hover:text-red-500 transition-colors active:scale-125"><Minus size={20}/></button>
                    <span className="font-black text-2xl w-8 text-center text-[#0A1A3A]">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="text-[#0A1A3A] hover:text-green-500 transition-colors active:scale-125"><Plus size={20}/></button>
                 </div>
              </div>

              {/* Box Avion/Bateau enlevée pour "COMMANDE" */}
              
              <div className="flex justify-between items-end border-t border-gray-200 pt-8">
                <div>
                  <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-2">PRIX UNITAIRE</p>
                  <p className="text-4xl md:text-5xl font-black text-[#0A1A3A] tracking-tighter">
                    {Number(price)?.toLocaleString()} <span className="text-xl">FCFA</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">SOUS-TOTAL</p>
                  <p className="text-2xl font-bold text-[#D4AF37]">{(Number(price) * qty).toLocaleString()} F</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-7 rounded-[2.5rem] font-black flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all text-xl uppercase tracking-widest border-b-[10px] border-black/20 ${isOrder ? 'bg-[#25D366] text-white' : 'bg-[#0A1A3A] text-white'}`}
            >
              {isOrder ? <Phone size={24} /> : <ShoppingBag size={24} />}
              {isOrder ? `Commander via WhatsApp (${qty})` : `Ajouter au Panier`}
            </button>
            
            {isOrder && (
              <p className="text-center text-[10px] font-bold text-[#25D366] uppercase tracking-widest animate-pulse">
                * Les produits sur commande sont finalisés directement avec nos experts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = ({ cart, total, onBack, api }) => {
  const [form, setForm] = useState({ nom: '', tel: '', adresse: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await api.postOrder({
      nom_client: form.nom, telephone: form.tel, adresse: form.adresse,
      panier_details: cart.map(i => `${i.nom} (${i.mode}) x${i.quantity}`).join(', '),
      total_prix: total, mode_livraison: 'Site Web'
    });
    setLoading(false);
    if (success) setDone(true);
    else alert("Erreur de sauvegarde.");
  };

  const handleWhatsApp = () => {
    if(!form.nom || !form.tel) return alert("Veuillez remplir votre nom et numéro.");
    const text = `*COMMANDE Industrie-Avenir*%0A-----------------%0A${cart.map(i => `• ${i.nom} (${i.mode}) x${i.quantity}`).join('%0A')}%0A-----------------%0A*TOTAL : ${total.toLocaleString()} FCFA*%0A%0A*Client :* ${form.nom}%0A*Tél :* ${form.tel}%0A*Lieu :* ${form.adresse}`;
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER & Num}?text=${text}`;
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white font-sans text-center">
      <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner"><CheckCircle size={60} /></div>
      <h2 className="text-3xl font-black text-[#002D5A] mb-4 uppercase">C'est validé !</h2>
      <p className="text-gray-500 mb-10">Notre équipe vous contactera pour la livraison.</p>
      <button onClick={onBack} className="bg-[#002D5A] text-white px-10 py-4 rounded-2xl font-black shadow-xl">RETOUR BOUTIQUE</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 animate-fade-in">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[700] px-4 md:px-6 py-4 border-b flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>
        <h2 className="text-xl font-black text-[#002D5A] uppercase">Caisse</h2>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nom complet" className="w-full bg-gray-50 p-5 rounded-2xl border-none focus:ring-2 focus:ring-[#D0A050]" value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} />
            <input required type="tel" placeholder="WhatsApp" className="w-full bg-gray-50 p-5 rounded-2xl border-none focus:ring-2 focus:ring-[#D0A050]" value={form.tel} onChange={e=>setForm({...form, tel:e.target.value})} />
            <input required placeholder="Lieu de livraison" className="w-full bg-gray-50 p-5 rounded-2xl border-none focus:ring-2 focus:ring-[#D0A050]" value={form.adresse} onChange={e=>setForm({...form, adresse:e.target.value})} />
            <div className="pt-8 space-y-4">
              <button disabled={loading} type="submit" className="w-full bg-[#002D5A] text-white py-6 rounded-[2.5rem] font-black shadow-xl uppercase border-b-8 border-black/20">CONFIRMER SUR LE SITE</button>
              <button type="button" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black shadow-xl uppercase border-b-8 border-green-800/20">COMMANDER PAR WHATSAPP</button>
            </div>
          </form>
        </div>
        <div className="bg-[#002D5A] text-white p-10 rounded-[3.5rem] shadow-2xl h-fit">
          <h3 className="text-[#D0A050] font-black text-xs uppercase mb-10 tracking-[0.4em]">Résumé</h3>
          <div className="space-y-4 mb-10 max-h-48 overflow-y-auto no-scrollbar">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span>{item.nom} x{item.quantity}</span>
                <span className="font-black">{(item.finalPrice * item.quantity).toLocaleString()} F</span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t-4 border-[#D0A050] flex justify-between items-end">
             <span className="text-xs uppercase opacity-60">Total Net</span>
             <span className="text-3xl font-black text-[#D0A050]">{total.toLocaleString()} F</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD ADMIN SÉCURISÉ & MODERNISÉ ---
const AdminDashboard = ({ products, categories, onRefresh, onBack, api, sb }) => {
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: '', pass: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showCatList, setShowCatList] = useState(false);

  // Vérifier la session. Si sb est null (pas encore chargé), on attend.
  useEffect(() => {
    if (!sb) return;
    const checkUser = async () => {
      try {
        const { data: { user } } = await sb.auth.getUser();
        setUser(user);
      } catch (e) { console.error("Auth check error", e); }
    };
    checkUser();
  }, [sb]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!sb) return alert("Veuillez patienter, connexion en cours...");
    setAuthLoading(true);
    const { data, error } = await sb.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.pass
    });
    setAuthLoading(false);
    if (error) alert("Accès refusé : " + error.message);
    else setUser(data.user);
  };

  const handleLogout = async () => {
    if (sb) await sb.auth.signOut();
    setUser(null);
  };

  const openCloudinary = (index) => {
    if (!window.cloudinary) return alert("Module d'image indisponible.");
    window.cloudinary.openUploadWidget({
      cloudName: CLOUDINARY_CLOUD_NAME, uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'url', 'camera'], multiple: false,
    }, (error, result) => {
      if (!error && result.event === "success") { 
        const newImages = [...(editing.image_urls || ['', '', '', '', ''])];
        newImages[index] = result.info.secure_url;
        setEditing({...editing, image_urls: newImages});
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const cleaned = { ...editing, image_urls: editing.image_urls.filter(u => u && u.trim() !== '') };
    const success = await api.upsertProduct(cleaned);
    setSaving(false);
    if (success) { setEditing(null); onRefresh(); }
    else alert("Échec de sauvegarde.");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#002D5A] p-6 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-4 border-[#D0A050]">
          <Lock className="mx-auto text-[#D0A050] mb-6" size={48} />
          <h2 className="text-2xl font-black text-[#002D5A] mb-8 uppercase tracking-tighter">Accès Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
             <input required type="email" placeholder="Email Admin" className="w-full bg-gray-100 p-5 rounded-2xl border-none focus:ring-2 focus:ring-[#D0A050]" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
             <input required type="password" placeholder="Mot de passe" className="w-full bg-gray-100 p-5 rounded-2xl border-none focus:ring-2 focus:ring-[#D0A050]" value={authForm.pass} onChange={e => setAuthForm({...authForm, pass: e.target.value})} />
             <button disabled={authLoading || !sb} type="submit" className="w-full bg-[#002D5A] text-white py-5 rounded-2xl font-black uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
               {authLoading ? <Loader2 className="animate-spin" /> : "Se Connecter"}
             </button>
          </form>
          <button onClick={onBack} className="mt-6 text-gray-400 font-bold hover:text-black">Quitter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 p-4 md:p-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#002D5A] uppercase tracking-tighter leading-none">Gestion Boutique</h2>
          <p className="text-[10px] font-black text-[#D0A050] uppercase mt-2 tracking-widest">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleLogout} className="p-4 bg-white rounded-2xl shadow-sm border text-red-500 flex items-center gap-2 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"><LogOut size={16}/> Déconnexion</button>
          <div className="bg-white p-2 rounded-2xl shadow-sm border flex items-center gap-2">
             <input placeholder="Nouvelle catégorie" className="bg-transparent border-none text-xs px-4 focus:ring-0 w-32 md:w-48" value={newCatName} onChange={e=>setNewCatName(e.target.value)} />
             <button onClick={async () => { await api.addCategory(newCatName); setNewCatName(''); onRefresh(); }} className="bg-[#D0A050] p-2 rounded-xl text-[#002D5A]"><Plus size={18}/></button>
          </div>
          <button onClick={() => setShowCatList(!showCatList)} className="p-4 bg-white rounded-2xl shadow-sm border text-[#002D5A] hover:bg-gray-50 transition-colors"><Settings size={20}/></button>
          <button onClick={onBack} className="p-4 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"><X/></button>
        </div>
      </div>

      {showCatList && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border mb-8 animate-fade-in grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(c => (
              <div key={c.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-[#002D5A] truncate pr-2">{c.name}</span>
                <button onClick={async () => { if(window.confirm("Supprimer la catégorie ?")) { await api.deleteCategory(c.id); onRefresh(); } }} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
              </div>
            ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => setEditing({ nom: '', categorie: categories[0]?.name, type_dispo: 'STOCK', description: '', image_urls: ['', '', '', '', ''] })} className="bg-white border-4 border-dashed border-gray-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center hover:border-[#D0A050] transition-all group aspect-square">
          <Plus size={40} className="text-gray-300 group-hover:text-[#D0A050] mb-2" />
          <span className="font-black text-gray-400 text-xs uppercase tracking-widest text-center">Nouveau Produit</span>
        </button>
        {products.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm flex flex-col items-center group relative border border-white hover:border-gray-200 transition-all">
            <button onClick={async () => { if(window.confirm("Supprimer l'article ?")) { await api.deleteProduct(p.id); onRefresh(); } }} className="absolute top-4 right-4 p-2 bg-red-50 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button>
            <img src={p.image_urls?.[0]} className="w-full aspect-square rounded-3xl object-cover mb-4 bg-gray-50 shadow-inner" alt="" />
            <p className="font-black text-[#002D5A] uppercase text-[10px] truncate w-full text-center px-2">{p.nom}</p>
            <button onClick={() => setEditing({ ...p, image_urls: [...(p.image_urls || []), '', '', '', '', ''].slice(0, 5) })} className="mt-4 w-full py-2 bg-gray-50 rounded-xl text-[#D0A050] font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-[#002D5A] hover:text-white">Modifier</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[1000] bg-[#002D5A]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-fade-in relative">
            <button onClick={() => setEditing(null)} className="absolute top-8 right-8 p-3 bg-gray-100 rounded-full hover:bg-red-50 transition-all"><X size={20}/></button>
            <h3 className="text-2xl font-black text-[#002D5A] mb-8 uppercase tracking-tighter">Édition Article</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <input required className="w-full bg-gray-50 p-4 rounded-xl border-none" value={editing.nom} onChange={e=>setEditing({...editing, nom:e.target.value})} placeholder="Désignation" />
                <select className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none" value={editing.categorie} onChange={e=>setEditing({...editing, categorie:e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <textarea className="w-full bg-gray-50 p-4 rounded-xl h-44 border-none font-sans" value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} placeholder="Description détaillée..." />
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Galerie Photos (Max 5)</p>
                <div className="grid grid-cols-5 gap-2">
                  {editing.image_urls.map((url, i) => (
                    <button key={i} type="button" onClick={() => openCloudinary(i)} className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${i === 0 ? 'border-[#D0A050] bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-[#D0A050]'}`}>
                      {url ? <img src={url} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={18} className="text-gray-300"/>}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <select className="w-full bg-gray-50 p-4 rounded-xl font-bold border-none" value={editing.type_dispo} onChange={e=>setEditing({...editing, type_dispo:e.target.value})}>
                    <option value="STOCK">STOCK </option>
                    <option value="COMMANDE">IMPORT DIRECT USA</option>
                  </select>
                  <input type="number" className="w-full bg-gray-50 p-4 rounded-xl font-black border-none text-[#002D5A]" value={editing.prix_standard || editing.prix_avion || ''} onChange={e=>setEditing({...editing, prix_standard:e.target.value})} placeholder="Prix de vente (F)" />
                </div>
                <button disabled={saving} type="submit" className="w-full bg-[#002D5A] text-white py-6 rounded-2xl font-black uppercase shadow-xl active:scale-95 transition-all">
                  {saving ? <Loader2 className="animate-spin mx-auto"/> : "ENREGISTRER SUR LE CLOUD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


// --- APP CONTENT ---
function AppContent() {
  const [sb, setSb] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  
  // Header Animation States
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);

  // LOGIQUE DE NAVIGATION HISTORIQUE


    const loadData = async () => {
    if (!apiInstance) return;
    setLoading(true);
    const [cats, prods] = await Promise.all([apiInstance.getCategories(), apiInstance.getProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
        if (event.state.data) setSelectedProduct(event.state.data);
      } else {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ view: 'home' }, '', '');
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // INITIALISATION SUPABASE
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/dist/umd/supabase.js';
    script.async = true;
    script.onload = () => { 
      if (window.supabase && SUPABASE_URL) {
        setSb(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
      }
    };
    document.head.appendChild(script);

    const clickOutside = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const apiInstance = useMemo(() => sb ? createApi(sb) : null, [sb]);

  useEffect(() => {
    if (!apiInstance) return;
    const load = async () => {
      setLoading(true);
      const [cats, prods] = await Promise.all([apiInstance.getCategories(), apiInstance.getProducts()]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    };
    load();
  }, [apiInstance]);

  const searchSuggestions = useMemo(() => {
    if (search.length < 2) return [];
    return products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase())).slice(0, 10); 
  }, [search, products]);

  const scrollToCategory = (catName) => {
    setActiveCategory(catName);
    setIsMenuOpen(false);
    setTimeout(() => {
      const id = catName === "Tout" ? 'header-categories' : `section-${catName.replace(/\s+/g, '-').toLowerCase()}`;
      const element = document.getElementById(id);
      if (element) {
        const offset = 160;
        window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) setShowHeader(false);
      else setShowHeader(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  if (view === 'detail' && selectedProduct) return <ProductDetail product={selectedProduct} onBack={() => window.history.back()} onAddToCart={(p, mode, price, qty) => {setCart([...cart, {...p, mode, finalPrice: price, quantity: qty, cartId: Date.now()}]); setIsCartOpen(true);}} />;
  if (view === 'admin') return <AdminDashboard products={products} categories={categories} api={apiInstance} sb={sb} onRefresh={loadData} onBack={() => window.history.back()} />;
  if (view === 'about') return <AboutPage onBack={() => window.history.back()} />;
  if (view === 'checkout') return <CheckoutPage cart={cart} total={cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0)} api={apiInstance} onBack={() => window.history.back()} />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#0A1A3A] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&family=Bitter:wght@700&family=Karla:wght@500&display=swap');
        .designer-title { font-family: 'Syne', sans-serif; }
        .designer-body { font-family: 'Inter', sans-serif; }
        .bitter-font { font-family: 'Bitter', serif; }
        .karla-font { font-family: 'Karla', sans-serif; }
        .roboto-font { font-family: 'Syne', sans-serif; }
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
        .animate-vertical-up { animation: scrollUp 40s linear infinite; }
        .animate-vertical-down { animation: scrollDown 40s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header Premium */}
      <header className={`fixed top-0 left-0 right-0 z-[600] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-[#D4AF37]/30 py-3' : 'bg-blue-900 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-wrap items-center justify-between gap-y-3">
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-full transition-all active:scale-90 ${isScrolled ? 'text-[#0A1A3A] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
              <Menu size={24} strokeWidth={2.5}/>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => (scrollToCategory("Tout"), setActiveCategory("Tout"))}>
              <img src="/logoah.jpeg" className="h-10 md:h-16 w-auto rounded-lg shadow-md border border-[#D4AF37]/30" alt="Logo" />
            </div>
          </div>

          <div className=" order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-[500px] relative px-1 sm:px-0" ref={searchRef} onClick={() => scrollToCategory("Tout")}>
            <div className={`flex items-center rounded-[2rem] px-5 py-3 gap-3 transition-all ${isScrolled ? 'bg-gray-100 border border-gray-100' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
              <Search size={18} className={isScrolled ? 'text-gray-400' : 'text-white/60'} />
              <input type="text" placeholder="Rechercher une pépite..." className={`bg-transparent border-none text-xs md:text-sm w-full focus:ring-0 focus:outline-none p-0 font-medium ${isScrolled ? 'text-[#0A1A3A]' : 'text-white placeholder-white/50'}`} value={search} onChange={e => {setSearch(e.target.value); setShowSuggestions(true);}} onFocus={() => setShowSuggestions(true)} />
            </div>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-[110%] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 z-[800] animate-fade-in p-4">
                 <div className="flex flex-row overflow-x-auto no-scrollbar gap-4 pb-2">
                    {searchSuggestions.map(p => (
                      <div key={p.id} onClick={() => { setShowSuggestions(false); setSearch('')}} className="flex-shrink-0 w-44 bg-gray-50 hover:bg-white border border-gray-100 rounded-[2rem] p-3 transition-all cursor-pointer">
                         <div className="aspect-square w-full rounded-2xl overflow-hidden mb-3"><img src={p.image_urls?.[0]} className="w-full h-full object-cover" alt="" /></div>
                         <p className="text-[11px] font-bold text-[#0A1A3A] truncate uppercase">{p.nom}</p>
                         <p className="text-[10px] font-black text-[#D4AF37] mt-1">{p.prix_standard?.toLocaleString()}F</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <button onClick={() => setIsCartOpen(true)} className={`relative p-2.5 md:p-4 rounded-full shadow-2xl transition-all active:scale-90 ${isScrolled ? 'bg-[#0A1A3A] text-white border-4 border-[#D4AF37]/20' : 'bg-white/20 backdrop-blur-md text-white border-2 border-white/20'}`}>
              <ShoppingBag size={18} className="md:w-6 md:h-6" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A1A3A] text-[9px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="h-20" />
      <HeroSection onScrollToCategories={() => scrollToCategory("Tout")} />

      <div id="header-categories" className="border-b bg-white sticky top-0 z-40 overflow-x-auto no-scrollbar pt-[10px] sm:pt-[5px]">
        <div className="max-w-7xl mx-auto flex gap-10 px-8 py-5 whitespace-nowrap items-center border-t border-gray-100">
          <button onClick={() => scrollToCategory("Tout")} className={`text-[11px] font-bold uppercase tracking-widest relative pb-2 transition-all ${activeCategory === "Tout" ? 'text-[#0A1A3A]' : 'text-gray-400 hover:text-gray-600'}`}>Tout{activeCategory === "Tout" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-full"></div>}</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => scrollToCategory(c.name)} className={`text-[11px] font-bold uppercase tracking-widest relative pb-2 transition-all ${activeCategory === c.name ? 'text-[#0A1A3A]' : 'text-gray-400 hover:text-gray-600'}`}>{c.name}{activeCategory === c.name && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-full"></div>}</button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
        <div className="space-y-32">
          {activeCategory === "Tout" ? categories.map(cat => {
            const catProds = products.filter(p => p.categorie === cat.name && p.nom.toLowerCase().includes(search.toLowerCase()));
            return catProds.length > 0 && (
              <section key={cat.id} id={`section-${cat.name.replace(/\s+/g, '-').toLowerCase()}`} className="animate-fade-in-up scroll-mt-24">
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-[#0A1A3A] designer-title uppercase ">{cat.name}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {catProds.map(p => (
                    <div key={p.id} className="group bg-white rounded-[1rem] overflow-hidden border border-gray-100 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer ">
                      <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-[1rem] mb-6 shadow-inner">
                        <img src={p.image_urls?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                        <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-xl text-[8px] font-Karla text-white shadow-xl ${p.type_dispo === 'STOCK' ? 'bg-blue-600' : 'bg-red-600'}`}>{p.type_dispo}</div>
                      </div>
                      <div className="space-y-2 p-3">
                        <p className="text-[#D4AF37] text-[8px] font-black uppercase ">{p.categorie}</p>
                        <h3 className="text-lg font-karla text-[#0A1A3A] designer-title uppercase truncate">{p.nom}</h3>
                        <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                          <p className="text-xl font-Karla text-[#0A1A3A]">{p.prix_standard?.toLocaleString()} F</p>
                          <div className="p-3 bg-gray-50 group-hover:bg-[#0A1A3A] group-hover:text-white transition-all rounded-xl"><ArrowRight size={14}/></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }) : (
            <section className="animate-fade-in-up scroll-mt-24">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.filter(p => p.categorie === activeCategory && p.nom.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <div key={p.id}  className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer ">
                    <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-[1rem] mb-6 shadow-inner"><img src={p.image_urls?.[0]} className="w-full h-full object-cover" alt="" /></div>
                    <div className="space-y-2 p-3">
                      <p className="text-[#D4AF37] text-[8px] font-black uppercase ">{p.categorie}</p>
                      <h3 className="text-lg font-Karla text-[#0A1A3A] designer-title uppercase truncate">{p.nom}</h3>
                      <p className="text-xl font-Karla text-[#0A1A3A] mt-4">{p.prix_standard?.toLocaleString()} F</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>


       <footer className="bg-[#002D5A] text-white pt-24 pb-12 px-8 rounded-t-[4rem] md:rounded-t-[6rem] font-sans mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase google-sans-header">Industrie de l'avenir</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">vente.</p>
            <div className="flex justify-center md:justify-start gap-4">
               <div className="p-4 bg-white/5 rounded-2xl hover:bg-[#D0A050] transition-all cursor-pointer shadow-lg"><Facebook size={20}/></div>
               <div className="p-4 bg-white/5 rounded-2xl hover:bg-[#D0A050] transition-all cursor-pointer shadow-lg"><Instagram size={20}/></div>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#D0A050] font-black uppercase text-[10px] tracking-[0.4em]">Rayons</h4>
            <ul className="space-y-4 text-sm font-bold opacity-60">
              {categories.slice(0, 5).map(c => <li key={c.id} className="cursor-pointer hover:text-[#D0A050]" onClick={() => {setActiveCategory(c.name); window.scrollTo(0,0);}}>{c.name}</li>)}
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#D0A050] font-black uppercase text-[10px] tracking-[0.4em]">Société</h4>
            <ul className="space-y-4 text-sm font-bold opacity-60">
              <li className="cursor-pointer hover:text-[#D0A050]" onClick={()=>setView('about')}>À Propos de l'industrie de l'avenir</li>
              <li className="cursor-pointer hover:text-white" onClick={()=>setView('admin')}>Admin</li>
            </ul>
          </div>
          <div className="space-y-8 md:col-span-1">
            <h4 className="text-[#D0A050] font-black uppercase text-[10px] tracking-[0.4em]">Contact</h4>
            <p className="text-xl font-black">{WHATSAPP_NUMBER.replace('228', '+228 ')}</p>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">lome TOGO.</p>
          </div>
        </div>
        <p className="text-[9px] text-gray-600 uppercase text-center border-t border-white/5 pt-10 font-black tracking-[0.5em] tracking-widest">© 2024 l'industie de l'avenir . L'EXCELLENCE SANS FRONTIÈRES</p>
      </footer>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex">
          <div className="absolute inset-0 bg-blend-soft-light backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-75 max-w-[85%] bg-blue-950 h-full shadow-2xl animate-slide-in p-10 flex flex-col font-sans no-scrollbar overflow-y-auto">
             <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black text-white tracking-tighter leading-none roboto-font uppercase">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-grid-100 lato-font rounded-full text-white"><X size={20}/></button>
             </div>
             <nav className="flex flex-col gap-10">
                <button 
                  onClick={() => scrollToCategory("Tout")} 
                  className={`text-left font-medium karla-font text-xl transition-all ${activeCategory === "Tout" ? 'underline decoration-[#D4AF37] decoration-4 underline-offset-8 text-white' : 'text-white'}`}
                >
                  Toutes les Pépites
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => scrollToCategory(c.name)} 
                    className={`text-left bitter-font text-2xl transition-all text-white ${activeCategory === c.name ? 'underline decoration-[#D4AF37] decoration-4 underline-offset-8' : 'hover:underline hover:decoration-[#D4AF37]/50'}`}
                  >
                    {c.name}
                  </button>
                ))}
                <div className="pt-10 border-t border-gray-100">
                  <button onClick={() => {setView('about'); setIsMenuOpen(false);}} className="text-left font-medium text-xl text-white transition-colors">Notre Processus</button>
                </div>
             </nav>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-8 animate-slide-in-right overflow-y-auto no-scrollbar font-sans">
             <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-[#0A1A3A] tracking-tighter uppercase">Votre Panier</h2>
               <button onClick={() => setIsCartOpen(false)} className="p-4 bg-gray-100 rounded-full"><X size={20}/></button>
             </div>
             <div className="flex-1 space-y-6">
                {cart.length === 0 ? <p className="text-center py-20 font-bold opacity-30">Panier vide</p> : cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <img src={item.image_urls?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0A1A3A] truncate text-xs uppercase">{item.nom}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border">
                          <button onClick={() => updateCartQty(item.cartId, -1)}><Minus size={12}/></button>
                          <span className="text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.cartId, 1)}><Plus size={12}/></button>
                        </div>
                        <p className="font-black text-[#0A1A3A] text-xs">{(item.finalPrice * item.quantity).toLocaleString()} F</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             {cart.length > 0 && (
               <div className="pt-8 border-t border-gray-100">
                  <div className="flex justify-between mb-6">
                    <span className="font-bold text-gray-400">TOTAL</span>
                    <span className="text-2xl font-black text-[#0A1A3A]">{(cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0)).toLocaleString()} F</span>
                  </div>
                  <button  className="w-full bg-[#0A1A3A] text-white py-5 rounded-2xl font-black uppercase shadow-xl tracking-widest active:scale-95 transition-all">Valider la Commande</button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() { return <AppContent />; }
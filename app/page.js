'use client';
import React, { useState, useEffect, useRef,useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Plane, Ship, X, CheckCircle, ArrowRight, ShoppingCart, 
  Menu, Search, Facebook, Instagram, ArrowLeft, Truck, Send, 
  Loader2, Heart, Bell, Phone, MapPin, User, Mail, ShieldCheck, 
  History, FileText, ChevronDown, ListChecks, Globe, ChevronRight,
  Settings, Plus, Minus, Edit3, Image as ImageIcon, Save, Lock, Trash2, Info, LogOut,Sparkles,Zap,CircleQuestionMark,BookOpen, Laptop,Maximize2,ChevronLeft,Play,Icon,Star
} from 'lucide-react';

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""; 
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""; 
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""; 
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

const isVideo = (url) => {
  if (!url) return false;
  return url.includes('/video/upload/') || url.match(/\.(mp4|webm|ogg|mov)$/i);
};

// --- HOOK PERSONNALISÉ POUR GÉRER LE RETOUR ---
const useBackHandler = (handler, deps = []) => {
  const backHandlerRef = useRef(handler);
  useEffect(() => {
    backHandlerRef.current = handler;
  }, deps);
  useEffect(() => {
    const handlePopState = () => {
      backHandlerRef.current();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};


// --- COMPOSANT ROUTER SIMULÉ (pour remplacer useRouter si non utilisé) ---


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
const MediaRenderer = ({ url, className, autoPlay = false }) => {
  if (isVideo(url)) {
    return (
      <video src={url} className={className} autoPlay={autoPlay} muted loop playsInline />
    );
  }
  return <img src={url} className={className} alt="" />;
};

const Nudge = ({ api }) => {
  const [visible, setVisible] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('afri_nudge_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 15000);
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

// --- COMPOSANT HERO ---
const HeroSection = () => {

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



      <section className="relative overflow-hidden bg-blue-100 py-5 lg:py-10 min-h-[85vh] flex items-center">

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

                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter designer-body">Commandez en toute confiance </span>

                </div>

                <div className="flex items-center gap-2">

                  <Truck className="text-blue-500" size={18} />

                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter designer-body">Livraison partout</span>

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

// --- ABOUT PAGE AVEC GESTION DU RETOUR ---
const AboutPage = ({ onBack, sectionId }) => {
  // Utilisation du hook pour gérer le retour
  useBackHandler(() => {
    onBack();
  });

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
              <p className="text-gray-600">Les industries de l'avenir est une plateforme de vente et d'importation créée pour simplifier l'accès aux produits du monde entier, tout en proposant des articles disponibles localement..</p>
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

// --- DÉTAIL PRODUIT AVEC GESTION DU RETOUR ---
const ProductDetail = ({ product, onBack, onAddToCart }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  
  // Gestion du retour avec le hook personnalisé
  useBackHandler(() => {
    onBack();
  });

  const isOrder = product.type_dispo === 'COMMANDE';
  const price = isOrder ? product.prix_avion : product.prix_standard;

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-20 font-sans overflow-x-hidden">
      {showToast && (
           <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <div className="bg-[#D4AF37] p-1 rounded-full text-[#0A1A3A]"><CheckCircle size={16}/></div>
            <span className="font-bold">Produit Ajouté au panier !</span>
   
        </div>
      )}
      
      {isFullscreen && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"><X size={32} /></button>
          <div className="relative w-full max-w-4xl flex items-center justify-center">
            {isVideo(product.image_urls[activeImgIndex]) ? (
              <video src={product.image_urls[activeImgIndex]} className="max-w-full max-h-full" controls autoPlay  />
            ) : (
              <img src={product.image_urls[activeImgIndex]} className="max-w-full max-h-full object-contain" alt="" />
            )}
            <button onClick={() => setActiveImgIndex((prev) => (prev - 1 + product.image_urls.length) % product.image_urls.length)} className="absolute left-0 p-4 text-white"><ChevronLeft size={48} /></button>
            <button onClick={() => setActiveImgIndex((prev) => (prev + 1) % product.image_urls.length)} className="absolute right-0 p-4 text-white"><ChevronRight size={48} /></button>
          </div>
        </div>
      )}

      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[700] px-4 md:px-6 py-4 border-b flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-[#0A1A3A] hover:text-white transition-all active:scale-90"><ArrowLeft size={20}/></button>
        <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">A l'Industrie de l'Avenir </span>
        <div className="w-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <div onClick={() => setIsFullscreen(true)} className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border shadow-2xl cursor-zoom-in group">
              <MediaRenderer url={product.image_urls[activeImgIndex]} className="w-full h-full object-cover transition-all" autoPlay={true} />
              <div className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {isVideo(product.image_urls[activeImgIndex]) ? <Play size={24} /> : <Maximize2 size={24} />}
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
              {product.image_urls?.map((url, i) => (
                <button key={i} onClick={() => setActiveImgIndex(i)} className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 shrink-0 transition-all ${activeImgIndex === i ? 'border-[#D4AF37] scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                  {isVideo(url) ? <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Play size={24}/></div> : <img src={url} className="w-full h-full object-cover" alt="" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10 flex flex-col justify-center">
            <div>
              <div className="inline-flex px-3 py-1 bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                {product.categorie}
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.nom}</h1>
              <p className="text-lg text-slate-600 mb-6">{product.description}</p>
              
              {/* Note */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                 
                    <Star size={20} className="text-yellow-400 fill-current" fill="currentColor" />
                 
                </div>
                <span className="text-slate-600">(4.9 • 128 avis)</span>
              </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-[3.5rem] space-y-10 shadow-inner">
              <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-[#0A1A3A] uppercase tracking-[0.2em]">SÉLECTION QUANTITÉ</p>
                 <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-[1.5rem] shadow-sm border border-gray-100">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[#0A1A3A] active:scale-125 transition-transform"><Minus size={20}/></button>
                    <span className="font-black text-2xl w-8 text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="text-[#0A1A3A] active:scale-125 transition-transform"><Plus size={20}/></button>
                 </div>
              </div>
             <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Prix actuel</div>
                  <div className="text-5xl font-bold text-slate-900">
                    {Number(price).toLocaleString()} F
                  </div>
                  {isOrder && (
                    <div className="text-sm text-emerald-600 mt-2">
                      <Icon name="package" size={16} className="inline mr-2" />
                    Ici vous avez le prix de l'article sans les frais livraisons 
                    </div>
                  )}
                </div>
               
              </div>
            </div>
           {/* Boutons */}
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    onAddToCart(product, isOrder ? 'WHATSAPP' : 'STOCK', price, quantity);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isOrder 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg hover:shadow-emerald-500/25' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/25'
                  } text-white`}
                >
                  {isOrder ? 'Commander maintenant' : 'Ajouter au panier'}
                </button>
                
                <button className="w-full py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Acheter maintenant
                </button>
              </div>
                {/* Garanties */}
                {isOrder && ( 
                <div className="grid grid-cols-2 gap-4">
                  <div  className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                    <div className="bg-green-100 p-2 rounded-full text-green-500"><Ship size={20} className="text-cyan-600"/> <span className="text-sm font-medium text-slate-700">Bateau</span></div>
                    <div className="bg-green-100 p-2 rounded-full text-green-500"><Plane size={20} className="text-cyan-600"/> <span className="text-sm font-medium text-slate-700">Avion</span></div>
                          
                </div>
              )
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD AVEC GESTION DU RETOUR ---
const AdminDashboard = ({ products, categories, onRefresh, onBack, api, sb }) => {
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: '', pass: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showCatList, setShowCatList] = useState(false);

  // Gestion du retour pour l'admin
  useBackHandler(() => {
    if (editing) {
      setEditing(null);
    } else {
      onBack();
    }
  }, [editing]);

  useEffect(() => {
    if (!sb || !sb.auth) return;
    const checkUser = async () => {
      try {
        const { data: { user } } = await sb.auth.getUser();
        setUser(user);
      } catch (e) {}
    };
    checkUser();
  }, [sb]);

  const filteredAdminProducts = useMemo(() => {
    return products.filter(p => 
      p.nom.toLowerCase().includes(adminSearch.toLowerCase()) || 
      p.categorie.toLowerCase().includes(adminSearch.toLowerCase())
    );
  }, [products, adminSearch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!sb || !sb.auth) return;
    setAuthLoading(true);
    const { data, error } = await sb.auth.signInWithPassword({
      email: authForm.email, password: authForm.pass
    });
    setAuthLoading(false);
    if (!error) setUser(data.user);
  };

  const handleLogout = async () => {
    if (sb && sb.auth) await sb.auth.signOut();
    setUser(null);
  };

  const openCloudinary = (index) => {
    if (!window.cloudinary) return alert("Cloudinary non chargé.");
    window.cloudinary.openUploadWidget({
      cloudName: CLOUDINARY_CLOUD_NAME, 
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      resourceType: 'auto',
      sources: ['local', 'url', 'camera'], 
      multiple: false,
    }, (error, result) => {
      if (!error && result.event === "success") { 
        const newImages = [...(editing.image_urls || Array(5).fill(''))];
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
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1A3A] p-6 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-[#D4AF37]">
          <Lock className="mx-auto text-[#0A1A3A] mb-6" size={56} />
          <h2 className="text-2xl font-black text-[#0A1A3A] mb-8 uppercase designer-title">Administration</h2>
          <form onSubmit={handleLogin} className="space-y-4">
             <input required type="email" placeholder="Email" className="w-full bg-gray-100 p-5 rounded-2xl border-none outline-none font-bold shadow-inner" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
             <input required type="password" placeholder="Pass" className="w-full bg-gray-100 p-5 rounded-2xl border-none outline-none font-bold shadow-inner" value={authForm.pass} onChange={e => setAuthForm({...authForm, pass: e.target.value})} />
             <button disabled={authLoading || !sb} type="submit" className="w-full bg-[#0A1A3A] text-white py-5 rounded-2xl font-black uppercase shadow-xl active:scale-95 transition-all">
               {authLoading ? <Loader2 className="animate-spin" /> : "ACCÉDER"}
             </button>
          </form>
          <button onClick={onBack} className="mt-8 text-gray-400 font-bold hover:text-[#0A1A3A] transition-colors uppercase text-xs">Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans pb-20 p-4 md:p-12 animate-fade-in roboto-font">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#0A1A3A] uppercase tracking-tighter designer-title">Gestion Stock</h2>
          <p className="text-[10px] font-bold text-blue-600 mt-2">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Trouver un produit..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:bg-white focus:border-[#D4AF37] outline-none transition-all shadow-inner font-medium" value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} />
          </div>
          <button onClick={handleLogout} className="p-3.5 bg-red-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase flex items-center gap-2 border border-red-100"><LogOut size={16}/> Quitter</button>
          <button onClick={() => setShowCatList(!showCatList)} className="p-3.5 bg-white rounded-2xl shadow-sm border border-gray-200 text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white transition-all"><Settings size={20}/></button>
          <button onClick={onBack} className="p-3.5 bg-gray-100 rounded-full text-gray-500 hover:bg-white transition-all"><X size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <button onClick={() => setEditing({ nom: '', categorie: categories[0]?.name, type_dispo: 'STOCK', description: '', image_urls: Array(8).fill('') })} className="bg-white border-4 border-dashed border-gray-200 rounded-[3rem] p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group aspect-square shadow-sm">
          <Plus size={40} className="text-gray-300 group-hover:text-blue-500 transition-all" />
          <span className="font-black text-gray-400 text-[10px] uppercase mt-4">Ajouter</span>
        </button>

        {filteredAdminProducts.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-[3rem] shadow-sm flex flex-col items-center group relative border border-transparent hover:border-[#D4AF37] transition-all duration-500">
            <button onClick={async () => { if(window.confirm("Supprimer ?")) { await api.deleteProduct(p.id); onRefresh(); } }} className="absolute top-4 right-4 p-2.5 bg-red-50 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 size={16}/></button>
            <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-5 bg-gray-50 relative shadow-inner">
              <MediaRenderer url={p.image_urls?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay={true} />
              {isVideo(p.image_urls?.[0]) && <div className="absolute bottom-2 right-2 bg-[#D4AF37] text-[#0A1A3A] p-1.5 rounded-full"><Play size={10} fill="currentColor"/></div>}
            </div>
            <div className="w-full text-center">
              <p className="text-[8px] font-black text-[#D4AF37] uppercase mb-1">{p.categorie}</p>
              <p className="font-black text-[#0A1A3A] uppercase text-[11px] truncate w-full px-2">{p.nom}</p>
            </div>
            <button onClick={() => setEditing({ ...p, image_urls: [...(p.image_urls || []), ...Array(8).fill('')].slice(0, 8) })} className="mt-4 w-full py-3 bg-[#0A1A3A] rounded-2xl text-white font-black text-[9px] uppercase hover:bg-[#D4AF37] transition-all shadow-md">Modifier</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[1000] bg-[#0A1A3A]/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[3.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-fade-in relative border-b-8 border-[#D4AF37]">
            <button onClick={() => setEditing(null)} className="absolute top-8 right-8 p-3.5 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>
            <h3 className="text-3xl font-black text-[#0A1A3A] mb-10 uppercase tracking-tighter roboto-font flex items-center gap-3"><Edit3 size={28} className="text-blue-500"/> Fiche Article (Max 8 Médias)</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <input required className="w-full bg-gray-50 p-5 rounded-[1.2rem] border border-gray-100 focus:border-blue-500 outline-none font-bold shadow-inner" value={editing.nom} onChange={e=>setEditing({...editing, nom:e.target.value})} placeholder="Désignation" />
                <select className="w-full bg-gray-50 p-5 rounded-[1.2rem] font-black border border-gray-100 shadow-inner" value={editing.categorie} onChange={e=>setEditing({...editing, categorie:e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <textarea className="w-full bg-gray-50 p-5 rounded-[1.2rem] h-48 border border-gray-100 focus:border-blue-500 font-medium shadow-inner" value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} placeholder="Description..." />
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-2.5">
                  {editing.image_urls.map((url, i) => (
                    <button key={i} type="button" onClick={() => openCloudinary(i)} className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${i === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}>
                      {url ? (
                        isVideo(url) ? <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Play size={16}/></div> : <img src={url} className="w-full h-full object-cover" alt="" />
                      ) : <Plus size={16} className="text-gray-300"/>}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <select className="w-full bg-gray-50 p-4 rounded-[1rem] font-black text-[10px] uppercase shadow-inner" value={editing.type_dispo} onChange={e=>setEditing({...editing, type_dispo:e.target.value})}>
                    <option value="STOCK">STOCK </option>
                    <option value="COMMANDE">IMPORT USA</option>
                  </select>
                  <input type="number" className="w-full bg-gray-100 p-4 rounded-[1rem] font-black text-[#0A1A3A] text-xl shadow-inner outline-none focus:ring-2 focus:ring-[#D4AF37]" value={editing.prix_standard || editing.prix_avion || ''} onChange={e=>setEditing({...editing, prix_standard:e.target.value})} placeholder="Prix (F)" />
                </div>
                <button disabled={saving} type="submit" className="w-full bg-[#0A1A3A] text-white py-6 rounded-[1.5rem] font-black uppercase shadow-2xl active:scale-95 transition-all text-sm tracking-widest mt-2 flex items-center justify-center gap-3 border-b-4 border-black/30">
                  {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> ENREGISTRER PRODUIT</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CHECKOUT PAGE AVEC GESTION DU RETOUR ---
const CheckoutPage = ({ cart, total, onBack, api }) => {
  const [form, setForm] = useState({ nom: '', tel: '', adresse: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Gestion du retour pour checkout
  useBackHandler(() => {
    if (!done) {
      onBack();
    }
  }, [done]);

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
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
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

// --- COMPOSANT PRINCIPAL AVEC SYSTÈME DE NAVIGATION COMPLET ---
const ProductCard = ({ product, onClick }) => (
  <div onClick={onClick} className="group bg-white rounded-[1rem] overflow-hidden border border-gray-100 hover:border-[#D4AF37]/40 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer  animate-fade-in gap-2">
    <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-[1rem] mb-1 shadow-inner">
      <img src={product.image_urls?.[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.nom} />
      <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-xl text-[8px] font-Roboto text-white shadow-xl ${product.type_dispo === 'STOCK' ? 'bg-blue-600' : 'bg-red-600'}`}>
        {product.type_dispo}
      </div>
    </div>
    <div className="space-y-2 p-4">
      <p className="text-[#D4AF37] text-[8px] font-black uppercase ">{product.categorie}</p>
      <h3 className="text-lg font-Karla text-[#0A1A3A] designer-title uppercase leading-tight truncate">{product.nom}</h3>
      <div className="flex justify-between items-center pt-5 border-t border-gray-100">
        <p className="text-xl font-Karla text-[#0A1A3A] ">{(product.prix_standard || product.prix_avion)?.toLocaleString()} F</p>
        <div className="p-3 bg-gray-50 group-hover:bg-[#0A1A3A] group-hover:text-white transition-all rounded-xl shadow-inner"><ArrowRight size={13}/></div>
      </div>
    </div>
  </div>
);

// --- APP CONTENT PRINCIPAL ---
function AppContent() {
  const [sb, setSb] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Gestionnaire de navigation principale
  const navigateTo = (newView, product = null) => {
    // Ajouter un état à l'historique pour chaque navigation
    window.history.pushState({ view: newView, product }, '', window.location.pathname);
    setView(newView);
    setSelectedProduct(product);
    
    // Fermer les modals lors de la navigation
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  // Gestion du retour pour la page principale
  useBackHandler(() => {
    if (view !== 'home') {
      setView('home');
      setSelectedProduct(null);
    }
  }, [view]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    
    // Ajouter un état initial à l'historique
    window.history.replaceState({ view: 'home', product: null }, '', window.location.pathname);
    
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const apiInstance = useMemo(() => sb ? createApi(sb) : null, [sb]);

  const loadData = async () => {
    if (!apiInstance) return;
    setLoading(true);
    const [cats, prods] = await Promise.all([apiInstance.getCategories(), apiInstance.getProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => { if (apiInstance) loadData(); }, [apiInstance]);

  const searchSuggestions = useMemo(() => {
    if (search.length < 2) return [];
    return products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase())).slice(0, 6);
  }, [search, products]);

  const filtered = useMemo(() => {
    let res = products.filter(p => (activeCategory === "Tout" || p.categorie === activeCategory) && p.nom.toLowerCase().includes(search.toLowerCase()));
    return res.sort((a, b) => {
      const pa = Number(a.prix_standard || a.prix_avion || a.prix_bateau || 0);
      const pb = Number(b.prix_standard || b.prix_avion || b.prix_bateau || 0);
      return sortOrder === 'asc' ? pa - pb : pb - pa;
    });
  }, [products, activeCategory, search, sortOrder]);

  const addToCart = (product, mode, price, quantity = 1) => {
    const existing = cart.find(i => i.id === product.id && i.mode === mode);
    if (existing) {
      setCart(cart.map(i => (i.id === product.id && i.mode === mode) ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      setCart([...cart, { ...product, mode, finalPrice: price, quantity: quantity, cartId: Date.now() }]);
    }
    setIsCartOpen(true);
  };

  const groupedProducts = useMemo(() => {
    const groups = {};
    const filtered = products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()));
    categories.forEach(cat => { groups[cat.name] = filtered.filter(p => p.categorie === cat.name); });
    return groups;
  }, [products, categories, search]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.categorie === activeCategory && p.nom.toLowerCase().includes(search.toLowerCase()));
  }, [products, activeCategory, search]);

  const scrollToCategory = (catName) => {
    setActiveCategory(catName);
    setIsMenuOpen(false);
    setTimeout(() => {
      const id = catName === "Tout" ? 'header-categories' : `section-${catName.replace(/\s+/g, '-').toLowerCase()}`;
      const element = document.getElementById(id);
      if (catName === "Tout") window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (element) {
        const offset = 160;
        const pos = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: pos - offset, behavior: 'smooth' });
      }
    }, 150);
  };

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // Rendu conditionnel des vues
  if (view === 'admin') return <AdminDashboard products={products} categories={categories} api={apiInstance} sb={sb} onRefresh={loadData} onBack={() => navigateTo('home')} />;
  if (view === 'about') return <AboutPage onBack={() => navigateTo('home')} />;
  if (view === 'detail' && selectedProduct) return <ProductDetail product={selectedProduct} onBack={() => navigateTo('home')} onAddToCart={addToCart} />;
  if (view === 'checkout') return <CheckoutPage cart={cart} total={cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0)} api={apiInstance} onBack={() => navigateTo('home')} />;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#D0A050]/20 overflow-x-hidden">
      <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .google-sans-header { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; letter-spacing: -0.04em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[600] transition-all duration-500 ease-in-out transform  ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-[#D4AF37]/30 py-3' : 'bg-blue-800 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-wrap items-center justify-between gap-y-3">
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-full transition-all active:scale-90 ${isScrolled ? 'text-[#0A1A3A] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
              <Menu size={24} strokeWidth={2.5}/>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToCategory("Tout")}>
              <img src="/logoah.jpeg" className="h-10 md:h-16 w-auto rounded-lg shadow-md border border-[#D4AF37]/30" alt="Logo" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-[600px] relative px-1 sm:px-0" ref={searchRef}>
            <div className={`flex items-center rounded-[2rem] px-5 py-3 gap-3 transition-all ${isScrolled ? 'bg-gray-100 border border-gray-200' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
              <Search size={18} className={isScrolled ? 'text-gray-400' : 'text-white/60'} />
              <input 
                type="text" 
                placeholder="Trouver une pépite, un article..." 
                className={`bg-transparent border-none text-xs md:text-sm w-full focus:ring-0 focus:outline-none p-0 font-medium ${isScrolled ? 'text-[#0A1A3A]' : 'text-white placeholder-white/50'}`} 
                value={search} 
                onChange={e => {setSearch(e.target.value); setShowSuggestions(true);}} 
                onFocus={() => setShowSuggestions(true)}
              />
              {search && (
                <button onClick={() => {setSearch(''); setShowSuggestions(false);}} className={`p-1 rounded-full ${isScrolled ? 'bg-gray-200 text-gray-500' : 'bg-white/20 text-white'}`}><X size={12}/></button>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-[110%] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[800] animate-fade-in mx-1 sm:mx-0 p-4">
                 <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Pépites trouvées</span>
                    <button onClick={() => setShowSuggestions(false)} className="text-[10px] font-bold text-gray-400 hover:text-red-500">FERMER</button>
                 </div>
                 
                 <div className="flex flex-row overflow-x-auto no-scrollbar gap-4 pb-2">
                    {searchSuggestions.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => {navigateTo('detail', p); setShowSuggestions(false); setSearch(''); window.scrollTo(0,0);}} 
                        className="flex-shrink-0 w-44 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-[#D4AF37]/40 rounded-[2rem] p-3 transition-all cursor-pointer group shadow-sm"
                      >
                         <div className="aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-white">
                            <img src={p.image_urls?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                         </div>
                         <div className="px-1 min-w-0">
                            <p className="text-[11px] font-bold text-[#0A1A3A] truncate uppercase leading-tight">{p.nom}</p>
                            <div className="flex items-center justify-between mt-1">
                               <span className="text-[8px] font-black text-[#D4AF37] uppercase truncate max-w-[60%]">{p.categorie}</span>
                               <span className="text-[10px] font-black text-[#0A1A3A]">{(p.prix_standard || p.prix_avion)?.toLocaleString()}F</span>
                            </div>
                         </div>
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

      <HeroSection/>

      {/* Barre de Catégories */}
      <div className="border-b bg-white sticky top-[120px] sm:top-[81px] z-40 overflow-x-auto no-scrollbar transition-all">
        <div className="max-w-7xl mx-auto flex gap-6 md:gap-10 px-6 md:px-12 py-4 md:py-6 whitespace-nowrap">
          <button onClick={() => setActiveCategory("Tout")} className={`text-[10px] md:text-xs font-black uppercase tracking-widest relative pb-1 transition-all ${activeCategory === "Tout" ? 'text-[#002D5A]' : 'text-blue-500'}`}>Tout</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.name)} className={`text-[10px] md:text-xs  Alegreya-font uppercase tracking-widest relative pb-1 transition-all ${activeCategory === c.name ? 'text-[#002D5A]' : 'text-gray-500 hover:text-blue-700'}`}>
              {c.name}
              {activeCategory === c.name && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D0A050] rounded-full"></div>}
            </button>
          ))}
        </div>
      </div>
     
      <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
        <div className="space-y-24">
          {activeCategory === "Tout" ? (
            categories.map(cat => groupedProducts[cat.name]?.length > 0 && (
              <section key={cat.id} id={`section-${cat.name.replace(/\s+/g, '-').toLowerCase()}`} className="animate-fade-in-up scroll-mt-24">
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-[#0A1A3A] designer-title uppercase ">{cat.name}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase ">{groupedProducts[cat.name].length} Produits</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {groupedProducts[cat.name].map(p => ( 
                    <ProductCard key={p.id} product={p} onClick={() => navigateTo('detail', p)} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section id={`section-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`} className="animate-fade-in-up scroll-mt-24">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map(p => ( 
                  <ProductCard key={p.id} product={p} onClick={() => navigateTo('detail', p)} />
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
              <li className="cursor-pointer hover:text-[#D0A050]" onClick={()=>navigateTo('about')}>À Propos de l'industrie de l'avenir</li>
              <li className="cursor-pointer hover:text-white" onClick={()=>navigateTo('admin')}>Admin</li>
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

      {/* Drawer Panier */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-[#002D5A]/85 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col p-8 md:p-12 animate-slide-in-right overflow-y-auto no-scrollbar font-sans">
             <div className="flex justify-between items-center mb-10 md:mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-[#002D5A] tracking-tighter uppercase leading-none">Votre Panier</h2>
               <button onClick={() => setIsCartOpen(false)} className="p-4 bg-gray-100 rounded-full active:scale-90 hover:bg-red-50 hover:text-red-500 transition-all"><X size={20}/></button>
             </div>
             <div className="flex-1 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-40 opacity-10 flex flex-col items-center">
                    <ShoppingCart size={120} strokeWidth={0.5}/><p className="mt-8 font-black uppercase text-sm tracking-[0.3em] font-sans">Votre panier est vide</p>
                  </div>
                ) : cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 md:gap-6 items-center bg-gray-50 p-6 rounded-[2.5rem] border shadow-sm relative animate-fade-in">
                    <img src={item.image_urls?.[0]} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg border" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#002D5A] truncate uppercase text-[10px] leading-tight mb-2 pr-4">{item.nom}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                         <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border shadow-sm">
                            <button onClick={() => updateCartQty(item.cartId, -1)} className="text-gray-400 active:scale-110"><Minus size={12}/></button>
                            <span className="font-black text-xs min-w-[12px] text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.cartId, 1)} className="text-gray-400 active:scale-110"><Plus size={12}/></button>
                         </div>
                         <p className="font-black text-[#002D5A] text-xs">{(item.finalPrice * item.quantity).toLocaleString()} F</p>
                      </div>
                    </div>
                    <button onClick={() => setCart(cart.filter(i=>i.cartId!==item.cartId))} className="absolute -top-2 -right-2 bg-white text-red-500 p-2 rounded-full shadow-md border active:scale-90 transition-all"><X size={14}/></button>
                  </div>
                ))}
             </div>
             {cart.length > 0 && (
               <div className="pt-8 border-t border-gray-100 space-y-8">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.5em]">Total Commande</span>
                    <span className="text-3xl font-black text-[#002D5A] tracking-tighter">{(cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0)).toLocaleString()} F</span>
                  </div>
                  <button onClick={() => {setIsCartOpen(false); navigateTo('checkout'); window.scrollTo(0,0);}} className="w-full bg-[#002D5A] text-white py-6 rounded-[2rem] font-black text-xl border-b-8 border-black/20 active:scale-95 transition-all uppercase tracking-widest">Valider la Commande</button>
               </div>
             )}
          </div>
        </div>
      )}

      <Nudge api={apiInstance} />

      {/* Menu Mobile */}
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
                  <button onClick={() => {navigateTo('about'); setIsMenuOpen(false);}} className="text-left font-medium text-xl text-white transition-colors">Notre Processus</button>
                </div>
             </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() { return <AppContent />; }
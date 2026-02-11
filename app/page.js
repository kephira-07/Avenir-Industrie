'use client';
import React, { useState, useEffect, useRef,useMemo } from 'react';
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
  const col1Images = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170315870-efffd09636f7?q=80&w=800&auto=format&fit=crop"
  ];

  const col2Images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(245, 158, 11, 0.2) 25%, 
            rgba(239, 68, 68, 0.1) 50%, 
            rgba(245, 158, 11, 0.2) 75%, 
            rgba(59, 130, 246, 0.1) 100%);
          background-size: 200% auto;
          animation: shimmer 8s linear infinite;
        }
        .animate-vertical-up {
          animation: scrollUp 35s linear infinite;
        }
        .animate-vertical-down {
          animation: scrollDown 35s linear infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #f59e0b 50%, #ef4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .border-gradient {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #3b82f6, #f59e0b, #ef4444) border-box;
        }
      `}} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 py-8 lg:py-12 min-h-[90vh] flex items-center">
        {/* Effets d'arrière-plan animés */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Grille subtile */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* TEXTE & CTA */}
            <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/30 to-amber-900/20 border border-blue-500/30 text-blue-300 text-xs font-medium tracking-wider transition-all duration-300 hover:scale-105 hover:border-amber-500/40">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>Import direct • Disponible en boutique</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Commandez vos produits
                <br />
                <span className="text-gradient relative inline-block">
                  Chez nous
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-amber-400 to-red-500"></span>
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
                La plateforme qui vous permet de commander des produits locaux et internationaux,
                avec une livraison fiable partout en Afrique.
                <span className="block mt-2 text-amber-200/80">
                  Accédez à des articles sélectionnés, en toute simplicité.
                </span>
              </p>

              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex items-center justify-center gap-2">
                  Commander maintenant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="px-8 py-3.5 border-gradient bg-slate-900/50 text-slate-200 font-medium rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                  Explorer les produits
                </button>
              </div>

              {/* Badges de confiance */}
              <div className="pt-8 mt-8 border-t border-slate-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Commande sécurisée</p>
                      <p className="text-xs text-slate-400">Paiements 100% protégés</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group">
                    <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Livraison rapide</p>
                      <p className="text-xs text-slate-400">48h-72h en moyenne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUEL DYNAMIQUE */}
            <div className="w-full lg:w-1/2 h-[550px] relative animate-float">
              {/* Conteneur principal avec effet de brillance */}
              <div className="relative h-full overflow-hidden rounded-[2.5rem] border-4 border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950 animate-shimmer">
                
                {/* Effet de lumière */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-amber-500/5"></div>
                
                {/* Colonnes d'images */}
                <div className="grid grid-cols-2 gap-4 h-full p-4">
                  {/* Colonne 1 : Monte */}
                  <div className="space-y-4 animate-vertical-up">
                    {[...col1Images, ...col1Images].map((img, i) => (
                      <div key={i} className="h-52 w-full relative overflow-hidden rounded-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent z-10"></div>
                        <img 
                          src={img} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          alt="Product"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-3 left-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Produit {i % 4 + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Colonne 2 : Descend */}
                  <div className="space-y-4 animate-vertical-down pt-12">
                    {[...col2Images, ...col2Images].map((img, i) => (
                      <div key={i} className="h-52 w-full relative overflow-hidden rounded-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/20 to-transparent z-10"></div>
                        <img 
                          src={img} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:-rotate-1"
                          alt="Product"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-3 left-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Produit {i % 4 + 5}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overlay de dégradé pour cacher les bords */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                
                {/* Élément décoratif */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-blue-500 to-amber-400 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-tr from-red-500 to-amber-400 rounded-full"></div>
              </div>

              {/* Éléments flottants décoratifs */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-amber-500/5 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Indicateur de défilement */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-slate-400 font-light">Explorer</span>
              <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-amber-400 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 animate-fade-in pb-20">
      {/* Header fixe */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors hover:scale-105 active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h2 className="text-xl font-black text-[#135290] google-sans-header">À Propos de Nous</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>En ligne</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-20 font-sans pb-20">
        
        {/* Section 1: Notre Mission */}
        <section id="mission" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#002D5A] google-sans-header">
              Industrie de l'Avenir
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Votre partenaire de confiance pour l'importation et la vente de produits de qualité 
              depuis la Chine vers le Togo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl">
                <span className="text-3xl font-black text-blue-600">🏭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sourcing Direct</h3>
              <p className="text-gray-600 leading-relaxed">
                Nous travaillons directement avec les usines en Chine pour vous garantir 
                les meilleurs prix et une qualité contrôlée à la source.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl">
                <span className="text-3xl font-black text-green-600">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Gestion Complète</h3>
              <p className="text-gray-600 leading-relaxed">
                De la commande chez le fournisseur jusqu'à la livraison chez vous au Togo, 
                nous gérons toute la logistique.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl">
                <span className="text-3xl font-black text-amber-600">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Accompagnement Personnalisé</h3>
              <p className="text-gray-600 leading-relaxed">
                Chaque client bénéficie d'un suivi individuel via WhatsApp pour un service 
                adapté à ses besoins.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Nos Catégories de Produits */}
        <section id="categories" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Notre Catalogue</h2>
              <p className="text-gray-500 mt-2">Des produits sélectionnés pour toutes vos envies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "👔", title: "Mode Homme", items: ["Vêtements", "Chaussures", "Accessoires"] },
              { icon: "👗", title: "Mode Femme", items: ["Robes", "Bijoux", "Sacs"] },
              { icon: "🚜", title: "Agricole", items: ["Machines", "Outils", "Équipements"] },
              { icon: "🏡", title: "Fournitures", items: ["Électronique", "Ménager", "Bureau"] }
            ].map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all hover:scale-[1.02]">
                <div className="text-3xl mb-4">{cat.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-blue-200">
                <span className="text-xl">ℹ️</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Produits sur Commande</h4>
                <p className="text-blue-800 mt-2">
                  Certains articles ne sont pas disponibles immédiatement en stock. 
                  Nous les commandons spécialement pour vous depuis la Chine. 
                  Le délai de livraison vous sera communiqué avant validation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Notre Processus */}
        <section id="processus" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Comment ça marche ?</h2>
              <p className="text-gray-500 mt-2">Un processus simple et transparent</p>
            </div>
          </div>

          <div className="relative">
            {/* Ligne de connexion pour desktop */}
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-400 via-amber-400 to-green-400 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { 
                  number: "01", 
                  title: "Commande sur le Site", 
                  description: "Parcourez notre catalogue et passez votre commande directement sur le site. Aucun paiement n'est requis à cette étape.",
                  icon: "🛒"
                },
                { 
                  number: "02", 
                  title: "Contact WhatsApp", 
                  description: "Nous vous contactons sur WhatsApp pour finaliser les détails : quantité exacte, options de livraison, et devis personnalisé.",
                  icon: "💬"
                },
                { 
                  number: "03", 
                  title: "Livraison au Togo", 
                  description: "Nous gérons l'importation depuis la Chine et la livraison jusqu'à votre adresse au Togo. Vous suivez chaque étape !",
                  icon: "📦"
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <span className="text-4xl font-black text-gray-200">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Options de Livraison */}
        <section id="livraison" className="space-y-8 scroll-mt-24">
          <div className="bg-gradient-to-r from-[#002D5A] to-[#135290] rounded-3xl p-8 text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm">
                <span className="text-2xl">✈️</span>
              </div>
              <div>
                <h2 className="text-3xl font-black google-sans-header">Options de Livraison</h2>
                <p className="text-blue-100 mt-2">Choisissez le mode qui correspond à vos besoins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                    <span className="text-xl">✈️</span>
                  </div>
                  <h3 className="text-xl font-bold">Par Avion (Express)</h3>
                </div>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Livraison en 15-25 jours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Idéal pour les commandes urgentes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Coût calculé au poids et volume</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                    <span className="text-xl">🚢</span>
                  </div>
                  <h3 className="text-xl font-bold">Par Bateau (Économique)</h3>
                </div>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Livraison en 45-60 jours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Parfait pour les grosses commandes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Coût réduit pour les volumes importants</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-center text-blue-100">
                💡 <strong>Le prix final</strong> (produit + livraison) vous sera communiqué sur WhatsApp 
                après discussion de vos besoins spécifiques.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Notre Engagement */}
        <section id="engagement" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-[#002D5A] google-sans-header">Pourquoi Nous Faire Confiance ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des années d'expérience dans l'importation et un engagement total envers la satisfaction client
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: "🔒", 
                title: "Transparence Totale", 
                desc: "Devis détaillé avec tous les frais inclus. Pas de surprise à l'arrivée." 
              },
              { 
                icon: "📱", 
                title: "Suivi en Temps Réel", 
                desc: "Recevez des mises à jour régulières sur l'état de votre commande." 
              },
              { 
                icon: "🏭", 
                title: "Fournisseurs Vérifiés", 
                desc: "Nous travaillons uniquement avec des usines certifiées et fiables en Chine." 
              },
              { 
                icon: "🤝", 
                title: "Support Dédié", 
                desc: "Un conseiller personnel vous accompagne du début à la fin de votre commande." 
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white rounded-2xl border border-amber-300">
                <span className="text-3xl">💰</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">Information Importante sur les Paiements</h3>
                <p className="text-amber-800 mb-4">
                  <strong>Ce site sert uniquement de catalogue et de plateforme de commande.</strong><br/>
                  Aucune transaction financière n'est effectuée ici. Tous les paiements sont finalisés 
                  de manière sécurisée via WhatsApp après confirmation des détails de votre commande.
                </p>
                <div className="flex items-center gap-4 text-amber-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Paiements sécurisés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Reçu officiel fourni</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Contact & Démarrage */}
        <section id="contact" className="space-y-8 scroll-mt-24 text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-10">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-black text-gray-900 google-sans-header">Prêt à Commander ?</h2>
              <p className="text-gray-700 text-lg">
                Commencez par parcourir notre catalogue, sélectionnez vos articles, 
                et nous vous contacterons dans les 24 heures sur WhatsApp.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button 
                  onClick={onBack}
                  className="bg-[#002D5A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#135290] transition-colors hover:scale-105 active:scale-95 shadow-lg"
                >
                  Voir le Catalogue
                </button>
                <a 
                  href="https://wa.me/228XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                  <span className="text-xl">💬</span>
                  Nous Contacter sur WhatsApp
                </a>
              </div>
              
              <p className="text-sm text-gray-500 pt-6">
                <strong>Heures de contact :</strong> Lundi - Samedi • 8h00 - 20h00
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Mentions Légales */}
        <section id="mentions" className="space-y-6 scroll-mt-24 pt-12 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Informations Légales</h2>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Industrie de l'Avenir</h3>
              <p className="text-gray-600">RCCM ABJ-2024-B-XXXX • NIF: XXXXXXXXX</p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Garanties</h3>
              <p className="text-gray-600">
                Tous les équipements électroniques bénéficient d'une garantie SAV locale de 12 mois. 
                Pour les autres produits, une garantie de conformité est appliquée.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Siège</h3>
              <p className="text-gray-600">Lomé, Togo • Service client disponible au +228 XX XX XX XX</p>
            </div>
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
  const handleWhatsApp = () => {
    if(!form.nom || !form.tel) return alert("Veuillez remplir votre nom et numéro.");
    const text = `*COMMANDE Industrie-Avenir*%0A-----------------%0A${cart.map(i => `• ${i.nom} (${i.mode}) x${i.quantity}`).join('%0A')}%0A-----------------%0A*TOTAL : ${total.toLocaleString()} FCFA*%0A%0A*Client :* ${form.nom}%0A*Tél :* ${form.tel}%0A*Lieu :* ${form.adresse}`;
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const isOrder = product?.type_dispo === "COMMANDE";
  const price = isOrder ? product?.prix_avion : product?.prix_standard;

  // Vérification sécurisée pour éviter les erreurs
  const images = Array.isArray(product?.image_urls) ? product.image_urls : [];

  return (
     <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {showToast && (
        <div className="fixed top-6 right-6 z-[1000] animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="font-Roboto font-2xl">Ajouté au panier ! 🛒😉</span>
          </div>
        </div>
      )}

      {isFullscreen && images.length > 0 && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
          >
            <X size={32} />
          </button>
          <div className="relative w-full max-w-4xl flex items-center justify-center">
            {isVideo(images[activeImgIndex]) ? (
              <video
                src={images[activeImgIndex]}
                className="max-w-full max-h-full"
                controls
                autoPlay
              />
            ) : (
              <img
                src={images[activeImgIndex]}
                className="max-w-full max-h-full object-contain"
                alt=""
              />
            )}
            <button
              onClick={() =>
                setActiveImgIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                )
              }
              className="absolute left-0 p-4 text-white"
            >
              <ChevronLeft size={48} />
            </button>
            <button
              onClick={() =>
                setActiveImgIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-0 p-4 text-white"
            >
              <ChevronRight size={48} />
            </button>
          </div>
        </div>
      )}

      {/* Barre supérieure */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[700] px-4 md:px-6 py-4 border-b flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="p-2 bg-gray-100 rounded-full hover:bg-[#0A1A3A] hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">
          A l'Industrie de l'Avenir
        </span>
        <div className="w-10" />
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <div className="space-y-6">
            {images.length > 0 && (
              <div
                onClick={() => setIsFullscreen(true)}
                className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border shadow-2xl cursor-zoom-in group"
              >
                <MediaRenderer
                  url={images[activeImgIndex]}
                  className="w-full h-full object-cover transition-all"
                  autoPlay={true}
                />
                <div className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {isVideo(images[activeImgIndex]) ? (
                    <Play size={24} />
                  ) : (
                    <Maximize2 size={24} />
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 shrink-0 transition-all ${
                    activeImgIndex === i
                      ? "border-[#D4AF37] scale-110 shadow-xl"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                >
                  {isVideo(url) ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                      <Play size={24} />
                    </div>
                  ) : (
                    <img src={url} className="w-full h-full object-cover" alt="" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Détails produit */}
          <div className="space-y-10 flex flex-col justify-center">
            <div>
              <div className="inline-flex px-3 py-1 bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                {product?.categorie}
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {product?.nom}
              </h1>
              <p className="text-lg text-slate-600 mb-6">{product?.description}</p>

              {/* Note */}
              <div className="flex items-center gap-2 mb-6">
                <Star size={20} className="text-yellow-400 fill-current" />
                <span className="text-slate-600">(4.9 • 128 avis)</span>
              </div>
            </div>

            {/* Prix et quantité */}
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Prix actuel</div>
                  <div className="text-5xl font-bold text-slate-900">
                    {Number(price).toLocaleString()} F
                  </div>
                  {isOrder && (
                    <div className="text-sm text-emerald-600 mt-2">
                      Ici vous avez le prix de l'article sans les frais de livraison
                    </div>
                  )}
                </div>
              </div>
                           {/* Quantité */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-sm font-medium text-slate-700">Quantité</div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-2">
                  <button 
                    onClick={() =>setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    <Minus size={20} />
                   </button>
                  <span className="text-xl font-bold w-12 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
                  >

                    <Plus size={20} />
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <div className="text-lg text-slate-700">Total</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {(Number(price) * qty).toLocaleString()} F
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-8">
               <div className="space-y-4">
                <button 
                  onClick={() => {
                    onAddToCart(product, isOrder ? 'WHATSAPP' : 'STOCK', price, qty);
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
                
                <button onClick={handleWhatsApp} className="w-full py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold  hover:bg-slate-50">
                  Acheter maintenant
                </button>
              </div>
              </div>
            </div>
           
                {/* Garanties */}
                {isOrder && ( 
                <div className="grid grid-cols-2 w-full gap-2">
                  <div  className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                    <div className="bg-green-100 p-2  rounded-1.5xl text-green-500"><Ship size={20} className="text-amber-600"/> <span className="text-sm font-medium text-slate-700">Bateau</span></div>
                    <div className="bg-green-100 p-2 rounded-1.5xl  text-green-500"><Plane size={20} className="text-amber-600"/> <span className="text-sm font-medium text-slate-700">Avion</span></div>
                          
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
          <div className="bg-white p-2 rounded-2xl shadow-sm border flex items-center gap-2">
             <input placeholder="Nouvelle catégorie" className="bg-transparent border-none text-xs px-4 focus:ring-0 w-32 md:w-48" value={newCatName} onChange={e=>setNewCatName(e.target.value)} />
             <button onClick={async () => { await api.addCategory(newCatName); setNewCatName(''); onRefresh(); }} className="bg-[#D0A050] p-2 rounded-xl text-[#002D5A]"><Plus size={18}/></button>
          </div>
          <button onClick={() => setShowCatList(!showCatList)} className="p-3.5 bg-white rounded-2xl shadow-sm border border-gray-200 text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white transition-all"><Settings size={20}/></button>
          <button onClick={onBack} className="p-3.5 bg-gray-100 rounded-full text-gray-500 hover:bg-white transition-all"><X size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <button onClick={() => setEditing({ nom: '', categorie: categories[0]?.name, type_dispo: 'STOCK', description: '', image_urls: Array(5).fill('') })} className="bg-white border-4 border-dashed border-gray-200 rounded-[3rem] p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group aspect-square shadow-sm">
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
            <button onClick={() => setEditing({ ...p, image_urls: [...(p.image_urls || []), ...Array(5).fill('')].slice(0, 5) })} className="mt-4 w-full py-3 bg-[#0A1A3A] rounded-2xl text-white font-black text-[9px] uppercase hover:bg-[#D4AF37] transition-all shadow-md">Modifier</button>
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
   <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-gradient-to-r from-slate-100 to-white rounded-xl border hover:shadow-md transition-shadow"
            ><ArrowLeft size={20}/></button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Finalisez la commande
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Informations personnelles</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={form.nom}
                      onChange={e => setForm({...form, nom: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone *</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={form.tel}
                      onChange={e => setForm({...form, tel: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adresse de livraison *</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={form.adresse}
                    onChange={e => setForm({...form, adresse: e.target.value})}
                  />
                </div>
             
              <button type="submit" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-Roboto shadow-xl uppercase border-b-8 border-green-800/20"> Finaliser la commande PAR WHATSAPP</button>
           
          </form>
        </div>
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-amber-100 to-amber-400 text-black rounded-1.5xl p-4">
              <h2 className="text-2xl font-bold mb-8">Résumé de commande</h2>
              
              <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image_urls?.[0]} 
                        alt={item.nom}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium">{item.nom}</div>
                        <div className="text-sm text-slate-300">x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold">
                      {(item.finalPrice * item.quantity).toLocaleString()} F
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/20">
                         
                
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/20">
                  <span>Total</span>
                  <span>{total.toLocaleString()} F</span>
                </div>
              </div>
            </div>
          </div>
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
    <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden bg-url('../public/bg.jpg') bg-cover bg-center">
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
      <header className={`fixed top-0 left-0 right-0 z-[600] transition-all duration-500 ease-in-out transform ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#D4AF37]/20 py-3' : 'bg-gradient-to-r from-[#002D5A] to-[#135290] py-5'}`}>
  <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-y-3">
    
    {/* Partie gauche : Menu burger + Logo */}
    <div className="flex items-center gap-3 md:gap-4 shrink-0">
      <button 
        onClick={() => setIsMenuOpen(true)} 
        className={`p-2.5 rounded-full transition-all active:scale-90 hover:scale-105 ${isScrolled ? 'text-[#0A1A3A] hover:bg-gray-100/80' : 'text-white hover:bg-white/20'}`}
        aria-label="Menu principal"
      >
        <Menu size={22} strokeWidth={2.5} />
      </button>
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={() => scrollToCategory("Tout")}
      >
        <div className="relative">
          <img 
            src="/logoah.jpeg" 
            className="h-10 md:h-14 w-auto rounded-xl shadow-md border-2 border-[#D4AF37]/40 group-hover:scale-105 transition-transform duration-300" 
            alt="Logo Industrie de l'Avenir" 
          />
          <div className="absolute -inset-1 bg-[#D4AF37]/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        {!isScrolled && (
          <span className="hidden md:block text-sm font-bold text-white/90 tracking-tight">
            Industrie<br/>de l'Avenir
          </span>
        )}
      </div>
    </div>

    {/* Barre de recherche - Centre */}
    <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-[500px] lg:max-w-[600px] relative px-1 sm:px-0" ref={searchRef}>
      <div className={`flex items-center rounded-[2rem] px-4 py-2.5 md:px-5 md:py-3 gap-3 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/40' : 'bg-white/10 backdrop-blur-md border border-white/30 hover:border-white/50'}`}>
        <Search size={18} className={isScrolled ? 'text-gray-500' : 'text-white/70'} />
        <input 
          type="text" 
          placeholder="Rechercher un produit, une catégorie..." 
          className={`bg-transparent border-none text-xs md:text-sm w-full focus:ring-0 focus:outline-none p-0 font-medium placeholder:font-normal ${isScrolled ? 'text-[#0A1A3A] placeholder-gray-400' : 'text-white placeholder-white/60'}`} 
          value={search} 
          onChange={e => {setSearch(e.target.value); setShowSuggestions(true);}} 
          onFocus={() => setShowSuggestions(true)}
        />
        {search && (
          <button 
            onClick={() => {setSearch(''); setShowSuggestions(false);}} 
            className={`p-1 rounded-full hover:scale-110 transition-transform ${isScrolled ? 'bg-gray-200 text-gray-500 hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/30'}`}
            aria-label="Effacer la recherche"
          >
            <X size={14}/>
          </button>
        )}
      </div>

      {/* Suggestions de recherche */}
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,45,90,0.25)] border border-gray-100 overflow-hidden z-[800] animate-fade-in mx-1 sm:mx-0 p-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-[#002D5A] uppercase tracking-wider">
              {searchSuggestions.length} résultat{searchSuggestions.length > 1 ? 's' : ''}
            </span>
            <button 
              onClick={() => setShowSuggestions(false)} 
              className="text-[10px] font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X size={10} /> Fermer
            </button>
          </div>
          
          <div className="flex flex-row overflow-x-auto no-scrollbar gap-4 pb-3 scrollbar-thin">
            {searchSuggestions.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  navigateTo('detail', p); 
                  setShowSuggestions(false); 
                  setSearch(''); 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="flex-shrink-0 w-44 bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border border-gray-100 hover:border-[#D4AF37]/50 rounded-2xl p-3 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-100 relative">
                  <img 
                    src={p.image_urls?.[0]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={p.nom} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="px-1 min-w-0">
                  <p className="text-xs font-bold text-[#0A1A3A] truncate uppercase leading-tight tracking-tight">
                    {p.nom}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-bold text-[#135290] uppercase truncate max-w-[60%] bg-blue-50 px-2 py-0.5 rounded-full">
                      {p.categorie}
                    </span>
                    <span className="text-xs font-black text-[#002D5A]">
                      {(p.prix_standard || p.prix_avion)?.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Partie droite : Boutons d'action */}
    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      
      {/* Bouton À Propos */}
      <button 
        onClick={() => navigateTo('about')}
        className={`relative p-2.5 md:p-3 rounded-full transition-all active:scale-90 hover:scale-105 group ${isScrolled ? 'text-[#0A1A3A] hover:bg-gray-100/80' : 'text-white hover:bg-white/20'}`}
        aria-label="À propos de nous"
        title="À propos de notre entreprise"
      >
        <svg 
          className={`w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12 ${isScrolled ? 'text-[#135290]' : 'text-white'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {!isScrolled && (
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            À Propos
          </span>
        )}
      </button>

      {/* Bouton Panier */}
      <button 
        onClick={() => setIsCartOpen(true)} 
        className={`relative p-2.5 md:p-3 rounded-full shadow-lg transition-all active:scale-90 hover:scale-105 group ${isScrolled ? 'bg-gradient-to-r from-[#002D5A] to-[#135290] text-white border border-[#D4AF37]/30' : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:border-white/50'}`}
        aria-label="Panier d'achat"
      >
        <ShoppingBag size={18} className="md:w-5 md:h-5" />
        {cart.length > 0 && (
          <>
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#D4AF37] to-[#e8b969] text-[#002D5A] text-[10px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
              {cart.length}
            </span>
            <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#D4AF37]/30 animate-ping"></div>
          </>
        )}
        {!isScrolled && cart.length === 0 && (
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            Panier
          </span>
        )}
      </button>

      {/* Bouton WhatsApp (Optionnel - visible seulement en mobile ou selon besoin) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`md:hidden p-2.5 rounded-full transition-all active:scale-90 hover:scale-105 ${isScrolled ? 'bg-green-500 text-white' : 'bg-green-500/90 text-white'}`}
        aria-label="Contact WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.507 14.307l-.009.075c-2.199-1.096-2.429-1.242-2.713-.816-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.05-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.8 5.114.714.227 1.365.195 1.88.121.574-.091 1.754-.721 2-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.574-.346z"/>
        </svg>
      </a>
    </div>
  </div>

  {/* Indicateur de scroll pour desktop */}
  {isScrolled && (
    <div className="hidden md:block absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
  )}
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

      <footer className="bg-gradient-to-b from-[#002D5A] to-[#001a3d] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 rounded-t-[4rem] md:rounded-t-[6rem] font-sans mt-32 relative overflow-hidden">
  {/* Éléments décoratifs */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D0A050] via-[#135290] to-[#D0A050]"></div>
  <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#D0A050]/5 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#135290]/10 rounded-full blur-3xl"></div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Contenu principal */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      
      {/* Colonne 1: Brand & Description */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D0A050] to-[#e8b969] rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold">🏭</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight google-sans-header">Industrie de l'Avenir</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-medium">
          Votre partenaire de confiance pour l'importation directe depuis la Chine et la vente de produits 
          de qualité au Togo. Mode, équipements agricoles, électronique et bien plus.
        </p>
        <p className="text-gray-400 text-xs leading-relaxed">
          RCCM ABJ-2024-B-XXXX • NIF: XXXXXXXXX
        </p>
        <div className="flex gap-3 pt-4">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-[#D0A050] hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-[#D0A050]/20 group"
            aria-label="Facebook"
          >
            <Facebook size={18} className="group-hover:scale-110 transition-transform" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-pink-500/20 group"
            aria-label="Instagram"
          >
            <Instagram size={18} className="group-hover:scale-110 transition-transform" />
          </a>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 hover:bg-green-500 hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-green-500/20 group"
            aria-label="WhatsApp"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.507 14.307l-.009.075c-2.199-1.096-2.429-1.242-2.713-.816-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.05-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.8 5.114.714.227 1.365.195 1.88.121.574-.091 1.754-.721 2-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.574-.346z"/>
              <path d="M20.52 3.449C17.943.985 14.466 0 11.986 0 5.849 0 .453 4.989.087 11.13-.28 17.344 4.095 22.752 10.211 23.68c3.104.488 6.011-.258 8.625-2.115l4.355 1.423c.398.13.795-.198.924-.597.13-.398-.198-.795-.597-.924l-4.45-1.456c2.757-1.885 4.588-4.725 4.873-8.261.573-7.019-4.826-12.99-11.82-13.03zM12 22.165c-5.384 0-9.833-4.353-10.087-9.746-.254-5.393 4.064-9.885 9.449-9.885 5.385 0 9.834 4.353 10.087 9.746.253 5.393-4.064 9.885-9.449 9.885z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Colonne 2: Catégories */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[#D0A050] rounded-full"></div>
          <h4 className="text-[#D0A050] font-bold uppercase text-xs tracking-[0.3em]">NOS CATÉGORIES</h4>
        </div>
        <ul className="space-y-3">
          {categories.slice(0, 6).map(c => (
            <li key={c.id}>
              <button
                onClick={() => { 
                  setActiveCategory(c.name); 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-[#D0A050] transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
              >
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-[#D0A050] transition-colors"></div>
                {c.name}
                {c.count && (
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-auto">
                    {c.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            Produits disponibles en stock ou sur commande spéciale depuis la Chine
          </p>
        </div>
      </div>

      {/* Colonne 3: Liens utiles */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[#135290] rounded-full"></div>
          <h4 className="text-[#135290] font-bold uppercase text-xs tracking-[0.3em]">LIENS UTILES</h4>
        </div>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => navigateTo('about')}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
              À Propos de nous
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigateTo('about#processus')}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
              Notre processus d'importation
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigateTo('about#livraison')}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
              Options de livraison
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigateTo('about#mentions')}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
              Mentions légales
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigateTo('about#contact')}
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-white transition-colors"></div>
              Contact & Support
            </button>
          </li>
          {process.env.NODE_ENV === 'development' && (
            <li>
              <button 
                onClick={() => navigateTo('admin')}
                className="text-gray-400 hover:text-red-300 transition-colors duration-300 text-sm font-medium flex items-center gap-2 group mt-4 pt-4 border-t border-white/10"
              >
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-red-300 transition-colors"></div>
                Interface Administrateur
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Colonne 4: Contact & Horaires */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[#D0A050] rounded-full"></div>
          <h4 className="text-[#D0A050] font-bold uppercase text-xs tracking-[0.3em]">NOUS CONTACTER</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
            <div className="p-2 bg-[#D0A050]/20 rounded-lg group-hover:bg-[#D0A050]/30">
              <svg className="w-5 h-5 text-[#D0A050]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium">contact@industrie-avenir.tg</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.449C17.943.985 14.466 0 11.986 0 5.849 0 .453 4.989.087 11.13-.28 17.344 4.095 22.752 10.211 23.68c3.104.488 6.011-.258 8.625-2.115l4.355 1.423c.398.13.795-.198.924-.597.13-.398-.198-.795-.597-.924l-4.45-1.456c2.757-1.885 4.588-4.725 4.873-8.261.573-7.019-4.826-12.99-11.82-13.03zM12 22.165c-5.384 0-9.833-4.353-10.087-9.746-.254-5.393 4.064-9.885 9.449-9.885 5.385 0 9.834 4.353 10.087 9.746.253 5.393-4.064 9.885-9.449 9.885z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">WhatsApp Business</p>
              <p className="text-lg font-bold tracking-tight">{WHATSAPP_NUMBER.replace('228', '+228 ')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Siège Social</p>
              <p className="text-sm font-medium">Lomé, Togo</p>
              <p className="text-xs text-gray-400 mt-1">Zone portuaire, Bâtiment A3</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">📅 Horaires d'ouverture :</p>
          <p className="text-sm">
            Lundi - Vendredi: 8h00 - 18h00<br/>
            Samedi: 9h00 - 16h00<br/>
            <span className="text-gray-400">Fermé le dimanche</span>
          </p>
        </div>
      </div>
    </div>

    {/* Section inférieure */}
    <div className="border-t border-white/10 pt-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            🌍 Importation directe depuis la Chine • Livraison partout au Togo
          </p>
          <p className="text-[10px] text-gray-600 tracking-wide">
            Tous les prix sont indiqués en FCFA. Les délais de livraison varient selon le mode de transport choisi.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-black text-[#D0A050]">100%</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#135290]">24/7</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Support WhatsApp</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">✓</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Sans intermédiaire</div>
          </div>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-12 pt-8 border-t border-white/5">
      <p className="text-xs text-gray-500 uppercase text-center tracking-[0.3em] font-medium">
        © {new Date().getFullYear()} Industrie de l'Avenir • Excellence Sans Frontières • Tous droits réservés
      </p>
      <p className="text-[10px] text-gray-600 text-center mt-2 tracking-wide">
        Ce site sert de catalogue. Les transactions sont finalisées via WhatsApp après confirmation des détails.
      </p>
    </div>
  </div>
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
'use client';
import React, { useState, useEffect, useRef,useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Plane, Ship, X, CheckCircle, ArrowRight, ShoppingCart, 
  Menu, Search, Facebook, Instagram, ArrowLeft, Truck, Send, 
  Loader2, Heart, Bell, Phone, MapPin, User, Mail, ShieldCheck, 
  History, FileText, ChevronDown, ListChecks, Globe, ChevronRight,
  Settings, Plus, Minus, Edit3, Image as ImageIcon, Save, Lock, Trash2, Info, LogOut,Sparkles,Zap,CircleQuestionMark
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

const HeroSection = () => {
  return (
    <div className="relative bg-[#2269af] overflow-hidden py-20 md:py-10 px-6">
      {/* Image de fond avec animation Ken Burns */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000" 
          alt="Import Logistique" 
          className="w-full h-full object-cover opacity-30 scale-110 animate-ken-burns"
        />
        {/* Overlay Dégradé pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002D5A] via-[#002D5A]/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            
            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Importation Directe USA & Chine</span>
          </div>
          
          <h1 className="text-3xl md:text-7xl font-medium text-white leading-[1.1] tracking-tighter Savate-font">
          <span className="text-[#D0A050]">Commandez vos produits  </span>  de qualite chez nous  
          </h1>
          
          <p className="text-gray-200 text-lg md:text-xl max-w-xl leading-relaxed font-thin Karla-font">
            Ici a l'Industie de l'Avenir vous pouvez commander des produit depuis la Chine et quantite que vous Voulez,et il y aussi des produits diponible en boutique pour vous.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/10 shadow-xl">
                <div className="p-3 bg-[#D0A050] text-[#002D5A] rounded-2xl shadow-lg"><Zap size={20}/></div>
                <div><p className="text-white font-black text-sm uppercase">Livraison</p><p className="text-xs text-gray-300">10-12j (Avion)</p></div>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/10 shadow-xl">
                <div className="p-3 bg-[#D0A050] text-[#002D5A] rounded-2xl shadow-lg"><ShieldCheck size={20}/></div>
                <div><p className="text-white font-black text-sm uppercase">diponible</p><p className="text-xs text-gray-300">SAV local certifié</p></div>
             </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center relative animate-float">
           <div className="relative z-10 bg-gradient-to-tr from-[#D0A050] to-amber-200 aspect-square w-[450px] rounded-[4rem] shadow-2xl flex items-center justify-center p-1.5 overflow-hidden">
              <div className="bg-[#002D5A] w-full h-full rounded-[3.8rem] flex flex-col items-center justify-center p-12 text-center space-y-6">
                 <Globe size={130} className="text-[#D0A050] animate-spin-slow" />
                 <h2 className="text-2xl font-black text-white uppercase tracking-widest leading-tight">Commander <br/>Sans Limites</h2>
                 <p className="text-sm text-gray-400">Électronique, Automobile, Industriel. Nous trouvons, nous livrons.</p>
              </div>
           </div>
           {/* Éléments décoratifs flottants */}
           <div className="absolute top-0 right-10 w-20 h-20 bg-[#D0A050]/20 rounded-full blur-2xl animate-pulse"></div>
           <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-ken-burns { animation: ken-burns 20s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
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
  const [activeImg, setActiveImg] = useState(product.image_urls?.[0] || '');
  const [mode, setMode] = useState('AVION');
  const [qty, setQty] = useState(1);
  const isOrder = product.type_dispo === 'COMMANDE';
  const price = isOrder ? (mode === 'AVION' ? product.prix_avion : product.prix_bateau) : product.prix_standard;

  useEffect(() => {
    if (product.image_urls?.length > 0) setActiveImg(product.image_urls[0]);
  }, [product]);

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-20 font-sans overflow-x-hidden">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[700] px-4 md:px-6 py-4 border-b flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><ArrowLeft size={20}/></button>
        <span className="text-[10px] font-black uppercase text-[#D0A050]">Vitrine </span>
        <div className="w-10" />
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-gray-50 border shadow-xl">
              <img src={activeImg} alt={product.nom} className="w-full h-full object-cover transition-all duration-500" />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {product.image_urls?.map((url, i) => (
                <button key={i} onClick={() => setActiveImg(url)} className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 shrink-0 transition-all ${activeImg === url ? 'border-[#D0A050] scale-105' : 'border-transparent opacity-60'}`}>
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <span className="text-[#D0A050] font-black uppercase text-xs tracking-[0.4em] mb-2 block">{product.categorie}</span>
              <h1 className="text-3xl md:text-5xl font-black text-[#002D5A] leading-tight uppercase tracking-tighter">{product.nom}</h1>
              <p className="text-gray-500 mt-8 leading-relaxed text-lg whitespace-pre-line border-l-4 border-gray-100 pl-6">{product.description}</p>
            </div>
            <div className="p-8 bg-gray-100 rounded-[3rem] space-y-8">
              <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Choisir Quantité</p>
                 <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[#002D5A] active:scale-90 transition-all"><Minus size={18}/></button>
                    <span className="font-black text-xl w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="text-[#002D5A] active:scale-90 transition-all"><Plus size={18}/></button>
                 </div>
              </div>
              {isOrder && (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setMode('AVION')} className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${mode === 'AVION' ? 'border-[#D0A050] bg-white shadow-lg' : 'border-transparent opacity-40'}`}>
                    <Plane size={24} className="text-[#D0A050]"/><span className="text-[10px] font-black uppercase">Avion</span>
                  </button>
                  <button onClick={() => setMode('BATEAU')} className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${mode === 'BATEAU' ? 'border-[#D0A050] bg-white shadow-lg' : 'border-transparent opacity-40'}`}>
                    <Ship size={24} className="text-[#D0A050]"/><span className="text-[10px] font-black uppercase">Bateau</span>
                  </button>
                </div>
              )}
              <div className="flex justify-between items-end border-t border-gray-200 pt-6">
                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix Unitaire</p><p className="text-3xl md:text-4xl font-black text-[#002D5A]">{Number(price)?.toLocaleString()} F</p></div>
                <div className="text-right"><p className="text-[10px] font-black text-[#D0A050] uppercase mb-1">Sous-total</p><p className="text-xl font-black">{(Number(price) * qty).toLocaleString()} F</p></div>
              </div>
            </div>
            <button onClick={() => onAddToCart(product, isOrder ? mode : 'STOCK', price, qty)} className="w-full bg-[#002D5A] text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all text-xl uppercase tracking-tighter border-b-8 border-black/20">
              <ShoppingBag size={24} /> Ajouter {qty} au Panier
            </button>
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

// --- ADMIN DASHBOARD ---
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
                    <option value="STOCK">STOCK ABIDJAN</option>
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
  const [sortOrder, setSortOrder] = useState('asc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

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

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  if (view === 'admin') return <AdminDashboard products={products} categories={categories} api={apiInstance} sb={sb} onRefresh={loadData} onBack={() => setView('home')} />;
  if (view === 'about') return <AboutPage onBack={() => setView('home')} />;
  if (view === 'detail' && selectedProduct) return <ProductDetail product={selectedProduct} onBack={() => setView('home')} onAddToCart={addToCart} />;
  if (view === 'checkout') return <CheckoutPage cart={cart} total={cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0)} api={apiInstance} onBack={() => setView('home')} />;

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
      `}</style>

      {/* Header Premium Responsive avec Retour à la ligne pour la barre de recherche sur mobile */}
      <header className="sticky top-0 z-[600] bg-white/95 backdrop-blur-xl border-b border-gray-100 px-3 md:px-12 py-3 md:py-4 flex flex-wrap items-center justify-between shadow-sm gap-y-3">
        <div className="flex items-center gap-1 md:gap-4 shrink-0">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-[#002D5A] hover:bg-gray-100 rounded-full transition-all active:scale-90">
            <Menu size={24} strokeWidth={2.5}/>
          </button>
          <div className="flex flex-col cursor-pointer shrink-0" onClick={() => {setView('home'); setActiveCategory('Tout'); setSearch(''); window.scrollTo(0,0);}}>
             <div className="flex flex-col cursor-pointer" onClick={() => {setView('home'); setActiveCategory('Tout'); setSearch(''); window.scrollTo(0,0);}}>
             <div className="flex items-center gap-2">
             
              <img src="/logoah.jpeg" className="h-13 md:h-19 w-auto" alt="Logoah" />
              </div>
            </div>
             </div>
        </div>

        {/* Barre de Recherche (order-last sur mobile) */}
        <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-[500px] relative px-1 sm:px-0" ref={searchRef}>
          <div className="flex items-center bg-gray-50 border border-gray-100 rounded-[2rem] px-4 md:px-6 py-2.5 gap-2 focus-within:bg-white focus-within:border-[#D0A050]/50 transition-all shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="Rechercher une pépite..." className="bg-transparent border-none text-xs md:text-sm w-full focus:ring-0 p-0 font-medium" value={search} onChange={e => {setSearch(e.target.value); setShowSuggestions(true);}} onFocus={() => setShowSuggestions(true)} />
          </div>
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-50 overflow-hidden z-[800] animate-fade-in mx-1 sm:mx-0">
              {searchSuggestions.map(p => (
                <div key={p.id} onClick={() => {setSelectedProduct(p); setView('detail'); setShowSuggestions(false); setSearch(''); window.scrollTo(0,0);}} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-all">
                  <img src={p.image_urls?.[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-50 border shadow-sm" alt="" />
                  <div>
                    <p className="text-xs font-black text-[#002D5A] uppercase leading-tight">{p.nom}</p>
                    <p className="text-[9px] text-[#D0A050] font-black uppercase tracking-widest">{p.categorie}</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-4 shrink-0">
          <button onClick={() => {setView('about'); window.scrollTo(0,0);}} className="flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#002D5A] p-2 transition-all">
            <Info size={18} className="md:hidden" />
            <span className="hidden md:inline">À Propos</span>
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 md:p-4 bg-[#002D5A] text-white rounded-full shadow-2xl border-4 border-[#D0A050]/10 active:scale-90 transition-all">
            <ShoppingBag size={18} className="md:w-6 md:h-6" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D0A050] text-[#002D5A] text-[9px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg">{cart.length}</span>}
          </button>
        </div>
      </header>
      <HeroSection/>

      {/* Barre de Catégories Responsive (Scroll horizontal) - Dynamique depuis Supabase */}
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
     
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 min-h-screen animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase text-[#D0A050] tracking-[0.5em] flex items-center gap-4 animate-fade-in"><span className="h-px w-10 bg-[#D0A050]"></span> Boutique Exclusive</p>
            <h2 className="text-3xl md:text-6xl font-black text-[#002D5A] tracking-tighter uppercase leading-tight animate-fade-in">{activeCategory}</h2>
          </div>
          <div className="flex items-center gap-4 py-3 px-6 bg-gray-50 rounded-2xl border shadow-sm self-start animate-fade-in">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tri par Prix :</span>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="text-[10px] font-black text-[#002D5A] flex items-center gap-2 uppercase tracking-widest active:scale-95 transition-all">
              {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'} <ChevronDown size={14} className={`transition-all ${sortOrder === 'desc' ? 'rotate-180' : ''}`}/>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-20"><Loader2 size={60} className="animate-spin mb-4 text-[#002D5A]"/><p className="font-black uppercase text-xs tracking-widest text-center">Accès Cloud...</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pb-32">
            {filtered.map(p => (
              <div key={p.id} onClick={() => {setSelectedProduct(p); setView('detail'); window.scrollTo(0,0);}} className="group bg-white rounded-[3rem] md:rounded-[3.5rem] overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer">
                <div className="aspect-square bg-gray-50 overflow-hidden relative rounded-[2.5rem] mb-10 border shadow-inner">
                  <img src={p.image_urls?.[0]} alt={p.nom} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-xl text-[8px] font-black text-white shadow-lg ${p.type_dispo === 'STOCK' ? 'bg-green-500' : 'bg-rose-600'}`}>
                    {p.type_dispo === 'STOCK' ? 'EN STOCK' : 'SUR COMMANDE'}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[#D0A050] text-[9px] font-black uppercase tracking-[0.4em]">{p.categorie}</p>
                  <h3 className="text-xl md:text-2xl font-black text-[#002D5A] truncate uppercase tracking-tight">{p.nom}</h3>
                  <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <p className="text-2xl md:text-3xl font-black text-[#002D5A] tracking-tighter">{(Number(p.prix_standard || p.prix_avion))?.toLocaleString()} F</p>
                    <div className="p-5 bg-gray-50 rounded-[2rem] group-hover:bg-[#D0A050] group-hover:text-[#002D5A] transition-all shadow-inner"><ArrowRight size={24}/></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            <p className="text-xl font-black">{WHATSAPP_NUMBER.replace('225', '+225 ')}</p>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">lome TOGO.</p>
          </div>
        </div>
        <p className="text-[9px] text-gray-600 uppercase text-center border-t border-white/5 pt-10 font-black tracking-[0.5em] tracking-widest">© 2024 l'industie de l'avenir . L'EXCELLENCE SANS FRONTIÈRES</p>
      </footer>

      {/* Drawer Panier avec +/- Quantité */}
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
                  <button onClick={() => {setIsCartOpen(false); setView('checkout'); window.scrollTo(0,0);}} className="w-full bg-[#002D5A] text-white py-6 rounded-[2rem] font-black text-xl border-b-8 border-black/20 active:scale-95 transition-all uppercase tracking-widest">Valider la Commande</button>
               </div>
             )}
          </div>
        </div>
      )}

      <Nudge api={apiInstance} />

      {/* Menu Mobile - Dynamique depuis Supabase */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-1000 flex">
          <div className="absolute inset-0 bg-blend-soft-light backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-75 max-w-[85%] bg-blue-950 h-full shadow-2xl animate-slide-in p-10 flex flex-col font-sans no-scrollbar overflow-y-auto">
             <div className="flex justify-between items-center mb-16">
                <h2 className="text-3xl font-black  text-white tracking-tighter  leading-none roboto-font uppercase">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-grid-100 lato-font rounded-full text-white"><X size={20}/></button>
             </div>
             <nav className="flex flex-col gap-10">
                <button onClick={()=>{setActiveCategory("Tout"); setIsMenuOpen(false); setView('home'); setSearch(''); window.scrollTo(0,0);}} className={`text-left font-medium karla-font text-xl ${activeCategory === "Tout" ? 'underline decoration-[#D4AF37] decoration-4 underline-offset-8 text-white'  : 'text-white'}`}>Toutes les Pépites</button>
                {categories.map(c => (
              <button  key={c.id} onClick={() => { setActiveCategory(c.name); setIsMenuOpen(false); setView('home');   setSearch('');  window.scrollTo(0, 0);   }}   className={`text-left Bitter-font text-2xl transition-all text-white  ${activeCategory === c.name  ? 'underline decoration-[#D4AF37] decoration-4 underline-offset-8' : 'hover:underline hover:decoration-[#D4AF37]/50'   }`}
              >    {c.name}  </button>))}
                <div className="pt-10 border-t border-gray-100"><button onClick={()=>{setView('about'); setIsMenuOpen(false);}} className="text-left font-medium text-xl  text-white transition-colors ">Notre Processus</button></div>
             </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() { return <AppContent />; }


import { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Clock, Star, Shield, CreditCard,
  Plane, Car, Users, Zap, ChevronRight, Check, X,
  RefreshCw, Calendar, Menu, ArrowRight, Sparkles,
  Award, Heart, Globe
} from 'lucide-react';
import { AnimatedSection, useCounter, useInView } from './hooks/useAnimations';

const API_URL = 'https://script.google.com/macros/s/AKfycbxH5HaUScvNH_1gwTk8Ol4gLKTnIA_RjzGMYh2FKLhEoR3I1y-YTZkwEvg-5YoEatDk/exec';

interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: number | string;
  email: string;
  depart: string;
  arrivee: string;
  km: string;
  min: string;
  price: number;
  createdAt: string;
}

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('berline');

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonials rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data: Reservation[] = await response.json();
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDashboard) fetchReservations();
  }, [showDashboard]);

  // Submit reservation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone: phone ? Number(phone) : '', email,
          depart: pickup, arrivee: destination, date, time,
        }),
      });
      setSubmitSuccess(true);
      setName(''); setPhone(''); setEmail('');
      setPickup(''); setDestination(''); setDate(''); setTime('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setSubmitError('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return dateStr; }
  };

  const formatTime = (timeStr: string) => {
    try { return new Date(timeStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
    catch { return timeStr; }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                <Car className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">VTC Paris</span>
                <span className="block text-[10px] text-amber-400/80 font-medium tracking-wider uppercase">Premium Service</span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm text-gray-300 hover:text-white transition-colors relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors relative group">
                Comment ça marche
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <a href="#reservation" className="text-sm text-gray-300 hover:text-white transition-colors relative group">
                Réservation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <a href="#temoignages" className="text-sm text-gray-300 hover:text-white transition-colors relative group">
                Témoignages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <button
                onClick={() => setShowDashboard(true)}
                className="text-sm text-gray-300 hover:text-white transition-colors relative group"
              >
                Espace Client
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </button>
              <a href="#reservation" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5">
                Réserver
              </a>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 p-6 space-y-4">
            <a href="#services" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Services</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Comment ça marche</a>
            <a href="#reservation" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Réservation</a>
            <a href="#temoignages" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Témoignages</a>
            <button onClick={() => { setShowDashboard(true); setMobileMenu(false); }} className="block text-gray-300 hover:text-white py-2 text-left">Espace Client</button>
            <a href="#reservation" onClick={() => setMobileMenu(false)} className="block w-full text-center px-5 py-3 bg-amber-500 text-black font-semibold rounded-xl">Réserver</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <img
            src="https://image.qwenlm.ai/generated-images/75004318-6c27-4080-9055-274aaaa7cbcf/_result.png"
            alt="Paris"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/50 to-[#0a0a0f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/50 to-transparent" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Service VTC Premium
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Votre trajet
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  premium
                </span> commence ici
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                Réservez votre chauffeur privé en quelques clics. Service disponible 24h/24, 7j/7 en Île-de-France.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="#reservation" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                  Réserver maintenant
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setShowDashboard(true)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Espace Client
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Live status */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">Chauffeur disponible</p>
                  <p className="text-xs text-gray-400">Prise en charge dans 15 min · Mercedes Classe E</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>
            </div>

            {/* Right - Quick booking card */}
            <div className="hidden lg:block">
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Réservation rapide</span>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      placeholder="Point de départ"
                      defaultValue="Aéroport Charles de Gaulle"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type="text"
                      placeholder="Destination"
                      defaultValue="75008 Paris"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                      <input
                        type="text"
                        defaultValue="Aujourd'hui"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                      <input
                        type="text"
                        defaultValue="14:30"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <a href="#reservation" className="block w-full text-center px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30">
                    Réserver →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Nos Services</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">
              Des solutions adaptées à <span className="text-amber-400">vos besoins</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Que ce soit pour un transfert aéroport, un déplacement professionnel ou un événement spécial, nous avons la solution qu'il vous faut.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard icon={<Plane className="w-6 h-6" />} title="Transport Aéroport" description="Transferts fiables vers tous les aéroports. Suivi de vol en temps réel." delay={0} />
            <ServiceCard icon={<Car className="w-6 h-6" />} title="Mise à disposition" description="Chauffeur dédié à votre service pour la durée de votre choix." delay={100} />
            <ServiceCard icon={<Users className="w-6 h-6" />} title="Transport Groupe" description="Véhicules adaptés pour vos événements et déplacements en groupe." delay={200} />
            <ServiceCard icon={<Zap className="w-6 h-6" />} title="Course Urgente" description="Service express disponible 24h/24 pour vos déplacements imprévus." delay={300} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Comment ça marche</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">
              Réservez en <span className="text-amber-400">3 étapes</span> simples
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            <StepCard number="01" title="Choisissez votre trajet" description="Indiquez votre point de départ et votre destination" delay={0} />
            <StepCard number="02" title="Sélectionnez votre véhicule" description="Berline, Van, ou véhicule de luxe selon vos besoins" delay={150} />
            <StepCard number="03" title="Confirmez et partez" description="Votre chauffeur vous attend à l'heure convenue" delay={300} />
          </div>

          <AnimatedSection className="text-center mt-12" delay={400}>
            <a href="#reservation" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1">
              Commencer ma réservation
              <ArrowRight className="w-5 h-5" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Pourquoi nous choisir</span>
              <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-8">
                L'excellence au service de vos <span className="text-amber-400">déplacements</span>
              </h2>

              <div className="space-y-4">
                {[
                  { icon: <Award className="w-5 h-5" />, text: "Chauffeurs professionnels certifiés" },
                  { icon: <Shield className="w-5 h-5" />, text: "Véhicules haut de gamme régulièrement contrôlés" },
                  { icon: <CreditCard className="w-5 h-5" />, text: "Tarification transparente sans surprise" },
                  { icon: <Clock className="w-5 h-5" />, text: "Service client disponible 24h/24" },
                  { icon: <Check className="w-5 h-5" />, text: "Annulation gratuite jusqu'à 1h avant" },
                  { icon: <Heart className="w-5 h-5" />, text: "Paiement sécurisé en ligne" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-3xl blur-xl" />
                <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-400">Réservation rapide</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Point de départ</label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <MapPin className="w-5 h-5 text-green-400" />
                        <span>Aéroport Charles de Gaulle</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Destination</label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <span>75008 Paris</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Date & Heure</label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <span>Aujourd'hui, 14:30</span>
                      </div>
                    </div>
                    <a href="#reservation" className="block w-full text-center px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20">
                      Réserver →
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="temoignages" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Témoignages</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">
              Ce que disent nos <span className="text-amber-400">clients</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Service impeccable ! Ponctualité et professionnalisme au rendez-vous à chaque course."
              name="Marie L."
              role="Cliente régulière"
              active={activeTestimonial === 0}
            />
            <TestimonialCard
              quote="J'utilise ce service pour tous mes déplacements professionnels. Fiabilité exemplaire."
              name="Thomas D."
              role="Homme d'affaires"
              active={activeTestimonial === 1}
            />
            <TestimonialCard
              quote="Accueil chaleureux, véhicule propre et confortable. Je recommande vivement !"
              name="Sophie M."
              role="Touriste"
              active={activeTestimonial === 2}
            />
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section id="reservation" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <AnimatedSection className="text-center mb-12">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Réservation</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">
              Prêt à <span className="text-amber-400">voyager</span> en toute sérénité ?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Réservez votre chauffeur privé dès maintenant et profitez d'un service d'exception.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
                  <Check className="w-5 h-5" />
                  <span>Réservation envoyée avec succès ! Vous serez contacté prochainement.</span>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                  <X className="w-5 h-5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom complet *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de départ *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input type="text" required value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Ex: Aéroport Roissy CDG"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de destination *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex: 15 Rue de Rivoli, Paris"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date *</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Heure *</label>
                  <input type="time" required value={time} onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Type de véhicule</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'berline', label: 'Berline', icon: '🚗' },
                      { value: 'van', label: 'Van', icon: '🚐' },
                      { value: 'luxe', label: 'Luxe', icon: '✨' },
                    ].map((v) => (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => setVehicleType(v.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${vehicleType === v.value ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                      >
                        <span className="text-xl">{v.icon}</span>
                        <span className="block text-xs mt-1">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button type="submit" disabled={submitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-500/50 disabled:to-amber-600/50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Envoyer la réservation
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Estimation de tarif indicative, non contractuelle. Le prix définitif est confirmé par le chauffeur.
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative p-12 sm:p-16 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/10" />
              <div className="absolute inset-0 bg-[url('https://image.qwenlm.ai/generated-images/75004318-6c27-4080-9055-274aaaa7cbcf/_result.png')] bg-cover bg-center opacity-10" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-3xl" />

              <div className="relative text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Prêt à voyager en toute sérénité ?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                  Réservez votre chauffeur privé dès maintenant et profitez d'un service d'exception.
                </p>
                <a href="#reservation" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:-translate-y-1">
                  Réserver mon trajet
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="text-lg font-bold">VTC Paris</span>
                  <span className="block text-[10px] text-amber-400/80 font-medium tracking-wider uppercase">Premium Service</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Service de chauffeur privé premium à Paris et en Île-de-France. Disponible 24h/24, 7j/7.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Transfert aéroport</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Transfert gare</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Mise à disposition</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Déplacement professionnel</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Événements & soirées</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">Comment ça marche</a></li>
                <li><a href="#reservation" className="hover:text-amber-400 transition-colors">Réservation</a></li>
                <li><a href="#temoignages" className="hover:text-amber-400 transition-colors">Témoignages</a></li>
                <li><button onClick={() => setShowDashboard(true)} className="hover:text-amber-400 transition-colors text-left">Espace Client</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> WhatsApp 24/7</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> contact@vtc-paris.fr</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Paris & Île-de-France</li>
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-400" /> vtc-paris.workers.dev</li>
              </ul>
              <a href="#" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2024 VTC Paris — Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">🇫🇷 🇬🇧</span>
              <a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Dashboard Modal */}
      {showDashboard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDashboard(false)}>
          <div className="bg-[#12121a] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold">Espace Client</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} enregistrée{reservations.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchReservations} disabled={loading}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
                <button onClick={() => setShowDashboard(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <RefreshCw className="w-10 h-10 mx-auto mb-4 text-amber-400 animate-spin" />
                    <p className="text-gray-400">Chargement des données...</p>
                  </div>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">Aucune réservation pour le moment.</p>
                  <p className="text-gray-500 text-sm mt-2">Les réservations apparaîtront ici.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20">
                            {res.name ? res.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{res.name}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {res.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">
                            {res.price}€
                          </span>
                          <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">
                            {formatDate(res.date)} · {formatTime(res.time)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg flex-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="truncate">{res.depart}</span>
                        </div>
                        <div className="hidden sm:flex items-center text-gray-600">→</div>
                        <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg flex-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                          <span className="truncate">{res.arrivee}</span>
                        </div>
                      </div>
                      {res.km && (
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span>📏 {res.km} km</span>
                          {res.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {res.email}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components

function StatsSection() {
  const { ref, isInView } = useInView(0.3);
  const courses = useCounter(10000, 2000, isInView);
  const note = useCounter(49, 2000, isInView);
  const chauffeurs = useCounter(50, 2000, isInView);

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={`${(courses / 1000).toFixed(0)}K+`} label="Courses réalisées" />
          <StatCard value={`${(note / 10).toFixed(1)}/5`} label="Note moyenne" />
          <StatCard value={`${chauffeurs}+`} label="Chauffeurs pro" />
          <StatCard value="24/7" label="Disponibilité" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:border-amber-500/20 transition-all group hover:-translate-y-1">
      <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1 group-hover:scale-110 transition-transform">{value}</div>
      <div className="text-xs sm:text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ServiceCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <div className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2 h-full">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-3 group-hover:text-amber-300 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </AnimatedSection>
  );
}

function StepCard({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <div className="text-center p-8 relative">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-amber-400">{number}</span>
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </AnimatedSection>
  );
}

function TestimonialCard({ quote, name, role, active }: { quote: string; name: string; role: string; active: boolean }) {
  return (
    <div className={`p-8 rounded-2xl border transition-all duration-500 ${active ? 'bg-white/5 border-amber-500/30 shadow-lg shadow-amber-500/5 scale-[1.02]' : 'bg-white/[0.02] border-white/5'}`}>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-gray-300 leading-relaxed mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}


+++ src/App.tsx (修改后)
import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Car, MapPin, Clock, Plane, Train,
  Phone, Globe, Check, X, RefreshCw,
  Calendar, Menu, ArrowRight, Banknote
} from 'lucide-react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxH5HaUScvNH_1gwTk8Ol4gLKTnIA_RjzGMYh2FKLhEoR3I1y-YTZkwEvg-5YoEatDk/exec';

interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: number | string;
  email: string;
  depart: string;
  arrivee: string;
  km: string;
  min: string;
  price: number;
  createdAt: string;
}

// Hook: Intersection Observer for scroll animations
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Hook: Animated counter
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frame: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, start]);
  return count;
}

// Animated wrapper
function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Scroll detection
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Reservation[] = await res.json();
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (showDashboard) fetchReservations(); }, [showDashboard]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: phone ? Number(phone) : '', email, depart: pickup, arrivee: destination, date, time }),
      });
      setSubmitSuccess(true);
      setName(''); setPhone(''); setEmail(''); setPickup(''); setDestination(''); setDate(''); setTime('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch { setSubmitError('Erreur lors de la réservation.'); }
    finally { setSubmitting(false); }
  };

  const formatDate = (s: string) => { try { return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return s; } };
  const formatTime = (s: string) => { try { return new Date(s).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); } catch { return s; } };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ─── Navigation ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-amber-500/10 shadow-lg shadow-black/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
                <Car className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-semibold tracking-tight">VTC Paris</span>
            </a>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#services" className="hover:text-amber-400 transition-colors relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <a href="#reservation" className="hover:text-amber-400 transition-colors relative group">
                Réservation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
              <button onClick={() => setShowDashboard(true)} className="hover:text-amber-400 transition-colors relative group">
                Espace Client
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </button>
              <a href="#contact" className="hover:text-amber-400 transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                <span>🇫🇷</span><span>🇬🇧</span>
              </div>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 p-6 space-y-4 animate-[fadeIn_0.2s_ease]">
            <a href="#services" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-amber-400 py-2 transition-colors">Services</a>
            <a href="#reservation" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-amber-400 py-2 transition-colors">Réservation</a>
            <button onClick={() => { setShowDashboard(true); setMobileMenu(false); }} className="block text-gray-300 hover:text-amber-400 py-2 transition-colors text-left w-full">Espace Client</button>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-amber-400 py-2 transition-colors">Contact</a>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://image.qwenlm.ai/generated-images/75004318-6c27-4080-9055-274aaaa7cbcf/_result.png" alt="Tour Eiffel, Paris" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Badge */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-gray-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Île-de-France · Disponible 24h/24, 7j/7
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6">
              Un chauffeur privé,
              <br />
              à <em className="font-serif italic text-amber-300">votre</em> rythme.
            </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Trajets, transferts aéroport et déplacements professionnels à Paris et en Île-de-France — réservez en quelques secondes, confirmez sur WhatsApp.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="#reservation" className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-1 flex items-center gap-2">
                Réserver un trajet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => setShowDashboard(true)} className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 text-white hover:-translate-y-1 hover:border-amber-500/30">
                🔍 Suivre ma course
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-xs text-gray-500">Paris · Île-de-France</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Scrolling Banner ─── */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-y border-white/5 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap py-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <span className="text-sm text-gray-400">Paris · Île-de-France</span>
              <span className="text-amber-500">✦</span>
              <span className="text-sm text-gray-400">Disponible 24h/24, 7j/7</span>
              <span className="text-amber-500">✦</span>
              <span className="text-sm text-gray-400">Paiement simplifié</span>
              <span className="text-amber-500">✦</span>
              <span className="text-sm text-gray-400">Réservation en 1 minute</span>
              <span className="text-amber-500">✦</span>
              <span className="text-sm text-gray-400">Confirmation sur WhatsApp</span>
              <span className="text-amber-500">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Nos services</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Un service de chauffeur privé adapté à tous vos besoins de déplacement en Île-de-France.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0}>
              <div className="group p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  Aéroports & Gares
                  <Train className="w-4 h-4 text-amber-500/50" />
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Prise en charge à Orly, Roissy CDG, Gare de Lyon, Gare du Nord et toutes les gares d'Île-de-France.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-amber-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Transferts</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="group p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors">
                  Disponible 24/7
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Un chauffeur joignable à toute heure, jour et nuit. Service continu sans interruption.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-amber-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Toujours là</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="group p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors">
                  Paiement CB & Espèces
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Carte bancaire ou espèces, comme vous préférez. Paiement simple et sécurisé.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-amber-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Flexible</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Reservation ─── */}
      <section id="reservation" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent" />
        <div className="max-w-3xl mx-auto relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Réserver un trajet</h2>
            <p className="text-gray-400">
              Remplissez le formulaire ci-dessous. Votre réservation sera enregistrée et confirmée rapidement.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm shadow-2xl shadow-black/20">
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
                  <Check className="w-5 h-5 shrink-0" />
                  <span>Réservation envoyée avec succès ! Vous serez contacté prochainement.</span>
                </div>
              )}
              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                  <X className="w-5 h-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom complet *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de départ *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input type="text" required value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Ex: Aéroport Roissy CDG"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de destination *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex: 15 Rue de Rivoli, Paris"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date *</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Heure *</label>
                  <input type="time" required value={time} onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                </div>
              </div>

              <div className="mt-8">
                <button type="submit" disabled={submitting}
                  className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <>Envoyer la réservation <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Estimation de tarif indicative, non contractuelle. Le prix définitif est confirmé par le chauffeur.
              </p>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <StatsSection />

      {/* ─── Footer ─── */}
      <footer id="contact" className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <Car className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-semibold">VTC Paris</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Service de chauffeur privé à Paris et en Île-de-France. Disponible 24h/24, 7j/7.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Transfert aéroport</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Transfert gare</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Mise à disposition</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Déplacement professionnel</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Événements & soirées</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> WhatsApp 24/7</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Paris & Île-de-France</li>
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-400" /> vtc-paris.workers.dev</li>
              </ul>
              <a href="#" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors">
                💬 Contacter sur WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© 2024 VTC Paris — Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">🇫🇷 🇬🇧</span>
              <button onClick={() => setShowDashboard(true)} className="text-xs text-gray-500 hover:text-amber-400 transition-colors">
                Accès professionnel →
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Dashboard Modal ─── */}
      {showDashboard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDashboard(false)}>
          <div className="bg-[#12121a] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-semibold">Espace Client</h3>
                <p className="text-sm text-gray-400 mt-1">{reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchReservations} disabled={loading}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
                </button>
                <button onClick={() => setShowDashboard(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Aucune réservation pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">
                            {res.name ? res.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-medium">{res.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{res.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20">{res.price}€</span>
                          <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">{formatDate(res.date)} · {formatTime(res.time)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg flex-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                          <span className="truncate">{res.depart}</span>
                        </div>
                        <div className="hidden sm:flex items-center text-gray-600">→</div>
                        <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg flex-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                          <span className="truncate">{res.arrivee}</span>
                        </div>
                      </div>
                      {res.km && (
                        <div className="mt-2 text-xs text-gray-500">📏 {res.km} km {res.email && `· ${res.email}`}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stats Section ───
function StatsSection() {
  const { ref, isInView } = useInView(0.3);
  const c1 = useCounter(24, 1500, isInView);
  const c2 = useCounter(1, 800, isInView);
  const c3 = useCounter(100, 1800, isInView);
  const c4 = useCounter(49, 2000, isInView);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value={`${c1}/7`} label="Disponibilité" delay={0} active={isInView} />
          <StatCard value={`${c1} min`} label="Réservation" delay={100} active={isInView} />
          <StatCard value={`${c3}%`} label="Professionnel" delay={200} active={isInView} />
          <StatCard value={`★ ${(c4 / 10).toFixed(1)}`} label="Satisfaction" delay={300} active={isInView} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, delay, active }: { value: string; label: string; delay: number; active: boolean }) {
  return (
    <FadeIn delay={delay}>
      <div className={`text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </FadeIn>
  );
}

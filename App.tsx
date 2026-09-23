
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

// ─── Hook : animation au scroll ───
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

// ─── Hook : compteur animé ───
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

// ─── Composant : FadeIn au scroll ───
function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}>
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

  // Formulaire
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Détection scroll pour la nav
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Récupération des réservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const  Reservation[] = await res.json();
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (showDashboard) fetchReservations(); }, [showDashboard]);

  // Envoi de la réservation
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
          name,
          phone: phone ? Number(phone) : '',
          email,
          depart: pickup,
          arrivee: destination,
          date,
          time
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

  const formatDate = (s: string) => {
    try { return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return s; }
  };
  const formatTime = (s: string) => {
    try { return new Date(s).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
    catch { return s; }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ═══════════ NAVIGATION ═══════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">VTC Paris</span>
            </a>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#reservation" className="hover:text-white transition-colors">Réservation</a>
              <button onClick={() => setShowDashboard(true)} className="hover:text-white transition-colors">
                Espace Client
              </button>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🇫🇷</span>
                <span>🇬🇧</span>
              </div>
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenu && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 p-6 space-y-4 animate-[fadeIn_0.2s_ease]">
            <a href="#services" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Services</a>
            <a href="#reservation" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Réservation</a>
            <button onClick={() => { setShowDashboard(true); setMobileMenu(false); }} className="block text-gray-300 hover:text-white py-2 text-left w-full">Espace Client</button>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block text-gray-300 hover:text-white py-2">Contact</a>
          </div>
        )}
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://image.qwenlm.ai/generated-images/75004318-6c27-4080-9055-274aaaa7cbcf/_result.png"
            alt="Tour Eiffel, Paris"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Badge statut */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Île-de-France · Disponible 24h/24, 7j/7
            </div>
          </FadeIn>

          {/* Titre */}
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

          {/* Boutons CTA */}
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#reservation"
                className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Réserver un trajet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => setShowDashboard(true)}
                className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 rounded-xl transition-all duration-300 text-white hover:-translate-y-0.5"
              >
                🔍 Suivre ma course
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-xs text-gray-500">Paris · Île-de-France</p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ BANNIÈRE DÉFILANTE ═══════════ */}
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

      {/* ═══════════ SERVICES ═══════════ */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Nos services</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Un service de chauffeur privé adapté à tous vos besoins de déplacement en Île-de-France.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte 1 : Aéroports */}
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

            {/* Carte 2 : 24/7 */}
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

            {/* Carte 3 : Paiement */}
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

      {/* ═══════════ RÉSERVATION ═══════════ */}
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
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de départ *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input
                      type="text"
                      required
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Ex: Aéroport Roissy CDG"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Adresse de destination *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ex: 15 Rue de Rivoli, Paris"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Heure *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
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

      {/* ═══════════ STATS ═══════════ */}
      <StatsSection />

      {/* ═══════════ FOOTER ═══════════ */}
      <footer id="contact" className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">V</span>
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
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" /> WhatsApp disponible 24/7
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" /> Paris & Île-de-France
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" /> vtc-paris.workers.dev
                </li>
              </ul>
              <a
                href="#"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
              >
                💬 Contacter sur WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© 2024 VTC Paris — Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">🇫🇷 🇬🇧</span>
              <button
                onClick={() => setShowDashboard(true)}
                className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
              >
                Accès professionnel →
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════ MODAL ESPACE CLIENT ═══════════ */}
      {showDashboard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDashboard(false)}
        >
          <div
            className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-medium">Espace Client</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} enregistrée{reservations.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchReservations}
                  disabled={loading}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenu */}
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
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Aucune réservation pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-medium">
                            {res.name ? res.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-medium">{res.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {res.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
                            {res.price}€
                          </span>
                          <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">
                            {formatDate(res.date)} · {formatTime(res.time)}
                          </span>
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
                        <div className="mt-2 text-xs text-gray-500">
                          📏 {res.km} km {res.email && `· ${res.email}`}
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

// ═══════════ SECTION STATS ═══════════
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
          <FadeIn delay={0}>
            <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">{c1}/7</div>
              <div className="text-sm text-gray-400">Disponibilité</div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">{c2} min</div>
              <div className="text-sm text-gray-400">Réservation</div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">{c3}%</div>
              <div className="text-sm text-gray-400">Professionnel</div>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">★ {(c4 / 10).toFixed(1)}</div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}


+++ src/App.tsx (修改后)
import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Plane, Train,
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

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json() as Reservation[];
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDashboard) {
      fetchReservations();
    }
  }, [showDashboard]);

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
          name,
          phone: phone ? Number(phone) : '',
          email,
          depart: pickup,
          arrivee: destination,
          date,
          time
        }),
      });

      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setPickup('');
      setDestination('');
      setDate('');
      setTime('');

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Erreur lors de la réservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatTime = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch { return timeStr; }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-semibold">VTC Paris</span>
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#reservation" className="hover:text-white transition-colors">Réservation</a>
              <button onClick={() => setShowDashboard(true)} className="hover:text-white transition-colors">Espace Client</button>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🇫🇷</span><span>🇬🇧</span>
              </div>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10">
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 p-6 space-y-4">
            <a href="#services" onClick={() => setMobileMenu(false)} className="block text-gray-300 py-2">Services</a>
            <a href="#reservation" onClick={() => setMobileMenu(false)} className="block text-gray-300 py-2">Réservation</a>
            <button onClick={() => { setShowDashboard(true); setMobileMenu(false); }} className="block text-gray-300 py-2 text-left w-full">Espace Client</button>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block text-gray-300 py-2">Contact</a>
          </div>
        )}
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1502602682455-6c009a8945a5?w=1920&q=80" alt="Paris" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-200 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Île-de-France · Disponible 24h/24, 7j/7
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6">
            Un chauffeur privé,<br />à <em className="font-serif italic text-amber-300">votre</em> rythme.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trajets, transferts aéroport et déplacements professionnels à Paris et en Île-de-France.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#reservation" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
              Réserver un trajet <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={() => setShowDashboard(true)} className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all text-white">
              🔍 Suivre ma course
            </button>
          </div>
          <p className="text-xs text-gray-500">Paris · Île-de-France</p>
        </div>
      </section>

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
            </div>
          ))}
        </div>
      </div>

      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Nos services</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Un service de chauffeur privé adapté à tous vos besoins.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                Aéroports & Gares <Train className="w-4 h-4 text-amber-500/50" />
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">Prise en charge à Orly, Roissy CDG, Gare de Lyon, Gare du Nord.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors">Disponible 24/7</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Un chauffeur joignable à toute heure, jour et nuit.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-3 group-hover:text-amber-300 transition-colors">Paiement CB & Espèces</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Carte bancaire ou espèces, comme vous préférez.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reservation" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light mb-4">Réserver un trajet</h2>
            <p className="text-gray-400">Remplissez le formulaire ci-dessous.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Réservation envoyée avec succès !</span>
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <X className="w-5 h-5" />
                <span>{submitError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nom complet *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Téléphone *</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Adresse de départ *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                  <input type="text" required value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Ex: Aéroport Roissy CDG" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Destination *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex: 15 Rue de Rivoli, Paris" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date *</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Heure *</label>
                <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
            </div>
            <div className="mt-8">
              <button type="submit" disabled={submitting} className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                {submitting ? (<><RefreshCw className="w-5 h-5 animate-spin" /> Envoi...</>) : (<>Envoyer <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">Estimation de tarif indicative, non contractuelle.</p>
          </form>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center"><div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">24/7</div><div className="text-sm text-gray-400">Disponibilité</div></div>
            <div className="text-center"><div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">1 min</div><div className="text-sm text-gray-400">Réservation</div></div>
            <div className="text-center"><div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">100%</div><div className="text-sm text-gray-400">Professionnel</div></div>
            <div className="text-center"><div className="text-3xl sm:text-4xl font-light text-amber-400 mb-2">★ 4.9</div><div className="text-sm text-gray-400">Satisfaction</div></div>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">V</span>
                </div>
                <span className="text-lg font-semibold">VTC Paris</span>
              </div>
              <p className="text-sm text-gray-400">Service de chauffeur privé à Paris et en Île-de-France.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Transfert aéroport</li>
                <li>Transfert gare</li>
                <li>Mise à disposition</li>
                <li>Déplacement professionnel</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> WhatsApp 24/7</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Paris & Île-de-France</li>
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-400" /> vtc-paris.workers.dev</li>
              </ul>
              <a href="#" className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors">💬 WhatsApp</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© 2024 VTC Paris — Tous droits réservés.</p>
            <button onClick={() => setShowDashboard(true)} className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Accès professionnel →</button>
          </div>
        </div>
      </footer>

      {showDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDashboard(false)}>
          <div className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-medium">Espace Client</h3>
                <p className="text-sm text-gray-400 mt-1">{reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchReservations} disabled={loading} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
                </button>
                <button onClick={() => setShowDashboard(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  <X className="w-4 h-4" />
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
                  <p className="text-gray-400">Aucune réservation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-medium">
                            {res.name ? res.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-medium">{res.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {res.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium">{res.price}€</span>
                          <span className="text-xs text-gray-500">{formatDate(res.date)} · {formatTime(res.time)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300"><span className="text-green-400">●</span><span>{res.depart}</span></div>
                        <div className="hidden sm:block text-gray-600">→</div>
                        <div className="flex items-center gap-2 text-gray-300"><span className="text-red-400">●</span><span>{res.arrivee}</span></div>
                      </div>
                      {res.km && <div className="mt-2 text-xs text-gray-500">{res.km} km {res.email && `· ${res.email}`}</div>}
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

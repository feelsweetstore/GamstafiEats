import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Globe,
  ChefHat,
  Bike,
  Megaphone,
  HelpCircle
} from 'lucide-react';

const Footer = () => {
  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'X (Twitter)' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1: À propos et Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-violet-400 transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 2: Rejoignez-nous */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Rejoignez-nous</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register/restaurant" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Ajouter mon restaurant
                </Link>
              </li>
              <li>
                <Link to="/register/driver" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  Devenir livreur indépendant
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Faites de la publicité ici !
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Légal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informations légales</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-violet-400 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-violet-400 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-violet-400 transition-colors">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Langue et Réseaux sociaux */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Langue</h3>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <select className="bg-gray-800 text-white rounded px-2 py-1 text-sm">
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Suivez-nous</h3>
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-violet-400 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Gamstafi Eats. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
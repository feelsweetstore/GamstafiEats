import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type UserRole = 'client' | 'restaurant' | 'driver';

interface BaseFormData {
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

interface ClientFormData extends BaseFormData {
  firstName: string;
  lastName: string;
  deliveryAddress?: string;
}

interface RestaurantFormData extends BaseFormData {
  restaurantName: string;
  address: string;
  cuisineType: string;
  openingHours: {
    [key: string]: { open: string; close: string };
  };
}

interface DriverFormData extends BaseFormData {
  firstName: string;
  lastName: string;
  vehicleType: string;
  availability: {
    [key: string]: { available: boolean; hours: { start: string; end: string }[] };
  };
}

type FormData = ClientFormData | RestaurantFormData | DriverFormData;

const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    phone: '',
    role: 'client',
    firstName: '',
    lastName: '',
    deliveryAddress: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'role') {
      // Reset form when role changes
      let newFormData: FormData;
      
      switch (value as UserRole) {
        case 'client':
          newFormData = {
            email: '',
            password: '',
            phone: '',
            role: 'client',
            firstName: '',
            lastName: '',
            deliveryAddress: '',
          };
          break;
        case 'restaurant':
          newFormData = {
            email: '',
            password: '',
            phone: '',
            role: 'restaurant',
            restaurantName: '',
            address: '',
            cuisineType: '',
            openingHours: DAYS_OF_WEEK.reduce((acc, day) => ({
              ...acc,
              [day]: { open: '09:00', close: '22:00' },
            }), {}),
          };
          break;
        case 'driver':
          newFormData = {
            email: '',
            password: '',
            phone: '',
            role: 'driver',
            firstName: '',
            lastName: '',
            vehicleType: '',
            availability: DAYS_OF_WEEK.reduce((acc, day) => ({
              ...acc,
              [day]: { available: false, hours: [{ start: '09:00', end: '18:00' }] },
            }), {}),
          };
          break;
        default:
          return;
      }
      setFormData(newFormData);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            role: formData.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data');

      // 2. Create profile and role-specific data
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: authData.user.id,
        role: formData.role,
        phone: formData.phone,
        ...(formData.role === 'client' || formData.role === 'driver'
          ? {
              first_name: (formData as ClientFormData | DriverFormData).firstName,
              last_name: (formData as ClientFormData | DriverFormData).lastName,
            }
          : {}),
      });

      if (profileError) throw profileError;

      // 3. Create role-specific data
      switch (formData.role) {
        case 'restaurant': {
          const restaurantData = formData as RestaurantFormData;
          const { error: restaurantError } = await supabase.from('restaurants').insert({
            profile_id: authData.user.id,
            name: restaurantData.restaurantName,
            cuisine_type: restaurantData.cuisineType,
            address: restaurantData.address,
            opening_hours: restaurantData.openingHours,
          });
          if (restaurantError) throw restaurantError;
          break;
        }
        case 'driver': {
          const driverData = formData as DriverFormData;
          const { error: driverError } = await supabase.from('drivers').insert({
            profile_id: authData.user.id,
            vehicle_type: driverData.vehicleType,
            availability: driverData.availability,
          });
          if (driverError) throw driverError;
          break;
        }
      }

      // Afficher le message de succès
      let roleLabel = '';
      switch (formData.role) {
        case 'client':
          roleLabel = 'client';
          break;
        case 'restaurant':
          roleLabel = 'restaurant';
          break;
        case 'driver':
          roleLabel = 'livreur';
          break;
      }

      setSuccess(`Inscription réussie en tant que ${roleLabel} ! Veuillez confirmer votre email avant de vous connecter.`);
      
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        switch (err.message) {
          case 'User already registered':
            setError('Un compte existe déjà avec cette adresse email');
            break;
          default:
            setError('Une erreur est survenue lors de l\'inscription');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Adresse email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Mot de passe"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Numéro de téléphone"
          />
        </div>
      </>
    );

    switch (formData.role) {
      case 'client': {
        const clientData = formData as ClientFormData;
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={clientData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={clientData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Nom"
              />
            </div>
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                Adresse de livraison (optionnel)
              </label>
              <input
                id="deliveryAddress"
                name="deliveryAddress"
                type="text"
                value={clientData.deliveryAddress}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Adresse de livraison"
              />
            </div>
          </>
        );
      }
      case 'restaurant': {
        const restaurantData = formData as RestaurantFormData;
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                Nom du restaurant
              </label>
              <input
                id="restaurantName"
                name="restaurantName"
                type="text"
                required
                value={restaurantData.restaurantName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Nom du restaurant"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={restaurantData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Adresse du restaurant"
              />
            </div>
            <div>
              <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">
                Type de cuisine
              </label>
              <input
                id="cuisineType"
                name="cuisineType"
                type="text"
                required
                value={restaurantData.cuisineType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Type de cuisine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horaires d'ouverture
              </label>
              <div className="space-y-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <span className="w-24 text-sm">{day}</span>
                    <input
                      type="time"
                      value={restaurantData.openingHours[day]?.open || '09:00'}
                      onChange={(e) =>
                        setFormData({
                          ...restaurantData,
                          openingHours: {
                            ...restaurantData.openingHours,
                            [day]: {
                              ...restaurantData.openingHours[day],
                              open: e.target.value,
                            },
                          },
                        })
                      }
                      className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={restaurantData.openingHours[day]?.close || '22:00'}
                      onChange={(e) =>
                        setFormData({
                          ...restaurantData,
                          openingHours: {
                            ...restaurantData.openingHours,
                            [day]: {
                              ...restaurantData.openingHours[day],
                              close: e.target.value,
                            },
                          },
                        })
                      }
                      className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }
      case 'driver': {
        const driverData = formData as DriverFormData;
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={driverData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={driverData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Nom"
              />
            </div>
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                Type de véhicule
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                required
                value={driverData.vehicleType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionnez un type de véhicule</option>
                <option value="bike">Vélo</option>
                <option value="scooter">Scooter</option>
                <option value="car">Voiture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilités
              </label>
              <div className="space-y-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={driverData.availability[day]?.available}
                      onChange={(e) =>
                        setFormData({
                          ...driverData,
                          availability: {
                            ...driverData.availability,
                            [day]: {
                              ...driverData.availability[day],
                              available: e.target.checked,
                            },
                          },
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="w-24 text-sm">{day}</span>
                    {driverData.availability[day]?.available && (
                      <>
                        <input
                          type="time"
                          value={driverData.availability[day]?.hours[0]?.start || '09:00'}
                          onChange={(e) =>
                            setFormData({
                              ...driverData,
                              availability: {
                                ...driverData.availability,
                                [day]: {
                                  ...driverData.availability[day],
                                  hours: [
                                    {
                                      ...driverData.availability[day].hours[0],
                                      start: e.target.value,
                                    },
                                  ],
                                },
                              },
                            })
                          }
                          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={driverData.availability[day]?.hours[0]?.end || '18:00'}
                          onChange={(e) =>
                            setFormData({
                              ...driverData,
                              availability: {
                                ...driverData.availability,
                                [day]: {
                                  ...driverData.availability[day],
                                  hours: [
                                    {
                                      ...driverData.availability[day].hours[0],
                                      end: e.target.value,
                                    },
                                  ],
                                },
                              },
                            })
                          }
                          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Type de compte
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="client">Client</option>
                <option value="restaurant">Restaurant</option>
                <option value="driver">Livreur</option>
              </select>
            </div>
            {renderFormFields()}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer un compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
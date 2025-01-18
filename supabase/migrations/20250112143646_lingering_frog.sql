/*
  # Schéma initial pour Gamstafi Eats

  1. Tables
    - profiles
      - id (uuid, clé primaire)
      - user_id (uuid, lié à auth.users)
      - role (enum: client, restaurant, driver)
      - first_name (text)
      - last_name (text)
      - phone (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - restaurants
      - id (uuid, clé primaire)
      - profile_id (uuid, lié à profiles)
      - name (text)
      - cuisine_type (text)
      - address (text)
      - opening_hours (jsonb)
      - status (enum: pending, approved, rejected)
      - created_at (timestamp)
      - updated_at (timestamp)

    - drivers
      - id (uuid, clé primaire)
      - profile_id (uuid, lié à profiles)
      - vehicle_type (text)
      - availability (jsonb)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour chaque type d'utilisateur
*/

-- Création des types énumérés
CREATE TYPE user_role AS ENUM ('client', 'restaurant', 'driver', 'admin');
CREATE TYPE restaurant_status AS ENUM ('pending', 'approved', 'rejected');

-- Table des profils
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role user_role NOT NULL,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des restaurants
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  name text NOT NULL,
  cuisine_type text,
  address text NOT NULL,
  opening_hours jsonb DEFAULT '{}',
  status restaurant_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

-- Table des livreurs
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  vehicle_type text NOT NULL,
  availability jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

-- Activation RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Politiques RLS pour restaurants
CREATE POLICY "Public can view approved restaurants"
  ON restaurants FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Restaurant owners can view their own restaurant"
  ON restaurants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = restaurants.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Politiques RLS pour drivers
CREATE POLICY "Drivers can view and update their own info"
  ON drivers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = drivers.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
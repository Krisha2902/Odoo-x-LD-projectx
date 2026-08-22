-- Enums
CREATE TYPE user_role AS ENUM ('owner', 'conductor', 'traveler', 'editor');
CREATE TYPE vote_direction AS ENUM ('up', 'down');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted');

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trips
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    share_slug VARCHAR(255) UNIQUE,
    budget_cap NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trip Members
CREATE TABLE trip_members (
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'traveler',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trip_id, user_id)
);

-- Cities
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6)
);

-- Stops
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id),
    order_index INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Activity Catalog
CREATE TABLE activity_catalog (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    avg_cost NUMERIC(10, 2) DEFAULT 0,
    avg_duration_minutes INTEGER DEFAULT 60,
    description TEXT
);

-- Itinerary Items
CREATE TABLE itinerary_items (
    id SERIAL PRIMARY KEY,
    stop_id INTEGER REFERENCES stops(id) ON DELETE CASCADE,
    activity_catalog_id INTEGER REFERENCES activity_catalog(id) ON DELETE SET NULL,
    custom_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    cost NUMERIC(10, 2) DEFAULT 0,
    scheduled_date DATE,
    scheduled_time TIME,
    duration_minutes INTEGER,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- For conflict resolution
);

-- Votes (Collaborative feature)
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    itinerary_item_id INTEGER REFERENCES itinerary_items(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote vote_direction NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(itinerary_item_id, user_id) -- Prevent double voting
);

-- Trip Invites
CREATE TABLE trip_invites (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    invited_email VARCHAR(255) NOT NULL,
    status invite_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_trips_owner ON trips(owner_id);
CREATE INDEX idx_stops_trip ON stops(trip_id);
CREATE INDEX idx_items_stop ON itinerary_items(stop_id);
CREATE INDEX idx_activity_city ON activity_catalog(city_id);
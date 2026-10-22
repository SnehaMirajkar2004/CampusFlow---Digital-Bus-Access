CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'passenger',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_point VARCHAR(100) NOT NULL,
    end_point VARCHAR(100) NOT NULL,
    timing VARCHAR(50),
    bus_id INTEGER,
    
    CONSTRAINT fk_route_bus
        FOREIGN KEY(bus_id)
        REFERENCES buses(id)
        ON DELETE SET NULL
);

CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    route_id INTEGER NOT NULL,

    CONSTRAINT fk_stop_route
        FOREIGN KEY(route_id)
        REFERENCES routes(id)
        ON DELETE CASCADE
);

CREATE TABLE pass_requests (
    id SERIAL PRIMARY KEY,
    
    passenger_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,

    status VARCHAR(20) DEFAULT 'pending',

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,

    admin_note TEXT,

    CONSTRAINT fk_passenger
        FOREIGN KEY(passenger_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_route
        FOREIGN KEY(route_id)
        REFERENCES routes(id)
        ON DELETE CASCADE
);


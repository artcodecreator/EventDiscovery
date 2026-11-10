-- EventDiscovery database bootstrap for Strapi 5 (MySQL 8.0+)
--
-- IMPORTANT:
-- Strapi owns the application table structure and migrations. Do not define
-- Strapi content tables here. Strapi creates and evolves those tables during
-- its first startup and subsequent migrations. Hand-written versions can cause
-- migration failures (missing Strapi metadata columns, conflicting constraints,
-- and incompatible relation tables).
--
-- Create/select the database, then configure cms/.env with the same connection:
-- DATABASE_CLIENT=mysql
-- DATABASE_NAME=event_discovery
-- DATABASE_HOST=127.0.0.1
-- DATABASE_PORT=3306
-- DATABASE_USERNAME=root
-- DATABASE_PASSWORD=your-password
--
-- Run Strapi from the cms directory after ensuring this database is empty or
-- contains a valid Strapi 5 schema. Existing manually-created tables should be
-- backed up and removed/recreated before the first Strapi startup.

CREATE DATABASE IF NOT EXISTS event_discovery
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

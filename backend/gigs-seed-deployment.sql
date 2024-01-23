DROP DATABASE gigs;
CREATE DATABASE gigs;

\connect gigs

\i gigs-schema.sql
\i gigs-seed.sql

\q
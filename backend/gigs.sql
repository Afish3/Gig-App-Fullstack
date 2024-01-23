\echo 'Delete and recreate gigs db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gigs;
CREATE DATABASE gigs;
\connect gigs

\i gigs-schema.sql
\i gigs-seed.sql

\echo 'Delete and recreate gigs_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gigs_test;
CREATE DATABASE gigs_test;
\connect gigs_test

\i gigs-schema.sql

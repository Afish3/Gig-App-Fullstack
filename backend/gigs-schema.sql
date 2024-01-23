-- CREATE TABLE companies (
--   handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
--   name TEXT UNIQUE NOT NULL,
--   num_employees INTEGER CHECK (num_employees >= 0),
--   description TEXT,
--   logo_url TEXT,
-- );

-- Note that in the users table `login_type` is required to be a text.
-- This value should ALWAYS be EITHER `email` or `google` for this application as the
-- only login options are email or google OAuth login.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  login_type TEXT NOT NULL, 
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  date_registered DATE,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1),
  user_type TEXT NOT NULL,
  rating FLOAT CHECK (rating <= 5),
  profile TEXT,
  area_code TEXT,
  skills TEXT,
  photo TEXT,
  resume TEXT,
  availabile_datetimes TEXT
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary NUMERIC NOT NULL CHECK (salary >= 0),
  job_description TEXT NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  created_at DATE,
  location TEXT NOT NULL,
  company_id TEXT NOT NULL
    REFERENCES users ON DELETE CASCADE,
  user_id_1 TEXT NOT NULL
    REFERENCES users ON DELETE CASCADE,
  user_id_2 TEXT 
    REFERENCES users ON DELETE CASCADE,
  user_id_3 TEXT 
    REFERENCES users ON DELETE CASCADE,
  accepted TEXT
    REFERENCES users ON DELETE CASCADE
);

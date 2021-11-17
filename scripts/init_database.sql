CREATE DATABASE IF NOT EXISTS ugly_sweater_app;

USE ugly_sweater_app;

CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name STRING NOT NULL,
  description STRING,
  max_votes INT DEFAULT 1
);
​
CREATE TABLE entries (
  id UUID UNIQUE DEFAULT gen_random_uuid(),
  name STRING NOT NULL,
  picture BYTES,
  contest_id UUID NOT NULL REFERENCES contests (id) ON DELETE CASCADE,
  PRIMARY KEY (contest_id, id),
  UNIQUE (name, contest_id)
);
​
CREATE TABLE votes (
  contest_id UUID NOT NULL REFERENCES contests (id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries (id) ON DELETE CASCADE,
  voter_id STRING NOT NULL,
  PRIMARY KEY (contest_id, entry_id, voter_id),
  INDEX (voter_id)
);
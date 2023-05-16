CREATE DATABASE entrega_s3_m4_kenzieVelopers;

-- basic queries

-- drop tables
DROP TABLE IF EXISTS projects_technologies;
DROP TABLE IF EXISTS technologies;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS developer_infos;
DROP TABLE IF EXISTS developers;

-- add techs
INSERT INTO technologies ("name")
VALUES ('JavaScript'),
('Python'),
('React'),
('Express.js'),
('HTML'),
('CSS'),
('Django'),
('PostgreSQL'),
('MongoDB');
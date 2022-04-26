--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: skaters; Type: TABLE; Schema: public; Owner: wideweb
--

CREATE TABLE public.skaters (
    id integer NOT NULL,
    email character varying(60) NOT NULL,
    nombre character varying(100) NOT NULL,
    password character varying(25) NOT NULL,
    anios_experiencia integer NOT NULL,
    especialidad character varying(100) NOT NULL,
    foto character varying(255) NOT NULL,
    estado boolean NOT NULL,
    es_admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.skaters OWNER TO wideweb;

--
-- Name: skaters_id_seq; Type: SEQUENCE; Schema: public; Owner: wideweb
--

CREATE SEQUENCE public.skaters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.skaters_id_seq OWNER TO wideweb;

--
-- Name: skaters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wideweb
--

ALTER SEQUENCE public.skaters_id_seq OWNED BY public.skaters.id;


--
-- Name: skaters id; Type: DEFAULT; Schema: public; Owner: wideweb
--

ALTER TABLE ONLY public.skaters ALTER COLUMN id SET DEFAULT nextval('public.skaters_id_seq'::regclass);


--
-- Data for Name: skaters; Type: TABLE DATA; Schema: public; Owner: wideweb
--

COPY public.skaters (id, email, nombre, password, anios_experiencia, especialidad, foto, estado, es_admin) FROM stdin;
30	antonio@limas.com	Antonio Limas	123	2	Wall Ride	/uploads/86cc-2e5c19a137b0.png	f	f
31	sebastian@nolineal.cl	Sebastián Kravetz	123	4	Ollie Flip Side	/uploads/927d-a7665ffd7de2.png	t	t
33	nico@nolineal.cl	Nicolás García	123	4	360 Full Flip	/uploads/becc-bb3ee785e586.png	f	f
34	gatito@nolineal.cl	Gatito Pérez	123	0	Cat Slide	/uploads/8bf6-0d2551772df3.png	t	t
\.


--
-- Name: skaters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wideweb
--

SELECT pg_catalog.setval('public.skaters_id_seq', 34, true);


--
-- Name: skaters skaters_email_key; Type: CONSTRAINT; Schema: public; Owner: wideweb
--

ALTER TABLE ONLY public.skaters
    ADD CONSTRAINT skaters_email_key UNIQUE (email);


--
-- PostgreSQL database dump complete
--


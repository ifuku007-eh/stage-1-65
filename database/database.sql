--
-- PostgreSQL database dump
--

\restrict fFJtlEL96ipSu2GsPB9ayh5Cf618ddtSii2abWp6MbEYhDjNVn2rgfww5EnfceT

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-06 21:25:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 222 (class 1259 OID 16495)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    image text,
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16494)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 221
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 224 (class 1259 OID 16514)
-- Name: technologies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technologies (
    id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.technologies OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16513)
-- Name: technologies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.technologies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.technologies_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 223
-- Name: technologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.technologies_id_seq OWNED BY public.technologies.id;


--
-- TOC entry 220 (class 1259 OID 16482)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16481)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4868 (class 2604 OID 16498)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 4870 (class 2604 OID 16517)
-- Name: technologies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technologies ALTER COLUMN id SET DEFAULT nextval('public.technologies_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 16485)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5031 (class 0 OID 16495)
-- Dependencies: 222
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, user_id, title, description, image, start_date, end_date, created_at) FROM stdin;
1	1	Personal Web	Website portfolio pribadi	https://via.placeholder.com/300	2026-02-02	2026-02-06	2026-02-06 21:19:00.209483
2	1	My Project App	Aplikasi manajemen project sederhana	https://via.placeholder.com/300	2026-02-02	2026-02-06	2026-02-06 21:19:00.209483
\.


--
-- TOC entry 5033 (class 0 OID 16514)
-- Dependencies: 224
-- Data for Name: technologies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technologies (id, project_id, name) FROM stdin;
1	1	HTML
2	1	CSS
3	2	JavaScript
\.


--
-- TOC entry 5029 (class 0 OID 16482)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, created_at) FROM stdin;
1	Mhd Nur Project	ifuku.007@gmail.com	2026-02-06 21:19:00.209483
\.


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 221
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 2, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 223
-- Name: technologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.technologies_id_seq', 3, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4876 (class 2606 OID 16507)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16522)
-- Name: technologies technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 16493)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4874 (class 2606 OID 16491)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 16523)
-- Name: technologies fk_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4879 (class 2606 OID 16508)
-- Name: projects fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-06 21:25:08

--
-- PostgreSQL database dump complete
--

\unrestrict fFJtlEL96ipSu2GsPB9ayh5Cf618ddtSii2abWp6MbEYhDjNVn2rgfww5EnfceT


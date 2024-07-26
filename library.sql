--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    a_id integer NOT NULL,
    a_username character varying(255) NOT NULL,
    a_password character varying(255)
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: admin_a_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_a_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_a_id_seq OWNER TO postgres;

--
-- Name: admin_a_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_a_id_seq OWNED BY public.admin.a_id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    b_id integer NOT NULL,
    b_name character varying(255),
    b_author text,
    b_category character varying(255),
    isbn character varying(255),
    is_borrowed_status boolean
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_b_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_b_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_b_id_seq OWNER TO postgres;

--
-- Name: books_b_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_b_id_seq OWNED BY public.books.b_id;


--
-- Name: borrowing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrowing (
    borrow_id integer NOT NULL,
    b_id integer,
    a_id integer,
    u_id integer,
    borrow_date date,
    due_date date,
    return_date date,
    is_borrowed_status boolean
);


ALTER TABLE public.borrowing OWNER TO postgres;

--
-- Name: borrowing_borrow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrowing_borrow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrowing_borrow_id_seq OWNER TO postgres;

--
-- Name: borrowing_borrow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrowing_borrow_id_seq OWNED BY public.borrowing.borrow_id;


--
-- Name: fine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fine (
    f_id integer NOT NULL,
    b_id integer,
    u_id integer,
    a_id integer,
    fine_amount integer,
    paid_status boolean
);


ALTER TABLE public.fine OWNER TO postgres;

--
-- Name: fine_f_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fine_f_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fine_f_id_seq OWNER TO postgres;

--
-- Name: fine_f_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fine_f_id_seq OWNED BY public.fine.f_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    u_id integer NOT NULL,
    u_name text,
    u_address text,
    u_email character varying(255),
    u_phone character varying(255),
    is_borrowed_status boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_u_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_u_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_u_id_seq OWNER TO postgres;

--
-- Name: users_u_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_u_id_seq OWNED BY public.users.u_id;


--
-- Name: admin a_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN a_id SET DEFAULT nextval('public.admin_a_id_seq'::regclass);


--
-- Name: books b_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN b_id SET DEFAULT nextval('public.books_b_id_seq'::regclass);


--
-- Name: borrowing borrow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowing ALTER COLUMN borrow_id SET DEFAULT nextval('public.borrowing_borrow_id_seq'::regclass);


--
-- Name: fine f_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine ALTER COLUMN f_id SET DEFAULT nextval('public.fine_f_id_seq'::regclass);


--
-- Name: users u_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN u_id SET DEFAULT nextval('public.users_u_id_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (a_id, a_username, a_password) FROM stdin;
2	root	$2b$10$/sn.k4xbZs3GkkdzQbs6SuDXJifmjYFpTXK.mm32PToSbWYEG8F0q
3	admin1	$2b$10$euseE2W.PATF9Xu20pK3wut11Xtdzdtu5igNIv8Hih77kkPjUe7rC
1	ditari	$2b$10$BH1rGTDOIWS.GudzaPP2p..4PJWVDgUJCfoaEEYAUk8edKeyD78vO
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (b_id, b_name, b_author, b_category, isbn, is_borrowed_status) FROM stdin;
4	book 4	four	c3	isbn4	f
3	book 3	three	c3	isbn3	t
7	book 7	thirteen	c7	isbn13	f
\.


--
-- Data for Name: borrowing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrowing (borrow_id, b_id, a_id, u_id, borrow_date, due_date, return_date, is_borrowed_status) FROM stdin;
36	3	1	3	2024-06-25	2024-07-09	\N	t
\.


--
-- Data for Name: fine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fine (f_id, b_id, u_id, a_id, fine_amount, paid_status) FROM stdin;
6	3	3	2	100	f
7	4	3	2	100	f
8	4	2	2	100	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (u_id, u_name, u_address, u_email, u_phone, is_borrowed_status) FROM stdin;
2	user2	address2	email2	phone2	f
3	user 3	addr3	email3	phone3	t
\.


--
-- Name: admin_a_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_a_id_seq', 3, true);


--
-- Name: books_b_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_b_id_seq', 9, true);


--
-- Name: borrowing_borrow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrowing_borrow_id_seq', 36, true);


--
-- Name: fine_f_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fine_f_id_seq', 8, true);


--
-- Name: users_u_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_u_id_seq', 5, true);


--
-- Name: admin admin_a_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_a_username_key UNIQUE (a_username);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (a_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (b_id);


--
-- Name: borrowing borrowing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_pkey PRIMARY KEY (borrow_id);


--
-- Name: fine fine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_pkey PRIMARY KEY (f_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (u_id);


--
-- Name: borrowing borrowing_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_a_id_fkey FOREIGN KEY (a_id) REFERENCES public.admin(a_id);


--
-- Name: borrowing borrowing_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_b_id_fkey FOREIGN KEY (b_id) REFERENCES public.books(b_id);


--
-- Name: borrowing borrowing_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.users(u_id);


--
-- Name: fine fine_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_a_id_fkey FOREIGN KEY (a_id) REFERENCES public.admin(a_id);


--
-- Name: fine fine_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_b_id_fkey FOREIGN KEY (b_id) REFERENCES public.books(b_id);


--
-- Name: fine fine_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fine
    ADD CONSTRAINT fine_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.users(u_id);


--
-- PostgreSQL database dump complete
--


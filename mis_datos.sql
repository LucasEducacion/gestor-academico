--
-- PostgreSQL database dump
--

\restrict hBJx7wR9Vog77DK0U7NCNJnOshavvdTpbqM9yBcL8Z5O9s6kD9EdkBayuZeYqKT

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-02 00:06:08

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
-- TOC entry 222 (class 1259 OID 16403)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    color character varying(20) DEFAULT '#FFFFFF'::character varying
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- TOC entry 227 (class 1259 OID 16459)
-- Name: correlatividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.correlatividades (
    materia_id integer NOT NULL,
    correlativa_id integer NOT NULL
);


ALTER TABLE public.correlatividades OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16413)
-- Name: materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    categoria_id integer
);


ALTER TABLE public.materias OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16412)
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_id_seq OWNER TO postgres;

--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 223
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- TOC entry 226 (class 1259 OID 16427)
-- Name: notas_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notas_usuarios (
    id integer NOT NULL,
    usuario_id integer,
    materia_id integer,
    nota integer,
    condicion character varying(20) DEFAULT 'Pendiente'::character varying,
    disponibilidad character varying(20) DEFAULT 'No Disponible'::character varying,
    CONSTRAINT notas_usuarios_nota_check CHECK (((nota >= 0) AND (nota <= 10)))
);


ALTER TABLE public.notas_usuarios OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16426)
-- Name: notas_usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notas_usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notas_usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 225
-- Name: notas_usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notas_usuarios_id_seq OWNED BY public.notas_usuarios.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4876 (class 2604 OID 16406)
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 16416)
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 16430)
-- Name: notas_usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_usuarios ALTER COLUMN id SET DEFAULT nextval('public.notas_usuarios_id_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16393)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5052 (class 0 OID 16403)
-- Dependencies: 222
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nombre, color) FROM stdin;
1	Primer Año	#D32F2F
2	Segundo Año	#1976D2
3	Tercer Año	#388E3C
4	Cuarto Año	#FBC02D
5	Quinto Año	#7B1FA2
6	Transversales	#E64A19
7	Electivas	#5D6D7E
\.


--
-- TOC entry 5057 (class 0 OID 16459)
-- Dependencies: 227
-- Data for Name: correlatividades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.correlatividades (materia_id, correlativa_id) FROM stdin;
3628	3622
3629	3623
3630	3624
3631	3625
3633	3622
3634	3628
3635	3629
3635	3621
3636	3629
3636	3621
3637	3630
3638	3631
3676	3626
3639	3633
3640	3635
3641	3636
3642	3637
3642	3626
3643	3638
3643	3634
3644	3632
3680	3638
3680	3636
3680	3635
3680	3632
3680	3630
3680	3626
3680	3625
3680	3624
3680	3623
3680	3621
3645	3627
3646	3640
3646	3633
3647	3642
3648	3642
3648	3636
3649	3638
3650	3643
3650	3638
3650	3635
3675	3642
3651	3645
3651	3639
3651	3621
3652	3641
3652	3646
3653	3648
3654	3649
3654	3645
3654	3640
3655	3650
3656	3651
3656	3641
3657	3646
3658	3654
3658	3646
3659	3653
3659	3647
3659	3644
3660	3654
3661	3651
3661	3650
3661	3644
3662	3651
3663	3657
3664	3651
3664	3646
3665	3659
3665	3652
3666	3655
3666	3652
3666	3649
3667	3647
3668	3664
3668	3656
3669	3661
3670	3664
3670	3656
902	901
903	902
904	903
912	911
3672	3658
3672	3661
3672	3663
3673	3662
3673	3666
3674	3664
3674	3665
3677	3658
3677	3661
3677	3663
3678	3662
3678	3666
3679	3664
3679	3665
3671	3667
3671	3661
3671	3660
3671	3659
3671	3656
\.


--
-- TOC entry 5054 (class 0 OID 16413)
-- Dependencies: 224
-- Data for Name: materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias (id, nombre, categoria_id) FROM stdin;
3621	Matemática Discreta	1
3622	Análisis Matemático I	1
3623	Programación Inicial	1
3624	Introducción a los Sistemas de Información	1
3625	Sistemas de Numeración	1
3626	Principios de Calidad de Software	1
3627	Álgebra y Geometría Analítica I	1
3628	Física I	1
3629	Programación Estructurada Básica	1
3630	Introducción a la Gestión de Requisitos	1
3631	Fundamentos de Sistemas Embebidos	1
3632	Introducción a los Proyectos Informáticos	1
3633	Análisis Matemático II	2
3634	Física II	2
3635	Tópicos de Programación	2
3636	Bases de Datos	2
3637	Análisis de Sistemas	2
3638	Arquitectura de Computadoras	2
3676	Responsabilidad Social Universitaria	2
3639	Análisis Matemático III	2
3640	Algoritmos y Estructuras de Datos	2
3641	Bases de Datos Aplicadas	2
3642	Principios de Diseño de Sistemas	2
3643	Redes de Computadoras	2
3644	Gestión de las Organizaciones	2
3680	Taller de Integración	2
3645	Álgebra y Geometría Analítica II	3
3646	Paradigmas de Programación	3
3647	Requisitos Avanzados	3
3648	Diseño de Software	3
3649	Sistemas Operativos	3
3650	Seguridad de la Información	3
3675	Práctica Profesional Supervisada	3
3651	Probabilidad y Estadística	3
3652	Programación Avanzada	3
3653	Arquitectura de Sistemas Software	3
3654	Virtualización de Hardware	3
3655	Auditoría y Legislación	3
3656	Estadística Aplicada	4
3657	Autómatas y Gramáticas	4
3658	Programación Concurrente	4
3659	Gestión Aplic. al Des. de Software I	4
3660	Sistemas Operativos Avanzados	4
3661	Gestión de Proyectos	4
3662	Matemática Aplicada	4
3663	Lenguajes y Compiladores	4
3664	Inteligencia Artificial	4
3665	Gestión Aplicada al Desarrollo de Software II	4
3666	Seguridad Aplicada y Forensia	4
3667	Gestión de la Calidad en Procesos de Sistemas	4
3668	Inteligencia Artificial Aplicada	5
3669	Innovación y Emprendedorismo	5
3670	Ciencia de Datos	5
3671	Proyecto Final de Carrera	5
3672	Electiva I	5
3673	Electiva II	5
3674	Electiva III	5
3677	Lenguaje Orientado a Negocios	7
3678	Tecnologías en Seguridad	7
3679	Visión Artificial	7
901	Inglés Transversal Nivel I	6
902	Inglés Transversal Nivel II	6
903	Inglés Transversal Nivel III	6
904	Inglés Transversal Nivel IV	6
911	Computación Transversal Nivel I	6
912	Computación Transversal Nivel II	6
\.


--
-- TOC entry 5056 (class 0 OID 16427)
-- Dependencies: 226
-- Data for Name: notas_usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notas_usuarios (id, usuario_id, materia_id, nota, condicion, disponibilidad) FROM stdin;
\.


--
-- TOC entry 5050 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password) FROM stdin;
1	Estudiante Demo	test@test.com	$2a$10$8Kz1/4t/8.8.8.8.8.8.8e.J.J.J.J.J.J.J.J.J.J.J.J
2	Nuevo Usuario	yo@test.com	$2b$10$1VAehHKAKrnG01utW9Dj/.Kok4UEtuuijlTTO7Ck9wf3PG09NIA6O
\.


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 1, false);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 223
-- Name: materias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_id_seq', 1, false);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 225
-- Name: notas_usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notas_usuarios_id_seq', 132, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- TOC entry 4888 (class 2606 OID 16411)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 16465)
-- Name: correlatividades correlatividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correlatividades
    ADD CONSTRAINT correlatividades_pkey PRIMARY KEY (materia_id, correlativa_id);


--
-- TOC entry 4890 (class 2606 OID 16420)
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16436)
-- Name: notas_usuarios notas_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_usuarios
    ADD CONSTRAINT notas_usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 16477)
-- Name: notas_usuarios unique_nota_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_usuarios
    ADD CONSTRAINT unique_nota_usuario UNIQUE (usuario_id, materia_id);


--
-- TOC entry 4884 (class 2606 OID 16401)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4886 (class 2606 OID 16399)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16471)
-- Name: correlatividades correlatividades_correlativa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correlatividades
    ADD CONSTRAINT correlatividades_correlativa_id_fkey FOREIGN KEY (correlativa_id) REFERENCES public.materias(id);


--
-- TOC entry 4901 (class 2606 OID 16466)
-- Name: correlatividades correlatividades_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.correlatividades
    ADD CONSTRAINT correlatividades_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- TOC entry 4897 (class 2606 OID 16421)
-- Name: materias materias_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- TOC entry 4898 (class 2606 OID 16442)
-- Name: notas_usuarios notas_usuarios_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_usuarios
    ADD CONSTRAINT notas_usuarios_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- TOC entry 4899 (class 2606 OID 16437)
-- Name: notas_usuarios notas_usuarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_usuarios
    ADD CONSTRAINT notas_usuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


-- Completed on 2026-01-02 00:06:09

--
-- PostgreSQL database dump complete
--

\unrestrict hBJx7wR9Vog77DK0U7NCNJnOshavvdTpbqM9yBcL8Z5O9s6kD9EdkBayuZeYqKT


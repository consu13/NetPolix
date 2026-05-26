USE [master]
GO
/****** Objeto: Database [SIC_NetPOLIx] Fecha de script: 25/05/2026 12:54:21 p. m. ******/
CREATE DATABASE [SIC_NetPOLIx]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SIC_NetPOLIx', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\SIC_NetPOLIx.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SIC_NetPOLIx_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\SIC_NetPOLIx_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [SIC_NetPOLIx] SET COMPATIBILITY_LEVEL = 170
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SIC_NetPOLIx].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [SIC_NetPOLIx] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ARITHABORT OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SIC_NetPOLIx] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SIC_NetPOLIx] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET  ENABLE_BROKER 
GO
ALTER DATABASE [SIC_NetPOLIx] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SIC_NetPOLIx] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET RECOVERY FULL 
GO
ALTER DATABASE [SIC_NetPOLIx] SET  MULTI_USER 
GO
ALTER DATABASE [SIC_NetPOLIx] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SIC_NetPOLIx] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SIC_NetPOLIx] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SIC_NetPOLIx] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [SIC_NetPOLIx] SET OPTIMIZED_LOCKING = OFF 
GO
ALTER DATABASE [SIC_NetPOLIx] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'SIC_NetPOLIx', N'ON'
GO
ALTER DATABASE [SIC_NetPOLIx] SET QUERY_STORE = ON
GO
ALTER DATABASE [SIC_NetPOLIx] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [SIC_NetPOLIx]
GO
/****** Objeto: Table [dbo].[video] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[video](
	[id_video] [int] IDENTITY(1,1) NOT NULL,
	[isan] [varchar](50) NOT NULL,
	[titulo_original] [varchar](200) NOT NULL,
	[anio] [int] NOT NULL,
	[duracion] [int] NOT NULL,
	[tipo] [varchar](20) NULL,
	[descripcion] [varchar](max) NULL,
	[id_clasificacion] [varchar](10) NULL,
	[url_descarga] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_video] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[isan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[calificacion] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[calificacion](
	[id_calificacion] [int] IDENTITY(1,1) NOT NULL,
	[id_video] [int] NOT NULL,
	[id_cliente] [int] NOT NULL,
	[fecha] [date] NOT NULL,
	[valor] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_calificacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: View [dbo].[vw_promedio_calificaciones] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_promedio_calificaciones] AS
SELECT 
    v.id_video,
    v.titulo_original,
    COUNT(c.id_calificacion) AS total_votos,
    SUM(CASE WHEN c.valor = 'EXCELENTE' THEN 1 ELSE 0 END) AS votos_excelente,
    SUM(CASE WHEN c.valor = 'BUENA' THEN 1 ELSE 0 END) AS votos_buena,
    SUM(CASE WHEN c.valor = 'REGULAR' THEN 1 ELSE 0 END) AS votos_regular,
    SUM(CASE WHEN c.valor = 'MALA' THEN 1 ELSE 0 END) AS votos_mala,
    CAST(ROUND(AVG(CAST(CASE c.valor
        WHEN 'EXCELENTE' THEN 4
        WHEN 'BUENA' THEN 3
        WHEN 'REGULAR' THEN 2
        WHEN 'MALA' THEN 1
        ELSE 0
    END AS FLOAT)), 2) AS DECIMAL(3,2)) AS promedio
FROM video v
LEFT JOIN calificacion c ON v.id_video = c.id_video
GROUP BY v.id_video, v.titulo_original;
GO
/****** Objeto: Table [dbo].[categoria] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categoria](
	[id_categoria] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_categoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[clasificacion] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clasificacion](
	[tipo] [varchar](10) NOT NULL,
	[descripcion] [varchar](255) NOT NULL,
 CONSTRAINT [PK_clasificacion] PRIMARY KEY CLUSTERED 
(
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[cliente] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cliente](
	[id_cliente] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[cedula] [varchar](20) NOT NULL,
	[fecha_ingreso] [date] NOT NULL,
	[email] [varchar](100) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[puntos] [int] NULL,
	[saldo] [decimal](10, 2) NULL,
	[rol] [varchar](20) NULL,
	[nickname] [varchar](50) NULL,
	[id_referido] [int] NULL,
	[foto_perfil] [varchar](50) NULL,
	[fecha_nacimiento_hash] [varchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[cedula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[coleccion] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[coleccion](
	[isan] [varchar](50) NOT NULL,
	[titulo] [varchar](200) NOT NULL,
	[volumen] [int] NOT NULL,
 CONSTRAINT [PK_coleccion] PRIMARY KEY CLUSTERED 
(
	[isan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_coleccion_isan] UNIQUE NONCLUSTERED 
(
	[isan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[coleccion_video] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[coleccion_video](
	[isan_coleccion] [varchar](50) NOT NULL,
	[id_video] [int] NOT NULL,
 CONSTRAINT [PK_coleccion_video] PRIMARY KEY CLUSTERED 
(
	[isan_coleccion] ASC,
	[id_video] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[idioma] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[idioma](
	[id_idioma] [int] IDENTITY(1,1) NOT NULL,
	[lenguaje] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_idioma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[lenguaje] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[persona] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[persona](
	[id_persona] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[fecha_nacimiento] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_persona] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[serie] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[serie](
	[id_serie] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [varchar](200) NOT NULL,
	[temporada] [int] NOT NULL,
 CONSTRAINT [PK_serie] PRIMARY KEY CLUSTERED 
(
	[id_serie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[serie_persona] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[serie_persona](
	[id_serie] [int] NOT NULL,
	[id_persona] [int] NOT NULL,
	[tipo] [varchar](20) NOT NULL,
 CONSTRAINT [PK_serie_persona] PRIMARY KEY CLUSTERED 
(
	[id_serie] ASC,
	[id_persona] ASC,
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[serie_video] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[serie_video](
	[id_serie] [int] NOT NULL,
	[id_video] [int] NOT NULL,
 CONSTRAINT [PK_serie_video] PRIMARY KEY CLUSTERED 
(
	[id_serie] ASC,
	[id_video] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[transaccion] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transaccion](
	[id_transaccion] [int] IDENTITY(1,1) NOT NULL,
	[id_cliente] [int] NOT NULL,
	[id_video] [int] NOT NULL,
	[tipo] [varchar](10) NOT NULL,
	[monto] [decimal](10, 2) NOT NULL,
	[fecha] [datetime] NULL,
	[fecha_expiracion] [date] NULL,
	[max_reproducciones] [int] NULL,
	[reproducciones_usadas] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_transaccion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[usuario_sistema] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuario_sistema](
	[id_usuario] [int] IDENTITY(1,1) NOT NULL,
	[nombre_completo] [varchar](100) NOT NULL,
	[documento] [varchar](20) NOT NULL,
	[nombre_usuario] [varchar](50) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[rol] [varchar](20) NOT NULL,
	[fecha_creacion] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[documento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[nombre_usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[video_categoria] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[video_categoria](
	[id_video] [int] NOT NULL,
	[id_categoria] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_video] ASC,
	[id_categoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[video_idioma] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[video_idioma](
	[id_video] [int] NOT NULL,
	[id_idioma] [int] NOT NULL,
	[tipo] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_video] ASC,
	[id_idioma] ASC,
	[tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[video_persona] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[video_persona](
	[id_video] [int] NOT NULL,
	[id_persona] [int] NOT NULL,
	[rol] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_video] ASC,
	[id_persona] ASC,
	[rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Index [idx_calificacion_cliente] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_calificacion_cliente] ON [dbo].[calificacion]
(
	[id_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Objeto: Index [idx_calificacion_video] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_calificacion_video] ON [dbo].[calificacion]
(
	[id_video] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [idx_cliente_cedula] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_cliente_cedula] ON [dbo].[cliente]
(
	[cedula] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [idx_cliente_email] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_cliente_email] ON [dbo].[cliente]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Objeto: Index [idx_video_anio] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_video_anio] ON [dbo].[video]
(
	[anio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [idx_video_titulo] Fecha de script: 25/05/2026 12:54:22 p. m. ******/
CREATE NONCLUSTERED INDEX [idx_video_titulo] ON [dbo].[video]
(
	[titulo_original] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[calificacion] ADD  DEFAULT (getdate()) FOR [fecha]
GO
ALTER TABLE [dbo].[cliente] ADD  DEFAULT (getdate()) FOR [fecha_ingreso]
GO
ALTER TABLE [dbo].[cliente] ADD  DEFAULT ((0)) FOR [puntos]
GO
ALTER TABLE [dbo].[cliente] ADD  DEFAULT ((0)) FOR [saldo]
GO
ALTER TABLE [dbo].[cliente] ADD  DEFAULT ('CLIENTE') FOR [rol]
GO
ALTER TABLE [dbo].[transaccion] ADD  DEFAULT (getdate()) FOR [fecha]
GO
ALTER TABLE [dbo].[transaccion] ADD  DEFAULT ((0)) FOR [reproducciones_usadas]
GO
ALTER TABLE [dbo].[usuario_sistema] ADD  DEFAULT (getdate()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[video] ADD  DEFAULT ('PELICULA') FOR [tipo]
GO
ALTER TABLE [dbo].[calificacion]  WITH CHECK ADD FOREIGN KEY([id_cliente])
REFERENCES [dbo].[cliente] ([id_cliente])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[calificacion]  WITH CHECK ADD FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[cliente]  WITH CHECK ADD  CONSTRAINT [FK_cliente_referido] FOREIGN KEY([id_referido])
REFERENCES [dbo].[cliente] ([id_cliente])
GO
ALTER TABLE [dbo].[cliente] CHECK CONSTRAINT [FK_cliente_referido]
GO
ALTER TABLE [dbo].[coleccion_video]  WITH CHECK ADD  CONSTRAINT [FK_coleccion_video_coleccion] FOREIGN KEY([isan_coleccion])
REFERENCES [dbo].[coleccion] ([isan])
GO
ALTER TABLE [dbo].[coleccion_video] CHECK CONSTRAINT [FK_coleccion_video_coleccion]
GO
ALTER TABLE [dbo].[coleccion_video]  WITH CHECK ADD  CONSTRAINT [FK_coleccion_video_video] FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
GO
ALTER TABLE [dbo].[coleccion_video] CHECK CONSTRAINT [FK_coleccion_video_video]
GO
ALTER TABLE [dbo].[serie_persona]  WITH CHECK ADD  CONSTRAINT [FK_serie_persona_persona] FOREIGN KEY([id_persona])
REFERENCES [dbo].[persona] ([id_persona])
GO
ALTER TABLE [dbo].[serie_persona] CHECK CONSTRAINT [FK_serie_persona_persona]
GO
ALTER TABLE [dbo].[serie_persona]  WITH CHECK ADD  CONSTRAINT [FK_serie_persona_serie] FOREIGN KEY([id_serie])
REFERENCES [dbo].[serie] ([id_serie])
GO
ALTER TABLE [dbo].[serie_persona] CHECK CONSTRAINT [FK_serie_persona_serie]
GO
ALTER TABLE [dbo].[serie_video]  WITH CHECK ADD  CONSTRAINT [FK_serie_video_serie] FOREIGN KEY([id_serie])
REFERENCES [dbo].[serie] ([id_serie])
GO
ALTER TABLE [dbo].[serie_video] CHECK CONSTRAINT [FK_serie_video_serie]
GO
ALTER TABLE [dbo].[serie_video]  WITH CHECK ADD  CONSTRAINT [FK_serie_video_video] FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
GO
ALTER TABLE [dbo].[serie_video] CHECK CONSTRAINT [FK_serie_video_video]
GO
ALTER TABLE [dbo].[transaccion]  WITH CHECK ADD  CONSTRAINT [FK_transaccion_cliente] FOREIGN KEY([id_cliente])
REFERENCES [dbo].[cliente] ([id_cliente])
GO
ALTER TABLE [dbo].[transaccion] CHECK CONSTRAINT [FK_transaccion_cliente]
GO
ALTER TABLE [dbo].[transaccion]  WITH CHECK ADD  CONSTRAINT [FK_transaccion_video] FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
GO
ALTER TABLE [dbo].[transaccion] CHECK CONSTRAINT [FK_transaccion_video]
GO
ALTER TABLE [dbo].[video]  WITH CHECK ADD  CONSTRAINT [FK_video_clasificacion] FOREIGN KEY([id_clasificacion])
REFERENCES [dbo].[clasificacion] ([tipo])
GO
ALTER TABLE [dbo].[video] CHECK CONSTRAINT [FK_video_clasificacion]
GO
ALTER TABLE [dbo].[video_categoria]  WITH CHECK ADD FOREIGN KEY([id_categoria])
REFERENCES [dbo].[categoria] ([id_categoria])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[video_categoria]  WITH CHECK ADD FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[video_idioma]  WITH CHECK ADD FOREIGN KEY([id_idioma])
REFERENCES [dbo].[idioma] ([id_idioma])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[video_idioma]  WITH CHECK ADD FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[video_persona]  WITH CHECK ADD FOREIGN KEY([id_persona])
REFERENCES [dbo].[persona] ([id_persona])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[video_persona]  WITH CHECK ADD FOREIGN KEY([id_video])
REFERENCES [dbo].[video] ([id_video])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[calificacion]  WITH CHECK ADD CHECK  (([valor]='MALA' OR [valor]='REGULAR' OR [valor]='BUENA' OR [valor]='EXCELENTE'))
GO
ALTER TABLE [dbo].[serie_persona]  WITH CHECK ADD  CONSTRAINT [CK_serie_persona_tipo] CHECK  (([tipo]='INVITADO' OR [tipo]='PRODUCTOR' OR [tipo]='DIRECTOR' OR [tipo]='ACTOR'))
GO
ALTER TABLE [dbo].[serie_persona] CHECK CONSTRAINT [CK_serie_persona_tipo]
GO
ALTER TABLE [dbo].[usuario_sistema]  WITH CHECK ADD CHECK  (([rol]='ADMINISTRADOR' OR [rol]='GERENTE'))
GO
ALTER TABLE [dbo].[video_persona]  WITH CHECK ADD CHECK  (([rol]='INVITADO' OR [rol]='PRODUCTOR' OR [rol]='DIRECTOR' OR [rol]='ACTOR'))
GO
USE [master]
GO
ALTER DATABASE [SIC_NetPOLIx] SET  READ_WRITE 
GO

import pyodbc

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=SIC_NetPOLIx;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)
cursor = conn.cursor()

def col_exists(table, col):
    cursor.execute(
        "SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID(?) AND name=?",
        (table, col)
    )
    return cursor.fetchone() is not None

def table_exists(table):
    cursor.execute(
        "SELECT 1 FROM sysobjects WHERE name=? AND xtype='U'",
        (table,)
    )
    return cursor.fetchone() is not None

def view_exists(name):
    cursor.execute(
        "SELECT 1 FROM sysobjects WHERE name=? AND xtype='V'",
        (name,)
    )
    return cursor.fetchone() is not None

print("=== Completando esquema de SIC_NetPOLIx ===\n")

# ── Columnas faltantes en cliente ────────────────────────────────────────────
if not col_exists('cliente', 'nickname'):
    cursor.execute("ALTER TABLE cliente ADD nickname VARCHAR(100) NULL")
    print("+ cliente.nickname")

if not col_exists('cliente', 'rol'):
    cursor.execute("ALTER TABLE cliente ADD rol VARCHAR(20) DEFAULT 'CLIENTE'")
    print("+ cliente.rol")

if not col_exists('cliente', 'id_referido'):
    cursor.execute("ALTER TABLE cliente ADD id_referido INT NULL")
    print("+ cliente.id_referido")

if not col_exists('cliente', 'foto_perfil'):
    cursor.execute("ALTER TABLE cliente ADD foto_perfil VARCHAR(50) NULL")
    print("+ cliente.foto_perfil")

# ── Columnas faltantes en video ───────────────────────────────────────────────
if not col_exists('video', 'tipo'):
    cursor.execute("ALTER TABLE video ADD tipo VARCHAR(20) DEFAULT 'PELICULA'")
    print("+ video.tipo")

if not col_exists('video', 'descripcion'):
    cursor.execute("ALTER TABLE video ADD descripcion VARCHAR(500) NULL")
    print("+ video.descripcion")

if not col_exists('video', 'id_clasificacion'):
    cursor.execute("ALTER TABLE video ADD id_clasificacion INT NULL")
    print("+ video.id_clasificacion")

if not col_exists('video', 'url_descarga'):
    cursor.execute("ALTER TABLE video ADD url_descarga VARCHAR(500) NULL")
    print("+ video.url_descarga")

conn.commit()

# ── Tabla: transaccion ────────────────────────────────────────────────────────
if not table_exists('transaccion'):
    cursor.execute("""
        CREATE TABLE transaccion (
            id_transaccion       INT IDENTITY(1,1) PRIMARY KEY,
            id_cliente           INT NOT NULL REFERENCES cliente(id_cliente),
            id_video             INT NOT NULL REFERENCES video(id_video),
            tipo                 VARCHAR(10) NOT NULL,
            monto                DECIMAL(10,2) NOT NULL,
            fecha                DATETIME DEFAULT GETDATE(),
            fecha_expiracion     DATE NULL,
            max_reproducciones   INT NULL,
            reproducciones_usadas INT DEFAULT 0
        )
    """)
    print("+ tabla transaccion")

# ── Tabla: calificacion ───────────────────────────────────────────────────────
if not table_exists('calificacion'):
    cursor.execute("""
        CREATE TABLE calificacion (
            id_calificacion INT IDENTITY(1,1) PRIMARY KEY,
            id_video        INT NOT NULL REFERENCES video(id_video),
            id_cliente      INT NOT NULL REFERENCES cliente(id_cliente),
            valor           VARCHAR(10) NOT NULL,
            fecha           DATETIME DEFAULT GETDATE()
        )
    """)
    print("+ tabla calificacion")

# ── Vista: vw_promedio_calificaciones ─────────────────────────────────────────
if not view_exists('vw_promedio_calificaciones'):
    cursor.execute("""
        CREATE VIEW vw_promedio_calificaciones AS
        SELECT id_video,
               AVG(CAST(CASE valor
                   WHEN 'EXCELENTE' THEN 4
                   WHEN 'BUENA'     THEN 3
                   WHEN 'REGULAR'   THEN 2
                   WHEN 'MALA'      THEN 1
               END AS FLOAT)) AS promedio
        FROM calificacion
        GROUP BY id_video
    """)
    print("+ vista vw_promedio_calificaciones")

# ── Tabla: categoria ──────────────────────────────────────────────────────────
if not table_exists('categoria'):
    cursor.execute("""
        CREATE TABLE categoria (
            id_categoria INT IDENTITY(1,1) PRIMARY KEY,
            nombre       VARCHAR(100) UNIQUE NOT NULL
        )
    """)
    cursor.execute("""
        INSERT INTO categoria (nombre) VALUES
        ('ACCION'),('COMEDIA'),('TERROR'),('SUSPENSO'),('DRAMA'),('INDEPENDIENTE')
    """)
    print("+ tabla categoria (con categorias base)")

# ── Tabla: persona ────────────────────────────────────────────────────────────
if not table_exists('persona'):
    cursor.execute("""
        CREATE TABLE persona (
            id_persona       INT IDENTITY(1,1) PRIMARY KEY,
            nombre           VARCHAR(200) NOT NULL,
            fecha_nacimiento DATE NULL
        )
    """)
    print("+ tabla persona")

# ── Tabla: video_persona ──────────────────────────────────────────────────────
if not table_exists('video_persona'):
    cursor.execute("""
        CREATE TABLE video_persona (
            id_video   INT NOT NULL REFERENCES video(id_video),
            id_persona INT NOT NULL REFERENCES persona(id_persona),
            rol        VARCHAR(20) NOT NULL,
            PRIMARY KEY (id_video, id_persona, rol)
        )
    """)
    print("+ tabla video_persona")

# ── Tabla: video_categoria ────────────────────────────────────────────────────
if not table_exists('video_categoria'):
    cursor.execute("""
        CREATE TABLE video_categoria (
            id_video     INT NOT NULL REFERENCES video(id_video),
            id_categoria INT NOT NULL REFERENCES categoria(id_categoria),
            PRIMARY KEY (id_video, id_categoria)
        )
    """)
    print("+ tabla video_categoria")

# ── Tabla: video_idioma ───────────────────────────────────────────────────────
if not table_exists('video_idioma'):
    cursor.execute("""
        CREATE TABLE video_idioma (
            id_video INT NOT NULL REFERENCES video(id_video),
            idioma   VARCHAR(50) NOT NULL,
            tipo     VARCHAR(20) NOT NULL,   -- ORIGINAL, SUBTITULO, DOBLAJE
            PRIMARY KEY (id_video, idioma, tipo)
        )
    """)
    print("+ tabla video_idioma")

# ── Tabla: serie ──────────────────────────────────────────────────────────────
if not table_exists('serie'):
    cursor.execute("""
        CREATE TABLE serie (
            id_serie  INT IDENTITY(1,1) PRIMARY KEY,
            titulo    VARCHAR(200) NOT NULL,
            temporada INT NOT NULL
        )
    """)
    print("+ tabla serie")

# ── Tabla: serie_video ────────────────────────────────────────────────────────
if not table_exists('serie_video'):
    cursor.execute("""
        CREATE TABLE serie_video (
            id_serie INT NOT NULL REFERENCES serie(id_serie),
            id_video INT NOT NULL REFERENCES video(id_video),
            PRIMARY KEY (id_serie, id_video)
        )
    """)
    print("+ tabla serie_video")

# ── Tabla: clasificacion ──────────────────────────────────────────────────────
if not table_exists('clasificacion'):
    cursor.execute("""
        CREATE TABLE clasificacion (
            id_clasificacion INT IDENTITY(1,1) PRIMARY KEY,
            tipo             VARCHAR(10)  NOT NULL,
            descripcion      VARCHAR(200) NOT NULL
        )
    """)
    cursor.execute("""
        INSERT INTO clasificacion (tipo, descripcion) VALUES
        ('G',     'Audiencia general - apto para todos'),
        ('PG',    'Guia parental sugerida'),
        ('PG-13', 'Guia parental estricta para menores de 13 anos'),
        ('R',     'Restringido - menores requieren acompanante adulto'),
        ('NC-17', 'Solo para adultos mayores de 17 anos')
    """)
    print("+ tabla clasificacion")

# ── Columna: cliente.fecha_nacimiento_hash ────────────────────────────────────
if not col_exists('cliente', 'fecha_nacimiento_hash'):
    cursor.execute("ALTER TABLE cliente ADD fecha_nacimiento_hash VARCHAR(200) NULL")
    print("+ cliente.fecha_nacimiento_hash")

conn.commit()
conn.close()
print("\n=== Esquema completado exitosamente ===")

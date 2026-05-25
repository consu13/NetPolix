import pyodbc

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost\\SQLEXPRESS;"
    "DATABASE=SIC_NetPOLIx;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

cursor = conn.cursor()

# Crear tabla cliente
cursor.execute("""
CREATE TABLE cliente (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    puntos INT DEFAULT 0,
    saldo DECIMAL(10,2) DEFAULT 0,
    id_plan INT NULL,
    fecha_inicio_suscripcion DATE NULL,
    fecha_fin_suscripcion DATE NULL,
    suscripcion_activa BIT DEFAULT 1
)
""")

# Crear tabla plan
cursor.execute("""
CREATE TABLE [plan] (
    id_plan INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    precio_mensual DECIMAL(10,2) NOT NULL,
    precio_anual DECIMAL(10,2),
    max_dispositivos INT DEFAULT 1,
    calidad VARCHAR(20) DEFAULT 'HD',
    tiene_anuncios BIT DEFAULT 0,
    activo BIT DEFAULT 1,
    fecha_creacion DATE DEFAULT GETDATE()
)
""")

# Crear tabla video
cursor.execute("""
CREATE TABLE video (
    id_video INT IDENTITY(1,1) PRIMARY KEY,
    isan VARCHAR(50) UNIQUE NOT NULL,
    titulo_original VARCHAR(200) NOT NULL,
    anio INT NOT NULL,
    duracion INT NOT NULL,
    promedio DECIMAL(3,2) DEFAULT 0
)
""")

# Insertar datos de prueba
cursor.execute("""
INSERT INTO [plan] (nombre, descripcion, precio_mensual, max_dispositivos, calidad) VALUES
('Basico', 'Acceso con anuncios', 3.99, 1, 'HD'),
('Estandar', 'Catalogo completo sin anuncios', 7.99, 2, 'FULL HD'),
('Premium', 'Todo el contenido + 4K', 12.99, 4, '4K UHD')
""")

cursor.execute("""
INSERT INTO cliente (nombre, cedula, email, password, id_plan, fecha_fin_suscripcion) VALUES
('Juan Perez', '12345678', 'juan@mail.com', 'juan123', 2, DATEADD(MONTH, 1, GETDATE()))
""")

cursor.execute("""
INSERT INTO video (isan, titulo_original, anio, duracion) VALUES
('1234-5678-9012', 'Inception', 2010, 148),
('2345-6789-0123', 'The Dark Knight', 2008, 152)
""")

conn.commit()

# Verificar
cursor.execute("SELECT COUNT(*) FROM cliente")
print(f"Clientes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM video")
print(f"Videos: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM [plan]")
print(f"Planes: {cursor.fetchone()[0]}")

conn.close()
print("Tablas creadas exitosamente")
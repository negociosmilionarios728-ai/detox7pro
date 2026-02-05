-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela para senhas geradas
CREATE TABLE IF NOT EXISTS generated_passwords (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_text VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    length INTEGER DEFAULT 16,
    uses_uppercase BOOLEAN DEFAULT true,
    uses_lowercase BOOLEAN DEFAULT true,
    uses_numbers BOOLEAN DEFAULT true,
    uses_special BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Inserir dados de teste (opcional)
-- INSERT INTO users (full_name, email, password_hash) VALUES ('Test User', 'test@example.com', '$2a$10$...');

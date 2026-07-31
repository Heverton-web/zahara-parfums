-- Tabela de marcas
CREATE TABLE marcas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  logo_url TEXT
);

-- Tabela de produtos
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  marca_id UUID REFERENCES marcas(id) ON DELETE SET NULL,
  genero TEXT CHECK (genero IN ('feminino', 'masculino', 'unissex')),
  preco_original NUMERIC(10,2) NOT NULL,
  preco_promocional NUMERIC(10,2),
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de tracking
CREATE TABLE tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('view', 'click')),
  ip TEXT,
  user_agent TEXT,
  dispositivo TEXT,
  navegador TEXT,
  so TEXT,
  pais TEXT,
  referrer TEXT,
  fingerprint TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela de config
CREATE TABLE config (
  chave TEXT PRIMARY KEY,
  valor TEXT
);

-- Config inicial
INSERT INTO config (chave, valor) VALUES
  ('whatsapp_numero', '5511999999999');

-- Índices para performance
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_produtos_marca ON produtos(marca_id);
CREATE INDEX idx_tracking_produto ON tracking(produto_id);
CREATE INDEX idx_tracking_tipo ON tracking(tipo);
CREATE INDEX idx_tracking_criado ON tracking(criado_em);

-- RLS (Row Level Security)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (leitura)
CREATE POLICY "Produtos ativos são públicos" ON produtos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Marcas são públicas" ON marcas
  FOR SELECT USING (true);

-- Políticas admin (tudo)
CREATE POLICY "Admin pode tudo em produtos" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em marcas" ON marcas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em config" ON config
  FOR ALL USING (auth.role() = 'authenticated');

-- Tracking: inserção anônima permitida
CREATE POLICY "Anyone can insert tracking" ON tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin pode ler tracking" ON tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket para imagens
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);

CREATE POLICY "Imagens são públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'produtos');

CREATE POLICY "Admin pode upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'produtos' AND auth.role() = 'authenticated');

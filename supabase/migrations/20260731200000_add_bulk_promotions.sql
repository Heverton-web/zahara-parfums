-- Migration: Promoções em Massa
-- Tabelas + colunas para promoções em massa com timer
-- NOTA: produtos.id é TEXT, por isso produto_id é TEXT

-- 1. Tabela principal de promoções em massa
CREATE TABLE promocoes_em_massa (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nome TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'SUPER PROMOÇÃO',
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  tipo_desconto TEXT CHECK (tipo_desconto IN ('fixo', 'percentual')) NOT NULL,
  valor_desconto NUMERIC(10,2) NOT NULL,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela junction: promoção em massa ↔ produtos
CREATE TABLE promocao_em_massa_produtos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  promocao_em_massa_id TEXT NOT NULL REFERENCES promocoes_em_massa(id) ON DELETE CASCADE,
  produto_id TEXT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  UNIQUE(promocao_em_massa_id, produto_id)
);

-- 3. Novas colunas na tabela produtos
ALTER TABLE produtos ADD COLUMN preco_em_massa NUMERIC(10,2);
ALTER TABLE produtos ADD COLUMN em_promocao_em_massa BOOLEAN DEFAULT false;
ALTER TABLE produtos ADD COLUMN promocao_em_massa_id TEXT REFERENCES promocoes_em_massa(id) ON DELETE SET NULL;

-- 4. Índices para performance
CREATE INDEX idx_promocoes_em_massa_ativa ON promocoes_em_massa(ativa);
CREATE INDEX idx_promocoes_em_massa_data_fim ON promocoes_em_massa(data_fim);
CREATE INDEX idx_promocao_em_massa_produtos_produto ON promocao_em_massa_produtos(produto_id);
CREATE INDEX idx_promocao_em_massa_produtos_promocao ON promocao_em_massa_produtos(promocao_em_massa_id);
CREATE INDEX idx_produtos_em_promocao_em_massa ON produtos(em_promocao_em_massa);

-- 5. RLS (Row Level Security)
ALTER TABLE promocoes_em_massa ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocao_em_massa_produtos ENABLE ROW LEVEL SECURITY;

-- 6. Políticas públicas (leitura)
CREATE POLICY "Promoções em massa são públicas para leitura" ON promocoes_em_massa
  FOR SELECT USING (true);

CREATE POLICY "Promoção em massa produtos são públicos para leitura" ON promocao_em_massa_produtos
  FOR SELECT USING (true);

-- 7. Políticas admin (tudo)
CREATE POLICY "Admin pode tudo em promoções em massa" ON promocoes_em_massa
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em promoção em massa produtos" ON promocao_em_massa_produtos
  FOR ALL USING (auth.role() = 'authenticated');

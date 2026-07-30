-- Migration corrigido - usa TEXT para IDs simples
-- Cole este SQL no Supabase Dashboard → SQL Editor

-- 1. Criar tabelas
CREATE TABLE IF NOT EXISTS config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marcas (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  marca_id TEXT REFERENCES marcas(id),
  genero TEXT CHECK (genero IN ('masculino', 'feminino', 'unissex')),
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cliques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id TEXT REFERENCES produtos(id),
  tipo TEXT CHECK (tipo IN ('view', 'click')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir marcas
INSERT INTO marcas (id, nome) VALUES
  ('1', 'Amouage'),
  ('2', 'Ajmal'),
  ('3', 'Rasasi'),
  ('4', 'Al Haramain'),
  ('5', 'Lattafa'),
  ('6', 'Swiss Arabian')
ON CONFLICT (id) DO NOTHING;

-- 3. Inserir produtos
INSERT INTO produtos (id, nome, marca_id, genero, preco, imagem_url, descricao, ativo, tags) VALUES
  ('1', 'Interlude Man', '1', 'masculino', 899.90, 'https://amouage.com/cdn/shop/files/Interlude-Man-100ml.png?v=1724136443&width=600', 'Um perfume oriental amadeirado para homens.', true, ARRAY['lançamento']),
  ('2', 'Jubilation XXV', '1', 'masculino', 1299.90, 'https://amouage.com/cdn/shop/files/jubilationXXV.png?v=1724136443&width=600', 'Uma celebração da vida e do sucesso.', true, ARRAY[]::TEXT[]),
  ('3', 'Oud Mood', '3', 'unissex', 349.90, 'https://lattafa.com/cdn/shop/files/oud-mood.png?v=1724136443&width=600', 'Fragrância oriental com notas de oud.', true, ARRAY['promoção']),
  ('4', 'Pure Oud', '4', 'masculino', 289.90, 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-60ml-Bottle.jpg?v=1724061272&width=600', 'Oud puro e autêntico do Oriente.', true, ARRAY[]::TEXT[]),
  ('5', 'Yara', '5', 'feminino', 199.90, 'https://lattafa.com/cdn/shop/files/yara.png?v=1724136443&width=600', 'Fragrância doce e floral.', true, ARRAY['oferta relâmpago']),
  ('6', 'Blue Lady', '6', 'feminino', 459.90, 'https://rasasionline.com/cdn/shop/files/blue-lady.png?v=1724136443&width=600', 'Elegância e sofisticação em cada gota.', true, ARRAY['lançamento']),
  ('7', 'Oud Sahara', '2', 'masculino', 529.90, 'https://en-ae.ajmal.com/cdn/shop/files/sahara-oudh.png?v=1724136443&width=600', 'Inspirado nas dunas do Saara.', true, ARRAY[]::TEXT[]),
  ('8', 'Raghba', '5', 'unissex', 159.90, 'https://lattafa.com/cdn/shop/files/raghba.png?v=1724136443&width=600', 'Fragrância doce oriental.', true, ARRAY['promoção']),
  ('9', 'Amber Oud', '4', 'unissex', 679.90, 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-Gold-60ml-Bottle.jpg?v=1724061229&width=600', 'A combinação perfeita de âmbar e oud.', true, ARRAY[]::TEXT[])
ON CONFLICT (id) DO NOTHING;

-- 4. Config WhatsApp
INSERT INTO config (chave, valor) VALUES ('whatsapp_numero', '5519981868198')
ON CONFLICT (chave) DO NOTHING;

-- 5. Habilitar RLS
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliques ENABLE ROW LEVEL SECURITY;

-- 6. Políticas
CREATE POLICY "Leitura pública" ON config FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON marcas FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON produtos FOR SELECT USING (true);
CREATE POLICY "Admin pode tudo" ON config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode tudo" ON marcas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode tudo" ON produtos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer um insere" ON cliques FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin vê cliques" ON cliques FOR SELECT USING (auth.role() = 'authenticated');

-- Migration: Criar usuário admin e tabelas necessárias
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de configurações (se não existir)
CREATE TABLE IF NOT EXISTS config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir configuração do WhatsApp
INSERT INTO config (chave, valor) 
VALUES ('whatsapp_numero', '5519981868198')
ON CONFLICT (chave) DO NOTHING;

-- 3. Criar tabela de marcas (se não existir)
CREATE TABLE IF NOT EXISTS marcas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de produtos (se não existir)
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  marca_id UUID REFERENCES marcas(id),
  genero TEXT CHECK (genero IN ('masculino', 'feminino', 'unissex')),
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela de cliques (se não existir)
CREATE TABLE IF NOT EXISTS cliques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id),
  tipo TEXT CHECK (tipo IN ('view', 'click')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inserir marcas de exemplo
INSERT INTO marcas (id, nome) VALUES
  ('1', 'Amouage'),
  ('2', 'Ajmal'),
  ('3', 'Rasasi'),
  ('4', 'Al Haramain'),
  ('5', 'Lattafa'),
  ('6', 'Swiss Arabian')
ON CONFLICT (id) DO NOTHING;

-- 7. Inserir produtos de exemplo
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

-- 8. Criar função para criar usuário admin (execute separadamente)
-- IMPORTANTE: Execute este passo depois de criar o usuário no Auth do Supabase
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   confirmation_token,
--   recovery_token,
--   email_change_token_new,
--   email_change
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'zahara@parfum.com',
--   crypt('@#Khen741963@#', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '',
--   '',
--   '',
--   ''
-- );

-- 9. Criar políticas de segurança (RLS)
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliques ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Leitura pública de config" ON config FOR SELECT USING (true);
CREATE POLICY "Leitura pública de marcas" ON marcas FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos" ON produtos FOR SELECT USING (true);

-- Políticas para administradores
CREATE POLICY "Admin pode inserir config" ON config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar config" ON config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar config" ON config FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode inserir marcas" ON marcas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar marcas" ON marcas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar marcas" ON marcas FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode inserir produtos" ON produtos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar produtos" ON produtos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar produtos" ON produtos FOR DELETE USING (auth.role() = 'authenticated');

-- Política para cliques (qualquer um pode inserir)
CREATE POLICY "Qualquer um pode inserir cliques" ON cliques FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode ver cliques" ON cliques FOR SELECT USING (auth.role() = 'authenticated');

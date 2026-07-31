-- Migration: Configurações de redes sociais e contato
-- Execute no Supabase SQL Editor

-- Inserir configs padrão (não sobrescreve existentes)
INSERT INTO config (chave, valor) VALUES
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', ''),
  ('email_contato', 'contato@zaharaparfums.com.br'),
  ('telefone', '(11) 99999-9999'),
  ('endereco', 'São Paulo, SP - Brasil'),
  ('footer_texto', 'Descubra a exclusividade dos perfumes árabes. Fragrâncias importadas que despertam suas emoções e transportam você a um mundo de sofisticação.')
ON CONFLICT (chave) DO NOTHING;

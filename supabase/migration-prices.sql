-- Migration: Adicionar preços original e promocional
-- Execute no Supabase SQL Editor

-- 1. Adicionar colunas
ALTER TABLE produtos ADD COLUMN preco_original NUMERIC(10,2);
ALTER TABLE produtos ADD COLUMN preco_promocional NUMERIC(10,2);

-- 2. Migrar dados existentes (preco → preco_original)
UPDATE produtos SET preco_original = preco WHERE preco_original IS NULL;

-- 3. Tornar preco_original NOT NULL após migração
ALTER TABLE produtos ALTER COLUMN preco_original SET NOT NULL;

-- 4. Remover coluna antiga (opcional, manter para compatibilidade)
-- ALTER TABLE produtos DROP COLUMN preco;

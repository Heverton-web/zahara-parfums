-- Migration: permitir leitura pública de tracking para o Dashboard
-- Execute no Supabase Dashboard → SQL Editor

-- Remover política antiga de leitura restrita
DROP POLICY IF EXISTS "Admin pode ler tracking" ON tracking;

-- Criar política de leitura pública
CREATE POLICY "Leitura pública de tracking" ON tracking
  FOR SELECT USING (true);

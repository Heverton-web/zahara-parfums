-- Permitir leitura pública de cliques para o Dashboard
DROP POLICY IF EXISTS "Admin vê cliques" ON cliques;
CREATE POLICY "Leitura pública de cliques" ON cliques
  FOR SELECT USING (true);

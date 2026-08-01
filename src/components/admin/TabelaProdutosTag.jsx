import { Loader2, Tag as TagIcon } from 'lucide-react'
import Badge from '../ui/Badge'

export default function TabelaProdutosTag({ tituloTag, produtos = [], loading = false }) {
  return (
    <div className="mt-10 bg-noir-900 rounded-2xl p-4 sm:p-6 border border-gold/15 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory/5">
        <div>
          <h2 className="text-base font-semibold text-ivory flex items-center gap-2">
            <TagIcon size={18} className="text-gold" />
            <span>Produtos com a Tag "{tituloTag}"</span>
          </h2>
          <p className="text-ivory/40 text-xs mt-0.5">
            Estes produtos estão sendo exibidos na seção correspondente do catálogo no frontend.
          </p>
        </div>

        <Badge variant="gold" className="px-2.5 py-1 text-xs">
          {produtos.length} produto(s)
        </Badge>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <Loader2 size={24} className="animate-spin text-gold/50 mx-auto mb-2" />
          <p className="text-ivory/40 text-xs italic">Carregando produtos...</p>
        </div>
      ) : produtos.length === 0 ? (
        <div className="p-8 text-center text-ivory/30 italic text-sm">
          Nenhum produto está vinculado a esta tag no momento.
        </div>
      ) : (
        <>
          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/15 bg-noir-950/60 text-ivory/40 text-[10px] sm:text-xs uppercase tracking-wider font-accent">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Preço Original</th>
                  <th className="p-3 text-right">Preço Promocional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-xs sm:text-sm">
                {produtos.map(produto => {
                  const precoOrig = Number(produto.preco_original) || 0
                  const precoPromo = Number(produto.preco_promocional || produto.preco_em_massa) || null

                  return (
                    <tr key={produto.id} className="hover:bg-noir-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-ivory">{produto.nome}</div>
                      </td>
                      <td className="p-3 text-gold/60 uppercase text-[11px] font-accent">
                        {produto.marcas?.nome || '-'}
                      </td>
                      <td className="p-3 text-ivory/70 whitespace-nowrap">
                        R$ {precoOrig.toFixed(2)}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {precoPromo ? (
                          <span className="text-emerald-400 font-bold">R$ {precoPromo.toFixed(2)}</span>
                        ) : (
                          <span className="text-ivory/30 italic">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-2.5">
            {produtos.map(produto => {
              const precoOrig = Number(produto.preco_original) || 0
              const precoPromo = Number(produto.preco_promocional || produto.preco_em_massa) || null

              return (
                <div key={produto.id} className="p-3.5 rounded-xl bg-noir-950/60 border border-gold/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-ivory">{produto.nome}</h3>
                    {produto.marcas?.nome && (
                      <p className="text-[10px] text-gold/60 uppercase font-accent">{produto.marcas.nome}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-ivory/40 text-[10px] block">R$ {precoOrig.toFixed(2)}</span>
                    {precoPromo ? (
                      <span className="text-emerald-400 text-xs font-bold block">R$ {precoPromo.toFixed(2)}</span>
                    ) : (
                      <span className="text-ivory/30 text-xs italic block">-</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

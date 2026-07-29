export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-gold">Zahara Parfums</h3>
            <p className="text-gray-400 text-sm mt-1">Perfumes importados de qualidade</p>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 Zahara Parfums. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}

const links = [
  { name: "Secretaría Distrital de Ambiente", desc: "Información oficial sobre los humedales de Bogotá", url: "https://www.ambientebogota.gov.co" },
  { name: "Humedales Bogotá", desc: "Portal dedicado a los humedales urbanos de la ciudad", url: "https://humedalesbogota.com" },
  { name: "RAMSAR Colombia", desc: "Convención sobre humedales de importancia internacional", url: "https://www.ramsar.org" },
  { name: "IDEAM", desc: "Instituto de Hidrología, Meteorología y Estudios Ambientales", url: "https://www.ideam.gov.co" },
  { name: "Jardín Botánico de Bogotá", desc: "Investigación y conservación de flora urbana", url: "https://www.jbb.gov.co" }
]

export default function Resources() {
  return (
    <section id="recursos" className="py-20 px-4">
      <h2 className="text-3xl font-bold text-green-300 text-center mb-4">📚 Recursos Oficiales</h2>
      <p className="text-green-100 text-center max-w-xl mx-auto mb-10">
        Aprende más sobre los humedales urbanos con estas fuentes oficiales.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {links.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-green-900/50 hover:bg-green-800/70 p-6 rounded-2xl border border-green-700 transition">
            <h3 className="font-bold text-green-300 mb-2">{link.name}</h3>
            <p className="text-green-100 text-sm">{link.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
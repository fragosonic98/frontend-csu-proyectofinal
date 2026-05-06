/* CidiumLogo.jsx — Logo de la marca
   Usamos el logo en SVG inline para que no dependa de una imagen externa
   y podamos controlar su color fácilmente con CSS */

export default function CidiumLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { img: 24, text: 'text-sm' },
    md: { img: 32, text: 'text-base' },
    lg: { img: 48, text: 'text-xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo circular con iniciales como fallback si no carga la imagen */}
      <img
        src="https://framerusercontent.com/images/c6SGLDqkwbLyayieMJ4UjwldBE.png"
        alt="Cidium"
        width={s.img}
        height={s.img}
        className="rounded-sm object-contain"
        onError={(e) => {
          // Si la imagen falla, mostrar un cuadro con texto
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      {/* Fallback logo */}
      <div
        style={{ display: 'none', width: s.img, height: s.img }}
        className="items-center justify-center rounded bg-blue-600 text-white font-bold text-xs"
      >
        CS
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-semibold text-white ${s.text}`}>Cidium</span>
          <span className="text-xs text-gray-500 -mt-0.5">Security University</span>
        </div>
      )}
    </div>
  )
}

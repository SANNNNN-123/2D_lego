import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center">
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-4 bg-red-500 rounded-sm" style={{ marginTop: i % 2 === 0 ? "8px" : "0" }} />
          ))}
        </div>
        <h1 className="text-xl font-bold ml-3 font-press-start">2D LEGO</h1>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a href="#gallery" className="text-gray-600 hover:text-gray-900 font-press-start">
          Gallery
        </a>
      </nav>
    </header>
  )
}

export function HeroSection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-5xl font-bold mb-6 font-press-start">Build Anything You Imagine</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 font-press-start">
        Create, design, and share your LEGO masterpieces with our intuitive 2D LEGO builder. No physical limitations,
        just pure creativity.
      </p>
      <Link
        href="/builder"
        className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors font-press-start"
      >
        Start Building <ArrowRight className="ml-2 h-5 w-5" />
      </Link>

      <div className="mt-16 relative">
        <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{
                backgroundColor: ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#AF52DE"][i % 6],
                width: "100%",
                height: 0,
                paddingBottom: "100%",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 3px, transparent 3px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "10px 10px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function GallerySection() {
  const galleryItems = [
    { name: "Space Rocket", color: "#FF3B30" },
    { name: "Pixel Art Heart", color: "#FF9500" },
    { name: "City Skyline", color: "#34C759" },
    { name: "Robot Friend", color: "#007AFF" },
    { name: "Flower Garden", color: "#FFCC00" },
    { name: "Abstract Pattern", color: "#AF52DE" },
  ]

  return (
    <section id="gallery" className="py-20 bg-gray-50 -mx-4 px-4">
      <h2 className="text-2xl font-bold text-center mb-16">Community Creations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item, i) => (
          <GalleryItem key={i} name={item.name} color={item.color} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          href="/builder"
          className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors font-press-start"
        >
          Create Your Own <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}

function GalleryItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div
        className="h-48 bg-gray-200"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${color}22, ${color}22 10px, ${color}44 10px, ${color}44 20px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div
            className="w-24 h-24"
            style={{
              backgroundColor: color,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 3px, transparent 3px)",
              backgroundSize: "12px 12px",
              backgroundPosition: "6px 6px",
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg font-press-start">{name}</h3>
        <p className="text-gray-600 text-sm mt-1 font-press-start">Created by LEGO Builder</p>
      </div>
    </div>
  )
}


export function Footer() {
  return (
    <footer className="py-10 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <p className="text-sm text-gray-600 ml-3 font-press-start">© 2025 LEGO Builder.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-press-start">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

// Main HomePage component that combines all sections
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        <HeroSection />
        <GallerySection />
        <Footer />
      </div>
    </div>
  )
}


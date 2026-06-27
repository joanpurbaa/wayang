import HeroSection from '../src/components//HeroSection'
import DalangMode from '../src/components/DalangMode'
import LoreSection from '../src/components/LoreSection'

export default function App() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      <HeroSection />
      <DalangMode />
      <LoreSection />
    </main>
  )
}
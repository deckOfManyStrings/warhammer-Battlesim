import BattleSimulator from '../components/BattleSimulator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Warhammer 40k Battle Simulator</h1>
      <BattleSimulator />
    </main>
  )
}
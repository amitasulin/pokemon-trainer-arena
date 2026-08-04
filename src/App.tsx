import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

const CreateTrainer = lazy(() => import('./pages/CreateTrainer'))
const World = lazy(() => import('./pages/World'))
const Battle = lazy(() => import('./pages/Battle'))
const Profile = lazy(() => import('./pages/Profile'))
const Pokedex = lazy(() => import('./pages/Pokedex'))
const Settings = lazy(() => import('./pages/Settings'))

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0b0f1a]">
      <div className="text-5xl animate-pokeball">🔴</div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trainer" element={<CreateTrainer />} />
        <Route path="/world" element={<World />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
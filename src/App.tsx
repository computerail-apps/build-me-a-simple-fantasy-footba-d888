import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Nav } from '@/lib/ui/Nav';
import { Button } from '@/lib/ui/Button';
import { Trophy } from 'lucide-react';
import Home from '@/pages/Home';
import League from '@/pages/League';
import Roster from '@/pages/Roster';

function TopNav() {
  const navigate = useNavigate();
  return (
    <Nav
      brand={
        <Button variant="ghost" size="sm" className="gap-2 px-0 text-foreground hover:bg-transparent" onClick={() => navigate('/')}>
          <Trophy size={18} />
          GridironTrack
        </Button>
      }
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <TopNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/league/:leagueId" element={<League />} />
            <Route path="/league/:leagueId/roster/:rosterId" element={<Roster />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

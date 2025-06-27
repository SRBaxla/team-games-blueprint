import { Toaster } from "sonner"; // ✅ Import this
import TopBannerAd from '../components/ui/TopBannerAd';
import BottomBannerAd from '../components/ui/BottomBannerAd';
import LeftRail from '../components/ui/LeftRail';
import RightRail from '../components/ui/RightRail';
import GameWindow from '../components/GameWindow';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white grid grid-rows-[auto_1fr_auto]">
      <Toaster position="top-center" richColors /> {/* ✅ Place toaster at root */}

      <TopBannerAd />

      <div className="grid grid-cols-[200px_1fr_200px] h-full">
        <LeftRail />
        <GameWindow />
        <RightRail />
      </div>

      <BottomBannerAd />
    </div>
  );
}

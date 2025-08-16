import TapOneGame from '@/components/TapOneGame';

export default function TapOnePage() {
  return (
    <>
      {/* Remove top padding (was creating gap with global navbar); keep bottom spacing only */}
      <div className="min-h-screen pb-8">
        <TapOneGame />
      </div>
    </>
  );
}

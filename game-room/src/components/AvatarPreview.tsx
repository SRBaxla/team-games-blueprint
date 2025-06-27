import type { AvatarData } from '@/types/avatar';
import clsx from 'clsx';

interface Props {
  data: AvatarData;
}

export default function AvatarPreview({ data }: Props) {
  return (
    <div
      className={clsx(
        'w-24 h-24 rounded-full mx-auto mt-4 transition-all',
        data.animation === 'bounce' && 'animate-bounce',
        data.animation === 'victory' && 'animate-pulse'
      )}
      style={{ backgroundColor: data.color }}
    >
      <p className="text-center text-white text-sm">{data.name}</p>
    </div>
  );
}

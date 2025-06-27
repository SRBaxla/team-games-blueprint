'use client';

import AvatarForm from '@/components/AvatarForm';
import { useRouter } from 'next/navigation';
import type { AvatarData } from '@/types/avatar';

export default function CustomizePage() {
  const router = useRouter();

  const handleSave = (avatar: AvatarData) => {
    localStorage.setItem('avatar', JSON.stringify(avatar));
    router.push('/lobby');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Customize Your Avatar</h1>
      <AvatarForm onSave={handleSave} />
    </div>
  );
}

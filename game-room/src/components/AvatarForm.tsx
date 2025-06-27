import { useState } from 'react';
import type { AvatarData } from '@/types/avatar';
import AvatarPreview from './AvatarPreview';

interface Props {
  onSave: (data: AvatarData) => void;
}

const defaultAvatar: AvatarData = {
  name: '',
  color: '#4f46e5',
  outfit: 'casual',
  accessory: 'none',
  animation: 'idle',
};

export default function AvatarForm({ onSave }: Props) {
  const [avatar, setAvatar] = useState<AvatarData>(defaultAvatar);

  const update = (key: keyof AvatarData, value: any) =>
    setAvatar({ ...avatar, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <input
        className="input"
        placeholder="Enter name"
        value={avatar.name}
        onChange={(e) => update('name', e.target.value)}
      />

      <label>Color</label>
      <input type="color" value={avatar.color} onChange={(e) => update('color', e.target.value)} />

      <label>Outfit</label>
      <select value={avatar.outfit} onChange={(e) => update('outfit', e.target.value as any)}>
        <option value="casual">Casual</option>
        <option value="ninja">Ninja</option>
        <option value="space">Space</option>
      </select>

      <label>Accessory</label>
      <select value={avatar.accessory} onChange={(e) => update('accessory', e.target.value as any)}>
        <option value="none">None</option>
        <option value="hat">Hat</option>
        <option value="glasses">Glasses</option>
      </select>

      <label>Animation</label>
      <select value={avatar.animation} onChange={(e) => update('animation', e.target.value as any)}>
        <option value="idle">Idle</option>
        <option value="bounce">Bounce</option>
        <option value="victory">Victory</option>
      </select>

      <AvatarPreview data={avatar} />

      <button className="btn" onClick={() => onSave(avatar)}>Save Avatar</button>
    </div>
  );
}

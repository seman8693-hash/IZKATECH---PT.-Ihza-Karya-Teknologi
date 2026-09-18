import React, { useState } from 'react';
import { Upload, ImageOff, Loader2, AlertCircle } from 'lucide-react';
import { getCustomLogo, setCustomLogo, removeCustomLogo } from '../../data/adminStore';

interface SettingsTabProps {
  onLogoUpdated: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onLogoUpdated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const existingLogo = getCustomLogo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar (maksimal 5 MB).');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar (PNG, JPG, SVG, WebP) yang diperbolehkan.');
      return;
    }
    setError(null);
    setFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string | null;
      if (result) {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!file) {
      setError('Pilih file logo terlebih dahulu.');
      return;
    }
    setSaving(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setCustomLogo(preview!);
    setFile(null);
    setPreview(null);
    if (onLogoUpdated) onLogoUpdated();
    setSaving(false);
  };

  const handleRemove = async () => {
    if (!existingLogo) return;
    setRemoving(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 250));
    removeCustomLogo();
    setPreview(null);
    if (onLogoUpdated) onLogoUpdated();
    setRemoving(false);
  };

  const isDefault = !existingLogo;

// src/pages/TrainerProfile.jsx
import { useState, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function TrainerProfile() {
  const { trainer } = useAuth();
  const { profile, status, updateProfile } = useProfile();

  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');

  const [avatarError, setAvatarError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!profile) return;
    setAvatarDataUrl(profile.avatarDataUrl);
    setBio(profile.bio);
    setSpecialty(profile.specialty);
    setPhone(profile.phone);
  }, [profile]);

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError('A imagem deve ter no máximo 2MB.');
      return;
    }

    setAvatarError(null);

    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result);
    reader.onerror = () => setAvatarError('Não foi possível carregar a imagem selecionada.');
    reader.readAsDataURL(file);

    event.target.value = '';
  }

  function handleRemoveAvatar() {
    setAvatarDataUrl(null);
    setAvatarError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await updateProfile({ avatarDataUrl, bio, specialty, phone });
      setSuccessMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'loading' || !profile) {
    return <LoadingSpinner label="Carregando perfil..." />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-slate-800">Painel do Treinador</h2>
        <p className="text-sm text-slate-500">Gerencie sua foto e informações de perfil</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6">
        <div aria-live="polite" aria-atomic="true">
          {submitError && (
            <div role="alert" className="mb-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        <section aria-labelledby="avatar-heading" className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <h3 id="avatar-heading" className="sr-only">
            Foto de perfil
          </h3>

          <div className="relative">
            {avatarDataUrl ? (
              <img
                src={avatarDataUrl}
                alt={`Foto de perfil de ${trainer?.name || 'treinador'}`}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-semibold text-emerald-700">
                {(trainer?.name || 'T').charAt(0).toUpperCase()}
              </span>
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700"
            >
              <Camera size={16} aria-hidden="true" />
              <span className="sr-only">Alterar foto de perfil</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
            />
          </div>

          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm font-medium text-slate-700">Foto de perfil</p>
            <p className="text-xs text-slate-500">JPG ou PNG, até 2MB</p>
            {avatarDataUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remover foto
              </button>
            )}
            {avatarError && (
              <p role="alert" className="text-xs text-red-600">
                {avatarError}
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="account-heading" className="flex flex-col gap-1 rounded-lg bg-slate-50 p-4">
          <h3 id="account-heading" className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User size={16} aria-hidden="true" />
            Dados da conta
          </h3>
          <p className="text-sm text-slate-600">{trainer?.name}</p>
          <p className="text-sm text-slate-500">{trainer?.email}</p>
        </section>

        <div>
          <label htmlFor="profile-specialty" className="mb-1 block text-sm font-medium text-slate-700">
            Especialidade
          </label>
          <input
            id="profile-specialty"
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Ex: Hipertrofia, Emagrecimento, Reabilitação..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="mb-1 block text-sm font-medium text-slate-700">
            Telefone / WhatsApp
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div>
          <label htmlFor="profile-bio" className="mb-1 block text-sm font-medium text-slate-700">
            Descrição do perfil
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre sua experiência, formação e forma de trabalho..."
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  );
}
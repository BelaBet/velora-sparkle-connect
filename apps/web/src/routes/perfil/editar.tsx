import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@velora/ui";
import { RequireMember } from "@/components/auth/require-member";
import { getOwnProfile, updateOwnProfileDetails, uploadOwnPhoto } from "@/lib/member-auth";

export const Route = createFileRoute("/perfil/editar")({
  head: () => ({
    meta: [{ title: "Velora — Editar perfil" }],
  }),
  component: PerfilEditar,
});

function PerfilEditar() {
  return (
    <RequireMember>
      <AppShell activeTab="Descobrir" activeBottom="Perfil">
        <PerfilEditarContent />
      </AppShell>
    </RequireMember>
  );
}

function PerfilEditarContent() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    void getOwnProfile().then((profile) => {
      setName(profile?.name ?? "");
      setPhotoUrl(profile?.photoUrl ?? null);
      setBio(profile?.bio ?? "");
      setInterests((profile?.interests ?? []).join(", "));
      setLoading(false);
    });
  }, []);

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
    setUploadingPhoto(true);
    const error = await uploadOwnPhoto(file);
    setUploadingPhoto(false);
    if (error) {
      toast("Não foi possível enviar a foto", { description: error });
      return;
    }
    const profile = await getOwnProfile();
    setPhotoUrl(profile?.photoUrl ?? null);
    toast("Foto atualizada");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const interestList = interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const error = await updateOwnProfileDetails(bio.trim(), interestList);
    setSaving(false);
    if (error) {
      toast("Não foi possível salvar", { description: error });
      return;
    }
    toast("Perfil atualizado");
    void navigate({ to: "/perfil" });
  };

  if (loading) {
    return <p className="px-6 py-8 text-[13px] text-muted-foreground">Carregando…</p>;
  }

  return (
    <div className="px-6 py-8">
      <p className="text-eyebrow">Descoberta</p>
      <h1 className="mt-3 font-display text-3xl text-ivory">Editar perfil</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        É isso que outros membros veem no seu card no Descobrir.
      </p>

      <div className="mt-8 flex items-center gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-charcoal">
            <span className="font-display text-3xl text-champagne/40">{name.charAt(0)}</span>
          </div>
        )}
        <div>
          <button
            type="button"
            disabled={uploadingPhoto}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-champagne px-4 py-2 text-[13px] uppercase tracking-[0.1em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            {uploadingPhoto ? "Enviando…" : "Trocar foto"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handlePhotoChange(e.target.files?.[0])}
          />
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
          Bio
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Uma frase sobre você"
            className="resize-none rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] text-pearl">
          Interesses
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Gastronomia, viagens, música"
            className="rounded-lg surface-glass px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
          />
          <span className="text-[12px] text-muted-foreground">Separe por vírgulas.</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full border border-champagne py-2.5 text-[13px] uppercase tracking-[0.14em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

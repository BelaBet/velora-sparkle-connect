import { useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequireAdmin } from "@/components/admin/require-admin";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  useAdminExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  uploadExperiencePhoto,
  type AdminExperience,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/experiencias")({
  head: () => ({
    meta: [{ title: "Velora Admin — Experiências" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminExperiencias,
});

function AdminExperiencias() {
  return (
    <RequireAdmin>
      <AdminShell active="Experiências">
        <ExperienciasContent />
      </AdminShell>
    </RequireAdmin>
  );
}

function ExperienciasContent() {
  const { data: experiences, isLoading, isError } = useAdminExperiences();

  return (
    <>
      <p className="text-eyebrow">Curadoria</p>
      <h2 className="mt-3 font-display text-3xl text-ivory">Experiências</h2>

      <NewExperienceForm />

      {isLoading && (
        <p className="mt-8 text-[13px] text-muted-foreground">Carregando experiências…</p>
      )}
      {isError && (
        <p className="mt-8 text-[13px] text-destructive">
          Não foi possível carregar as experiências.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {experiences?.map((exp) => (
          <ExperienceRow key={exp.id} experience={exp} />
        ))}
      </div>
    </>
  );
}

function NewExperienceForm() {
  const createExperience = useCreateExperience();
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createExperience.mutate(
      { title, venue, city, detail },
      {
        onSuccess: () => {
          toast("Experiência criada", { description: title });
          setTitle("");
          setVenue("");
          setCity("");
          setDetail("");
        },
        onError: () => toast("Não foi possível criar a experiência"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 rounded-lg surface-glass p-5">
      <p className="text-[13px] uppercase tracking-[0.1em] text-champagne">Nova experiência</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
        />
        <input
          required
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Local"
          className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
        />
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Cidade"
          className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
        />
        <input
          required
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Descrição"
          className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none placeholder:text-muted-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={createExperience.isPending}
        className="mt-1 self-start rounded-full border border-champagne px-4 py-2 text-[13px] uppercase tracking-[0.1em] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
      >
        {createExperience.isPending ? "Criando…" : "Adicionar"}
      </button>
    </form>
  );
}

function ExperienceRow({ experience }: { experience: AdminExperience }) {
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(experience.title);
  const [venue, setVenue] = useState(experience.venue);
  const [city, setCity] = useState(experience.city);
  const [detail, setDetail] = useState(experience.detail);

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const error = await uploadExperiencePhoto(experience.id, file);
    setUploading(false);
    if (error) {
      toast("Não foi possível enviar a foto", { description: error });
      return;
    }
    toast("Foto atualizada", { description: experience.title });
  };

  const handleSave = () => {
    updateExperience.mutate(
      { id: experience.id, title, venue, city, detail },
      {
        onSuccess: () => toast("Experiência atualizada", { description: title }),
        onError: () => toast("Não foi possível salvar"),
      },
    );
  };

  const handleDelete = () => {
    deleteExperience.mutate(experience.id, {
      onSuccess: () => toast("Experiência removida", { description: experience.title }),
      onError: () => toast("Não foi possível remover"),
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg surface-glass p-5 sm:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-2">
        {experience.imageUrl ? (
          <img
            src={experience.imageUrl}
            alt={experience.title}
            width={120}
            height={80}
            className="h-20 w-[120px] rounded-md object-cover"
          />
        ) : (
          <div className="flex h-20 w-[120px] items-center justify-center rounded-md bg-charcoal text-[11px] text-muted-foreground">
            Sem foto
          </div>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-[12px] text-champagne underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          {uploading ? "Enviando…" : "Trocar foto"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handlePhotoChange(e.target.files?.[0])}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none"
          />
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none"
          />
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="rounded-lg bg-charcoal px-4 py-2.5 text-[14px] text-ivory outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={updateExperience.isPending}
            onClick={handleSave}
            className="rounded-full border border-champagne px-4 py-1.5 text-[13px] text-champagne transition-velora hover:bg-champagne/10 disabled:pointer-events-none disabled:opacity-40"
          >
            Salvar
          </button>
          <button
            type="button"
            disabled={deleteExperience.isPending}
            onClick={handleDelete}
            className="text-[13px] text-destructive underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

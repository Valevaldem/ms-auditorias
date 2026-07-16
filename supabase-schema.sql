-- Crear tabla de auditorías
create table auditorias (
  id          uuid default gen_random_uuid() primary key,
  asesora     text not null,
  canal       text not null,
  semana      text not null,
  mes         text not null,          -- formato: "2025-07"
  respuestas  jsonb not null,
  score       integer,
  notas       text,
  auditora    text,                   -- quien hizo la auditoría (no se muestra en impresión)
  created_at  timestamptz default now()
);

-- Índices para filtros rápidos
create index auditorias_mes_idx     on auditorias(mes);
create index auditorias_asesora_idx on auditorias(asesora);
create index auditorias_created_idx on auditorias(created_at desc);

-- Habilitar acceso público (sin RLS por ahora - protegido por password en la app)
alter table auditorias enable row level security;

create policy "acceso_publico" on auditorias
  for all using (true) with check (true);

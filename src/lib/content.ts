import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Episode, Character, GlossaryTerm, Metadata } from '@/types';

function loadYaml<T>(filename: string): T {
  const filePath = path.join(process.cwd(), '..', 'content', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as T;
}

export function loadEpisodes(): Episode[] {
  const data = loadYaml<{ episodes: Episode[] }>('episodes.yaml');
  return data.episodes;
}

export function loadCharacters(): Character[] {
  const data = loadYaml<{ characters: any[] }>('characters.yaml');
  return data.characters.map(c => ({
    id: c.id === 'professor_chen' ? 'profchen' : c.id,
    name_zh: c.name_zh,
    name_en: c.name_en,
    role: c.role,
    age: c.age,
    personality: c.personality,
    color: c.color,
    quote: c.quote,
    avatar: c.avatar,
    background: c.background?.trim() || '',
  }));
}

export function loadGlossary(week?: number): GlossaryTerm[] {
  const data = loadYaml<{ glossary: GlossaryTerm[] }>('glossary.yaml');
  if (week !== undefined) {
    return data.glossary.filter(t => t.first_week <= week);
  }
  return data.glossary;
}

export function loadMetadata(): Metadata {
  return loadYaml<Metadata>('metadata.yaml');
}

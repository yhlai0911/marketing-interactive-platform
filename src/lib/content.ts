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
    id: c.id === 'prof_lin' ? 'profLin' : c.id,
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
  const data = loadYaml<{ terms: { zh: string; en: string; definition: string; first_week: number }[] }>('glossary.yaml');
  const terms: GlossaryTerm[] = (data.terms || []).map(t => ({
    term_zh: t.zh,
    term_en: t.en,
    definition: t.definition,
    first_week: t.first_week,
  }));
  if (week !== undefined) {
    return terms.filter(t => t.first_week <= week);
  }
  return terms;
}

export function loadMetadata(): Metadata {
  return loadYaml<Metadata>('metadata.yaml');
}

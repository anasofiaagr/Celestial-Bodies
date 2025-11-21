// evolvingTemplates.ts
// Templates for Evolving View - poetic, non-deterministic expressions of placements

import type { Template } from './SentenceEngine';

export const evolvingTemplates: Template[] = [
  // PRIMARY TEMPLATES - For main seed generation
  {
    id: 'evolving_primary_01',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: '{{planet.archetype_figure_name}} moving through {{sign.name}}—a way of being that keeps shifting, never quite settled.',
    variables: ['planet.archetype_figure_name', 'sign.name']
  },
  {
    id: 'evolving_primary_02',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: 'In {{house.name}}, {{planet.name}} becomes {{sign.fusion_label}}: neither fixed nor final, just a tendency you keep revisiting.',
    variables: ['house.name', 'planet.name', 'sign.fusion_label']
  },
  {
    id: 'evolving_primary_03',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: '{{planet.essence}} filtered through {{sign.essence}}—this is how you {{house.keywords.0}}, when no one is watching.',
    variables: ['planet.essence', 'sign.essence', 'house.keywords.0']
  },
  {
    id: 'evolving_primary_04',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: 'Sometimes {{planet.archetype_figure_name}} moves like {{sign.visual_mappings.motion}}, gathering around {{house.essence}}—gentle, persistent, unstable.',
    variables: ['planet.archetype_figure_name', 'sign.visual_mappings.motion', 'house.essence']
  },
  {
    id: 'evolving_primary_05',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: '{{sign.fusion_label}} in {{house.name}}: {{planet.keywords.0}} without conclusion, {{planet.keywords.1}} without permission.',
    variables: ['sign.fusion_label', 'house.name', 'planet.keywords.0', 'planet.keywords.1']
  },
  {
    id: 'evolving_primary_06',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: 'Here, {{planet.name}} becomes {{sign.fusion_label}}—neither archetype nor escape, just the way {{house.keywords.0}} feels when you\'re not trying.',
    variables: ['planet.name', 'sign.fusion_label', 'house.keywords.0']
  },
  {
    id: 'evolving_primary_07',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: 'In the field of {{house.essence}}, {{planet.archetype_figure_name}} touches {{sign.essence}}—a gesture that repeats, evolves, refuses to harden.',
    variables: ['house.essence', 'planet.archetype_figure_name', 'sign.essence']
  },
  {
    id: 'evolving_primary_08',
    context: 'evolving_view',
    role: 'primary',
    weights: 1,
    text: '{{planet.essence}} meets {{sign.visual_mappings.texture}} in {{house.name}}—this is what {{planet.keywords.0}} looks like when it\'s learning.',
    variables: ['planet.essence', 'sign.visual_mappings.texture', 'house.name', 'planet.keywords.0']
  },

  // CUE TEMPLATES - For regeneration variations
  {
    id: 'evolving_cue_01',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{planet.name}} in {{sign.name}}: {{planet.keywords.0}}, {{planet.keywords.1}}, but never the same way twice.',
    variables: ['planet.name', 'sign.name', 'planet.keywords.0', 'planet.keywords.1']
  },
  {
    id: 'evolving_cue_02',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{sign.fusion_label}} coloring {{house.name}}—a mood that {{planet.archetype_figure_name}} keeps returning to, reshaping.',
    variables: ['sign.fusion_label', 'house.name', 'planet.archetype_figure_name']
  },
  {
    id: 'evolving_cue_03',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: 'This is where {{planet.essence}} becomes {{sign.visual_mappings.motion}}—in {{house.name}}, identity stays fluid.',
    variables: ['planet.essence', 'sign.visual_mappings.motion', 'house.name']
  },
  {
    id: 'evolving_cue_04',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{planet.archetype_figure_name}} through {{sign.fusion_label}}: not a destiny, just a way {{house.keywords.0}} keeps unfolding.',
    variables: ['planet.archetype_figure_name', 'sign.fusion_label', 'house.keywords.0']
  },
  {
    id: 'evolving_cue_05',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: 'In {{house.name}}, {{sign.essence}} touches {{planet.essence}}—provisional, alive, never fixed.',
    variables: ['house.name', 'sign.essence', 'planet.essence']
  },
  {
    id: 'evolving_cue_06',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{planet.keywords.0}} as {{sign.fusion_label}}—this placement doesn\'t define you, it just keeps happening.',
    variables: ['planet.keywords.0', 'sign.fusion_label']
  },
  {
    id: 'evolving_cue_07',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{planet.archetype_figure_name}} in {{house.essence}}: {{sign.visual_mappings.rhythm}}, always beginning again.',
    variables: ['planet.archetype_figure_name', 'house.essence', 'sign.visual_mappings.rhythm']
  },
  {
    id: 'evolving_cue_08',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: 'Where {{house.keywords.0}} meets {{sign.name}}—{{planet.name}} moves through, leaving traces but no verdict.',
    variables: ['house.keywords.0', 'sign.name', 'planet.name']
  },
  {
    id: 'evolving_cue_09',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{sign.fusion_label}} shapes {{planet.essence}} in {{house.name}}—a tendency, not a trap.',
    variables: ['sign.fusion_label', 'planet.essence', 'house.name']
  },
  {
    id: 'evolving_cue_10',
    context: 'evolving_view',
    role: 'cue',
    weights: 1,
    text: '{{planet.archetype_figure_name}} as {{sign.visual_mappings.motion}}—in {{house.name}}, this is how {{planet.keywords.0}} feels today.',
    variables: ['planet.archetype_figure_name', 'sign.visual_mappings.motion', 'house.name', 'planet.keywords.0']
  }
];
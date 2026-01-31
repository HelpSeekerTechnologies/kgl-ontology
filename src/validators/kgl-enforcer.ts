/**
 * KGL 1.3 ENFORCER
 *
 * Validates all KGL mappings against the canonical KGL v1.3 specification.
 * Run this BEFORE committing any code that touches KGL properties.
 *
 * Usage:
 *   npx ts-node src/validators/kgl-enforcer.ts [--fix] [--neo4j]
 */

import { KGL_NODES } from '../ontology/canonicalOntology';

// ============================================================================
// KGL v1.3 CANONICAL REFERENCE (45 Nodes)
// ============================================================================

export const KGL_V1_3_NODES: Record<string, { glyph: string; category: string; description: string }> = {
  // Domain Nodes (5)
  'kompas':       { glyph: '✵', category: 'Domain', description: 'Meta domain' },
  'navigi':       { glyph: '✶', category: 'Domain', description: 'Help-seeker access' },
  'mareto':       { glyph: '✷', category: 'Domain', description: 'Service delivery' },
  'karto':        { glyph: '✸', category: 'Domain', description: 'Analysis and insight' },
  'volto':        { glyph: '✹', category: 'Domain', description: 'Outcomes and value' },

  // Central Nodes (4)
  'resource':     { glyph: '◉', category: 'Central', description: 'Available assets, funding, money' },
  'person':       { glyph: '◎', category: 'Central', description: 'Individual being served, client' },
  'insight':      { glyph: '⊙', category: 'Central', description: 'Analytical finding, pattern' },
  'outcome':      { glyph: '◯', category: 'Central', description: 'Result achieved, impact' },

  // Context Nodes (4)
  'program':      { glyph: '▣', category: 'Context', description: 'Structured service offering' },
  'case':         { glyph: '■', category: 'Context', description: 'Container for service journey' },
  'story':        { glyph: '▦', category: 'Context', description: 'Narrative container' },
  'purpose':      { glyph: '□', category: 'Context', description: 'Strategic intent, mission' },

  // Content - Temporal/Structural (4)
  'event':        { glyph: '⧫', category: 'Content-Temporal', description: 'Significant occurrence' },
  'timeframe':    { glyph: '⟲', category: 'Content-Temporal', description: 'Period, duration' },
  'organization': { glyph: 'ᚴ', category: 'Content-Temporal', description: 'Agency, institution, provider' },
  'geography':    { glyph: 'ᚪ', category: 'Content-Temporal', description: 'Location, region, territory' },

  // Content - Operational (6)
  'action':       { glyph: '↟', category: 'Content-Operational', description: 'General operation' },
  'activity':     { glyph: '↥', category: 'Content-Operational', description: 'Discrete tracked action' },
  'service':      { glyph: 'ᚼ', category: 'Content-Operational', description: 'Delivered intervention' },
  'task':         { glyph: '▪', category: 'Content-Operational', description: 'Discrete work item' },
  'project':      { glyph: 'ᚳ', category: 'Content-Operational', description: 'Program element' },
  'initiative':   { glyph: 'ᐯ', category: 'Content-Operational', description: 'Strategic effort' },

  // Content - Dynamics (8)
  'need':         { glyph: 'ϫ', category: 'Content-Dynamics', description: 'Requirement, gap' },
  'risk':         { glyph: 'Ϫ', category: 'Content-Dynamics', description: 'Probability of harm' },
  'acuity':       { glyph: '⋁', category: 'Content-Dynamics', description: 'Intensity, severity' },
  'target':       { glyph: '✽', category: 'Content-Dynamics', description: 'Specific objective, KPI' },
  'goal':         { glyph: '✹', category: 'Content-Dynamics', description: 'Strategic objective' },
  'driver':       { glyph: '⟰', category: 'Content-Dynamics', description: 'Causal force' },
  'authority':    { glyph: '✠', category: 'Content-Dynamics', description: 'Decision-making power' },
  'issue':        { glyph: 'ϩ', category: 'Content-Dynamics', description: 'Problem, concern' },

  // Content - Data/Measurement (7)
  'measurement':  { glyph: '⟡', category: 'Content-Data', description: 'Assessment, evaluation' },
  'indicator':    { glyph: '✼', category: 'Content-Data', description: 'Metric signal, KPI' },
  'record':       { glyph: '⟦', category: 'Content-Data', description: 'Database row or file' },
  'model':        { glyph: '꩜', category: 'Content-Data', description: 'Statistical logic' },
  'data':         { glyph: '⌖', category: 'Content-Data', description: 'Raw information' },
  'artifact':     { glyph: 'ᚠ', category: 'Content-Data', description: 'Produced output, report' },
  'complexity':   { glyph: '꩝', category: 'Content-Data', description: 'Complexity measure' },

  // Modifier Nodes (7)
  'type':           { glyph: 'Ϡ', category: 'Modifier', description: 'Classification' },
  'status':         { glyph: 'Ͼ', category: 'Modifier', description: 'Phase or standing' },
  'condition':      { glyph: 'ϟ', category: 'Modifier', description: 'Temporary state' },
  'characteristic': { glyph: 'ϡ', category: 'Modifier', description: 'Trait' },
  'role':           { glyph: '☨', category: 'Modifier', description: 'Functional relation' },
  'capacity':       { glyph: '⋀', category: 'Modifier', description: 'Ability or intensity' },
  'limitation':     { glyph: 'ᚾ', category: 'Modifier', description: 'Constraint' },
};

// Build reverse lookup: glyph -> handle
export const GLYPH_TO_HANDLE: Record<string, string> = {};
for (const [handle, node] of Object.entries(KGL_V1_3_NODES)) {
  GLYPH_TO_HANDLE[node.glyph] = handle;
}

// ============================================================================
// INVALID GLYPHS/HANDLES (Common mistakes to catch)
// ============================================================================

export const INVALID_MAPPINGS: Record<string, string> = {
  // Wrong glyphs that don't exist in KGL v1.3
  '⌘': 'Use ᚪ (geography) instead',
  '⊕': 'Use ⟡ (measurement) instead',
  '⊞': 'Use ⌖ (data) instead',
  '⚖': 'Use ⟦ (record) or ᚠ (artifact) instead',
  '⊛': 'Use ᚴ (organization) instead',
  '◈': 'Use ⊙ (insight) instead',
  '⎔': 'Use ▣ (program) instead',
  'ᛉ': 'Use ◎ (person) instead',
  '⊡': 'Not in KGL v1.3 - use appropriate node',

  // Wrong handles
  'location': 'Use geography instead',
  'metric': 'Use measurement instead',
  'dataset': 'Use data instead',
  'evidence': 'Use record or artifact instead',
  'asset': 'Use organization instead',
  'category': 'Use type instead for classification, or indicator for KPIs',
  'context': 'Not in KGL v1.3 - use case, story, or program',
};

// ============================================================================
// ENFORCER CLASS
// ============================================================================

export interface ValidationError {
  type: 'invalid_glyph' | 'invalid_handle' | 'mismatch' | 'unknown';
  message: string;
  found: string;
  expected?: string;
  location?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  stats: {
    nodesChecked: number;
    errorsFound: number;
    warningsFound: number;
  };
}

export class KGLEnforcer {

  /**
   * Validate a glyph against KGL v1.3
   */
  validateGlyph(glyph: string): { valid: boolean; error?: string; handle?: string } {
    if (INVALID_MAPPINGS[glyph]) {
      return { valid: false, error: `Invalid glyph '${glyph}': ${INVALID_MAPPINGS[glyph]}` };
    }

    const handle = GLYPH_TO_HANDLE[glyph];
    if (!handle) {
      return { valid: false, error: `Unknown glyph '${glyph}' - not in KGL v1.3` };
    }

    return { valid: true, handle };
  }

  /**
   * Validate a handle against KGL v1.3
   */
  validateHandle(handle: string): { valid: boolean; error?: string; glyph?: string } {
    if (INVALID_MAPPINGS[handle]) {
      return { valid: false, error: `Invalid handle '${handle}': ${INVALID_MAPPINGS[handle]}` };
    }

    const node = KGL_V1_3_NODES[handle];
    if (!node) {
      return { valid: false, error: `Unknown handle '${handle}' - not in KGL v1.3` };
    }

    return { valid: true, glyph: node.glyph };
  }

  /**
   * Validate a glyph-handle pair
   */
  validatePair(glyph: string, handle: string): { valid: boolean; error?: string } {
    const node = KGL_V1_3_NODES[handle];

    if (!node) {
      return { valid: false, error: `Unknown handle '${handle}'` };
    }

    if (node.glyph !== glyph) {
      return {
        valid: false,
        error: `Glyph mismatch for '${handle}': found '${glyph}', expected '${node.glyph}'`
      };
    }

    return { valid: true };
  }

  /**
   * Validate an array of KGL mappings
   */
  validateMappings(mappings: Array<{ glyph: string; handle: string; label?: string }>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    for (const mapping of mappings) {
      // Check if glyph is invalid
      if (INVALID_MAPPINGS[mapping.glyph]) {
        errors.push({
          type: 'invalid_glyph',
          message: INVALID_MAPPINGS[mapping.glyph],
          found: mapping.glyph,
          location: mapping.label,
        });
        continue;
      }

      // Check if handle is invalid
      if (INVALID_MAPPINGS[mapping.handle]) {
        errors.push({
          type: 'invalid_handle',
          message: INVALID_MAPPINGS[mapping.handle],
          found: mapping.handle,
          location: mapping.label,
        });
        continue;
      }

      // Check if pair matches
      const pairResult = this.validatePair(mapping.glyph, mapping.handle);
      if (!pairResult.valid) {
        errors.push({
          type: 'mismatch',
          message: pairResult.error!,
          found: `${mapping.glyph} ${mapping.handle}`,
          expected: `${KGL_V1_3_NODES[mapping.handle]?.glyph || '?'} ${mapping.handle}`,
          location: mapping.label,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        nodesChecked: mappings.length,
        errorsFound: errors.length,
        warningsFound: warnings.length,
      },
    };
  }

  /**
   * Get the correct glyph for a handle
   */
  getCorrectGlyph(handle: string): string | null {
    return KGL_V1_3_NODES[handle]?.glyph || null;
  }

  /**
   * Get the correct handle for a glyph
   */
  getCorrectHandle(glyph: string): string | null {
    return GLYPH_TO_HANDLE[glyph] || null;
  }

  /**
   * Suggest correct mapping for a domain label
   */
  suggestMapping(domainLabel: string): { handle: string; glyph: string } | null {
    const lower = domainLabel.toLowerCase();

    // Direct matches
    if (KGL_V1_3_NODES[lower]) {
      return { handle: lower, glyph: KGL_V1_3_NODES[lower].glyph };
    }

    // Common domain label -> KGL mappings
    const suggestions: Record<string, string> = {
      'geography': 'geography',
      'location': 'geography',
      'place': 'geography',
      'region': 'geography',
      'person': 'person',
      'client': 'person',
      'user': 'person',
      'individual': 'person',
      'organization': 'organization',
      'org': 'organization',
      'agency': 'organization',
      'provider': 'organization',
      'facility': 'organization',
      'healthcarefacility': 'organization',
      'program': 'program',
      'service': 'service',
      'socialservice': 'service',
      'intervention': 'service',
      'event': 'event',
      'encounter': 'event',
      'healthencounter': 'event',
      'appointment': 'event',
      'measurement': 'measurement',
      'healthmeasurement': 'measurement',
      'assessment': 'measurement',
      'indicator': 'indicator',
      'kpi': 'indicator',
      'metric': 'measurement',
      'outcome': 'outcome',
      'result': 'outcome',
      'impact': 'outcome',
      'grant': 'resource',
      'funding': 'resource',
      'benefit': 'resource',
      'payment': 'resource',
      'money': 'resource',
      'timeframe': 'timeframe',
      'period': 'timeframe',
      'duration': 'timeframe',
      'record': 'record',
      'validation': 'record',
      'datasource': 'data',
      'data': 'data',
      'dataset': 'data',
      'context': 'case', // Context isn't in KGL v1.3, suggest case
      'case': 'case',
      'issue': 'issue',
      'problem': 'issue',
      'risk': 'risk',
      'need': 'need',
      'goal': 'goal',
      'target': 'target',
      'type': 'type',
      'tpurposetype': 'type',
      'category': 'type',
    };

    const suggestedHandle = suggestions[lower];
    if (suggestedHandle && KGL_V1_3_NODES[suggestedHandle]) {
      return { handle: suggestedHandle, glyph: KGL_V1_3_NODES[suggestedHandle].glyph };
    }

    return null;
  }

  /**
   * Print canonical KGL v1.3 reference
   */
  printReference(): void {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║              KGL v1.3 CANONICAL REFERENCE                     ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║ Glyph │ Handle          │ Category            │ Description  ║');
    console.log('╠═══════╪═════════════════╪═════════════════════╪══════════════╣');

    for (const [handle, node] of Object.entries(KGL_V1_3_NODES)) {
      const g = node.glyph.padEnd(5);
      const h = handle.padEnd(15);
      const c = node.category.padEnd(19);
      const d = node.description.substring(0, 12);
      console.log(`║ ${g} │ ${h} │ ${c} │ ${d}... ║`);
    }

    console.log('╚═══════════════════════════════════════════════════════════════╝');
  }
}

// ============================================================================
// CLI RUNNER
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const enforcer = new KGLEnforcer();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
KGL v1.3 Enforcer - Validate KGL mappings

Usage:
  npx ts-node src/validators/kgl-enforcer.ts [options]

Options:
  --reference    Print the canonical KGL v1.3 reference
  --neo4j        Validate Neo4j database (requires connection)
  --fix          Auto-fix invalid mappings (with --neo4j)
  --help         Show this help
`);
    return;
  }

  if (args.includes('--reference')) {
    enforcer.printReference();
    return;
  }

  // Validate the internal ontology matches KGL v1.3
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('KGL v1.3 ENFORCER - Validating Internal Ontology');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const mappings = KGL_NODES.map(n => ({
    glyph: n.kgl,
    handle: n.handle,
    label: n.name,
  }));

  const result = enforcer.validateMappings(mappings);

  if (result.valid) {
    console.log('✅ All mappings valid against KGL v1.3');
  } else {
    console.log('❌ VALIDATION FAILED\n');
    for (const error of result.errors) {
      console.log(`  ❌ ${error.location || 'Unknown'}: ${error.message}`);
      if (error.expected) {
        console.log(`     Expected: ${error.expected}`);
      }
    }
  }

  console.log(`\nStats: ${result.stats.nodesChecked} checked, ${result.stats.errorsFound} errors`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export default KGLEnforcer;

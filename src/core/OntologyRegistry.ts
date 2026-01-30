/**
 * OntologyRegistry - Single Source of Truth for KGL Ontology
 *
 * This module provides centralized access to:
 * - 45 canonical nodes (L1)
 * - 7 modifier nodes
 * - Generated compounds (L2)
 * - Type taxonomies (L2)
 * - Modifier-on-modifier compatibility
 * - Node-modifier semantic compatibility
 *
 * All ontology validation MUST use this registry for handle lookups.
 */

import {
  KGL_NODES,
  CANONICAL_HANDLES,
  CANONICAL_NODES_SET,
  MODIFIER_HANDLES,
  MODIFIER_HANDLES_SET,
  DOMAIN_HANDLES,
  DOMAIN_HANDLES_SET,
  KGL_TYPE_TAXONOMIES,
  KGL_TYPE_TAXONOMIES_SET,
  KGL_COMPOUND_RELATIONSHIPS,
  KGL_COMPOUND_HANDLES_SET,
  MODIFIER_MODIFIER_COMPATIBILITY,
  NODE_MODIFIER_COMPATIBILITY,
  getNodeByHandle,
  isModifierHandle,
  isModifierValidForNode,
  getValidModifiersForNode,
  generateKnownCanonicalHandles,
  KNOWN_CANONICAL_HANDLES_FOR_PARSING,
} from '../ontology/canonicalOntology';
import type { KGLNode, KGLTypeTaxonomy, KGLCompoundRelationship, NodeCategory } from '../ontology/types';

/**
 * Handle validation result
 */
export interface HandleValidationResult {
  isValid: boolean;
  level?: 'L1' | 'L2_compound' | 'L2_taxonomy' | 'L3_subtaxonomy';
  nodeType?: NodeCategory;
  error?: string;
  suggestion?: string;
}

/**
 * Compound analysis result
 */
export interface CompoundAnalysis {
  isValidCompound: boolean;
  handleA?: string;
  handleB?: string;
  glyphA?: string;
  glyphB?: string;
  semanticMeaning?: string;
  typeLink?: string;
  error?: string;
}

/**
 * Registry providing access to KGL ontology data
 */
class OntologyRegistryClass {
  /**
   * Get all 45 canonical nodes
   */
  getAllNodes(): KGLNode[] {
    return [...KGL_NODES];
  }

  /**
   * Get all canonical handles
   */
  getAllHandles(): string[] {
    return [...CANONICAL_HANDLES];
  }

  /**
   * Get a node by handle
   */
  getNode(handle: string): KGLNode | undefined {
    return getNodeByHandle(handle);
  }

  /**
   * Check if a handle is a canonical L1 node
   */
  isCanonicalNode(handle: string): boolean {
    return CANONICAL_NODES_SET.has(handle);
  }

  /**
   * Check if a handle is a modifier
   */
  isModifier(handle: string): boolean {
    return isModifierHandle(handle);
  }

  /**
   * Get all modifier handles (7 modifiers)
   */
  getModifierHandles(): string[] {
    return [...MODIFIER_HANDLES];
  }

  /**
   * Get all domain handles (5 domains)
   */
  getDomainHandles(): string[] {
    return [...DOMAIN_HANDLES];
  }

  /**
   * Check if a handle is a valid compound
   */
  isValidCompound(handle: string): boolean {
    return KGL_COMPOUND_HANDLES_SET.has(handle);
  }

  /**
   * Check if a handle is a valid type taxonomy
   */
  isTypeTaxonomy(handle: string): boolean {
    return KGL_TYPE_TAXONOMIES_SET.has(handle);
  }

  /**
   * Get all type taxonomies
   */
  getAllTypeTaxonomies(): KGLTypeTaxonomy[] {
    return [...KGL_TYPE_TAXONOMIES];
  }

  /**
   * Get all compound relationships
   */
  getAllCompounds(): KGLCompoundRelationship[] {
    return [...KGL_COMPOUND_RELATIONSHIPS];
  }

  /**
   * Validate a handle and determine its level
   */
  validateHandle(handle: string): HandleValidationResult {
    // Check L1 canonical node
    if (CANONICAL_NODES_SET.has(handle)) {
      const node = getNodeByHandle(handle);
      return {
        isValid: true,
        level: 'L1',
        nodeType: node?.category,
      };
    }

    // Check L2 compound
    if (KGL_COMPOUND_HANDLES_SET.has(handle)) {
      return {
        isValid: true,
        level: 'L2_compound',
      };
    }

    // Check L2 type taxonomy
    if (KGL_TYPE_TAXONOMIES_SET.has(handle)) {
      return {
        isValid: true,
        level: 'L2_taxonomy',
      };
    }

    // Check if it's a valid L3+ sub-taxonomy pattern
    if (this.isValidSubTaxonomyPattern(handle)) {
      return {
        isValid: true,
        level: 'L3_subtaxonomy',
      };
    }

    // Invalid handle - suggest alternatives
    const suggestion = this.suggestAlternative(handle);
    return {
      isValid: false,
      error: `"${handle}" is not a canonical KGL handle`,
      suggestion,
    };
  }

  /**
   * Check if a handle follows valid L3+ sub-taxonomy naming pattern
   * Pattern: <parent_type_handle>_<category>
   */
  isValidSubTaxonomyPattern(handle: string): boolean {
    // Must contain _type_ to be a sub-taxonomy
    if (!handle.includes('_type_')) {
      return false;
    }

    // Split at _type_ and verify parent is valid
    const parts = handle.split('_type_');
    if (parts.length < 2) return false;

    const parentBase = parts[0];
    // Parent could be a canonical node or a compound
    return CANONICAL_NODES_SET.has(parentBase) || KGL_COMPOUND_HANDLES_SET.has(parentBase);
  }

  /**
   * Suggest an alternative for an invalid handle
   */
  suggestAlternative(handle: string): string {
    const lower = handle.toLowerCase();

    // Common mappings
    const mappings: Record<string, string> = {
      client: 'person',
      customer: 'person',
      user: 'person',
      staff: 'person',
      worker: 'person',
      employee: 'person',
      participant: 'person',
      beneficiary: 'person',
      appointment: 'event',
      meeting: 'event',
      visit: 'event',
      session: 'event',
      agency: 'organization',
      company: 'organization',
      provider: 'organization',
      partner: 'organization',
      firm: 'organization',
      plan: 'goal',
      objective: 'goal',
      job: 'task',
      action_item: 'task',
      note: 'record',
      document: 'artifact',
      file: 'artifact',
      location: 'geography',
      address: 'geography',
      period: 'timeframe',
      date: 'timeframe',
      score: 'measurement',
      metric: 'indicator',
      assessment: 'activity',
      referral: 'activity',
      housing: 'person_characteristic or person_need',
      health: 'person_characteristic or person_condition',
      disability: 'person_characteristic or person_limitation',
      income: 'resource or person_characteristic',
      employment: 'person_characteristic or person_activity',
    };

    if (mappings[lower]) {
      return `Map "${handle}" to canonical: ${mappings[lower]}`;
    }

    // Check for partial matches
    for (const canonical of CANONICAL_HANDLES) {
      if (lower.includes(canonical) || canonical.includes(lower)) {
        return `Consider using "${canonical}" or a compound like "${canonical}_type"`;
      }
    }

    return 'Review the 45 canonical nodes in KGL_NODES';
  }

  /**
   * Analyze a compound handle
   */
  analyzeCompound(handle: string): CompoundAnalysis {
    const compound = KGL_COMPOUND_RELATIONSHIPS.find((c) => c.compound === handle);

    if (!compound) {
      // Try to parse manually
      const parts = handle.split('_');
      if (parts.length < 2) {
        return {
          isValidCompound: false,
          error: 'Not a valid compound format. Compounds must have format A_B.',
        };
      }

      return {
        isValidCompound: false,
        error: `Compound "${handle}" not found in generated compounds. Check that both component handles are canonical.`,
      };
    }

    return {
      isValidCompound: true,
      handleA: compound.handleA,
      handleB: compound.handleB,
      glyphA: compound.kglA,
      glyphB: compound.kglB,
      semanticMeaning: compound.semanticMeaning,
      typeLink: compound.typeLink,
    };
  }

  /**
   * Check if a modifier is valid for a node
   */
  isModifierValidForNode(nodeHandle: string, modifierHandle: string): boolean {
    return isModifierValidForNode(nodeHandle, modifierHandle);
  }

  /**
   * Get valid modifiers for a node
   */
  getValidModifiersForNode(nodeHandle: string): string[] {
    return getValidModifiersForNode(nodeHandle);
  }

  /**
   * Check modifier-on-modifier compatibility
   */
  isModifierOnModifierValid(baseModifier: string, extensionModifier: string): boolean {
    const validExtensions = MODIFIER_MODIFIER_COMPATIBILITY[baseModifier];
    if (!validExtensions) return false;
    return validExtensions.has(extensionModifier);
  }

  /**
   * Get all known canonical handles for parsing
   */
  getAllKnownHandles(): Set<string> {
    return new Set(KNOWN_CANONICAL_HANDLES_FOR_PARSING);
  }

  /**
   * Export ontology summary as markdown
   */
  exportAsMarkdown(): string {
    const lines: string[] = ['# KGL Ontology Reference', ''];

    // Nodes by category
    lines.push('## Canonical Nodes (45)');
    lines.push('');

    const categories: NodeCategory[] = ['Domain', 'Central', 'Context', 'Content', 'Modifier'];
    for (const category of categories) {
      const nodes = KGL_NODES.filter((n) => n.category === category);
      lines.push(`### ${category} Nodes (${nodes.length})`);
      for (const node of nodes) {
        lines.push(`- **${node.handle}** (${node.kgl}): ${node.description}`);
      }
      lines.push('');
    }

    // Modifiers
    lines.push('## Modifiers (7)');
    lines.push('The 7 modifiers that can be applied to nodes:');
    for (const modHandle of MODIFIER_HANDLES) {
      const mod = getNodeByHandle(modHandle);
      if (mod) {
        lines.push(`- **${mod.handle}** (${mod.kgl}): ${mod.description}`);
      }
    }
    lines.push('');

    // Level system
    lines.push('## Level System');
    lines.push('- **L1**: 45 canonical nodes');
    lines.push('- **L2**: Compounds (A_B) and type taxonomies (A_type)');
    lines.push('- **L3**: Sub-taxonomies (A_type_category)');
    lines.push('- **L4+**: Nested via parent FK reference');
    lines.push('');

    // Stats
    lines.push('## Statistics');
    lines.push(`- Canonical Nodes: ${KGL_NODES.length}`);
    lines.push(`- Type Taxonomies: ${KGL_TYPE_TAXONOMIES.length}`);
    lines.push(`- Generated Compounds: ${KGL_COMPOUND_RELATIONSHIPS.length}`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Get nodes by category
   */
  getNodesByCategory(category: NodeCategory): KGLNode[] {
    return KGL_NODES.filter((n) => n.category === category);
  }

  /**
   * Get the type taxonomy handle for a node or compound
   */
  getTypeTaxonomyHandle(handle: string): string {
    return `${handle}_type`;
  }

  /**
   * Check if a type taxonomy exists for a handle
   */
  hasTypeTaxonomy(handle: string): boolean {
    return KGL_TYPE_TAXONOMIES_SET.has(`${handle}_type`);
  }
}

// Singleton instance
export const OntologyRegistry = new OntologyRegistryClass();

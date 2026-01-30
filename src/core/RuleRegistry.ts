/**
 * RuleRegistry - Single Source of Truth for KGL Rules
 *
 * This module provides centralized access to all 55 KGL rule definitions.
 * Validators MUST import rule definitions from here, not hardcode them.
 *
 * Rule Categories:
 * - R01-R16: Semantic & Structural rules
 * - T01-T10: Taxonomy rules
 * - M01-M04: Modifier pattern rules
 * - S01-S05: Selection rules
 * - N01-N07: Normalization rules
 * - CB01-CB14: Corteza Build rules
 */

import { KGL_RULES_DEFINITIONS } from '../ontology/canonicalData';
import type { KGLRule, RuleCategory } from '../ontology/types';

/**
 * Rule definition with extracted properties for validators
 */
export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  exampleCorrect?: string;
  exampleWrong?: string;
  errorIfViolated?: string;
}

/**
 * Registry providing access to all KGL rule definitions
 */
class RuleRegistryClass {
  private rulesById: Map<string, KGLRule>;
  private rulesByCategory: Map<RuleCategory, KGLRule[]>;

  constructor() {
    this.rulesById = new Map();
    this.rulesByCategory = new Map();
    this.loadRules();
  }

  /**
   * Load all rules from canonical data
   */
  private loadRules(): void {
    for (const rule of KGL_RULES_DEFINITIONS) {
      this.rulesById.set(rule.id, rule);

      const categoryRules = this.rulesByCategory.get(rule.category) || [];
      categoryRules.push(rule);
      this.rulesByCategory.set(rule.category, categoryRules);
    }
  }

  /**
   * Get a rule definition by ID
   * @throws Error if rule ID is not found
   */
  getRuleDefinition(ruleId: string): RuleDefinition {
    const rule = this.rulesById.get(ruleId);
    if (!rule) {
      throw new Error(
        `Rule "${ruleId}" not found in KGL_RULES_DEFINITIONS. ` +
          `Valid rule IDs: ${Array.from(this.rulesById.keys()).join(', ')}`
      );
    }
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      category: rule.category,
      exampleCorrect: rule.exampleCorrect,
      exampleWrong: rule.exampleWrong,
      errorIfViolated: rule.errorIfViolated,
    };
  }

  /**
   * Check if a rule ID exists
   */
  hasRule(ruleId: string): boolean {
    return this.rulesById.has(ruleId);
  }

  /**
   * Get all rules in a category
   */
  getRulesByCategory(category: RuleCategory): RuleDefinition[] {
    const rules = this.rulesByCategory.get(category) || [];
    return rules.map((r) => this.getRuleDefinition(r.id));
  }

  /**
   * Get all rule IDs
   */
  getAllRuleIds(): string[] {
    return Array.from(this.rulesById.keys());
  }

  /**
   * Get total count of rules
   */
  getRuleCount(): number {
    return this.rulesById.size;
  }

  /**
   * Get rules by prefix (R, T, M, S, N, CB)
   */
  getRulesByPrefix(prefix: string): RuleDefinition[] {
    const matching: RuleDefinition[] = [];
    for (const [id] of this.rulesById) {
      if (id.startsWith(prefix)) {
        matching.push(this.getRuleDefinition(id));
      }
    }
    return matching;
  }

  /**
   * Get semantic rules (R01-R16)
   */
  getSemanticRules(): RuleDefinition[] {
    return this.getRulesByPrefix('R');
  }

  /**
   * Get taxonomy rules (T01-T10)
   */
  getTaxonomyRules(): RuleDefinition[] {
    return this.getRulesByPrefix('T');
  }

  /**
   * Get modifier pattern rules (M01-M04)
   */
  getModifierRules(): RuleDefinition[] {
    return this.getRulesByPrefix('M');
  }

  /**
   * Get selection rules (S01-S05)
   */
  getSelectionRules(): RuleDefinition[] {
    return this.getRulesByPrefix('S');
  }

  /**
   * Get normalization rules (N01-N07)
   */
  getNormalizationRules(): RuleDefinition[] {
    return this.getRulesByPrefix('N');
  }

  /**
   * Get Corteza build rules (CB01-CB14)
   */
  getCortezaBuildRules(): RuleDefinition[] {
    return this.getRulesByPrefix('CB');
  }

  /**
   * Validate that a validator's ruleId exists in the registry
   * Used for testing that validators reference valid rules
   */
  validateRuleIdExists(ruleId: string): { valid: boolean; error?: string } {
    if (this.hasRule(ruleId)) {
      return { valid: true };
    }
    return {
      valid: false,
      error: `Rule ID "${ruleId}" not found in canonical definitions. Validator may be using a hardcoded or incorrect ID.`,
    };
  }

  /**
   * Export rules as markdown for context priming
   */
  exportAsMarkdown(): string {
    const lines: string[] = ['# KGL Rules Reference (55 Rules)', ''];

    const categories: { prefix: string; title: string; description: string }[] = [
      { prefix: 'R', title: 'Semantic & Structural Rules (R01-R16)', description: 'Core ontology grammar and semantic coherence' },
      { prefix: 'T', title: 'Taxonomy Rules (T01-T10)', description: 'Classification structure and hierarchy' },
      { prefix: 'M', title: 'Modifier Pattern Rules (M01-M04)', description: 'Rules for all 7 modifiers (type, status, condition, characteristic, role, capacity, limitation)' },
      { prefix: 'S', title: 'Selection Rules (S01-S05)', description: 'Use case compound selection guidance' },
      { prefix: 'N', title: 'Normalization Rules (N01-N07)', description: 'Cross-jurisdiction data alignment' },
      { prefix: 'CB', title: 'Corteza Build Rules (CB01-CB14)', description: 'Platform-specific implementation' },
    ];

    for (const cat of categories) {
      lines.push(`## ${cat.title}`);
      lines.push(`*${cat.description}*`);
      lines.push('');

      const rules = this.getRulesByPrefix(cat.prefix);
      for (const rule of rules) {
        lines.push(`### ${rule.id}: ${rule.name}`);
        lines.push(rule.description);
        if (rule.exampleCorrect) {
          lines.push(`- **Correct:** ${rule.exampleCorrect}`);
        }
        if (rule.exampleWrong) {
          lines.push(`- **Wrong:** ${rule.exampleWrong}`);
        }
        if (rule.errorIfViolated) {
          lines.push(`- **Error:** ${rule.errorIfViolated}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}

// Singleton instance
export const RuleRegistry = new RuleRegistryClass();

// Helper function for validators to get their rule definition
export function getRuleDefinition(ruleId: string): RuleDefinition {
  return RuleRegistry.getRuleDefinition(ruleId);
}

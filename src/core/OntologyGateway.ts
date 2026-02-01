/**
 * Copyright (c) 2024-2026 HelpSeeker Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ---
 *
 * OntologyGateway - Single Enforcement Point for KGL Validation
 *
 * This is the SINGLE source of truth for all ontology validation in the pipeline.
 * All validation calls should go through this gateway to ensure consistency.
 *
 * Features:
 * - Validates handles at different pipeline stages
 * - Configurable strictness (strict, warn, report)
 * - Wraps RuleRegistry and OntologyRegistry
 * - Provides checkpoint validation for pipeline stages
 * - Exports context for AI session priming
 */

import { RuleRegistry, getRuleDefinition, RuleDefinition } from './RuleRegistry';
import { OntologyRegistry, HandleValidationResult, CompoundAnalysis } from './OntologyRegistry';
import type { ObjectModule, TaxonomyModule } from '../types';
import type { RuleCategory } from '../ontology/types';

/**
 * Validation strictness levels
 */
export type StrictnessLevel = 'strict' | 'warn' | 'report';

/**
 * Pipeline stages for checkpoint validation
 */
export type PipelineStage = 'ingest' | 'extract' | 'map' | 'build' | 'export';

/**
 * Validation result from a checkpoint
 */
export interface CheckpointResult {
  stage: PipelineStage;
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    itemsChecked: number;
    errorsFound: number;
    warningsFound: number;
  };
}

/**
 * Validation error with rule reference
 */
export interface ValidationError {
  ruleId: string;
  ruleName: string;
  message: string;
  affectedHandle?: string;
  suggestion?: string;
}

/**
 * Validation warning (non-fatal)
 */
export interface ValidationWarning {
  ruleId?: string;
  message: string;
  affectedHandle?: string;
}

/**
 * Full validation report from running all rules
 */
export interface FullValidationReport {
  isValid: boolean;
  passed: number;
  failed: number;
  totalErrors: number;
  totalWarnings: number;
  checkpoints: CheckpointResult[];
  rulesChecked: string[];
}

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  strictness: StrictnessLevel;
  enabledCategories?: RuleCategory[];
  skipRules?: string[];
}

/**
 * OntologyGateway - Central validation orchestrator
 */
class OntologyGatewayClass {
  private config: GatewayConfig;

  constructor() {
    this.config = {
      strictness: 'report',
    };
  }

  /**
   * Configure the gateway
   */
  configure(config: Partial<GatewayConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current strictness level
   */
  getStrictness(): StrictnessLevel {
    return this.config.strictness;
  }

  // ===========================================================================
  // HANDLE VALIDATION
  // ===========================================================================

  /**
   * Validate a single handle
   */
  validateHandle(handle: string): HandleValidationResult {
    return OntologyRegistry.validateHandle(handle);
  }

  /**
   * Validate multiple handles
   */
  validateHandles(handles: string[]): { valid: string[]; invalid: HandleValidationResult[] } {
    const valid: string[] = [];
    const invalid: HandleValidationResult[] = [];

    for (const handle of handles) {
      const result = OntologyRegistry.validateHandle(handle);
      if (result.isValid) {
        valid.push(handle);
      } else {
        invalid.push({ ...result, error: `${handle}: ${result.error}` });
      }
    }

    return { valid, invalid };
  }

  /**
   * Validate that a handle is canonical (L1 or valid L2/L3)
   */
  isCanonicalHandle(handle: string): boolean {
    const result = OntologyRegistry.validateHandle(handle);
    return result.isValid;
  }

  // ===========================================================================
  // RULE ACCESS
  // ===========================================================================

  /**
   * Get a rule definition by ID
   */
  getRuleDefinition(ruleId: string): RuleDefinition {
    return getRuleDefinition(ruleId);
  }

  /**
   * Get all rules in a category
   */
  getRulesByCategory(category: RuleCategory): RuleDefinition[] {
    return RuleRegistry.getRulesByCategory(category);
  }

  /**
   * Get all rule IDs
   */
  getAllRuleIds(): string[] {
    return RuleRegistry.getAllRuleIds();
  }

  /**
   * Check if a rule ID is valid
   */
  isValidRuleId(ruleId: string): boolean {
    return RuleRegistry.hasRule(ruleId);
  }

  // ===========================================================================
  // COMPOUND VALIDATION
  // ===========================================================================

  /**
   * Analyze a compound handle
   */
  analyzeCompound(handle: string): CompoundAnalysis {
    return OntologyRegistry.analyzeCompound(handle);
  }

  /**
   * Check if a modifier is valid for a node
   */
  isModifierValidForNode(nodeHandle: string, modifierHandle: string): boolean {
    return OntologyRegistry.isModifierValidForNode(nodeHandle, modifierHandle);
  }

  /**
   * Get valid modifiers for a node
   */
  getValidModifiersForNode(nodeHandle: string): string[] {
    return OntologyRegistry.getValidModifiersForNode(nodeHandle);
  }

  // ===========================================================================
  // CHECKPOINT VALIDATION
  // ===========================================================================

  /**
   * Run validation checkpoint for a pipeline stage
   */
  validateCheckpoint(
    stage: PipelineStage,
    modules: ObjectModule[],
    taxonomies: TaxonomyModule[]
  ): CheckpointResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let itemsChecked = 0;

    switch (stage) {
      case 'ingest':
        // Ingest stage: minimal validation (confidence checks would go here)
        itemsChecked = modules.length + taxonomies.length;
        break;

      case 'extract':
        // Extract stage: validate that extracted entities have evidence
        itemsChecked = modules.length;
        break;

      case 'map':
        // Map stage: validate handles are canonical
        for (const module of modules) {
          itemsChecked++;
          const result = this.validateHandle(module.handle);
          if (!result.isValid) {
            errors.push({
              ruleId: 'R06',
              ruleName: 'Canonical nodes only',
              message: `Module "${module.handle}" is not a canonical KGL handle`,
              affectedHandle: module.handle,
              suggestion: result.suggestion,
            });
          }
        }
        for (const taxonomy of taxonomies) {
          itemsChecked++;
          const result = this.validateHandle(taxonomy.handle);
          if (!result.isValid) {
            errors.push({
              ruleId: 'R06',
              ruleName: 'Canonical nodes only',
              message: `Taxonomy "${taxonomy.handle}" is not a canonical KGL handle`,
              affectedHandle: taxonomy.handle,
              suggestion: result.suggestion,
            });
          }
        }
        break;

      case 'build':
        // Build stage: run structural rules
        const buildErrors = this.validateBuildStage(modules, taxonomies);
        errors.push(...buildErrors.errors);
        warnings.push(...buildErrors.warnings);
        itemsChecked = modules.length + taxonomies.length;
        break;

      case 'export':
        // Export stage: validate FK references and completeness
        const exportErrors = this.validateExportStage(modules, taxonomies);
        errors.push(...exportErrors.errors);
        warnings.push(...exportErrors.warnings);
        itemsChecked = modules.length + taxonomies.length;
        break;
    }

    const passed = errors.length === 0;

    // Handle strictness
    if (!passed && this.config.strictness === 'strict') {
      throw new Error(
        `Validation failed at ${stage} stage with ${errors.length} errors. ` +
          `First error: ${errors[0]?.message}`
      );
    }

    if (!passed && this.config.strictness === 'warn') {
      console.warn(`[OntologyGateway] ${stage} stage: ${errors.length} errors, ${warnings.length} warnings`);
      for (const error of errors) {
        console.warn(`  [${error.ruleId}] ${error.message}`);
      }
    }

    return {
      stage,
      passed,
      errors,
      warnings,
      stats: {
        itemsChecked,
        errorsFound: errors.length,
        warningsFound: warnings.length,
      },
    };
  }

  /**
   * Validate build stage rules
   */
  private validateBuildStage(
    modules: ObjectModule[],
    taxonomies: TaxonomyModule[]
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const allHandles = new Set([...modules.map((m) => m.handle), ...taxonomies.map((t) => t.handle)]);

    // Check T01: Compound type taxonomy required
    for (const module of modules) {
      if (module.handle.includes('_') && !module.handle.endsWith('_type')) {
        const typeHandle = `${module.handle}_type`;
        if (!allHandles.has(typeHandle)) {
          errors.push({
            ruleId: 'T01',
            ruleName: 'Compound type taxonomy required',
            message: `Compound "${module.handle}" missing type taxonomy "${typeHandle}"`,
            affectedHandle: module.handle,
            suggestion: `Create taxonomy module "${typeHandle}"`,
          });
        }
      }
    }

    // Check T09: Depth limit warning
    for (const taxonomy of taxonomies) {
      const depth = (taxonomy.handle.match(/_/g) || []).length;
      if (depth > 6) {
        warnings.push({
          ruleId: 'T09',
          message: `Taxonomy "${taxonomy.handle}" has depth ${depth} (> 6). Consider flattening.`,
          affectedHandle: taxonomy.handle,
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate export stage rules
   */
  private validateExportStage(
    modules: ObjectModule[],
    taxonomies: TaxonomyModule[]
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Export stage validation placeholder
    // Platform-specific export validations (e.g., CB rules) are handled by exporters

    return { errors, warnings };
  }

  // ===========================================================================
  // FULL VALIDATION
  // ===========================================================================

  /**
   * Run full validation across all stages
   */
  validateAll(
    modules: ObjectModule[],
    taxonomies: TaxonomyModule[]
  ): FullValidationReport {
    const checkpoints: CheckpointResult[] = [];
    const stages: PipelineStage[] = ['map', 'build', 'export'];
    let totalErrors = 0;
    let totalWarnings = 0;
    const rulesChecked = new Set<string>();

    for (const stage of stages) {
      const result = this.validateCheckpoint(stage, modules, taxonomies);
      checkpoints.push(result);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      for (const error of result.errors) {
        rulesChecked.add(error.ruleId);
      }
    }

    const passed = checkpoints.filter((c) => c.passed).length;
    const failed = checkpoints.filter((c) => !c.passed).length;

    return {
      isValid: totalErrors === 0,
      passed,
      failed,
      totalErrors,
      totalWarnings,
      checkpoints,
      rulesChecked: Array.from(rulesChecked),
    };
  }

  // ===========================================================================
  // CONTEXT EXPORT
  // ===========================================================================

  /**
   * Export complete context as markdown for AI session priming
   */
  exportContextMarkdown(): string {
    const lines: string[] = [
      '# KGL Ontology & Rules Context',
      '',
      'This document provides the complete KGL (Kompas Glyph Language) context for data modeling.',
      '',
    ];

    // Add ontology summary
    lines.push(OntologyRegistry.exportAsMarkdown());
    lines.push('');

    // Add rules summary
    lines.push(RuleRegistry.exportAsMarkdown());

    return lines.join('\n');
  }

  /**
   * Export rules summary only
   */
  exportRulesMarkdown(): string {
    return RuleRegistry.exportAsMarkdown();
  }

  /**
   * Export ontology summary only
   */
  exportOntologyMarkdown(): string {
    return OntologyRegistry.exportAsMarkdown();
  }

  // ===========================================================================
  // UTILITY METHODS
  // ===========================================================================

  /**
   * Get statistics about the ontology
   */
  getStats(): {
    nodes: number;
    modifiers: number;
    compounds: number;
    taxonomies: number;
    rules: number;
  } {
    return {
      nodes: OntologyRegistry.getAllNodes().length,
      modifiers: OntologyRegistry.getModifierHandles().length,
      compounds: OntologyRegistry.getAllCompounds().length,
      taxonomies: OntologyRegistry.getAllTypeTaxonomies().length,
      rules: RuleRegistry.getRuleCount(),
    };
  }

  /**
   * Suggest alternative handles for non-canonical terms
   */
  suggestAlternative(handle: string): string {
    const result = this.validateHandle(handle);
    return result.suggestion || 'Review the 45 canonical nodes';
  }
}

// Singleton instance
export const OntologyGateway = new OntologyGatewayClass();

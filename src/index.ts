/**
 * KGL (Kompas Glyph Language) v1.3 Ontology
 *
 * A universal data modeling language for social services and case management.
 *
 * Core Components:
 * - 45 Canonical Nodes (spine, legal, clinical, personal, operational)
 * - 7 Modifiers (type, status, condition, characteristic, role, capacity, limitation)
 * - 55 Validation Rules (semantic, taxonomy, modifier, selection, normalization, build)
 *
 * Architecture:
 * - OntologyRegistry: Access to nodes, compounds, taxonomies
 * - RuleRegistry: Central rule definitions and metadata
 * - OntologyGateway: Unified validation entry point
 */

// Core infrastructure
export {
  OntologyGateway,
  OntologyRegistry,
  RuleRegistry,
  getRuleDefinition,
} from './core';

// Export types from core
export type {
  StrictnessLevel,
  PipelineStage,
  CheckpointResult,
  ValidationError,
  ValidationWarning,
  FullValidationReport,
  GatewayConfig,
} from './core/OntologyGateway';

export type {
  HandleValidationResult,
  CompoundAnalysis,
} from './core/OntologyRegistry';

export type { RuleDefinition } from './core/RuleRegistry';

// Ontology data exports
export {
  KGL_RULES_DEFINITIONS,
  KGL_BRAND_ASSETS,
  KGL_SYSTEM_PROMPT_V1_3,
} from './ontology/canonicalData';

export {
  KGL_NODES,
  CANONICAL_HANDLES,
  MODIFIER_HANDLES,
  KGL_TYPE_TAXONOMIES,
  KGL_COMPOUND_RELATIONSHIPS,
  getNodeByHandle,
  getNodesByCategory,
  isModifierHandle,
  isModifierValidForNode,
  getValidModifiersForNode,
} from './ontology/canonicalOntology';

// Re-export all types
export type {
  KGLNode,
  KGLRule,
  KGLTypeTaxonomy,
  KGLCompoundRelationship,
  NodeCategory,
  RuleCategory,
} from './ontology/types';

// Module types for validation
export type {
  BaseModule,
  ObjectModule,
  TaxonomyModule,
  ModuleField,
} from './types';

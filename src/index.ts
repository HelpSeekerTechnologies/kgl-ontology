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

// Ontology data and types
export {
  CANONICAL_ONTOLOGY,
  KGL_RULES_DEFINITIONS,
  ALL_CANONICAL_HANDLES,
  ALL_COMPOUND_HANDLES,
  ALL_TYPE_TAXONOMY_HANDLES,
  NODE_COMBINABILITY,
  MODIFIER_HANDLES,
} from './ontology/canonicalData';

export type {
  NodeDefinition,
  NodeCategory,
  ModifierType,
  CompoundDefinition,
  TaxonomyDefinition,
  RuleCategory,
} from './ontology/types';

// Module types for validation
export type {
  BaseModule,
  ObjectModule,
  TaxonomyModule,
  FieldDefinition,
} from './types';

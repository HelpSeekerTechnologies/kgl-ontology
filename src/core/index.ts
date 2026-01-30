/**
 * Core Module - Single Source of Truth for KGL Ontology
 *
 * This module exports the central registries and gateway that enforce
 * ontology consistency across the entire pipeline.
 *
 * Usage:
 *   import { OntologyGateway, RuleRegistry, OntologyRegistry } from '../core';
 *
 * Key Components:
 * - RuleRegistry: Access to 55 rule definitions
 * - OntologyRegistry: Access to 45 nodes, compounds, taxonomies
 * - OntologyGateway: Single validation entry point for pipeline
 */

// Rule Registry - Single source for rule definitions
export { RuleRegistry, getRuleDefinition } from './RuleRegistry';
export type { RuleDefinition } from './RuleRegistry';

// Ontology Registry - Single source for ontology data
export { OntologyRegistry } from './OntologyRegistry';
export type { HandleValidationResult, CompoundAnalysis } from './OntologyRegistry';

// Ontology Gateway - Single enforcement point
export { OntologyGateway } from './OntologyGateway';
export type {
  StrictnessLevel,
  PipelineStage,
  CheckpointResult,
  ValidationError,
  ValidationWarning,
  FullValidationReport,
  GatewayConfig,
} from './OntologyGateway';

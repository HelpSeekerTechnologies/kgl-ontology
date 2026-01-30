/**
 * KGL Ontology Types
 *
 * Minimal type definitions for KGL validation.
 * These are compatible with Corteza module structures.
 */

/**
 * Field definition for modules
 */
export interface ModuleField {
  name: string;
  kind: string;
  label?: string;
  isRequired?: boolean;
  isMulti?: boolean;
  options?: Record<string, any>;
}

/**
 * Base module structure
 */
export interface BaseModule {
  handle: string;
  name: string;
  fields?: ModuleField[];
  description?: string;
  meta?: Record<string, any>;
}

/**
 * Object module (canonical nodes, compounds)
 */
export interface ObjectModule extends BaseModule {
  moduleType?: 'object';
  typeTaxonomy?: string;
}

/**
 * Taxonomy module (type classifications)
 */
export interface TaxonomyModule extends BaseModule {
  moduleType?: 'taxonomy';
  parent?: string;
  supportsHierarchy?: boolean;
  values?: Array<{
    name: string;
    code?: string;
    description?: string;
    parentRef?: string;
  }>;
}

// Re-export ontology types
export * from './ontology/types';

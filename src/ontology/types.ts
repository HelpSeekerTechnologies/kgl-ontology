/**
 * KGL (Kompas Glyph Language) Ontology Type Definitions
 *
 * This file defines the comprehensive type system for the KGL ontology v1.3,
 * which represents concepts, relationships, taxonomies, rules, and all auxiliary structures.
 */

// ============================================================================
// CORE ONTOLOGY TYPES
// ============================================================================

/**
 * Node categories in the KGL ontology
 */
export type NodeCategory = 'Domain' | 'Central' | 'Context' | 'Content' | 'Modifier';

/**
 * Content node subcategories
 */
export type ContentSubcategory = 'Temporal' | 'Operational' | 'Dynamics' | 'Data';

/**
 * Modifier subcategories
 */
export type ModifierSubcategory = 'Classification' | 'State' | 'Trait' | 'Relation' | 'Ability' | 'Constraint';

/**
 * Domain subcategories
 */
export type DomainSubcategory = 'Meta' | 'Access' | 'Delivery' | 'Analysis' | 'Outcomes';

/**
 * Domain focus areas
 */
export type DomainFocus = 'kompas' | 'navigi' | 'mareto' | 'karto' | 'volto';

/**
 * Represents a single node in the KGL ontology
 */
export interface KGLNode {
  /** Unique handle identifier (lowercase, snake_case) */
  handle: string;

  /** Human-readable name */
  name: string;

  /** Unicode glyph symbol representing this concept */
  kgl: string;

  /** Primary category */
  category: NodeCategory;

  /** Subcategory (for Content and Modifier nodes) */
  subcategory?: ContentSubcategory | ModifierSubcategory | DomainSubcategory;

  /** Description of the node */
  description: string;

  /** Associated domain (for Central and Context nodes) */
  domain?: DomainFocus;

  /** Default rationale for why this node is used (operational context) */
  defaultRationale?: string;

  /** For modifier nodes: whether it can be used standalone */
  isStandaloneModifier?: boolean;

  /** For modifier nodes: list of other modifiers that can extend this one */
  validExtensions?: string[];
}

/**
 * Defines different types of relationships between KGL nodes
 */
export enum RelationshipType {
  /** Node A is a more specific type of Node B */
  IS_A = "IS_A",

  /** Node A is a component or part of Node B */
  PART_OF = "PART_OF",

  /** Node A has a property or attribute of Node B */
  HAS_PROPERTY = "HAS_PROPERTY",

  /** Node A causes or leads to Node B */
  CAUSES = "CAUSES",

  /** Node A is used for the purpose of Node B */
  USED_FOR = "USED_FOR",

  /** Node A is similar to Node B */
  SIMILAR_TO = "SIMILAR_TO",

  /** Node A is the opposite of Node B */
  OPPOSITE_OF = "OPPOSITE_OF",

  /** Node A requires Node B to exist or function */
  REQUIRES = "REQUIRES",

  /** Node A produces or generates Node B */
  PRODUCES = "PRODUCES",

  /** Custom relationship type */
  CUSTOM = "CUSTOM"
}

/**
 * Represents a Level 2 compound relationship between two KGL nodes
 */
export interface KGLCompoundRelationship {
  /** Handle of the first node (A) */
  handleA: string;

  /** Glyph of the first node (A) */
  kglA: string;

  /** Handle of the second node (B) */
  handleB: string;

  /** Glyph of the second node (B) */
  kglB: string;

  /** Compound handle (A_B) */
  compound: string;

  /** Compound glyph (glyphA + glyphB) */
  kglCompound: string;

  /** Type taxonomy link for this compound */
  typeLink: string;

  /** Semantic meaning of the compound */
  semanticMeaning: string;
}

/**
 * Represents a Level 2 type taxonomy (classification layer)
 */
export interface KGLTypeTaxonomy {
  /** Type handle (e.g., person_type) */
  handle: string;

  /** Human-readable name */
  name: string;

  /** Glyph representation */
  kgl: string;

  /** Parent node handle */
  parent: string;

  /** Category inherited from parent */
  category: NodeCategory;

  /** Description of the classification */
  description: string;
}

/**
 * Represents a Level 3 sub-taxonomy (categorical values)
 */
export interface KGLSubTaxonomy {
  /** Sub-taxonomy handle (e.g., person_characteristic_type_gender) */
  handle: string;

  /** Human-readable name */
  name: string;

  /** Glyph representation */
  kgl: string;

  /** Parent type handle (e.g., person_characteristic_type) */
  parentTypeHandle: string;

  /** Category name (e.g., Identity, Communication) */
  category: string;

  /** Description */
  description: string;

  /** Standard fields for this sub-taxonomy module */
  standardFields: KGLField[];

  /** Example values */
  exampleValues: string[];
}

/**
 * Field definition for Corteza modules
 */
export interface KGLField {
  /** Field name */
  name: string;

  /** KGL data type */
  type: string;

  /** Corteza field kind */
  cortezaKind: string;

  /** Whether field is required */
  isRequired: boolean;

  /** Field description */
  description: string;

  /** Field options (for Record types, etc.) */
  options?: Record<string, any>;
}

// ============================================================================
// RULES AND VALIDATION
// ============================================================================

/**
 * Rule categories for the 55 KGL rules:
 * - Semantic: Core semantic coherence rules (R01-R16)
 * - Structure: Structural grammar rules (R01-R16)
 * - Naming: Handle and field naming conventions (R01-R16)
 * - Taxonomy: Classification and hierarchy rules (T01-T10)
 * - Modifier: Modifier pattern rules for all 7 modifiers (M01-M04)
 * - Selection: Use case compound selection rules (S01-S05)
 * - Normalization: Cross-jurisdiction alignment rules (N01-N07)
 * - Corteza Build: Platform-specific implementation rules (CB01-CB14)
 */
export type RuleCategory =
  | 'Semantic'
  | 'Structure'
  | 'Naming'
  | 'Taxonomy'
  | 'Modifier'
  | 'Selection'
  | 'Normalization'
  | 'Corteza Build';

/**
 * Rule ID prefixes for each category
 */
export type RuleIdPrefix = 'R' | 'T' | 'M' | 'S' | 'N' | 'CB';

/**
 * Represents a KGL rule definition
 *
 * Rule ID Prefixes:
 * - R01-R16: Semantic & Structural rules
 * - T01-T10: Taxonomy rules
 * - M01-M04: Modifier pattern rules
 * - S01-S05: Selection rules
 * - N01-N07: Normalization rules
 * - CB01-CB14: Corteza Build rules
 */
export interface KGLRule {
  /** Rule ID (e.g., R01, T05, M02, S03, N01, CB14) */
  id: string;

  /** Rule category */
  category: RuleCategory;

  /** Rule name */
  name: string;

  /** Rule description */
  description: string;

  /** Example of correct usage */
  exampleCorrect?: string;

  /** Example of wrong usage */
  exampleWrong?: string;

  /** Error message if rule is violated */
  errorIfViolated?: string;
}

/**
 * Represents a concept mapping for AI extraction
 */
export interface KGLConceptMapping {
  /** Non-canonical term */
  term: string;

  /** Canonical equivalent(s) - can be string or array */
  canonicalEquivalent: string | string[];

  /** Additional notes about the mapping */
  notes?: string;
}

// ============================================================================
// DOMAIN AND STORY STRUCTURES
// ============================================================================

/**
 * Domain description (Five Branches)
 */
export interface KGLDomainDescription {
  /** Domain name */
  domain: DomainFocus;

  /** Domain glyph */
  glyph: string;

  /** Focus area description */
  focus: string;

  /** Central node for this domain */
  centralNode: string;

  /** Context node for this domain */
  contextNode: string;

  /** When to use this domain */
  whenToUse: string;
}

/**
 * Story type (common or prophetic)
 */
export type StoryTypeCategory = 'common' | 'prophetic';

/**
 * KGL Story Type definition
 */
export interface KGLStoryType {
  /** Story name */
  name: string;

  /** Story type category */
  type: StoryTypeCategory;

  /** Story definition */
  definition: string;

  /** KGL glyph sequence */
  kglSequence: string;

  /** Operational meaning */
  operationalMeaning: string;

  /** When to use this story type */
  usedWhen: string;
}

/**
 * Risk pattern definition
 */
export interface KGLRiskPattern {
  /** Pattern name */
  name: string;

  /** Core KGL sequence */
  kglCore: string;

  /** Meaning/interpretation */
  meaning: string;
}

/**
 * Symbolic rule (IF-THEN logic)
 */
export interface KGLSymbolicRule {
  /** Rule ID */
  id: string;

  /** KGL rule in symbolic form */
  kglRule: string;

  /** Description of the rule */
  description: string;
}

// ============================================================================
// DATA AND FORECASTING TYPES
// ============================================================================

/**
 * Canonical data type definition
 */
export interface KGLCanonicalDataType {
  /** Data type name */
  name: string;

  /** Associated glyph */
  glyph: string;

  /** Definition */
  definition: string;

  /** Governance rules */
  rules: string[];
}

/**
 * Normalization pattern for cross-jurisdictional data
 */
export interface KGLNormalizationPattern {
  /** Domain (e.g., Age, Time) */
  domain: string;

  /** Compound handle for normalization */
  compound: string;

  /** Normalized taxonomy reference */
  taxonomy: string;

  /** Use case description */
  useCase: string;
}

/**
 * Full normalization compound structure for cross-jurisdictional data
 * Implements CB24-CB30 rules
 */
export interface KGLNormalizationCompound {
  /** Compound handle following pattern: <node>_<domain>_normalization */
  handle: string;

  /** FK → normalized_* taxonomy (standardized value reference) */
  normalizedTaxonomyRef: string;

  /** FK → geography_type_jurisdiction (source jurisdiction) */
  jurisdictionRef: string;

  /** Original system code (e.g., "G75GP", "18100", "K065") */
  sourceCode: string;

  /** How source implements the concept */
  mechanism: 'modifier' | 'embedded' | 'threshold' | 'percentage' | 'flat' | 'time_unit' | 'none';

  /** Value type for premium/adjustment */
  valueType: 'percentage' | 'flat' | 'none';

  /** Actual value (e.g., 0.20 for 20%, 55.39 for flat amount) */
  value?: number;

  /** Base rate before normalization */
  baseRate?: number;

  /** Effective rate after normalization */
  effectiveRate?: number;

  /** Confidence measure for cross-jurisdictional match (0.0-1.0) */
  comparabilityScore: number;
}

/**
 * Normalization level - where divergence creates incomparability
 */
export type NormalizationLevel =
  | 'L1' // Node level: client/patient/beneficiary → person
  | 'L2' // Type level: Office/Hospital/ER vs In/Out/Facility
  | 'L3'; // Sub-type level: AB 75+ vs BC 80+ (different mechanisms)

/**
 * Modifier ordering scenarios for R16 validation
 */
export interface KGLModifierOrderingRule {
  /** Scenario description */
  scenario: string;

  /** Correct ordering pattern */
  correctOrder: string;

  /** KGL glyph sequence */
  kgl: string;

  /** Reasoning for the ordering */
  reasoning: string;

  /** Example compound handle */
  example: string;
}

/**
 * Modifier ordering rules for validation (R16)
 */
export const MODIFIER_ORDERING_RULES: KGLModifierOrderingRule[] = [
  { scenario: 'Modifier on modifier', correctOrder: 'Base first, extension last', kgl: 'ϟͼ', reasoning: 'Extension modifies base', example: 'condition_status' },
  { scenario: 'Multiple modifiers on node', correctOrder: 'Node, then by specificity', kgl: '◎ϟͼ', reasoning: 'Most specific last', example: 'person_condition_status' },
  { scenario: 'Type always last', correctOrder: 'Other modifiers before type', kgl: '⧫ͼϠ', reasoning: 'Type classifies combination', example: 'event_status_type' },
  { scenario: 'Status vs condition', correctOrder: 'Base concept first', kgl: 'ϟͼ or Ͼϟ', reasoning: 'Depends on what is being modified', example: 'condition_status vs status_condition' },
  { scenario: 'Scoped compound + modifier', correctOrder: 'Scope → object → modifier', kgl: '■⧫Ͼ', reasoning: 'Hierarchy preserved', example: 'case_event_status' },
  { scenario: 'Scoped + modifier + type', correctOrder: 'Scope → object → modifier → type', kgl: '■⧫ͼϠ', reasoning: 'Type classifies scoped modifier', example: 'case_event_status_type' },
];

/**
 * Forecast playbook stage
 */
export interface KGLForecastStage {
  /** Stage name */
  name: string;

  /** Objective of this stage */
  objective: string;

  /** Actions for analysts */
  analystActions: string[];

  /** Governance rule */
  governanceRule: string;

  /** Required KGL sequence */
  requiredKGL: string;

  /** Additional constraints */
  constraint?: string;
}

// ============================================================================
// CONFIGURATION AND QUERY TYPES
// ============================================================================

/**
 * Configuration for the KGL ontology system
 */
export interface KGLOntologyConfig {
  /** Version of the ontology schema */
  version: string;

  /** Name of the ontology */
  name: string;

  /** Whether to enable strict validation */
  strictValidation?: boolean;

  /** Custom relationship types allowed */
  customRelationshipTypes?: string[];

  /** Additional configuration options */
  options?: Record<string, unknown>;
}

/**
 * Represents a query against the KGL ontology
 */
export interface KGLQuery {
  /** Type of query */
  type: "node" | "relationship" | "path" | "taxonomy" | "rule" | "story";

  /** Query parameters */
  params: {
    /** Node ID(s) or handle(s) to query */
    handles?: string[];

    /** Category to filter by */
    category?: NodeCategory;

    /** Subcategory to filter by */
    subcategory?: ContentSubcategory | ModifierSubcategory;

    /** Relationship type to filter by */
    relationshipType?: RelationshipType;

    /** Maximum depth for path queries */
    maxDepth?: number;

    /** Search term for text search */
    searchTerm?: string;

    /** Domain filter */
    domain?: DomainFocus;
  };
}

/**
 * Result of a KGL ontology query
 */
export interface KGLQueryResult {
  /** Matching nodes */
  nodes?: KGLNode[];

  /** Matching relationships */
  relationships?: KGLCompoundRelationship[];

  /** Matching taxonomies */
  taxonomies?: KGLTypeTaxonomy[];

  /** Matching rules */
  rules?: KGLRule[];

  /** Matching story types */
  stories?: KGLStoryType[];

  /** Number of results */
  count: number;

  /** Query execution metadata */
  metadata?: {
    executionTime?: number;
    totalMatches?: number;
  };
}

/**
 * Validation suggestion for KGL validator
 */
export interface ValidationSuggestion {
  /** Module handle being validated */
  handle: string;

  /** Issue type */
  issue: string;

  /** Severity level */
  severity: 'error' | 'warning' | 'info';

  /** Message describing the issue */
  message: string;

  /** Suggestion for fixing */
  suggestion: string;

  /** Suggested handle if applicable */
  suggestedHandle?: string;

  /** Whether this can be auto-fixed */
  autoFixable: boolean;
}

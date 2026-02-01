/**
 * KGL Canonical Data - Rules, Mappings, Stories, and Reference Data
 *
 * This file contains the static reference data for the KGL ontology including:
 * - Universal Rules (R01-R16, T01-T10, M01-M04, S01-S05, N01-N07)
 * - Concept mappings for AI extraction
 * - Domain descriptions
 * - Story types and risk patterns
 * - Data types and normalization patterns
 * - Forecast playbook stages
 * - System prompts
 *
 * Note: Platform-specific rules (e.g., Corteza Build Rules) have been moved to
 * their respective exporters in @helpseeker/data-model-generator to maintain
 * platform-agnostic ontology architecture.
 */

import {
    KGLRule, KGLConceptMapping, KGLDomainDescription, KGLStoryType, KGLRiskPattern,
    KGLSymbolicRule, KGLCanonicalDataType, KGLNormalizationPattern, KGLForecastStage,
    KGLSubTaxonomy, KGLField
} from './types';

// ============================================================================
// KGL BRANDING & ASSETS
// ============================================================================

/**
 * KGL Brand Assets
 * The Kompas compass rose represents the navigational nature of the ontology -
 * guiding users through complex data landscapes using the five domains (branches).
 */
export const KGL_BRAND_ASSETS = {
    /** Primary logo - Compass rose with 4-point star and directional indicators */
    logo: {
        description: 'Teal/cyan compass rose on black background with 4-point star, directional markers, and central navigation arrow',
        primaryColor: '#00A5B5', // Teal/cyan gradient
        secondaryColor: '#006080', // Darker teal
        backgroundColor: '#000000',
        symbolism: 'The compass represents navigation through complex systems; the 4 points align with the cardinal directions of the ontology; the central arrow points toward insight and purpose.',
    },
    /** Domain glyph: Kompas (Meta) */
    kompasGlyph: '✵',
    /** The five domain stars representing the Solar Family */
    solarFamily: ['✵', '✶', '✷', '✸', '✹'],
};

// ============================================================================
// KGL RULES DEFINITIONS - 41 Universal Rules
// ============================================================================
//
// These rules define what valid KGL is, independent of deployment platform.
//
// Categories:
// - R01-R16: Semantic & Structural Rules (ontology grammar)
// - T01-T10: Taxonomy Rules (classification structure)
// - M01-M04: Modifier Pattern Rules (applies to all 7 modifiers)
// - S01-S05: Selection Rules (use case compound selection)
// - N01-N07: Normalization Rules (cross-jurisdiction alignment)
//
// Platform-Specific Rules (moved to respective exporters):
// - CB01-CB14: Corteza Build Rules → @helpseeker/data-model-generator/CortezaValidator
// - Future: PostgreSQL rules, Salesforce rules, etc.
//
// ============================================================================

export const KGL_RULES_DEFINITIONS: KGLRule[] = [
    // =========================================================================
    // R01-R16: SEMANTIC & STRUCTURAL RULES
    // =========================================================================
    // These rules govern the core ontology grammar and semantic coherence.

    { id: 'R01', category: 'Semantic', name: 'Semantic coherence', description: 'Compound must describe a real thing. Every compound must have a coherent semantic meaning that represents an actual concept in the domain.', exampleCorrect: 'case_event = event in a case ✓', errorIfViolated: 'Semantic nonsense; compound has no real-world meaning' },
    { id: 'R02', category: 'Semantic', name: 'Order determines meaning', description: 'A_B ≠ B_A; both valid, different meaning. The order of nodes in a compound determines the semantic relationship direction.', exampleWrong: 'event_status vs status_event', exampleCorrect: 'event_status (Status OF an event) vs status_event (Event ABOUT status change)', errorIfViolated: 'Semantic ambiguity; relationship direction unclear' },
    { id: 'R03', category: 'Structure', name: 'All nodes get type taxonomy', description: 'Every compound and standalone node must have a corresponding type taxonomy for classification.', exampleCorrect: 'case_event → case_event_type', errorIfViolated: 'Missing classification; cannot categorize records' },
    { id: 'R04', category: 'Structure', name: 'No type-type', description: 'Type cannot classify itself. The "type" modifier cannot be applied to itself.', exampleWrong: 'type_type is invalid', exampleCorrect: 'Use status_type instead', errorIfViolated: 'Circular reference; type classifying itself' },
    { id: 'R05', category: 'Structure', name: 'No node repetition', description: 'Same node cannot appear twice in a compound. Each node can only appear once.', exampleWrong: 'person_person invalid', exampleCorrect: 'person_role, person_case', errorIfViolated: 'Invalid compound; duplicate node' },
    { id: 'R06', category: 'Semantic', name: 'Canonical nodes only', description: 'All handles must derive from the 45 canonical nodes. No custom or non-canonical terms allowed.', exampleWrong: 'happy, housing, client', exampleCorrect: 'Map to canonical: person, person_characteristic, person_need', errorIfViolated: 'Non-canonical term; must map to ontology' },
    { id: 'R07', category: 'Naming', name: 'Hyphen notation for fields', description: 'Use hyphen (-) for FK field references, underscore (_) for compound handles.', exampleWrong: 'case.case_event', exampleCorrect: 'case-case_event (field referencing case_event module)', errorIfViolated: 'Invalid field naming convention' },
    { id: 'R08', category: 'Naming', name: 'Full compound naming', description: 'Spell out complete compound handle in references. Do not abbreviate.', exampleCorrect: 'case_event-case_event_type (not case_event-type)', errorIfViolated: 'Ambiguous reference; incomplete handle' },
    { id: 'R09', category: 'Semantic', name: 'All many-to-many', description: 'No cardinality constraints in schema. All relationships are modeled as many-to-many. Business rules enforce limits at runtime.', exampleCorrect: 'Business rules enforce limits, not schema', errorIfViolated: 'Schema cardinality constraint; use business rules' },
    { id: 'R10', category: 'Semantic', name: 'Modifiers are standalone nodes', description: 'Status, condition, characteristic, role, capacity, limitation are standalone nodes with their own type taxonomies.', exampleCorrect: 'status → status_type exists as L2 taxonomy', errorIfViolated: 'Missing modifier taxonomy' },
    { id: 'R11', category: 'Semantic', name: 'Compounds are nodes', description: 'Compounds can be treated as nodes and receive their own type taxonomy.', exampleCorrect: 'person_case → person_case_type', errorIfViolated: 'Missing compound type taxonomy' },
    { id: 'R12', category: 'Semantic', name: 'Bidirectionality', description: 'A_B valid means B_A is also grammatically valid (though semantically different).', exampleCorrect: 'person_case AND case_person are both valid', errorIfViolated: 'Asymmetric compound restriction' },
    { id: 'R13', category: 'Naming', name: 'Snake case convention', description: 'All handles must be lowercase, singular, with underscores. No hyphens, plurals, or camelCase in handles.', exampleCorrect: 'case_event_status ✓', exampleWrong: 'CaseEventStatus, case-event, events', errorIfViolated: 'Invalid handle format' },
    { id: 'R14', category: 'Structure', name: 'Relationship modifier inheritance', description: 'When A-B relationship exists, include A-B_type and optionally A-B_<modifier> for relationship attributes.', exampleCorrect: 'person-outcome → person-outcome_type, person-outcome_status', errorIfViolated: 'Missing relationship type taxonomy' },
    { id: 'R15', category: 'Semantic', name: 'Modifier scope follows compound', description: 'When modifying a compound, the modifier follows the complete compound. A_B_modifier means "the modifier OF A\'s relationship to B".', exampleWrong: 'person_status_case (◎Ͼ■) - implies person has status, then is in case', exampleCorrect: 'person_case_status (◎■Ͼ) - status OF the person-case relationship', errorIfViolated: 'Semantic ambiguity; modifier scope unclear' },
    { id: 'R16', category: 'Semantic', name: 'Modifier ordering grammar', description: 'Modifiers follow specific ordering: (1) Base before extension for modifier-on-modifier, (2) Node then by specificity for multiple modifiers, (3) Type ALWAYS last, (4) Scoped compounds preserve hierarchy: scope → object → modifier → type.', exampleWrong: 'event_type_status (type not last), status_condition_person (wrong order)', exampleCorrect: 'condition_status (ϟͼ), person_condition_status (◎ϟͼ), event_status_type (⧫ͼϠ), case_event_status_type (■⧫ͼϠ)', errorIfViolated: 'Semantic ambiguity; glyph sequence uninterpretable' },

    // =========================================================================
    // T01-T10: TAXONOMY RULES
    // =========================================================================
    // These rules govern taxonomy structure, hierarchy, and classification.

    { id: 'T01', category: 'Taxonomy', name: 'Compound type taxonomy required', description: 'Every compound MUST have a corresponding type taxonomy module for classification.', exampleWrong: 'case_condition exists without case_condition_type', exampleCorrect: 'Both case_condition AND case_condition_type modules exist', errorIfViolated: 'Incomplete data model; missing type classification' },
    { id: 'T02', category: 'Taxonomy', name: 'Sub-type trigger', description: 'Create Level 3+ sub-taxonomy when 2+ categorical values are needed within a taxonomy category.', exampleWrong: 'person_characteristic_type with Gender as freeform text value', exampleCorrect: 'person_characteristic_type_gender module with Male, Female, Non-binary values', errorIfViolated: 'Uncontrolled categorical data' },
    { id: 'T03', category: 'Taxonomy', name: 'Sub-type grammar', description: 'Sub-taxonomy naming: <parent_handle>_<category_lowercase>. Parent handle is preserved, category appended.', exampleWrong: 'gender_type, person_gender', exampleCorrect: 'person_characteristic_type_gender (parent: person_characteristic_type, category: Gender)', errorIfViolated: 'Naming inconsistency; parent handle not preserved' },
    { id: 'T04', category: 'Taxonomy', name: 'Sub-type structure', description: 'Standard sub-type taxonomy fields: _id, _name, _code, _description, _display_order, _is_active, -parent.', exampleWrong: 'Only _id and _name fields', exampleCorrect: 'Complete field set with parent reference and metadata', errorIfViolated: 'Incomplete taxonomy structure' },
    { id: 'T05', category: 'Taxonomy', name: 'Sub-type reference', description: 'Parent taxonomy references sub-type via value field. Sub-type values are selected, not entered as text.', exampleWrong: 'person_characteristic stores gender as text string', exampleCorrect: 'person_characteristic-person_characteristic_type_gender (Record → sub-taxonomy)', errorIfViolated: 'No controlled vocabulary reference' },
    { id: 'T06', category: 'Taxonomy', name: 'Sub-type hierarchy', description: 'Sub-types can have parent references for nested hierarchical values (L4+).', exampleWrong: 'Flat list only, no hierarchy support', exampleCorrect: 'person_characteristic_type_indigenous with parent references for nations/tribes', errorIfViolated: 'Cannot model hierarchical taxonomy' },
    { id: 'T07', category: 'Taxonomy', name: 'Modifier taxonomy depth', description: 'For each modifier taxonomy (type, status, characteristic, role, etc.), if any category has 2+ categorical values, a Level 3+ sub-taxonomy MUST exist. Depth is driven by USE CASE DATA.', exampleWrong: 'person_type taxonomy with "Specialty" as value, but no person_type_specialty sub-taxonomy', exampleCorrect: 'person_type has "Specialty" value → person_type_specialty exists with actual values (Cardiologist, Neurologist)', errorIfViolated: 'Uncontrolled categorical data; cannot aggregate/report' },
    { id: 'T08', category: 'Taxonomy', name: 'One semantic dimension', description: 'Each modifier sub-taxonomy MUST maintain ONE semantic dimension. All values must answer the same semantic question. No mixed dimensions.', exampleWrong: 'person_characteristic_type_language containing [English, French, Full-Time Employee] - mixes language with employment', exampleCorrect: 'person_characteristic_type_language contains ONLY languages. Separate taxonomy for employment.', errorIfViolated: 'Semantic incoherence; impossible to query/aggregate meaningfully' },
    { id: 'T09', category: 'Taxonomy', name: 'Depth limit warning', description: 'Taxonomy depth beyond Level 6 triggers a warning. Deep hierarchies may indicate over-engineering or data model complexity.', exampleWrong: 'person_characteristic_type_indigenous_nation_band_community_family (L8)', exampleCorrect: 'Flatten hierarchy or use separate linking modules for deep relationships', errorIfViolated: 'Warning: Excessive taxonomy depth may indicate design issue' },
    { id: 'T10', category: 'Taxonomy', name: 'Path computation field', description: 'Hierarchical taxonomies (L3+) MUST include a computed path field for efficient querying and tree navigation.', exampleWrong: 'Hierarchical taxonomy without path field', exampleCorrect: 'path field: "/person_type/specialty/cardiology" enabling LIKE queries', errorIfViolated: 'Missing path field; hierarchical queries inefficient' },

    // =========================================================================
    // M01-M04: MODIFIER PATTERN RULES
    // =========================================================================
    // These rules apply to ALL 7 modifiers (type, status, condition, characteristic, role, capacity, limitation).
    // Modifiers MUST NOT be stored as freeform strings.

    { id: 'M01', category: 'Modifier', name: 'No freeform modifier attributes', description: 'Modifier values (type, status, condition, characteristic, role, capacity, limitation) MUST NOT be freeform strings. Use the node_modifier compound pattern with taxonomy reference.', exampleWrong: 'person.gender = "Male" as String field, event.status = "Completed" as String', exampleCorrect: 'person → person_characteristic → person_characteristic_type → person_characteristic_type_gender. event → event_status → event_status_type.', errorIfViolated: 'Uncontrolled, unreportable modifier data' },
    { id: 'M02', category: 'Modifier', name: 'Three-level modifier structure', description: 'All modifier attributes use minimum 3-level structure: Node → Node_Modifier → Node_Modifier_Type. Sub-taxonomies extend to L3+ when needed.', exampleWrong: 'person.gender = "Male" (direct string)', exampleCorrect: 'person_characteristic (L2) with type=Gender → person_characteristic_type_gender (L3) with value=Male', errorIfViolated: 'Cannot aggregate or report on modifier values' },
    { id: 'M03', category: 'Modifier', name: 'Multi-value support', description: 'Modifier compounds support multiple values per entity. Multiple records of the compound can exist for one entity.', exampleWrong: 'person_language as single String field', exampleCorrect: 'Multiple person_characteristic records of type=Language (English, French, Cree)', errorIfViolated: 'Data loss; cannot capture multiple modifier values' },
    { id: 'M04', category: 'Modifier', name: 'Modifier metadata', description: 'Modifier compounds should track provenance: source, verification_status, effective_date, end_date, notes.', exampleWrong: 'Just the modifier value with no context', exampleCorrect: 'person_characteristic with source=Self-Report, verified_at=2024-01-15, effective_date=2020-01-01', errorIfViolated: 'No audit trail for modifier values' },

    // =========================================================================
    // S01-S05: SELECTION RULES
    // =========================================================================
    // These rules guide compound selection for use cases. Not all grammatically valid compounds are needed.

    { id: 'S01', category: 'Selection', name: 'Spine first', description: 'Start with operational spine nodes (person, case, event, service, program, organization) before adding modifiers or context.', exampleWrong: 'Starting with person_characteristic before confirming person is needed', exampleCorrect: 'Confirm person is in scope, then add person_characteristic if demographics needed', errorIfViolated: 'Over-engineering; building compounds without spine anchor' },
    { id: 'S02', category: 'Selection', name: 'Question test', description: 'Each selected compound must answer a specific business question. If no question requires it, do not include it.', exampleWrong: 'Including person_acuity because it exists in the ontology', exampleCorrect: 'Including person_acuity because the use case asks "What is the client\'s acuity level?"', errorIfViolated: 'Unnecessary compound; no business question requires it' },
    { id: 'S03', category: 'Selection', name: 'Minimal compounds', description: 'Use the fewest compounds needed to answer all use case questions. Avoid redundant or overlapping compounds.', exampleWrong: 'Including both person_characteristic AND person_status for the same attribute', exampleCorrect: 'Choose person_characteristic for traits, person_status for state transitions', errorIfViolated: 'Redundant compounds; data duplication' },
    { id: 'S04', category: 'Selection', name: 'Modifier justification', description: 'Each modifier compound must be justified by a use case need. Not all entities need all modifiers.', exampleWrong: 'Adding person_capacity, person_limitation, person_condition to every person module', exampleCorrect: 'Add person_capacity only if use case tracks client abilities', errorIfViolated: 'Over-engineering; modifiers without use case need' },
    { id: 'S05', category: 'Selection', name: 'Taxonomy follows selection', description: 'Taxonomy values are populated AFTER compounds are selected. Do not design taxonomies before confirming compounds.', exampleWrong: 'Designing person_characteristic_type_gender values before confirming person_characteristic is needed', exampleCorrect: 'Select person_characteristic first, then populate type values based on use case', errorIfViolated: 'Premature taxonomy design; may create unused structures' },

    // =========================================================================
    // N01-N07: NORMALIZATION RULES
    // =========================================================================
    // These rules govern cross-jurisdiction data alignment and comparability.

    { id: 'N01', category: 'Normalization', name: 'Normalization trigger', description: 'Create normalization compound when same L2 category has different mechanisms, thresholds, or values across jurisdictions.', exampleWrong: 'Ignoring that BC and AB define "rural" differently', exampleCorrect: 'person_geography_normalization with jurisdiction-specific mappings to normalized_rurality', errorIfViolated: 'Cross-jurisdiction data incomparable' },
    { id: 'N02', category: 'Normalization', name: 'Reference taxonomy required', description: 'Every normalization compound must reference a normalized_* taxonomy containing standardized values.', exampleWrong: 'Normalization compound without target taxonomy', exampleCorrect: 'person_age_normalization → normalized_age_band (e.g., 0-17, 18-34, 35-54, 55+)', errorIfViolated: 'No standard reference for normalized values' },
    { id: 'N03', category: 'Normalization', name: 'Mechanism metadata', description: 'Record how source system implements concept: modifier, embedded, threshold, percentage, flat, time_unit.', exampleWrong: 'Just mapping values without explaining source mechanism', exampleCorrect: 'mechanism="threshold", source_threshold="65", notes="AB uses 65+, BC uses 55+"', errorIfViolated: 'Cannot understand or debug normalization logic' },
    { id: 'N04', category: 'Normalization', name: 'Calculated fields', description: 'Include base_rate and effective_rate fields enabling cross-system comparison.', exampleWrong: 'Only storing normalized value without calculation context', exampleCorrect: 'base_rate=100.00, effective_rate=125.00, multiplier=1.25', errorIfViolated: 'Cannot perform rate comparisons across systems' },
    { id: 'N05', category: 'Normalization', name: 'Comparability score', description: 'Include confidence measure (0.0-1.0) for imperfect cross-jurisdictional matches.', exampleWrong: 'Treating all normalizations as equally reliable', exampleCorrect: 'comparability_score=0.85 (indicating 85% confidence in mapping)', errorIfViolated: 'No indication of normalization quality' },
    { id: 'N06', category: 'Normalization', name: 'Source preservation', description: 'Always preserve original source_code. Normalization adds normalized value, never replaces original.', exampleWrong: 'Overwriting source value with normalized value', exampleCorrect: 'source_code="RURAL_BC", normalized_code="RURAL_STANDARD", both preserved', errorIfViolated: 'Loss of original source data' },
    { id: 'N07', category: 'Normalization', name: 'Jurisdiction reference', description: 'Every normalization compound must FK to geography_type_jurisdiction identifying source system.', exampleWrong: 'Normalization without jurisdiction context', exampleCorrect: 'normalization-geography_type_jurisdiction (FK to BC, AB, ON, etc.)', errorIfViolated: 'Cannot identify source of normalized data' },
];

// ============================================================================
// KGL CONCEPT MAPPINGS
// ============================================================================

export const KGL_CONCEPT_MAPPINGS_GENERIC: KGLConceptMapping[] = [
    { term: 'client', canonicalEquivalent: 'person' },
    { term: 'staff', canonicalEquivalent: 'person' },
    { term: 'worker', canonicalEquivalent: 'person' },
    { term: 'customer', canonicalEquivalent: 'person' },
    { term: 'user', canonicalEquivalent: 'person' },
    { term: 'appointment', canonicalEquivalent: 'event' },
    { term: 'meeting', canonicalEquivalent: 'event' },
    { term: 'visit', canonicalEquivalent: 'event' },
    { term: 'session', canonicalEquivalent: 'event' },
    { term: 'agency', canonicalEquivalent: 'organization' },
    { term: 'company', canonicalEquivalent: 'organization' },
    { term: 'provider', canonicalEquivalent: 'organization' },
    { term: 'partner', canonicalEquivalent: 'organization' },
    { term: 'plan', canonicalEquivalent: 'goal' },
    { term: 'objective', canonicalEquivalent: 'goal' },
    { term: 'assessment', canonicalEquivalent: 'activity' },
    { term: 'referral', canonicalEquivalent: 'activity' },
    { term: 'job', canonicalEquivalent: 'task' },
    { term: 'action_item', canonicalEquivalent: 'task' },
    { term: 'note', canonicalEquivalent: 'record' },
    { term: 'document', canonicalEquivalent: 'artifact' },
    { term: 'file', canonicalEquivalent: 'artifact' },
    { term: 'location', canonicalEquivalent: 'geography' },
    { term: 'address', canonicalEquivalent: 'geography' },
    { term: 'period', canonicalEquivalent: 'timeframe' },
    { term: 'date', canonicalEquivalent: 'timeframe' },
    { term: 'score', canonicalEquivalent: 'measurement' },
    { term: 'metric', canonicalEquivalent: 'indicator' },
];

export const KGL_CONCEPT_MAPPINGS_AI_EXTRACTION: KGLConceptMapping[] = [
    { term: 'housing', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_need', 'person_need_type'], notes: 'Housing concepts → person_characteristic or need' },
    { term: 'shelter', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_need', 'person_need_type'], notes: 'Housing concepts → person_characteristic or need' },
    { term: 'health', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_need', 'person_risk'], notes: 'Health concepts → person_characteristic or need/risk' },
    { term: 'mental_health', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_need', 'person_risk'], notes: 'Health concepts → person_characteristic or need/risk' },
    { term: 'disability', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_limitation'], notes: 'Disability → person_characteristic or limitation' },
    { term: 'income', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'resource'], notes: 'Income/Employment → person_characteristic or resource' },
    { term: 'employment', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type', 'person_activity'], notes: 'Income/Employment → person_characteristic or activity' },
    { term: 'education', canonicalEquivalent: ['person_characteristic', 'person_characteristic_type'], notes: 'Education → person_characteristic' },
    { term: 'family', canonicalEquivalent: ['person', 'person_role', 'person_role_type'], notes: 'Family → relationship through person compounds' },
    { term: 'household', canonicalEquivalent: ['person', 'person_role', 'organization'], notes: 'Household → person, role, organization' },
    { term: 'enrollment', canonicalEquivalent: ['program_service', 'program_service_type', 'program_service_status', 'person_service'], notes: 'Enrollment → program_service relationship' },
    { term: 'legal', canonicalEquivalent: ['authority', 'authority_type', 'person_need', 'issue'], notes: 'Legal → authority or need' },
    { term: 'client', canonicalEquivalent: ['person', 'person_type', 'person_role'], notes: 'Client → person' },
    { term: 'participant', canonicalEquivalent: ['person', 'person_type', 'person_role'], notes: 'Participant → person' },
];

// ============================================================================
// KGL DOMAIN DESCRIPTIONS
// ============================================================================

export const KGL_DOMAIN_DESCRIPTIONS: KGLDomainDescription[] = [
    { domain: 'navigi', glyph: '✶', focus: 'Access, Needs, Resources', centralNode: 'resource', contextNode: 'program', whenToUse: 'Finding, matching, navigating to help' },
    { domain: 'mareto', glyph: '✷', focus: 'Care, Cases, Delivery', centralNode: 'person', contextNode: 'case', whenToUse: 'Tracking individuals through services' },
    { domain: 'karto', glyph: '✸', focus: 'Patterns, Models, Stories', centralNode: 'insight', contextNode: 'story', whenToUse: 'Understanding patterns, telling data stories' },
    { domain: 'volto', glyph: '✹', focus: 'Value, Targets, Purpose', centralNode: 'outcome', contextNode: 'purpose', whenToUse: 'Measuring results, strategic alignment' },
    { domain: 'kompas', glyph: '✵', focus: 'Meta / system', centralNode: '', contextNode: '', whenToUse: 'System-level configuration, governance, authority (rarely used in operational spine)' },
];

// ============================================================================
// KGL STORY TYPES
// ============================================================================

export const KGL_STORY_TYPES: KGLStoryType[] = [
    // Common Story Types
    {
        name: 'Man in a Hole', type: 'common',
        definition: 'A stable situation deteriorates suddenly, then improves through effort and learning.',
        kglSequence: '◎☨■ → ◎⋁⧫■ → ◎ᚼ■ → ◯✽□',
        operationalMeaning: 'A person enters high-acuity crisis, receives service, and reaches a targeted outcome.',
        usedWhen: 'Crisis response, stabilization pilots, recovery narratives.'
    },
    {
        name: 'Dragon and the City', type: 'common',
        definition: 'A large shared threat endangers the system. Avoidance worsens the risk. Confrontation is costly but necessary.',
        kglSequence: '◎⋁⟲■ → Ϫ▣ → ⧫ → ◯✽□',
        operationalMeaning: 'Unaddressed acuity accumulates until it forces costly intervention.',
        usedWhen: 'High System Users, cost spirals, deferred policy action.'
    },
    {
        name: 'Order and Chaos', type: 'common',
        definition: 'The tension between fragile order and uncontrolled complexity.',
        kglSequence: '◎⋁▣ → ⊙꩝⟡▦ → ◯✽□',
        operationalMeaning: 'Systems are overwhelmed. Insight restores coherence.',
        usedWhen: 'System redesign, cross-ministry coordination, planning failures.'
    },
    {
        name: 'No Easy Way', type: 'common',
        definition: 'Progress is slow, costly, and requires sustained effort with no shortcut.',
        kglSequence: '◎⋁⟲■ → ◎ᚼ⟲■ → ◯✽□',
        operationalMeaning: 'Structural problems that cannot be solved with one-off interventions.',
        usedWhen: 'Addictions, homelessness, intergenerational issues.'
    },
    {
        name: 'Rags to Riches', type: 'common',
        definition: 'Steady improvement through opportunity and support.',
        kglSequence: '◎ᚾ■ → ◎ᚼ■ → ◯✽□',
        operationalMeaning: 'Capability development and upward trajectory.',
        usedWhen: 'Employment, education, prevention narratives.'
    },
    {
        name: 'Data Detectives', type: 'common',
        definition: 'Stories that explain by revealing insight through evidence.',
        kglSequence: '⟦⌖ → ⊙⟡꩜▦ → ◯✽□',
        operationalMeaning: 'Evidence-led explanation replaces anecdote.',
        usedWhen: 'Analytics briefings, forecast justification, AI outputs.'
    },

    // Prophetic Story Types
    {
        name: 'Enigma → Fulfilment (Delayed Meaning)', type: 'prophetic',
        definition: 'Prophecies are intentionally obscure and only understood after fulfilment. Prophecy lies "long in the dark" until events reveal meaning.',
        kglSequence: '⊙꩜▦ → ⟲ → ⧫ → ⊙⟡▦',
        operationalMeaning: 'Meaning is not predictive clarity. Meaning emerges through alignment of model and event.',
        usedWhen: 'Forecasting, scenario modelling, long-horizon policy signals.'
    },
    {
        name: 'Hidden Order Behind Chaos', type: 'prophetic',
        definition: 'Apparent disorder contrasts with divine or cosmic order governing events. Chaos is surface noise, not randomness.',
        kglSequence: '◎⋁⧫■ → ⊙꩝⟡▦ → ◯✽□',
        operationalMeaning: 'Violence and disruption are signals of underlying system dynamics, not anomalies.',
        usedWhen: 'System failure analysis, crisis retrospectives, structural reform.'
    },
    {
        name: 'Accumulation → Reckoning', type: 'prophetic',
        definition: 'Slow buildup of conditions followed by sudden catastrophe. War, famine, plague recur only after prolonged neglect.',
        kglSequence: '◎⋁⟲■ → Ϫ▣ → ⧫ → ◯✽□',
        operationalMeaning: 'Deferred action increases eventual severity.',
        usedWhen: 'High System Users, deferred maintenance, fiscal or social debt.'
    },
    {
        name: 'Divine Signal → Human Interpretation', type: 'prophetic',
        definition: 'Prophecy as divine illumination interpreted through human faculties and imperfect instruments.',
        kglSequence: '⊙⟰ → ⊙꩜ → ⊙⟡▦',
        operationalMeaning: 'Signal is real. Interpretation is fallible. Models mediate meaning.',
        usedWhen: 'AI-assisted forecasting, expert judgement systems.'
    },
    {
        name: 'Warning, Not Prevention', type: 'prophetic',
        definition: 'Prophecy does not exist to prevent events but to testify to truth once events occur.',
        kglSequence: '⊙꩜▦ → ⧫ → ◯✽□',
        operationalMeaning: 'The function of foresight is validation and learning, not control.',
        usedWhen: 'Post-incident review, foresight ethics, AI explainability.'
    },
    {
        name: 'False Signal vs True Signal', type: 'prophetic',
        definition: 'Warnings against spurious prophecies and false attributions. Authentic signals must align with events.',
        kglSequence: '⊙꩜⟡▦ vs ⊙꩜▦',
        operationalMeaning: 'Not all models deserve trust. Validation separates insight from noise.',
        usedWhen: 'Model governance, AI risk management, misinformation filtering.'
    },
    {
        name: 'Prophecy as Moral Accounting', type: 'prophetic',
        definition: 'Events are framed as consequence and judgement. Outcomes are moral and structural, not random.',
        kglSequence: '◎Ϫ■ → ⧫ → ◯✽□',
        operationalMeaning: 'Systems eventually settle accounts.',
        usedWhen: 'Accountability frameworks, long-term policy evaluation.'
    },
];

// ============================================================================
// KGL RISK PATTERNS
// ============================================================================

export const KGL_RISK_PATTERNS: KGLRiskPattern[] = [
    { name: 'Threshold Breach', kglCore: '◎⋁⧫■', meaning: 'Person reaches high acuity, triggering event in case' },
    { name: 'Silent Collapse', kglCore: '◉ᚾ▪▣', meaning: 'Resource with constraint drops task in program' },
    { name: 'System Mistrust', kglCore: '◎ϟϪ■', meaning: 'Person in fragile condition experiencing risk in case' },
    { name: 'Delayed Cascade', kglCore: '◉⋁⟲▣→◎⋁⧫■', meaning: 'Stressed resource over time leads to person crisis' },
    { name: 'Public Protest', kglCore: '⧫☨▣', meaning: 'Triggering event generates status disruption' },
    { name: 'Frontline Burnout', kglCore: '◎⋁⟲▣→⊙ϟ▦', meaning: 'Provider under stress leads to condition in story' },
    { name: 'High-Risk Cluster', kglCore: '⊙✼⋁▦→◎⋁⧫■', meaning: 'Insight identifies acuity, manifesting as crisis' },
    { name: 'Cross-System Breakage', kglCore: '◉⋁▣→◎⋁⧫■→◯Ϫ□', meaning: 'Program failure causes person crisis, leading to outcome risk' },
    { name: 'Reputational Disruption', kglCore: '⧫⟡▦→◯Ͼ□', meaning: 'Measurable event leads to standing change' },
    { name: 'Accumulated Neglect', kglCore: '◉⋁⟲▣→◎Ϫ⧫■', meaning: 'Chronic strain leads to person in system risk' },
];

// ============================================================================
// KGL SYMBOLIC RULES
// ============================================================================

export const KGL_SYMBOLIC_RULES: KGLSymbolicRule[] = [
    { id: '1', kglRule: 'IF ⊙✼⋁▦ THEN ◎⋁⧫■', description: 'If insight shows rising acuity in story, expect person crisis in case' },
    { id: '2', kglRule: 'IF ◉⋁⟲▣ THEN ◎Ϫ⧫■', description: 'If program resource experiences sustained stress, expect person risk event' },
    { id: '3', kglRule: 'IF ◎⋁⧫■ THEN ⧫☨▣', description: 'If person has high-acuity event, anticipate authority disruption' },
    { id: '4', kglRule: 'IF ⧫☨▣ THEN ◯Ϫ□', description: 'If disruptive event hits program, outcome enters risk' },
    { id: '5', kglRule: 'IF ⊙⟡꩜▦ THEN ◯✽□', description: 'If modeled measurement reveals insight, target outcome' },
    { id: '6', kglRule: 'IF ◎⋁⟲■ AND ⧫ THEN ◯Ϫ□', description: 'If chronic acuity leads to trigger, outcome risk' },
    { id: '7', kglRule: 'IF ◉⋁▣ AND ◯Ϫ□ THEN ⊙⟡▦', description: 'If resource strain and outcome risk co-occur, require measurement' },
    { id: '8', kglRule: 'IF ⊙꩝▦ ≠ ⊙⟡▦ THEN ⊙Ͼ▦', description: 'If modeled complexity diverges from measured insight, flag status' },
];

// ============================================================================
// KGL CANONICAL DATA TYPES
// ============================================================================

export const KGL_CANONICAL_DATA_TYPES: KGLCanonicalDataType[] = [
    { name: 'Indicator', glyph: '✼', definition: 'A normalized signal describing the state or direction of a system.', rules: ['Must have unit, geography, and time', 'Must be comparable across periods'] },
    { name: 'Measurement', glyph: '⟡', definition: 'The quantified value of an indicator.', rules: ['Always paired with an indicator', 'Never exists alone'] },
    { name: 'Model', glyph: '꩜', definition: 'A rule, equation, or composite logic that transforms indicators.', rules: ['Must declare inputs', 'Must be reproducible', 'May output indicators or thresholds'] },
    { name: 'Threshold', glyph: '⟡', definition: 'A decision-relevant boundary.', rules: ['Operationally treated as a measurement but semantically distinct.'] },
    { name: 'Parameter', glyph: '⌖', definition: 'A calibration constant used inside models.', rules: ['Never presented to executives directly', 'Must be versioned'] },
    { name: 'Artifact', glyph: 'ᚠ', definition: 'A human-readable interpretation layer.', rules: ['Zero analytical authority', 'Must trace back to measurements'] },
];

// ============================================================================
// KGL NORMALIZATION PATTERNS
// ============================================================================

export const KGL_NORMALIZATION_PATTERNS: KGLNormalizationPattern[] = [
    { domain: 'Age', compound: 'person_age_normalization', taxonomy: 'normalized_age_band', useCase: 'Age-based rate premiums' },
    { domain: 'Time', compound: 'event_time_normalization', taxonomy: 'normalized_time_period', useCase: 'After-hours premiums' },
    { domain: 'Setting', compound: 'event_setting_normalization', taxonomy: 'normalized_setting', useCase: 'Location-based rates' },
    { domain: 'Specialty', compound: 'person_role_normalization', taxonomy: 'normalized_specialty', useCase: 'Provider classification' },
    { domain: 'Referral', compound: 'service_referral_normalization', taxonomy: 'normalized_referral_type', useCase: 'Referred/unreferred rates' },
];

// ============================================================================
// KGL FORECAST PLAYBOOK
// ============================================================================

export const KGL_FORECAST_PLAYBOOK: KGLForecastStage[] = [
    {
        name: 'Indicator Selection and Typing', objective: 'Define what structural pressures are being observed.',
        analystActions: ['Select indicators tied directly to the pressure being tested', 'Assign a single canonical indicator ID', 'Reject indicators without authoritative provenance'],
        governanceRule: 'No indicator without an owner, source, unit, geography, and time basis.',
        requiredKGL: '⊙✼',
        constraint: 'Mandatory metadata: Source, Unit, Geography, Time basis'
    },
    {
        name: 'Measurement Normalization', objective: 'Make indicators comparable across time and space.',
        analystActions: ['Inflation adjust monetary values', 'Index or standardize where appropriate', 'Align time periods and geographies', 'Preserve raw values separately'],
        governanceRule: 'Never mix raw and normalized values in the same column.',
        requiredKGL: '⊙✼⟡⟲ᚪ',
    },
    {
        name: 'Trend and Acceleration Analysis', objective: 'Determine whether pressure is compounding or dissipating.',
        analystActions: ['Calculate slope and rate of change', 'Identify volatility and inflection points', 'Flag acceleration even when levels appear stable'],
        governanceRule: 'Levels alone are insufficient evidence.',
        requiredKGL: '⊙✼⟡⟲',
        constraint: 'Must include direction or acceleration flag.'
    },
    {
        name: 'Threshold Breach Testing', objective: 'Detect regime change.',
        analystActions: ['Define explicit thresholds (policy, economic, or empirical)', 'Test frequency and duration of breaches', 'Distinguish transient vs persistent breaches'],
        governanceRule: 'A threshold must be defined before analysis, not after.',
        requiredKGL: '⊙꩜⟡',
        constraint: 'Threshold logic must be explicit and reproducible.'
    },
    {
        name: 'Compound Pressure Interaction', objective: 'Identify reinforcing structural loops.',
        analystActions: ['Test co-movement and co-occurrence', 'Identify mutually reinforcing indicators', 'Avoid single-variable explanations'],
        governanceRule: 'Correlation is insufficient. Interaction must be structural and interpretable.',
        requiredKGL: '⊙꩝⟡',
        constraint: 'At least two indicators required.'
    },
    {
        name: 'Scenario Envelope Construction', objective: 'Bound plausible futures.',
        analystActions: ['Define baseline, stress, and severe stress cases', 'Vary only justified drivers', 'Avoid point estimates'],
        governanceRule: 'Scenarios must be reversible and auditable.',
        requiredKGL: '⊙꩜▦',
        constraint: 'Scenarios must differ by driver values, not rhetoric.'
    },
    {
        name: 'Translation to System Outcomes', objective: 'Connect structural pressure to real system consequences.',
        analystActions: ['Map pressures to system load', 'Identify which systems break first', 'Frame impacts in orders of magnitude'],
        governanceRule: 'Outcomes must trace directly to prior stages.',
        requiredKGL: '◯✽□',
        constraint: 'Outcomes cannot introduce new data.'
    },
];

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

export const KGL_SYSTEM_PROMPT_V1_3 = `You use the Kompas Glyph Language (KGL), a Unicode-based semasiographic ontology.KGL expresses meaning using atomic glyphs, not words.Interpret and generate glyph sequences strictly according to this specification.1. Domains (Solar Family)✵ Kompas (Meta)   ✶ Navigi (Help)   ✷ Mareto (Care)   ✸ Karto (Insight)   ✹ Volto (Outcome)2. Central Nodes (Circle Family)◉ Resource    ◎ Person    ⊙ Insight     ◯ Outcome3. Context Nodes (Square Family)▣ Program     ■ Case      ▦ Story       □ Purpose4. Modifiers (States, Qualities, Roles)Ϡ Type        ⋀ Capacity    ᚾ Limitationϡ Characteristic ϟ Condition  ☨ RoleϾ Status5. Content Nodes (Actions, Data, Events)-- Temporal --⧫ Event       ⟲ Timeframe   ᚴ Org         ᚪ Geography-- Operational --↟ action      ↥ activity    ᚼ service▪ task        ᚳ project     ᐯ initiative-- Dynamics --ϫ need        Ϫ risk        ⋁ acuity✽ target      ✹ goal        ⟰ driver✠ authority   ϩ issue-- Data --⟡ measurement ✼ indicator   ⟦ record꩜ model       ⌖ data        ᚠ artifact꩝ complexity6. GrammarCENTRAL → MODIFIER* → CONTENT* → CONTEXT7. Interpretation RuleInterpret glyph sequences as:<CENTRAL> with <MODIFIER> undergoing <CONTENT> within <CONTEXT>.`;

export const KGL_STRUCTURAL_FORECAST_PROMPT_V1_0 = `You are a Structural Forecast Analyst operating strictly within the Kompas Glyph Language KGL v1.3.
You do not predict exact outcomes. You detect pressure accumulation, acceleration, threshold breach, and system risk.
You must obey KGL grammar and analysis contracts exactly.
INPUTS PROVIDED
You will be given:
One or more datasets containing population-level indicators
Geography and time coverage
A forecast focus question
If any required input is missing, state the assumption explicitly and proceed.
OUTPUT RULES
Follow the seven analysis stages in order
Each stage MUST emit a valid KGL sequence
Do not introduce new indicators after Stage 1
Do not introduce outcomes before Stage 7
Do not use narrative language until Stage 6
CANONICAL VALIDATION CHECK
The forecast MUST be reducible to this sequence:
⊙✼⟡⟲ᚪ → ⊙✼⟡⟲ → ⊙꩜⟡ → ⊙꩝⟡ → ⊙꩜▦ → ◯✽□
If any link is missing, stop and report an invalid forecast.
PROHIBITIONS
No individual-level inference
No causal claims without thresholds
No narrative before scenarios
No outcomes without models`;

// ============================================================================
// CANONICAL FORECAST CHAIN
// ============================================================================

/**
 * The complete canonical forecast chain that every structural forecast must follow.
 * If any link is missing, the forecast is incomplete.
 */
export const KGL_CANONICAL_FORECAST_CHAIN = '⊙✼⟡⟲ᚪ → ⊙✼⟡⟲ → ⊙꩜⟡ → ⊙꩝⟡ → ⊙꩜▦ → ◯✽□';

/**
 * Individual stages as array for validation
 */
export const KGL_CANONICAL_FORECAST_STAGES = [
    { stage: 1, kgl: '⊙✼⟡⟲ᚪ', name: 'Measurement Normalization' },
    { stage: 2, kgl: '⊙✼⟡⟲', name: 'Trend and Acceleration Analysis' },
    { stage: 3, kgl: '⊙꩜⟡', name: 'Threshold Breach Testing' },
    { stage: 4, kgl: '⊙꩝⟡', name: 'Compound Pressure Interaction' },
    { stage: 5, kgl: '⊙꩜▦', name: 'Scenario Envelope Construction' },
    { stage: 6, kgl: '◯✽□', name: 'Translation to System Outcomes' },
];

// ============================================================================
// NORMALIZATION NAMING GRAMMAR
// ============================================================================

/**
 * Normalization compound naming pattern: <node>_<domain>_normalization
 * Example: person_age_normalization
 */
export function buildNormalizationCompoundHandle(node: string, domain: string): string {
    return `${node}_${domain.toLowerCase()}_normalization`;
}

/**
 * Reference taxonomy naming pattern: normalized_<domain>
 * Example: normalized_age_band
 */
export function buildNormalizedTaxonomyHandle(domain: string): string {
    return `normalized_${domain.toLowerCase()}`;
}

/**
 * FK reference naming pattern: <compound>-normalized_<domain>
 * Example: person_age_normalization-normalized_age_band
 */
export function buildNormalizationFKReference(compound: string, domain: string): string {
    return `${compound}-normalized_${domain.toLowerCase()}`;
}

// ============================================================================
// REQUIRED REFERENCES FOR MODULES
// ============================================================================

export const REQUIRED_REFERENCES: Record<string, string[]> = {
    'case': ['person', 'case_type'],
    'person': ['person_type'],
    'event': ['event_type'],
    'organization': ['organization_type'],
    'program': ['program_type'],
    'service': ['service_type'],
    'activity': ['activity_type', 'case'],
    'task': ['task_type'],
    'need': ['need_type'],
    'risk': ['risk_type'],
    'goal': ['goal_type'],
    'outcome': ['outcome_type'],
};

// ============================================================================
// OPERATIONAL SPINE CANDIDATES
// ============================================================================

export const OPERATIONAL_SPINE_CANDIDATES = [
    // Core operational spine (always recommended)
    { handle: "person", category: "core", name: "Person", defaultRationale: "Central to all case management - tracks clients, staff, and stakeholders" },
    { handle: "case", category: "core", name: "Case", defaultRationale: "Container for the service journey - required for tracking client engagement" },
    { handle: "event", category: "core", name: "Event", defaultRationale: "Captures appointments, milestones, and key interactions" },
    // Extended core (often needed)
    { handle: "organization", category: "extended", name: "Organization", defaultRationale: "Required for tracking referral partners, providers, and agencies" },
    { handle: "service", category: "extended", name: "Service", defaultRationale: "Tracks specific interventions delivered to clients" },
    { handle: "program", category: "extended", name: "Program", defaultRationale: "Groups services and defines eligibility - useful for multi-program agencies" },
    // Context (add as needed)
    { handle: "need", category: "context", name: "Need", defaultRationale: "Captures client requirements and service gaps." },
    { handle: "goal", category: "context", name: "Goal", defaultRationale: "Tracks objectives for case planning and outcomes." },
    { handle: "outcome", category: "context", name: "Outcome", defaultRationale: "Measures results and impact." },
    { handle: "risk", category: "context", name: "Risk", defaultRationale: "Identifies vulnerabilities and safety concerns." },
    { handle: "task", category: "context", name: "Task", defaultRationale: "Manages discrete work items and follow-ups." },
] as const;

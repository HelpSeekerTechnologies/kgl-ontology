/**
 * KGL Canonical Ontology Data Store
 *
 * This file serves as the single source of truth for the Kompas Glyph Language (KGL)
 * ontology. It programmatically defines all canonical nodes, relationships, rules,
 * mappings, and auxiliary data structures as specified in the KGL v1.3 documentation.
 *
 * It uses a generative approach for large, derivable lists to ensure consistency and reduce manual errors.
 */

import {
    KGLNode, KGLCompoundRelationship, KGLTypeTaxonomy, KGLSubTaxonomy, KGLField,
    KGLRule, KGLConceptMapping, KGLDomainDescription, KGLStoryType, KGLRiskPattern,
    KGLSymbolicRule, KGLCanonicalDataType, KGLNormalizationPattern, KGLForecastStage,
    NodeCategory, ContentSubcategory, DomainFocus
} from './types';

// ============================================================================
// 1. KGL NODES: The 45 Canonical Nodes
// ============================================================================
// This is the core, manually defined list from which many other lists are derived.

export const KGL_NODES: KGLNode[] = [
    // Domain Nodes (5)
    { handle: 'kompas', name: 'Kompas', kgl: '✵', category: 'Domain', subcategory: 'Meta', description: 'Meta domain' },
    { handle: 'navigi', name: 'Navigi', kgl: '✶', category: 'Domain', subcategory: 'Access', description: 'Help-seeker access' },
    { handle: 'mareto', name: 'Mareto', kgl: '✷', category: 'Domain', subcategory: 'Delivery', description: 'Service delivery' },
    { handle: 'karto', name: 'Karto', kgl: '✸', category: 'Domain', subcategory: 'Analysis', description: 'Analysis and insight' },
    { handle: 'volto', name: 'Volto', kgl: '✹', category: 'Domain', subcategory: 'Outcomes', description: 'Outcomes and value' },

    // Central Nodes (4)
    { handle: 'resource', name: 'Resource', kgl: '◉', category: 'Central', domain: 'navigi', description: 'Available assets, supports, funding, payments, money, financial resources, budgets', defaultRationale: "Central asset for tracking financial/material supports." },
    { handle: 'person', name: 'Person', kgl: '◎', category: 'Central', domain: 'mareto', description: 'Individual being served, client, participant, beneficiary, user', defaultRationale: "Central entity for tracking clients, staff, and stakeholders." },
    { handle: 'insight', name: 'Insight', kgl: '⊙', category: 'Central', domain: 'karto', description: 'Analytical finding, pattern, discovery, learning', defaultRationale: "Core for capturing analytical findings and discoveries." },
    { handle: 'outcome', name: 'Outcome', kgl: '◯', category: 'Central', domain: 'volto', description: 'Result achieved, impact, benefit, change measured', defaultRationale: "Central for measuring impact and results." },

    // Context Nodes (4)
    { handle: 'program', name: 'Program', kgl: '▣', category: 'Context', domain: 'navigi', description: 'Structured service offering, initiative container, funded program', defaultRationale: "Groups services and defines eligibility." },
    { handle: 'case', name: 'Case', kgl: '■', category: 'Context', domain: 'mareto', description: 'Container for service journey, client file, episode of care', defaultRationale: "Container for a client's service journey." },
    { handle: 'story', name: 'Story', kgl: '▦', category: 'Context', domain: 'karto', description: 'Narrative container, qualitative account', defaultRationale: "For qualitative accounts and narrative context." },
    { handle: 'purpose', name: 'Purpose', kgl: '□', category: 'Context', domain: 'volto', description: 'Strategic intent, mission, vision, why', defaultRationale: "Defines strategic intent and value realization." },

    // Content - Temporal & Structural Nodes (4)
    { handle: 'event', name: 'Event', kgl: '⧫', category: 'Content', subcategory: 'Temporal', description: 'Significant occurrence, milestone, appointment, session, transaction', defaultRationale: "Captures appointments, milestones, and key interactions." },
    { handle: 'timeframe', name: 'Timeframe', kgl: '⟲', category: 'Content', subcategory: 'Temporal', description: 'Period, duration, schedule, date range' },
    { handle: 'organization', name: 'Organization', kgl: 'ᚴ', category: 'Content', subcategory: 'Temporal', description: 'Agency, institution, provider, funder, partner', defaultRationale: "Required for tracking referral partners, providers, and agencies." },
    { handle: 'geography', name: 'Geography', kgl: 'ᚪ', category: 'Content', subcategory: 'Temporal', description: 'Location, address, region, territory, catchment' },

    // Content - Operational Nodes (6)
    { handle: 'action', name: 'Action', kgl: '↟', category: 'Content', subcategory: 'Operational', description: 'General operation, step taken' },
    { handle: 'activity', name: 'Activity', kgl: '↥', category: 'Content', subcategory: 'Operational', description: 'Discrete tracked action, engagement, intervention unit' },
    { handle: 'service', name: 'Service', kgl: 'ᚼ', category: 'Content', subcategory: 'Operational', description: 'Delivered intervention, support type, offering', defaultRationale: "Tracks specific interventions delivered to clients." },
    { handle: 'task', name: 'Task', kgl: '▪', category: 'Content', subcategory: 'Operational', description: 'Discrete work item, to-do, checklist item', defaultRationale: "Manages discrete work items and follow-ups." },
    { handle: 'project', name: 'Project', kgl: 'ᚳ', category: 'Content', subcategory: 'Operational', description: 'Program element, funded project, grant-funded work' },
    { handle: 'initiative', name: 'Initiative', kgl: 'ᐯ', category: 'Content', subcategory: 'Operational', description: 'Strategic effort, campaign, reform' },

    // Content - Dynamics Nodes (8)
    { handle: 'need', name: 'Need', kgl: 'ϫ', category: 'Content', subcategory: 'Dynamics', description: 'Requirement, gap, presenting issue, demand', defaultRationale: "Captures client requirements and service gaps." },
    { handle: 'risk', name: 'Risk', kgl: 'Ϫ', category: 'Content', subcategory: 'Dynamics', description: 'Probability of harm, vulnerability, danger, hazard', defaultRationale: "Identifies vulnerabilities and safety concerns." },
    { handle: 'acuity', name: 'Acuity', kgl: '⋁', category: 'Content', subcategory: 'Dynamics', description: 'Intensity, severity level, priority, urgency' },
    { handle: 'target', name: 'Target', kgl: '✽', category: 'Content', subcategory: 'Dynamics', description: 'Specific objective, KPI, quota, benchmark', defaultRationale: "Defines specific objectives and key performance indicators." },
    { handle: 'goal', name: 'Goal', kgl: '✹', category: 'Content', subcategory: 'Dynamics', description: 'Strategic objective, aim, aspiration', defaultRationale: "Tracks strategic objectives for case planning and outcomes." },
    { handle: 'driver', name: 'Driver', kgl: '⟰', category: 'Content', subcategory: 'Dynamics', description: 'Causal force, root cause, contributing factor' },
    { handle: 'authority', name: 'Authority', kgl: '✠', category: 'Content', subcategory: 'Dynamics', description: 'Decision-making power, mandate, jurisdiction' },
    { handle: 'issue', name: 'Issue', kgl: 'ϩ', category: 'Content', subcategory: 'Dynamics', description: 'Problem, concern, barrier, blocker', defaultRationale: "Identifies problems, concerns, or barriers." },

    // Content - Data & Measurement Nodes (7)
    { handle: 'measurement', name: 'Measurement', kgl: '⟡', category: 'Content', subcategory: 'Data', description: 'Assessment, evaluation, score, rating' },
    { handle: 'indicator', name: 'Indicator', kgl: '✼', category: 'Content', subcategory: 'Data', description: 'Metric signal, KPI, measure definition' },
    { handle: 'record', name: 'Record', kgl: '⟦', category: 'Content', subcategory: 'Data', description: 'Database row or file, log entry' },
    { handle: 'model', name: 'Model', kgl: '꩜', category: 'Content', subcategory: 'Data', description: 'Statistical logic, algorithm, prediction model' },
    { handle: 'data', name: 'Data', kgl: '⌖', category: 'Content', subcategory: 'Data', description: 'Raw information, dataset, field' },
    { handle: 'artifact', name: 'Artifact', kgl: 'ᚠ', category: 'Content', subcategory: 'Data', description: 'Produced output, report, document, deliverable' },
    { handle: 'complexity', name: 'Complexity', kgl: '꩝', category: 'Content', subcategory: 'Data', description: 'Complexity measure, difficulty level' },

    // Modifier Nodes (7)
    { handle: 'type', name: 'Type', kgl: 'Ϡ', category: 'Modifier', subcategory: 'Classification', description: 'Classification (taxonomy only)', isStandaloneModifier: false, validExtensions: ['status', 'condition', 'characteristic', 'capacity', 'limitation'] },
    { handle: 'status', name: 'Status', kgl: 'Ͼ', category: 'Modifier', subcategory: 'State', description: 'Phase or standing', isStandaloneModifier: true, validExtensions: ['condition', 'characteristic', 'role', 'capacity', 'limitation'] },
    { handle: 'condition', name: 'Condition', kgl: 'ϟ', category: 'Modifier', subcategory: 'State', description: 'Temporary state', isStandaloneModifier: true, validExtensions: ['status', 'characteristic', 'role', 'capacity', 'limitation'] },
    { handle: 'characteristic', name: 'Characteristic', kgl: 'ϡ', category: 'Modifier', subcategory: 'Trait', description: 'Trait', isStandaloneModifier: true, validExtensions: ['status', 'condition', 'role', 'capacity', 'limitation'] },
    { handle: 'role', name: 'Role', kgl: '☨', category: 'Modifier', subcategory: 'Relation', description: 'Functional relation', isStandaloneModifier: true, validExtensions: ['status', 'condition', 'characteristic', 'capacity', 'limitation'] },
    { handle: 'capacity', name: 'Capacity', kgl: '⋀', category: 'Modifier', subcategory: 'Ability', description: 'Ability or intensity', isStandaloneModifier: true, validExtensions: ['status', 'condition', 'characteristic', 'role', 'limitation'] },
    { handle: 'limitation', name: 'Limitation', kgl: 'ᚾ', category: 'Modifier', subcategory: 'Constraint', description: 'Constraint', isStandaloneModifier: true, validExtensions: ['status', 'condition', 'characteristic', 'role', 'capacity'] },
];

// ============================================================================
// DERIVED SETS AND GROUPINGS
// ============================================================================

export const CANONICAL_HANDLES = KGL_NODES.map(n => n.handle);
export const CANONICAL_NODES_SET = new Set(CANONICAL_HANDLES);
export const MODIFIER_HANDLES = KGL_NODES.filter(n => n.category === 'Modifier').map(n => n.handle);
export const MODIFIER_HANDLES_SET = new Set(MODIFIER_HANDLES);
export const DOMAIN_HANDLES = KGL_NODES.filter(n => n.category === 'Domain').map(n => n.handle);
export const DOMAIN_HANDLES_SET = new Set(DOMAIN_HANDLES);

export const KGL_NODES_BY_CATEGORY = KGL_NODES.reduce((acc, node) => {
    (acc[node.category] ||= []).push(node);
    return acc;
}, {} as Record<NodeCategory, KGLNode[]>);

export const KGL_CONTENT_NODES_BY_SUBCATEGORY = KGL_NODES.filter(n => n.category === 'Content').reduce((acc, node) => {
    const sub = node.subcategory || 'Other';
    (acc[sub] ||= []).push(node);
    return acc;
}, {} as Record<string, KGLNode[]>);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a KGLNode by handle
 */
export function getNodeByHandle(handle: string): KGLNode | undefined {
    return KGL_NODES.find(n => n.handle === handle);
}

/**
 * Get all nodes in a specific category
 */
export function getNodesByCategory(category: NodeCategory): KGLNode[] {
    return KGL_NODES.filter(node => node.category === category);
}

/**
 * Get all branch/domain nodes
 */
export function getBranchNodes(): KGLNode[] {
    return getNodesByCategory('Domain');
}

/**
 * Search nodes by name or description
 */
export function searchNodes(query: string): KGLNode[] {
    const lowerQuery = query.toLowerCase();
    return KGL_NODES.filter(
        node =>
            node.name.toLowerCase().includes(lowerQuery) ||
            node.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Checks if a given handle is a modifier handle
 */
export function isModifierHandle(handle: string): boolean {
    return MODIFIER_HANDLES_SET.has(handle);
}

/**
 * Checks if a given handle is a domain handle
 */
export function isDomainHandle(handle: string): boolean {
    return DOMAIN_HANDLES_SET.has(handle);
}

// ============================================================================
// 2. KGL TYPE TAXONOMIES: Programmatically Generated
// ============================================================================

function generateKGLTypeTaxonomies(): KGLTypeTaxonomy[] {
    const types: KGLTypeTaxonomy[] = [];
    const typeModifierNode = getNodeByHandle('type');
    if (!typeModifierNode) return types;

    for (const node of KGL_NODES) {
        if (node.handle === 'type') continue; // R4: No type_type

        const kgl = `${node.kgl}${typeModifierNode.kgl}`;
        types.push({
            handle: `${node.handle}_type`,
            name: `${node.name} Type`,
            kgl: kgl,
            parent: node.handle,
            category: node.category,
            description: `${node.description} classification`
        });
    }

    return types;
}

export const KGL_TYPE_TAXONOMIES: KGLTypeTaxonomy[] = generateKGLTypeTaxonomies();
export const KGL_TYPE_TAXONOMIES_SET = new Set(KGL_TYPE_TAXONOMIES.map(t => t.handle));

// ============================================================================
// 3. KGL COMPOUND RELATIONSHIPS: Programmatically Generated
// ============================================================================

function generateKGLCompoundRelationships(): KGLCompoundRelationship[] {
    const compounds: KGLCompoundRelationship[] = [];
    const nodes = KGL_NODES.filter(n => !DOMAIN_HANDLES_SET.has(n.handle)); // Exclude domain nodes

    for (const nodeA of nodes) {
        for (const nodeB of nodes) {
            if (nodeA.handle === nodeB.handle) continue; // R5: No node repetition

            const compoundHandle = `${nodeA.handle}_${nodeB.handle}`;
            const kglCompound = `${nodeA.kgl}${nodeB.kgl}`;
            const typeLink = `${compoundHandle}-${compoundHandle}_type`;

            // Basic semantic meaning
            const semanticMeaning = `${nodeA.name} related to ${nodeB.name}`;

            compounds.push({
                handleA: nodeA.handle,
                kglA: nodeA.kgl,
                handleB: nodeB.handle,
                kglB: nodeB.kgl,
                compound: compoundHandle,
                kglCompound: kglCompound,
                typeLink: typeLink,
                semanticMeaning: semanticMeaning
            });
        }
    }

    // Add Modifier-on-Modifier compounds
    for (const modA of MODIFIER_HANDLES) {
        const nodeA = getNodeByHandle(modA);
        if (!nodeA) continue;
        for (const modB of (nodeA.validExtensions || [])) {
            const nodeB = getNodeByHandle(modB);
            if (!nodeB) continue;

            const compoundHandle = `${modA}_${modB}`;
            const kglCompound = `${nodeA.kgl}${nodeB.kgl}`;
            const typeLink = `${compoundHandle}-${compoundHandle}_type`;
            const semanticMeaning = `${nodeB.name} of a ${nodeA.name}`;

            if (!compounds.some(c => c.compound === compoundHandle)) {
                 compounds.push({
                    handleA: modA, kglA: nodeA.kgl,
                    handleB: modB, kglB: nodeB.kgl,
                    compound: compoundHandle, kglCompound: kglCompound,
                    typeLink: typeLink, semanticMeaning: semanticMeaning
                });
            }
        }
    }

    return compounds;
}

export const KGL_COMPOUND_RELATIONSHIPS: KGLCompoundRelationship[] = generateKGLCompoundRelationships();
export const KGL_COMPOUND_HANDLES_SET = new Set(KGL_COMPOUND_RELATIONSHIPS.map(r => r.compound));

// Now extend KGL_TYPE_TAXONOMIES with compound types
KGL_COMPOUND_RELATIONSHIPS.forEach(cr => {
    const typeHandle = `${cr.compound}_type`;
    if (!KGL_TYPE_TAXONOMIES_SET.has(typeHandle)) {
        const parentNode = getNodeByHandle(cr.handleA);
        if (parentNode) {
            const typeModifierNode = getNodeByHandle('type');
            if (typeModifierNode) {
                KGL_TYPE_TAXONOMIES.push({
                    handle: typeHandle,
                    name: `${cr.semanticMeaning} Type`,
                    kgl: `${cr.kglCompound}${typeModifierNode.kgl}`,
                    parent: cr.compound,
                    category: parentNode.category,
                    description: `Classification for ${cr.semanticMeaning}`
                });
                KGL_TYPE_TAXONOMIES_SET.add(typeHandle);
            }
        }
    }
});

// ============================================================================
// 4. MODIFIER-ON-MODIFIER COMPATIBILITY
// ============================================================================

export const MODIFIER_MODIFIER_COMPATIBILITY: Record<string, Set<string>> = KGL_NODES
    .filter(node => node.category === 'Modifier' && node.validExtensions)
    .reduce((acc, node) => {
        acc[node.handle] = new Set(node.validExtensions!);
        return acc;
    }, {} as Record<string, Set<string>>);

// ============================================================================
// 5. NODE-MODIFIER SEMANTIC COMPATIBILITY (38×14 Matrix)
// ============================================================================

/**
 * Defines which modifiers are semantically valid for each node.
 * Based on KGL v1.3 Section 5.2 Semantic Compatibility Matrix.
 *
 * Key constraints:
 * - Only person, case, event can have 'condition' (temporary states)
 * - Only person, case, event can have 'acuity' (intensity levels)
 * - 'role' only for person, organization, task, authority
 * - All nodes can have status, characteristic, limitation
 */
export const NODE_MODIFIER_COMPATIBILITY: Record<string, Set<string>> = {
    // Domain nodes
    'kompas': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'navigi': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'mareto': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'karto': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'volto': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),

    // Central nodes
    'resource': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'person': new Set(['status', 'condition', 'characteristic', 'role', 'acuity', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'issue']),
    'insight': new Set(['status', 'characteristic', 'risk', 'limitation', 'target', 'goal', 'driver', 'issue']),
    'outcome': new Set(['status', 'characteristic', 'risk', 'limitation', 'target', 'goal', 'issue']),

    // Context nodes
    'program': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'case': new Set(['status', 'condition', 'characteristic', 'acuity', 'risk', 'need', 'capacity', 'limitation', 'issue']),
    'story': new Set(['status', 'characteristic', 'risk', 'limitation', 'target', 'goal', 'driver', 'issue']),
    'purpose': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'authority', 'issue']),

    // Content - Temporal/Structural
    'event': new Set(['status', 'condition', 'characteristic', 'acuity', 'risk', 'limitation', 'driver', 'issue']),
    'timeframe': new Set(['status', 'characteristic', 'limitation', 'issue']),
    'organization': new Set(['status', 'characteristic', 'role', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'geography': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'goal', 'driver', 'issue']),

    // Content - Operational
    'action': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'driver', 'issue']),
    'activity': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'driver', 'issue']),
    'service': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'driver', 'issue']),
    'task': new Set(['status', 'characteristic', 'role', 'risk', 'capacity', 'limitation', 'authority', 'issue']),
    'project': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),
    'initiative': new Set(['status', 'characteristic', 'risk', 'need', 'capacity', 'limitation', 'target', 'goal', 'driver', 'authority', 'issue']),

    // Content - Dynamics
    'need': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'goal', 'driver', 'issue']),
    'risk': new Set(['status', 'characteristic', 'capacity', 'limitation', 'driver', 'issue']),
    'acuity': new Set(['status', 'characteristic', 'risk', 'limitation', 'driver', 'issue']),
    'target': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'goal', 'driver', 'issue']),
    'goal': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'target', 'driver', 'issue']),
    'driver': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'issue']),
    'authority': new Set(['status', 'characteristic', 'role', 'risk', 'capacity', 'limitation', 'driver', 'issue']),
    'issue': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'driver']),

    // Content - Data/Measurement
    'indicator': new Set(['status', 'characteristic', 'risk', 'limitation', 'driver', 'issue']),
    'measurement': new Set(['status', 'characteristic', 'risk', 'limitation', 'driver', 'issue']),
    'record': new Set(['status', 'characteristic', 'limitation', 'issue']),
    'model': new Set(['status', 'characteristic', 'risk', 'capacity', 'limitation', 'driver', 'issue']),
    'data': new Set(['status', 'characteristic', 'limitation', 'issue']),
    'artifact': new Set(['status', 'characteristic', 'limitation', 'issue']),
    'complexity': new Set(['status', 'characteristic', 'risk', 'limitation', 'driver', 'issue']),
};

/**
 * Check if a modifier is semantically valid for a given node
 * @param nodeHandle - The handle of the base node
 * @param modifierHandle - The handle of the modifier to check
 * @returns true if the modifier is valid for this node
 */
export function isModifierValidForNode(nodeHandle: string, modifierHandle: string): boolean {
    const validModifiers = NODE_MODIFIER_COMPATIBILITY[nodeHandle];
    if (!validModifiers) return false;
    return validModifiers.has(modifierHandle);
}

/**
 * Get all valid modifiers for a given node
 * @param nodeHandle - The handle of the node
 * @returns Array of valid modifier handles, or empty array if node not found
 */
export function getValidModifiersForNode(nodeHandle: string): string[] {
    const validModifiers = NODE_MODIFIER_COMPATIBILITY[nodeHandle];
    if (!validModifiers) return [];
    return Array.from(validModifiers);
}

// ============================================================================
// IMPORT CANONICAL DATA
// ============================================================================

export * from './canonicalData';

// ============================================================================
// GENERATE KNOWN CANONICAL HANDLES
// ============================================================================

/**
 * Generates a comprehensive set of all known canonical KGL handles,
 * including Level 1 nodes, Level 2 compounds, Level 2 type taxonomies,
 * and Level 3 sub-type taxonomies. Used by parsers for robust handle detection.
 */
export function generateKnownCanonicalHandles(): Set<string> {
    const known = new Set<string>();
    // Level 1: All canonical nodes
    KGL_NODES.forEach(n => known.add(n.handle));
    // Level 2: All compound relationships
    KGL_COMPOUND_RELATIONSHIPS.forEach(r => known.add(r.compound));
    // Level 2: All type taxonomies
    KGL_TYPE_TAXONOMIES.forEach(t => known.add(t.handle));
    return known;
}

export const KNOWN_CANONICAL_HANDLES_FOR_PARSING = generateKnownCanonicalHandles();

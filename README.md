# KGL Ontology v1.3

**Kompas Glyph Language** - A universal data modeling language for social services and case management.

## Overview

KGL (Kompas Glyph Language) is a structured ontology designed to provide a single source of truth for data modeling across social services, healthcare, and case management domains. It provides:

- **45 Canonical Nodes** - Core entities organized into 5 categories
- **7 Modifiers** - Semantic extensions for nodes
- **55 Validation Rules** - Comprehensive rule set across 6 categories
- **Level System** - L1 (nodes) → L2 (compounds) → L3 (sub-taxonomies) → L4+ (nested)

## Installation

```bash
npm install @helpseeker/kgl-ontology
```

## Quick Start

```typescript
import { OntologyGateway, OntologyRegistry, RuleRegistry } from '@helpseeker/kgl-ontology';

// Validate a handle
const result = OntologyGateway.validateHandle('person_case');
console.log(result.isValid); // true

// Get all canonical nodes
const nodes = OntologyRegistry.getAllNodes();
console.log(nodes.length); // 45

// Get rule definition
const rule = RuleRegistry.getRuleDefinition('R01');
console.log(rule.name); // "Node Combinability"
```

## Canonical Nodes (45)

### Spine Nodes (5)
Core entities for case management:
- `person` - Any human individual
- `case` - Container for a service engagement
- `event` - Time-bound occurrence
- `service` - Deliverable intervention
- `outcome` - Measurable result

### Legal Nodes (5)
- `document`, `agreement`, `jurisdiction`, `compliance`, `authority`

### Clinical Nodes (6)
- `assessment`, `diagnosis`, `treatment`, `medication`, `provider`, `facility`

### Personal Nodes (10)
- `employment`, `education`, `housing`, `income`, `benefit`, `relationship`, `identity`, `contact`, `address`, `preference`

### Operational Nodes (19)
- `organization`, `program`, `resource`, `task`, `schedule`, `location`, `communication`, `note`, `attachment`, `metric`, `goal`, `plan`, `referral`, `enrollment`, `eligibility`, `consent`, `notification`, `audit`, `configuration`

## Modifiers (7)

Modifiers extend nodes to capture additional semantic dimensions:

| Modifier | Purpose | Example |
|----------|---------|---------|
| `type` | Classification taxonomy | `person_type` |
| `status` | Lifecycle state | `case_status` |
| `condition` | Temporary state | `person_condition` |
| `characteristic` | Permanent trait | `person_characteristic` |
| `role` | Relational context | `person_role` |
| `capacity` | Ability/intensity | `person_capacity` |
| `limitation` | Constraints | `person_limitation` |

## Validation Rules (55)

### Semantic & Structural (R01-R16)
Core semantic rules ensuring valid ontology usage.

| Rule | Name | Description |
|------|------|-------------|
| R01 | Node Combinability | Only valid node pairs can combine |
| R02 | Modifier Uniqueness | Each modifier type appears once per compound |
| R03 | Type Exclusivity | No compound can have multiple type taxonomies |
| R06 | Ontology Alignment | All handles must exist in ontology |
| ... | ... | ... |

### Taxonomy (T01-T10)
Rules for taxonomy structure and hierarchy.

### Modifier Pattern (M01-M04)
Rules for proper modifier usage.

### Selection (S01-S05)
Guidance for choosing appropriate compounds.

| Rule | Name | Description |
|------|------|-------------|
| S01 | Spine First | Always anchor to spine nodes |
| S02 | Question Test | Each compound answers a business question |
| S03 | Minimal Compounds | Use fewest compounds needed |
| S04 | Modifier Justification | Each modifier must be justified |
| S05 | Taxonomy Follows | Taxonomies follow compound selection |

### Normalization (N01-N07)
Rules for data normalization and consistency.

### Corteza Build (CB01-CB14)
Rules for Corteza-compatible output.

## Architecture

### Level System

```
L1: Canonical Nodes (45)
    └── person, case, event, service, outcome...

L2: Compounds & Type Taxonomies
    └── person_case, case_event, person_type, case_status...

L3: Sub-Taxonomies
    └── person_characteristic_type_gender, case_status_type_closed...

L4+: Nested Taxonomies (via parent FK)
    └── Deep hierarchical taxonomies
```

### Core Components

```typescript
// OntologyRegistry - Access canonical data
OntologyRegistry.getAllNodes()           // Get all 45 nodes
OntologyRegistry.validateHandle(handle)  // Validate a handle
OntologyRegistry.analyzeCompound(handle) // Analyze compound structure

// RuleRegistry - Rule definitions
RuleRegistry.getRuleDefinition(id)       // Get rule by ID
RuleRegistry.getRulesByCategory(cat)     // Get rules by category
RuleRegistry.getAllRuleIds()             // List all rule IDs

// OntologyGateway - Unified validation
OntologyGateway.validateHandle(handle)   // Validate single handle
OntologyGateway.validateCheckpoint(...)  // Pipeline stage validation
OntologyGateway.validateAll(...)         // Full validation
OntologyGateway.exportContextMarkdown()  // Export for AI priming
```

## Compound Formation Rules

Valid compounds are formed by combining nodes according to these rules:

1. **Spine + Spine**: `person_case`, `case_event`, `service_outcome`
2. **Any + Modifier**: `person_status`, `case_condition`, `event_type`
3. **Legal combinations**: `person_document`, `case_agreement`
4. **Clinical combinations**: `person_diagnosis`, `case_treatment`

## Usage with Validation Pipeline

```typescript
import { OntologyGateway } from '@helpseeker/kgl-ontology';
import type { ObjectModule, TaxonomyModule } from '@helpseeker/kgl-ontology';

// Configure strictness
OntologyGateway.configure({ strictness: 'strict' });

// Validate at pipeline checkpoints
const modules: ObjectModule[] = [...];
const taxonomies: TaxonomyModule[] = [...];

// Run checkpoint validation
const result = OntologyGateway.validateCheckpoint('build', modules, taxonomies);

if (!result.passed) {
  console.error('Validation errors:', result.errors);
}

// Run full validation
const fullReport = OntologyGateway.validateAll(modules, taxonomies);
console.log(`Valid: ${fullReport.isValid}`);
console.log(`Errors: ${fullReport.totalErrors}`);
```

## Export for AI Sessions

Generate context markdown for priming AI assistants:

```typescript
const context = OntologyGateway.exportContextMarkdown();
// Use this to prime Claude or other LLMs with KGL knowledge
```

## License

MIT License - HelpSeeker Technologies

## Contributing

Contributions are welcome! Please see our contributing guidelines.

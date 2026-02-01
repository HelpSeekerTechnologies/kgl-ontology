# KGL Ontology v1.3

**Kompas Glyph Language** - A platform-agnostic, universal data modeling language for social services and case management.

## Overview

KGL (Kompas Glyph Language) is a structured ontology designed to provide a single source of truth for data modeling across social services, healthcare, and case management domains. It provides:

- **45 Canonical Nodes** - Core entities organized into 5 categories
- **7 Modifiers** - Semantic extensions for nodes
- **41 Universal Validation Rules** - Platform-agnostic rules across 5 categories (R, T, M, S, N)
- **Level System** - L1 (nodes) → L2 (compounds) → L3 (sub-taxonomies) → L4+ (nested)

**Architecture Note**: Platform-specific rules (e.g., Corteza Build rules CB01-CB14) have been moved to `@helpseeker/data-model-generator` to maintain platform-agnostic ontology. This allows KGL to be exported to any target system (Corteza, PostgreSQL, Salesforce, etc.).

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

## Universal Validation Rules (41)

These rules define what valid KGL is, independent of deployment platform.

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

### Platform-Specific Rules

Platform-specific rules are maintained in their respective exporter packages:

- **Corteza Build (CB01-CB14)** → `@helpseeker/data-model-generator/CortezaValidator`
- **Future**: PostgreSQL rules, Salesforce rules, etc.

This separation ensures kgl-ontology remains platform-agnostic while allowing each exporter to enforce its own platform-specific requirements.

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

KGL Ontology provides five main components that work together to provide a complete data modeling and validation system:

#### 1. **OntologyRegistry** - Canonical Data Access

The single source of truth for all KGL canonical data (45 nodes, compounds, taxonomies).

```typescript
import { OntologyRegistry } from '@helpseeker/kgl-ontology';

// Get all 45 canonical nodes
const nodes = OntologyRegistry.getAllNodes();

// Validate a handle against canonical definitions
const result = OntologyRegistry.validateHandle('person_case');
console.log(result.isValid); // true
console.log(result.message); // "Valid handle"

// Analyze compound structure
const analysis = OntologyRegistry.analyzeCompound('person_case_status');
console.log(analysis.baseNode);      // "person"
console.log(analysis.secondaryNode); // "case"
console.log(analysis.modifiers);     // ["status"]

// Check if a node exists
const exists = OntologyRegistry.hasNode('person'); // true

// Get nodes by category
const spineNodes = OntologyRegistry.getNodesByCategory('spine');
```

**When to use**: When you need to query canonical KGL data, validate handles, or analyze compound structure.

#### 2. **RuleRegistry** - Rule Definitions

Central repository for all 55 KGL validation rules with metadata.

```typescript
import { RuleRegistry } from '@helpseeker/kgl-ontology';

// Get rule by ID
const rule = RuleRegistry.getRuleDefinition('R01');
console.log(rule.name);        // "Node Combinability"
console.log(rule.category);    // "semantic"
console.log(rule.description); // Full description
console.log(rule.severity);    // "error" | "warning" | "info"

// Get all rules in a category
const semanticRules = RuleRegistry.getRulesByCategory('semantic');
const taxonomyRules = RuleRegistry.getRulesByCategory('taxonomy');

// List all rule IDs
const allRuleIds = RuleRegistry.getAllRuleIds();
// ["R01", "R02", ..., "CB14"]

// Check if a rule exists
const hasRule = RuleRegistry.hasRule('R01'); // true
```

**When to use**: When you need rule metadata for validation reporting, documentation, or understanding validation failures.

#### 3. **OntologyGateway** - Unified Validation Entry Point

High-level validation orchestrator that runs rules against your data model.

```typescript
import { OntologyGateway } from '@helpseeker/kgl-ontology';
import type { ObjectModule, TaxonomyModule } from '@helpseeker/kgl-ontology';

// Configure strictness level
OntologyGateway.configure({
  strictness: 'strict'  // 'strict' | 'moderate' | 'lenient'
});

// Validate a single handle
const handleResult = OntologyGateway.validateHandle('person_case');
console.log(handleResult.isValid);

// Validate at pipeline checkpoint
const modules: ObjectModule[] = [...];
const taxonomies: TaxonomyModule[] = [...];

const checkpoint = OntologyGateway.validateCheckpoint(
  'build',      // 'design' | 'build' | 'test' | 'deploy'
  modules,
  taxonomies
);

if (!checkpoint.passed) {
  checkpoint.errors.forEach(err => {
    console.error(`[${err.ruleId}] ${err.message}`);
    console.error(`  Severity: ${err.severity}`);
    console.error(`  Module: ${err.moduleHandle}`);
  });
}

// Run full validation across all rules
const fullReport = OntologyGateway.validateAll(modules, taxonomies);
console.log(`Total Errors: ${fullReport.totalErrors}`);
console.log(`Total Warnings: ${fullReport.totalWarnings}`);
console.log(`Is Valid: ${fullReport.isValid}`);

// Export context for AI priming
const contextMarkdown = OntologyGateway.exportContextMarkdown();
// Use this to prime LLMs with KGL knowledge
```

**When to use**: Primary validation entry point for pipelines. Use at design time, build time, or deployment checkpoints.

#### 4. **KGLEnforcer** - Node-Level Validation

Low-level validator that enforces KGL v1.3 node specifications (45 canonical nodes).

```typescript
import { KGLEnforcer, KGL_V1_3_NODES, GLYPH_TO_HANDLE } from '@helpseeker/kgl-ontology';

// Access canonical node definitions
console.log(KGL_V1_3_NODES['person']);
// { glyph: '◎', category: 'Central', description: 'Individual being served, client' }

// Glyph to handle mapping
const handle = GLYPH_TO_HANDLE['◎']; // "person"

// Validate node against KGL v1.3 spec
const enforcer = new KGLEnforcer();
const validation = enforcer.validateNode('person', {
  handle: 'person',
  fields: [...],
  relationships: [...]
});

if (!validation.isValid) {
  validation.errors.forEach(err => {
    console.error(`Validation error: ${err}`);
  });
}

// Check if a handle is canonical
const isCanonical = enforcer.isCanonicalNode('person'); // true
const isCanonical2 = enforcer.isCanonicalNode('invalid'); // false
```

**When to use**: When you need low-level validation of nodes against the canonical 45-node specification, or when working with glyphs.

#### 5. **KGLNeo4jValidator** - Graph Database Validation

Validates KGL data models stored in Neo4j graph database.

```typescript
import { KGLNeo4jValidator } from '@helpseeker/kgl-ontology';
import neo4j from 'neo4j-driver';

// Connect to Neo4j
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

// Initialize validator
const validator = new KGLNeo4jValidator(driver);

// Validate graph structure
const result = await validator.validateGraph();

if (!result.isValid) {
  result.errors.forEach(err => {
    console.error(`Graph validation error: ${err.message}`);
    console.error(`  Node: ${err.nodeId}`);
    console.error(`  Rule violated: ${err.ruleId}`);
  });
}

// Validate specific node in graph
const nodeResult = await validator.validateNode('person-123');

// Clean up
await driver.close();
```

**When to use**: When your KGL data model is stored in Neo4j and you need to validate graph structure, relationships, and ontology compliance at the database level.

## Component Relationships

```
┌─────────────────────────────────────────────────────────┐
│                   OntologyGateway                       │
│            (Unified Validation Orchestrator)            │
│  - Pipeline checkpoints (design/build/test/deploy)      │
│  - Full validation across all 41 universal rules        │
│  - AI context export                                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ uses
                    ↓
┌─────────────────────────────────────────────────────────┐
│  OntologyRegistry          RuleRegistry                 │
│  ─────────────────          ────────────                │
│  • 45 Canonical Nodes       • 41 Universal Rules        │
│  • Compound definitions     • Rule metadata             │
│  • Taxonomy structures      • Severity levels           │
│  • Handle validation        • Categories                │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ referenced by
                    ↓
┌─────────────────────────────────────────────────────────┐
│               KGLEnforcer                               │
│        (Low-level Node Validation)                      │
│  • KGL_V1_3_NODES (45 canonical nodes)                  │
│  • GLYPH_TO_HANDLE mapping                              │
│  • Node-level validation                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            KGLNeo4jValidator                            │
│         (Graph Database Validation)                     │
│  • Neo4j graph structure validation                     │
│  • Relationship validation                              │
│  • Ontology compliance checking                         │
└─────────────────────────────────────────────────────────┘
```

## Use Cases by Component

### OntologyRegistry Use Cases

**Use Case 1: Validate User Input**
```typescript
// User enters a handle in a form - validate it exists
const userInput = "person_case_status";
const validation = OntologyRegistry.validateHandle(userInput);

if (!validation.isValid) {
  showError("Invalid KGL handle");
}
```

**Use Case 2: Build Autocomplete**
```typescript
// Provide autocomplete suggestions for KGL handles
const allNodes = OntologyRegistry.getAllNodes();
const suggestions = allNodes.map(node => node.handle);
// ["person", "case", "event", ...]
```

**Use Case 3: Analyze Compound Structure**
```typescript
// User created "person_case_status_type" - break it down
const analysis = OntologyRegistry.analyzeCompound("person_case_status_type");
// Shows: base="person", secondary="case", modifiers=["status", "type"]
```

### RuleRegistry Use Cases

**Use Case 1: Display Validation Errors with Context**
```typescript
// Show user-friendly error messages with rule details
function displayError(ruleId: string, context: string) {
  const rule = RuleRegistry.getRuleDefinition(ruleId);
  console.error(`[${rule.category.toUpperCase()}] ${rule.name}`);
  console.error(`Description: ${rule.description}`);
  console.error(`Severity: ${rule.severity}`);
  console.error(`Context: ${context}`);
}

displayError('R01', 'Cannot combine person_medication');
```

**Use Case 2: Generate Documentation**
```typescript
// Auto-generate validation rules documentation
const allRules = RuleRegistry.getAllRuleIds().map(id =>
  RuleRegistry.getRuleDefinition(id)
);

const markdown = allRules.map(rule =>
  `### ${rule.id}: ${rule.name}\n\n${rule.description}\n\n**Severity**: ${rule.severity}`
).join('\n\n');
```

**Use Case 3: Filter by Severity**
```typescript
// Only show critical errors, hide warnings
const allRuleIds = RuleRegistry.getAllRuleIds();
const criticalRules = allRuleIds
  .map(id => RuleRegistry.getRuleDefinition(id))
  .filter(rule => rule.severity === 'error');
```

### OntologyGateway Use Cases

**Use Case 1: Pre-deployment Validation**
```typescript
// Before deploying to Corteza, validate entire data model
import { OntologyGateway } from '@helpseeker/kgl-ontology';

const modules = loadModulesFromFile();
const taxonomies = loadTaxonomiesFromFile();

OntologyGateway.configure({ strictness: 'strict' });
const report = OntologyGateway.validateAll(modules, taxonomies);

if (!report.isValid) {
  console.error(`Cannot deploy: ${report.totalErrors} errors found`);
  process.exit(1);
}

console.log('✓ All validation passed - safe to deploy');
```

**Use Case 2: CI/CD Pipeline Integration**
```typescript
// Validate at each stage of the pipeline
async function ciPipeline() {
  // Stage 1: Design validation
  const designCheck = OntologyGateway.validateCheckpoint(
    'design', modules, taxonomies
  );
  if (!designCheck.passed) throw new Error('Design validation failed');

  // Stage 2: Build validation
  const buildCheck = OntologyGateway.validateCheckpoint(
    'build', modules, taxonomies
  );
  if (!buildCheck.passed) throw new Error('Build validation failed');

  // Stage 3: Deploy
  await deployToCorteza(modules, taxonomies);
}
```

**Use Case 3: AI Assistant Priming**
```typescript
// Generate KGL context for Claude or other LLMs
const kglContext = OntologyGateway.exportContextMarkdown();

const prompt = `${kglContext}

Using the KGL ontology above, design a data model for tracking
client housing applications.`;

// Send to Claude API with KGL knowledge
```

### KGLEnforcer Use Cases

**Use Case 1: Validate Legacy Data Migration**
```typescript
// Migrating from old system - ensure nodes match KGL v1.3
import { KGLEnforcer, KGL_V1_3_NODES } from '@helpseeker/kgl-ontology';

const enforcer = new KGLEnforcer();
const legacyNodes = loadLegacyDatabase();

legacyNodes.forEach(node => {
  const isValid = enforcer.isCanonicalNode(node.type);

  if (!isValid) {
    console.warn(`Legacy node "${node.type}" not in KGL v1.3`);
    console.warn(`Valid alternatives:`, Object.keys(KGL_V1_3_NODES));
  }
});
```

**Use Case 2: Glyph-based Visualization**
```typescript
// Render KGL nodes with their glyphs in UI
import { KGL_V1_3_NODES, GLYPH_TO_HANDLE } from '@helpseeker/kgl-ontology';

function renderNode(handle: string) {
  const node = KGL_V1_3_NODES[handle];
  return `<span class="kgl-node">
    <span class="glyph">${node.glyph}</span>
    <span class="label">${handle}</span>
  </span>`;
}

// Reverse: User clicks glyph, get handle
function onGlyphClick(glyph: string) {
  const handle = GLYPH_TO_HANDLE[glyph];
  console.log(`Glyph ${glyph} represents: ${handle}`);
}
```

**Use Case 3: Node-level Validation**
```typescript
// Validate individual nodes during data entry
const enforcer = new KGLEnforcer();

function validateUserNode(nodeData) {
  const validation = enforcer.validateNode(nodeData.handle, nodeData);

  if (!validation.isValid) {
    return {
      error: `Invalid ${nodeData.handle} node`,
      details: validation.errors
    };
  }

  return { success: true };
}
```

### KGLNeo4jValidator Use Cases

**Use Case 1: Post-Import Validation**
```typescript
// After importing data into Neo4j, validate graph structure
import { KGLNeo4jValidator } from '@helpseeker/kgl-ontology';
import neo4j from 'neo4j-driver';

async function validateImport() {
  const driver = neo4j.driver('bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'password'));

  const validator = new KGLNeo4jValidator(driver);
  const result = await validator.validateGraph();

  if (!result.isValid) {
    console.error('Import validation failed:');
    result.errors.forEach(err => {
      console.error(`  - ${err.message} (Rule: ${err.ruleId})`);
    });
  } else {
    console.log('✓ Graph structure is valid');
  }

  await driver.close();
}
```

**Use Case 2: Continuous Graph Monitoring**
```typescript
// Periodically validate Neo4j graph for ontology drift
import { KGLNeo4jValidator } from '@helpseeker/kgl-ontology';

async function monitorGraphHealth() {
  const validator = new KGLNeo4jValidator(driver);

  setInterval(async () => {
    const result = await validator.validateGraph();

    if (!result.isValid) {
      await alertDevOps({
        message: 'KGL ontology violation detected in production graph',
        errors: result.errors
      });
    }
  }, 3600000); // Check every hour
}
```

**Use Case 3: Node-Specific Validation**
```typescript
// Validate specific nodes after update
async function onNodeUpdate(nodeId: string) {
  const validator = new KGLNeo4jValidator(driver);
  const result = await validator.validateNode(nodeId);

  if (!result.isValid) {
    // Rollback the update
    await rollbackNodeChanges(nodeId);
    throw new Error(`Node ${nodeId} violates KGL rules`);
  }
}
```

## Dependencies

### neo4j-driver (^6.0.1)

**Purpose**: Enables graph database validation through `KGLNeo4jValidator`.

The Neo4j driver is required when you need to:
- Validate KGL data models stored in Neo4j
- Check graph structure compliance with KGL ontology rules
- Verify relationships between nodes match canonical definitions
- Monitor production graphs for ontology drift

**Installation**: Automatically installed as a dependency.

**When you don't need it**: If you're only doing in-memory validation (using `OntologyGateway`, `OntologyRegistry`, `RuleRegistry`, or `KGLEnforcer`), the Neo4j driver is not required. It's only needed when validating data in an actual Neo4j database.

**Example**:
```typescript
// This requires neo4j-driver
import { KGLNeo4jValidator } from '@helpseeker/kgl-ontology';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687');
const validator = new KGLNeo4jValidator(driver);

// This does NOT require neo4j-driver
import { OntologyGateway } from '@helpseeker/kgl-ontology';
OntologyGateway.validateHandle('person_case');
```

**Configuration**:
```typescript
// Neo4j connection options
const driver = neo4j.driver(
  'bolt://localhost:7687',          // or neo4j+s:// for cloud
  neo4j.auth.basic('username', 'password'),
  {
    maxConnectionPoolSize: 50,
    connectionTimeout: 30000
  }
);
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

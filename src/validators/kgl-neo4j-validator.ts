/**
 * KGL Neo4j Validator
 *
 * Validates and fixes KGL properties in Neo4j database against KGL v1.3
 *
 * Usage:
 *   npx ts-node src/validators/kgl-neo4j-validator.ts --validate
 *   npx ts-node src/validators/kgl-neo4j-validator.ts --fix
 */

import neo4j, { Driver } from 'neo4j-driver';
import KGLEnforcer, { KGL_V1_3_NODES } from './kgl-enforcer';

interface Neo4jConfig {
  uri: string;
  user: string;
  password: string;
}

interface NodeKGLData {
  label: string;
  count: number;
  currentGlyph: string | null;
  currentHandle: string | null;
  suggestedGlyph: string | null;
  suggestedHandle: string | null;
  isValid: boolean;
  error?: string;
}

export class KGLNeo4jValidator {
  private driver: Driver;
  private enforcer: KGLEnforcer;

  constructor(config: Neo4jConfig) {
    this.driver = neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.password));
    this.enforcer = new KGLEnforcer();
  }

  async close(): Promise<void> {
    await this.driver.close();
  }

  /**
   * Get all node labels with their KGL properties
   */
  async getNodeKGLData(): Promise<NodeKGLData[]> {
    const session = this.driver.session();
    const results: NodeKGLData[] = [];

    try {
      const query = `
        MATCH (n)
        WITH labels(n)[0] as label, n.kgl as glyph, n.kgl_handle as handle, count(n) as cnt
        RETURN label, glyph, handle, cnt
        ORDER BY cnt DESC
      `;

      const result = await session.run(query);

      for (const record of result.records) {
        const label = record.get('label');
        const glyph = record.get('glyph');
        const handle = record.get('handle');
        const count = record.get('cnt').toNumber();

        // Get suggestion
        const suggestion = this.enforcer.suggestMapping(label);

        // Validate current mapping
        let isValid = true;
        let error: string | undefined;

        if (glyph && handle) {
          const validation = this.enforcer.validatePair(glyph, handle);
          isValid = validation.valid;
          error = validation.error;
        } else if (glyph) {
          const validation = this.enforcer.validateGlyph(glyph);
          isValid = validation.valid;
          error = validation.error;
        } else if (handle) {
          const validation = this.enforcer.validateHandle(handle);
          isValid = validation.valid;
          error = validation.error;
        }

        results.push({
          label,
          count,
          currentGlyph: glyph,
          currentHandle: handle,
          suggestedGlyph: suggestion?.glyph || null,
          suggestedHandle: suggestion?.handle || null,
          isValid,
          error,
        });
      }
    } finally {
      await session.close();
    }

    return results;
  }

  /**
   * Validate the database against KGL v1.3
   */
  async validate(): Promise<{ valid: boolean; data: NodeKGLData[]; errors: number }> {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('KGL v1.3 NEO4J VALIDATOR');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const data = await this.getNodeKGLData();
    let errors = 0;

    console.log('Label                  │ Count        │ Current     │ Should Be   │ Status');
    console.log('───────────────────────┼──────────────┼─────────────┼─────────────┼────────');

    for (const node of data) {
      const label = node.label.padEnd(22);
      const count = node.count.toLocaleString().padStart(12);
      const current = node.currentGlyph && node.currentHandle
        ? `${node.currentGlyph} ${node.currentHandle}`.padEnd(11)
        : '(none)'.padEnd(11);
      const suggested = node.suggestedGlyph && node.suggestedHandle
        ? `${node.suggestedGlyph} ${node.suggestedHandle}`.padEnd(11)
        : '???'.padEnd(11);

      let status = '✅';
      if (!node.isValid) {
        status = '❌';
        errors++;
      } else if (node.currentGlyph !== node.suggestedGlyph || node.currentHandle !== node.suggestedHandle) {
        status = '⚠️ ';
        errors++;
      }

      console.log(`${label} │${count} │ ${current} │ ${suggested} │ ${status}`);

      if (node.error) {
        console.log(`                       │              │ Error: ${node.error}`);
      }
    }

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log(`Total: ${data.length} labels, ${errors} errors/warnings`);

    return { valid: errors === 0, data, errors };
  }

  /**
   * Fix KGL properties in the database
   */
  async fix(dryRun: boolean = false): Promise<void> {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`KGL v1.3 NEO4J FIXER ${dryRun ? '(DRY RUN)' : ''}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const data = await this.getNodeKGLData();

    for (const node of data) {
      if (!node.suggestedGlyph || !node.suggestedHandle) {
        console.log(`⏭️  ${node.label}: No KGL v1.3 mapping found, skipping`);
        continue;
      }

      const needsUpdate = node.currentGlyph !== node.suggestedGlyph ||
                          node.currentHandle !== node.suggestedHandle;

      if (!needsUpdate) {
        console.log(`✅ ${node.label}: Already correct (${node.suggestedGlyph} ${node.suggestedHandle})`);
        continue;
      }

      console.log(`🔧 ${node.label}: ${node.currentGlyph || '?'} ${node.currentHandle || '?'} → ${node.suggestedGlyph} ${node.suggestedHandle} (${node.count.toLocaleString()} nodes)`);

      if (!dryRun) {
        await this.updateLabel(node.label, node.suggestedGlyph, node.suggestedHandle);
      }
    }

    console.log('\n' + (dryRun ? 'Dry run complete. Run without --dry-run to apply changes.' : 'Fix complete.'));
  }

  /**
   * Update KGL properties for a label (batched for large datasets)
   */
  private async updateLabel(label: string, glyph: string, handle: string): Promise<void> {
    const batchSize = 100000;
    let total = 0;

    while (true) {
      const session = this.driver.session();
      try {
        const query = `
          MATCH (n:\`${label}\`)
          WHERE n.kgl <> '${glyph}' OR n.kgl_handle <> '${handle}' OR n.kgl IS NULL
          WITH n LIMIT ${batchSize}
          SET n.kgl = '${glyph}', n.kgl_handle = '${handle}'
          RETURN count(n) as updated
        `;

        const result = await session.run(query);
        const updated = result.records[0].get('updated').toNumber();

        if (updated === 0) break;

        total += updated;
        process.stdout.write(`   Updated: ${total.toLocaleString()}\r`);
      } finally {
        await session.close();
      }
    }

    console.log(`   Updated: ${total.toLocaleString()} nodes`);
  }
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Get config from environment variables (REQUIRED)
  if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
    throw new Error('Missing required environment variables: NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD');
  }

  const config: Neo4jConfig = {
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD,
  };

  const validator = new KGLNeo4jValidator(config);

  try {
    if (args.includes('--fix')) {
      const dryRun = args.includes('--dry-run');
      await validator.fix(dryRun);
    } else {
      await validator.validate();
    }
  } finally {
    await validator.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default KGLNeo4jValidator;

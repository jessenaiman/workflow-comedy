import { LangfuseSpanProcessor } from '@langfuse/otel';
import { propagateAttributes, startActiveObservation } from '@langfuse/tracing';
import { NodeSDK } from '@opentelemetry/sdk-node';

export const tracingEnabled = ['LANGFUSE_PUBLIC_KEY', 'LANGFUSE_SECRET_KEY', 'LANGFUSE_BASE_URL']
  .every((name) => Boolean(process.env[name]));

process.env.LANGFUSE_TRACING_ENVIRONMENT ||= 'development';

export const langfuseSpanProcessor = tracingEnabled ? new LangfuseSpanProcessor() : null;
const sdk = langfuseSpanProcessor ? new NodeSDK({ spanProcessors: [langfuseSpanProcessor] }) : null;
sdk?.start();

export function traceRoundMetadata(input) {
  return {
    traceName: 'run-office-comedy',
    sessionId: input.caseId,
    tags: ['office-comedy'],
    metadata: { roundId: input.roundId, roundNumber: String(input.roundNumber), ...(input.model ? { model: input.model } : {}) },
    input: { hypothetical: input.hypothetical, acceptance: input.acceptance },
  };
}

function errorAttributes(error) {
  return { level: 'ERROR', statusMessage: error?.message || String(error) };
}

export function traceRoundOutput(result) {
  const final = result.turns?.at(-1);
  return {
    status: result.status, path: result.path, violations: result.violations,
    finalTurn: final && {
      role: final.role, status: final.status, action: final.action, evidence: final.evidence,
      reaction: final.reaction, provider: final.provider,
    },
  };
}

export async function traceRound(input, run) {
  if (!tracingEnabled) return run();
  const { traceName, sessionId, tags, metadata, input: traceInput } = traceRoundMetadata(input);
  return propagateAttributes({ traceName, sessionId, tags, metadata }, () =>
    startActiveObservation(traceName, async (agent) => {
      agent.update({ input: traceInput });
      try {
        const result = await run();
        agent.update({ output: traceRoundOutput(result) });
        return result;
      } catch (error) {
        agent.update(errorAttributes(error));
        throw error;
      }
    }, { asType: 'agent' }));
}

export async function traceAgent(stage, input, run) {
  if (!tracingEnabled) return run();
  return startActiveObservation(`execute-${stage}`, async (agent) => {
    agent.update({ input });
    try {
      const result = await run();
      agent.update({ output: {
        status: result.status, action: result.action, evidence: result.evidence,
        failedField: result.failedField, correction: result.correction, reaction: result.reaction,
        provider: result.provider, fallbackReason: result.fallbackReason,
      } });
      return result;
    } catch (error) {
      agent.update(errorAttributes(error));
      throw error;
    }
  }, { asType: 'agent' });
}

export async function traceGeneration({ name, model, input, metadata, validate }, run) {
  if (!tracingEnabled) return run();
  return startActiveObservation(name, async (generation) => {
    generation.update({ model, input, metadata });
    try {
      const result = await run();
      const usageDetails = result.metrics?.promptEvalCount == null ? undefined : {
        input: result.metrics.promptEvalCount,
        output: result.metrics.evalCount,
      };
      generation.update({ output: result.content, usageDetails });
      validate?.(result);
      return result;
    } catch (error) {
      generation.update(errorAttributes(error));
      throw error;
    }
  }, { asType: 'generation' });
}

export async function flushTracing() {
  if (!langfuseSpanProcessor) return;
  try { await langfuseSpanProcessor.forceFlush(); }
  catch (error) { console.error(`Langfuse flush failed: ${error.message}`); }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => { await sdk?.shutdown(); process.exit(0); });
}

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Permite pasar la ruta del examen como argumento. Si no, usa el directorio actual.
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

// Nuevas rutas basadas en la estructura del repositorio
const BASELINE_PATH = path.join(targetDir, 'dataset', '_resultados.json');
const LLM_OUTPUTS_DIR = path.join(targetDir, 'llm_outputs');
const OUTPUT_PATH = path.join(targetDir, 'informe_resultados.md');

function readJsonWithText(filePath) {
  const rawText = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(rawText);
  return { rawText, parsed };
}

function normalizeOption(value) {
  if (value === null || value === undefined) {
    return null;
  }
  return String(value).trim().toLowerCase();
}

function toAnswerMap(respuestas) {
  const map = new Map();
  if (!Array.isArray(respuestas)) {
    return map;
  }

  for (const item of respuestas) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    map.set(item.id, normalizeOption(item.opcion_correcta));
  }

  return map;
}

function analyzeFile(baseData, fileName) {
  // Ahora leemos los resultados de las IA desde la carpeta llm_outputs/
  const filePath = path.join(LLM_OUTPUTS_DIR, fileName);
  const { parsed } = readJsonWithText(filePath);

  const totalAnswers = Array.isArray(baseData.respuestas) ? baseData.respuestas.length : 0;
  const baseAnswers = toAnswerMap(baseData.respuestas);
  const targetAnswers = toAnswerMap(parsed.respuestas);

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unansweredAnswers = 0;
  let missingAnswers = 0;
  let totalScore = 0;

  for (const [id, expectedOption] of baseAnswers.entries()) {
    if (!targetAnswers.has(id)) {
      missingAnswers += 1;
      wrongAnswers += 1;
      continue;
    }

    const actualOption = targetAnswers.get(id);

    if (actualOption === null) {
      unansweredAnswers += 1;
      wrongAnswers += 1;
      continue;
    }

    if (actualOption === expectedOption) {
      correctAnswers += 1;
      totalScore += 1;
    } else {
      wrongAnswers += 1;
      totalScore -= 0.25;
    }
  }

  const answeredAnswers = totalAnswers - unansweredAnswers;
  const accuracyTotal = totalAnswers === 0 ? 0 : (correctAnswers / totalAnswers) * 100;
  const accuracyAnswered = answeredAnswers === 0 ? 0 : (correctAnswers / answeredAnswers) * 100;

  return {
    fileName,
    llmModel: parsed.llm_model || 'N/A',
    correctAnswers,
    wrongAnswers,
    unansweredAnswers,
    missingAnswers,
    answeredAnswers,
    totalScore,
    accuracyTotal,
    accuracyAnswered,
  };
}

function escapeMdCell(value) {
  return String(value).replace(/\|/g, '\\|');
}

function main() {
  // Verificaciones de que la estructura es correcta
  if (!fs.existsSync(BASELINE_PATH)) {
    throw new Error(`No se encontró el archivo base en: ${BASELINE_PATH}\nComprueba que el directorio tenga la carpeta 'dataset/'.`);
  }
  if (!fs.existsSync(LLM_OUTPUTS_DIR)) {
    throw new Error(`No se encontró la carpeta de respuestas en: ${LLM_OUTPUTS_DIR}`);
  }

  const { parsed: baseData } = readJsonWithText(BASELINE_PATH);

  // Leemos todos los JSON de la carpeta llm_outputs (ya no hace falta excluir el archivo base porque está en otra carpeta)
  const resultFiles = fs
    .readdirSync(LLM_OUTPUTS_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort();

  const rows = [];

  for (const fileName of resultFiles) {
    try {
      rows.push(analyzeFile(baseData, fileName));
    } catch (error) {
      rows.push({
        fileName,
        llmModel: 'N/A',
        correctAnswers: 'ERROR',
        wrongAnswers: 'ERROR',
        unansweredAnswers: 'ERROR',
        missingAnswers: 'ERROR',
        answeredAnswers: 'ERROR',
        totalScore: 'ERROR',
        accuracyTotal: 'ERROR',
        accuracyAnswered: 'ERROR',
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Ordenar por puntuación total descendente
  rows.sort((a, b) => {
    const aVal = typeof a.accuracyTotal === 'number' ? a.accuracyTotal : -1;
    const bVal = typeof b.accuracyTotal === 'number' ? b.accuracyTotal : -1;
    return bVal - aVal;
  });

  const totalAnswers = Array.isArray(baseData.respuestas) ? baseData.respuestas.length : 0;

  const lines = [
    '# Informe de aciertos',
    '',
    `- Archivo base: dataset/_resultados.json`,
    `- Total respuestas base: ${totalAnswers}`,
    `- Fecha generacion: ${new Date().toISOString()}`,
    '',
    '| Archivo | llm_model | No respondidas | Respuestas incorrectas | % acierto sobre total | % acierto sobre respondidas | Puntuacion total |',
    '|---|---|---:|---:|---:|---:|---:|',
  ];

  for (const row of rows) {
    const accuracyTotalCell =
      typeof row.accuracyTotal === 'number' ? `${row.accuracyTotal.toFixed(2)}%` : String(row.accuracyTotal);
    const accuracyAnsweredCell =
      typeof row.accuracyAnswered === 'number'
        ? `${row.accuracyAnswered.toFixed(2)}%`
        : String(row.accuracyAnswered);
    const scoreCell =
      typeof row.totalScore === 'number' ? row.totalScore.toFixed(2) : String(row.totalScore);

    lines.push(
      `| ${escapeMdCell(row.fileName)} | ${escapeMdCell(row.llmModel)} | ${escapeMdCell(row.unansweredAnswers)} | ${escapeMdCell(row.wrongAnswers)} | ${escapeMdCell(accuracyTotalCell)} | ${escapeMdCell(accuracyAnsweredCell)} | ${escapeMdCell(scoreCell)} |`
    );
  }

  const errorRows = rows.filter((row) => row.errorMessage);
  if (errorRows.length > 0) {
    lines.push('');
    lines.push('## Errores detectados');
    for (const row of errorRows) {
      lines.push(`- ${row.fileName}: ${row.errorMessage}`);
    }
  }

  lines.push('');
  lines.push('Notas:');
  lines.push('- No respondidas son las respuestas con opcion_correcta null.');
  lines.push('- Si falta un id respecto al archivo base, se cuenta como incorrecta pero no como No respondida.');
  lines.push('- Respuestas incorrectas incluyen fallos y no respondidas.');
  lines.push('- % acierto sobre total usa todas las preguntas del archivo base.');
  lines.push('- % acierto sobre respondidas excluye respuestas null.');
  lines.push('- Puntuacion total: +1 acierto, -0.25 error, 0 si null.');

  fs.writeFileSync(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');

  console.log(`✅ Informe generado con éxito en: ${OUTPUT_PATH}`);
}

try {
  main();
} catch (error) {
  console.error('❌ Error al generar el informe.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
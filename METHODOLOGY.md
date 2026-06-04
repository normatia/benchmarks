# Metodología del Benchmark

Este documento detalla el rigor técnico, la extracción de datos y el sistema de evaluación utilizado para comparar Normatia con otros Modelos de Lenguaje Grande (LLMs). Nuestro objetivo es garantizar que la evaluación sea justa, transparente y 100% reproducible.

## 1. Origen de los Datos

Para evitar sesgos en la creación de las preguntas, no hemos utilizado preguntas generadas por nosotros. En su lugar, hemos recurrido a **exámenes tipo test oficiales de la Administración Pública española** (Ayuntamientos y Comunidades Autónomas) para puestos de Arquitecto y Arquitecto Técnico.

Cada examen incluido en la carpeta `exams/` cuenta con un subdirectorio `raw/` que contiene:
- El PDF original con el enunciado del examen público.
- El PDF original con la plantilla oficial de respuestas correctas dictada por el tribunal calificador.

Estos PDFs se han transcrito a un formato estructurado y estandarizado en la carpeta `dataset/`:
- `_test.json`: Contiene los enunciados y las opciones (a, b, c...).
- `_resultados.json`: Actúa como nuestro *Ground Truth* (verdad absoluta) contra el cual se evalúan las IAs.

## 2. El Prompt de Evaluación

A cada IA evaluada se le ha proporcionado el contenido del archivo `_test.json` junto con el siguiente prompt (instrucción del sistema) en un entorno *Zero-Shot* (sin ejemplos previos):

> *"Eres experto en construcción y edificación. Resuélveme este examen tipo test. Tu respuesta debe ser un json estructurado así: { "respuestas": [ { "id": [ID_PREGUNTA], "opcion_correcta": "[LETRA]" } ] }"*

Las respuestas brutas devueltas por cada modelo se han guardado sin alteraciones en la carpeta `llm_outputs/`.

## 3. Modelos Evaluados

En esta primera fase del benchmark (realizada en **mayo de 2026**), hemos puesto a prueba nuestro pipeline frente a los modelos más punteros del momento:

- **Normatia**: Modelo propio conectado vía RAG a la base de datos de normativa española.
- **Gemini 3.5 Flash** (Google)
- **Claude 4.6 Sonnet** (Anthropic)
- **GPT-5.3** (OpenAI)
- **Deepseek v4** (Deepseek)

## 4. Limitaciones Conocidas y Evolución

El ámbito legal y normativo es dinámico. Las evaluaciones están condicionadas por los siguientes factores:
1. **Leyes Derogadas:** Algunas preguntas de exámenes del año 2017 o 2019 referencian normativas municipales o autonómicas que han sido derogadas o modificadas a fecha de 2026. Los LLMs generalistas, entrenados con datos recientes, podrían fallar la pregunta no por falta de capacidad, sino porque aplican la normativa actual, mientras que el tribunal exigía la normativa de aquel año.
2. **Contexto Geográfico:** Al usar normativa de distintas autonomías (ej: Ayuntamiento de Madrid), los modelos genéricos suelen confundir la ley estatal (CTE, LOE) con las ordenanzas locales. Aquí es donde la arquitectura RAG especializada de Normatia demuestra su superioridad.

Continuaremos expandiendo este repositorio con nuevas exámenes y pruebas, ajustando las respuestas a las actualizaciones y nuevas normativas tanto a nivel estatal, como autonómico y municipal. También añadiendo evaluaciones de futuros modelos de IA.
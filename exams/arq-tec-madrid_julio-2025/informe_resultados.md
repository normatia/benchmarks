# Informe de aciertos

- Archivo base: dataset/_resultados.json
- Total respuestas base: 97
- Fecha generacion: 2026-06-04T10:39:54.497Z

| Archivo | llm_model | No respondidas | Respuestas incorrectas | % acierto sobre total | % acierto sobre respondidas | Puntuacion total |
|---|---|---:|---:|---:|---:|---:|
| normatia_resultados.json | Normatia | 0 | 3 | 96.91% | 96.91% | 93.25 |
| gemini_resultados.json | Gemini 3.5 Flash | 1 | 26 | 73.20% | 73.96% | 64.75 |
| claude_resultados.json | Claude Sonnet 4.6 | 0 | 28 | 71.13% | 71.13% | 62.00 |
| chatgpt_resultados.json | GPT-5.3 | 5 | 34 | 64.95% | 68.48% | 55.75 |
| deepseek_resultados.json | Deepseek v4 | 0 | 39 | 59.79% | 59.79% | 48.25 |

Notas:
- No respondidas son las respuestas con opcion_correcta null.
- Si falta un id respecto al archivo base, se cuenta como incorrecta pero no como No respondida.
- Respuestas incorrectas incluyen fallos y no respondidas.
- % acierto sobre total usa todas las preguntas del archivo base.
- % acierto sobre respondidas excluye respuestas null.
- Puntuacion total: +1 acierto, -0.25 error, 0 si null.

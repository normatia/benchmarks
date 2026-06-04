# Informe de aciertos

- Archivo base: dataset/_resultados.json
- Total respuestas base: 99
- Fecha generacion: 2026-06-04T10:40:40.210Z

| Archivo | llm_model | No respondidas | Respuestas incorrectas | % acierto sobre total | % acierto sobre respondidas | Puntuacion total |
|---|---|---:|---:|---:|---:|---:|
| normatia_resultados.json | Normatia | 3 | 7 | 92.93% | 95.83% | 91.00 |
| gemini_resultados.json | Gemini 3.5 Flash | 0 | 18 | 81.82% | 81.82% | 76.50 |
| claude_resultados.json | Claude Sonnet 4.6 | 0 | 25 | 74.75% | 74.75% | 67.75 |
| chatgpt_resultados.json | GPT-5.3 | 0 | 26 | 73.74% | 73.74% | 66.50 |
| deepseek_resultados.json | Deepseek v4 | 0 | 32 | 67.68% | 67.68% | 59.00 |

Notas:
- No respondidas son las respuestas con opcion_correcta null.
- Si falta un id respecto al archivo base, se cuenta como incorrecta pero no como No respondida.
- Respuestas incorrectas incluyen fallos y no respondidas.
- % acierto sobre total usa todas las preguntas del archivo base.
- % acierto sobre respondidas excluye respuestas null.
- Puntuacion total: +1 acierto, -0.25 error, 0 si null.

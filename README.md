# 🏗️ Normatia Benchmark

Bienvenido al repositorio de evaluación (benchmark) de **Normatia**. 

[Normatia](https://normatia.com) es un proyecto que digitaliza y centraliza la normativa de construcción española (estatal, autonómica y municipal). Mediante el uso de un sistema RAG (Retrieval-Augmented Generation) y el protocolo MCP (Model Context Protocol), Normatia ofrece un asistente de IA especializado en arquitectura y edificación.

Este repositorio tiene como objetivo **comparar el rendimiento del modelo especializado de Normatia frente a los principales Modelos Fundacionales (LLMs generalistas) del mercado**, utilizando exámenes oficiales reales de la Administración Pública española.

## Estructura del Repositorio

El proyecto está organizado de manera modular para garantizar la total transparencia y reproducibilidad de los resultados:

```text
benchmark/
├── README.md                 
├── METHODOLOGY.md            # Explicación detallada del proceso y evaluación
├── scripts/                  
│   └── generar_informe.js    # Script de evaluación oficial
└── exams/                    
    ├── arq-tec-madrid_febrero-2019/  # Exámenes organizados por año y municipio
    │   ├── raw/              # PDFs originales del examen y plantilla oficial
    │   ├── dataset/          # Examen y plantilla en formato JSON (_test.json, _resultados.json)
    │   ├── llm_outputs/      # Respuestas crudas en JSON dadas por cada IA
    │   └── informe_aciertos.md # Informe autogenerado
    ├── arq-sup-madrid_julio-2018/
    └── arq-tec-madrid_julio-2025/
```

## Cómo reproducir los resultados
Cualquier persona puede auditar nuestros resultados y comprobar que no hay manipulación. Para generar o verificar los informes .md por tu cuenta, solo necesitas tener Node.js instalado.
Clona este repositorio:
```code
Bash
git clone https://github.com/normatia/benchmark.git
cd benchmark
```

Ejecuta el script apuntando a la carpeta del examen que quieras evaluar. Por ejemplo:

```code
Bash
node scripts/generar_informe.js exams/arq-sup-madrid-2019
```

El script leerá la plantilla oficial en dataset/, la comparará con todos los JSON de la carpeta llm_outputs/ y actualizará (o creará) el archivo informe_aciertos.md en la carpeta del examen.

## Naturaleza viva del Benchmark

Este benchmark representa una fotografía del estado del arte. Sin embargo, es un proyecto vivo y está sujeto a modificaciones constantes:

- Actualizaciones legislativas: La normativa de construcción española cambia continuamente. Exámenes antiguos pueden contener preguntas cuyas respuestas oficiales hayan quedado obsoletas con las leyes de 2026.
- Mejoras en los modelos: Se añadirán iteraciones futuras tanto de los LLMs generalistas como de nuestro propio sistema (nuevos sistemas de embeddings, mejoras en el pipeline, etc.).
- Nuevos exámenes: Iremos incorporando progresivamente pruebas de distintas Comunidades Autónomas y Ayuntamientos.

Para más detalles sobre cómo hemos puntuado, extraído y evaluado a las IAs, por favor revisa nuestro documento de Metodología.
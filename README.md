# Payloaded

An educational encyclopedia dedicated to the study of malware.
Una enciclopedia educativa dedicada al estudio del malware.

[![Code License: MIT](https://img.shields.io/badge/Code%20License-MIT-blue.svg)](./LICENSE.md)
[![Content License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey.svg)](./CONTENT-LICENSE.md)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange.svg)](#)

---

## Table of Contents / Tabla de contenidos

- [English](#english)
  - [About](#about)
  - [Disclaimer](#disclaimer)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)
  - [License](#license)
- [Español](#español)
  - [Sobre el proyecto](#sobre-el-proyecto)
  - [Aviso legal](#aviso-legal)
  - [Stack tecnológico](#stack-tecnológico)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Contribuir](#contribuir)
  - [Licencia](#licencia)

---

## English

### About

**Payloaded** is a static encyclopedia dedicated exclusively to the
study and educational dissemination of malware. The project compiles,
organizes, and explains the different malware families (viruses, worms,
ransomware, spyware, rootkits, and others), their techniques, internal
workings, and historical context, with the goal of serving as a learning
resource for students, researchers, and cybersecurity professionals.

### Disclaimer

This project is strictly educational and informational. It does **not**
contain, distribute, or facilitate:

- Functional malicious code or working malware samples.
- Attack tools or exploitation frameworks.
- Operational instructions to create, deploy, or spread malware.

All content focuses on conceptual analysis, historical and technical
context, detection, and defense against these threats. This project is not
intended for, and must not be used for, any malicious or illegal purpose.

### Tech Stack

### Project Structure

Every article lives under `src/content/`. **Folders mirror the data model:
where entries form a hierarchy, folders show it; where they don't, the files
sit flat.**

```
src/content/
├── families/                    flat YAML — taxonomy labels, no article body
│   ├── ransomware.yaml
│   └── virus.yaml
├── types/                       grouped by family: entries carry a `parent`
│   ├── ransomware/
│   │   ├── index.md               the family entry
│   │   ├── leakware.md            a subtype
│   │   └── locker-ransomware.md
│   └── virus/
│       ├── index.mdx
│       ├── resident-virus.md
│       └── images/                assets sit beside the entries that use them
├── attack-vectors/              flat — no vector contains another
├── malware/                     flat
└── indicators/                  flat
```

Two consequences worth knowing before you move anything:

- **Folders are for organization only.** Ids are flattened, so
  `types/ransomware/leakware.md` is served at `/types/leakware`. Reclassifying
  an entry by dragging it to another folder never changes its URL.
- **Two files can therefore collide.** `types/virus/foo.md` and
  `types/ransomware/foo.md` would both claim the id `foo`. The build fails
  loudly if that happens, rather than dropping one silently.

`.md` and `.mdx` coexist in the same collection. Use `.mdx` only when an entry
needs a component — a figure anchored to a specific passage, for instance.

### Contributing

Contributions are welcome. Before submitting a change, please make sure that
any content:

1. Is strictly educational and analytical — no functional malicious code or
   step-by-step attack instructions.
2. Cites reliable and verifiable sources.
3. Follows the code style and architecture guidelines defined by the team.

Please open an issue to discuss significant changes before submitting a pull
request.

#### Code blocks in articles

Malware analysis needs to show evidence, so fenced blocks are allowed — but the
language decides whether they pass review. Every fence must carry one; an
untagged block hides what it holds and is always rejected.

**Cleared by default** — read-only evidence and detection logic. An analyst can
study these; nobody can run them:

```
yara · sigma · snort · asm · nasm · text · log · json · yaml · ini · diff
```

**Anything executable** must be declared per article, so the exception appears
in the diff instead of slipping past review:

```yaml
---
title: "Virus residente"
codeBlocks:
  - "powershell"
---
```

Declaring a language is not a licence to publish a payload: rule 1 still
applies. The declaration exists so a reviewer is told where to look.

`npm test` enforces all of this, along with defanged IoCs and the absence of
absolute internal links.

### License

This repository uses two separate licenses, keeping source code and wiki
content under distinct terms:

| Component                                       | License         | File                                      |
| ----------------------------------------------- | --------------- | ----------------------------------------- |
| Source code (frontend, scripts, configuration)  | MIT             | [`LICENSE`](./LICENSE.md)                 |
| Wiki content (articles, explanations, diagrams) | CC BY-NC-SA 4.0 | [`CONTENT-LICENSE`](./CONTENT-LICENSE.md) |

The content license is **CC BY-NC-SA 4.0** because the wiki content is derived
from the master's thesis (TFM) _"NEMESIS: Análisis y estudio de Malware"_
(Juan Caravantes Algaba, UCLM, 2025), which is released under those same terms.

---

## Español

### Sobre el proyecto

**Payloaded** es una enciclopedia colaborativa dedicada exclusivamente al
estudio y la divulgación educativa del malware. El proyecto recopila,
organiza y explica las distintas familias de malware (virus, gusanos,
ransomware, spyware, rootkits y otros), sus técnicas, su funcionamiento
interno y su contexto histórico, con el objetivo de servir como recurso de
aprendizaje para estudiantes, investigadores y profesionales de la
ciberseguridad.

### Aviso legal

Este proyecto tiene una finalidad estrictamente educativa e informativa. No
contiene, distribuye ni facilita:

- Código malicioso funcional ni muestras de malware operativas.
- Herramientas de ataque o frameworks de explotación.
- Instrucciones operativas para crear, desplegar o propagar malware.

Todo el contenido se centra en el análisis conceptual, el contexto histórico
y técnico, la detección y la defensa frente a estas amenazas. Este proyecto
no está destinado a, ni debe utilizarse para, ningún fin malicioso o ilegal.

### Stack tecnológico

### Estructura del proyecto

Todos los artículos viven en `src/content/`. **Las carpetas reflejan el modelo
de datos: donde las entradas forman una jerarquía, las carpetas la muestran;
donde no la hay, los ficheros van sueltos.**

```
src/content/
├── families/                    YAML plano — etiquetas de taxonomía, sin artículo
│   ├── ransomware.yaml
│   └── virus.yaml
├── types/                       agrupado por familia: las entradas tienen `parent`
│   ├── ransomware/
│   │   ├── index.md               la entrada de la familia
│   │   ├── leakware.md            un subtipo
│   │   └── locker-ransomware.md
│   └── virus/
│       ├── index.mdx
│       ├── resident-virus.md
│       └── images/                los recursos van junto a quien los usa
├── attack-vectors/              plano — ningún vector contiene a otro
├── malware/                     plano
└── indicators/                  plano
```

Dos consecuencias que conviene conocer antes de mover nada:

- **Las carpetas son organizativas.** Los ids se aplanan, así que
  `types/ransomware/leakware.md` se sirve en `/types/leakware`. Reclasificar una
  entrada arrastrándola a otra carpeta nunca cambia su URL.
- **Por eso dos ficheros pueden colisionar.** `types/virus/foo.md` y
  `types/ransomware/foo.md` reclamarían el mismo id `foo`. El build falla de
  forma explícita si ocurre, en lugar de descartar uno en silencio.

`.md` y `.mdx` conviven en la misma colección. Usa `.mdx` solo cuando una entrada
necesite un componente — por ejemplo una figura anclada a un pasaje concreto.

### Contribuir

Las contribuciones son bienvenidas. Antes de enviar un cambio, asegúrate de
que cualquier contenido:

1. Sea estrictamente educativo y analítico — sin código malicioso funcional
   ni instrucciones paso a paso de ataque.
2. Cite fuentes fiables y verificables.
3. Siga la guía de estilo de código y arquitectura definida por el equipo.

Abre un issue para discutir cambios significativos antes de enviar un pull
request.

#### Bloques de código en los artículos

El análisis de malware necesita mostrar evidencias, así que los bloques de código
están permitidos — pero es el lenguaje el que decide si pasan la revisión. Toda
valla debe llevar uno; un bloque sin etiquetar oculta lo que contiene y se
rechaza siempre.

**Permitidos por defecto** — evidencia y lógica de detección. Un analista puede
estudiarlas; nadie puede ejecutarlas:

```
yara · sigma · snort · asm · nasm · text · log · json · yaml · ini · diff
```

**Cualquier cosa ejecutable** debe declararse artículo por artículo, para que la
excepción aparezca en el diff en lugar de colarse sin revisión:

```yaml
---
title: "Virus residente"
codeBlocks:
  - "powershell"
---
```

Declarar un lenguaje no autoriza a publicar un payload: la regla 1 sigue
vigente. La declaración existe para avisar a quien revisa de dónde mirar.

`npm test` comprueba todo esto, junto con los IoC defanged y la ausencia de
enlaces internos absolutos.

### Licencia

Este repositorio utiliza dos licencias separadas, manteniendo el código
fuente y el contenido de la wiki bajo términos distintos:

| Componente                                                 | Licencia        | Fichero                                   |
| ---------------------------------------------------------- | --------------- | ----------------------------------------- |
| Código fuente (frontend, scripts, configuración)           | MIT             | [`LICENSE`](./LICENSE.md)                 |
| Contenido de la wiki (artículos, explicaciones, diagramas) | CC BY-NC-SA 4.0 | [`CONTENT-LICENSE`](./CONTENT-LICENSE.md) |

La licencia del contenido es **CC BY-NC-SA 4.0** porque el contenido de la
wiki deriva del Trabajo de Fin de Máster (TFM) _«NEMESIS: Análisis y estudio
de Malware»_ (Juan Caravantes Algaba, UCLM, 2025), publicado bajo esos mismos
términos.

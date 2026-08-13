---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Virus residente"
summary: "Se carga en memoria y sobrevive al reinicio: su ventaja es la persistencia, y ahí está también su rastro."
order: 1
draft: false
family: "es/virus"
parent: "es/virus"
vectors:
  - "es/removable-devices"
notableCases:
  - "CIH / Chernobyl (1998) — residente en memoria, llegó a sobrescribir la BIOS de los equipos afectados"
sources:
  - "TFM NEMESIS, §3.3.1"
---

Un **virus residente** se aloja en la memoria del sistema y sigue operando después de que el archivo que lo introdujo haya desaparecido. Esa permanencia es lo que lo distingue: no depende de que la víctima vuelva a abrir el fichero infectado, porque ya está activo.

## Mecanismos de persistencia

Descritos aquí a nivel conceptual, como material de detección:

- **Entradas de autoarranque.** Claves del registro que ejecutan el código al iniciar sesión.
- **Inyección en procesos legítimos.** Modificación de un proceso lícito para que ejecute código ajeno, camuflándose bajo una identidad de confianza.
- **Carga dinámica.** Manipulación de librerías o módulos para cargarse sin dejar entradas visibles en configuración.
- **Memoria virtual.** Aprovechamiento del área de intercambio en disco que emula la RAM.
- **Apoyo en rootkits.** Uso de herramientas de ocultación para dificultar aún más el hallazgo.

## La inversión defensiva

Esa lista, leída al revés, es un **inventario de sitios donde mirar**. Cada técnica de permanencia deja un rastro comprobable:

| Mecanismo | Dónde buscar |
|---|---|
| Autoarranque | Entradas de inicio y tareas programadas |
| Inyección | Integridad de procesos, memoria que no corresponde al binario |
| Carga dinámica | Librerías cargadas por cada proceso |
| Rootkit | Discrepancias entre lo que informa el sistema y lo que ve un análisis externo |

Esa inversión —del comportamiento del atacante al procedimiento del analista— es el hilo conductor de esta wiki.

## Mitigación

- **Análisis desde un medio externo**, que no confía en el sistema potencialmente comprometido.
- **Comparación con una línea base** de procesos y entradas de arranque conocidas.
- **Mínimo privilegio**: sin permisos administrativos, la mayoría de estos mecanismos no llegan a establecerse.

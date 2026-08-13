---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Leakware (doxware)"
summary: "No cobra por descifrar, sino por no publicar: el rescate se paga para evitar la filtración de los datos robados."
order: 3
draft: false
family: "es/ransomware"
parent: "es/ransomware"
vectors:
  - "es/social-engineering"
  - "es/unpatched-vulnerabilities"
notableCases:
  - "Maze (2019) — popularizó el sitio de filtraciones como método de presión"
sources:
  - "TFM NEMESIS, §3.3.5"
---

El **leakware** —también llamado *doxware*— invierte la lógica del ransomware clásico. En lugar de bloquear el acceso a la información y cobrar por devolverla, la exfiltra y cobra por **no hacerla pública**. Suele combinarse con el cifrado en lo que se conoce como doble extorsión: primero se roban los datos, después se cifran, y se pide un pago por cada cosa.

## Por qué la copia de seguridad ya no basta

Aquí está el cambio importante para la defensa. Contra el ransomware de cifrado, una copia de seguridad verificada y desconectada neutraliza el chantaje: se restaura y se sigue trabajando. Contra el leakware, esa copia **no resuelve nada**, porque los datos ya están en poder del atacante y la amenaza es la publicación.

Eso desplaza la defensa hacia dos frentes distintos: impedir que la información salga y reducir el valor de la que pueda salir.

## Detección

Al depender de la exfiltración, deja rastros distintos a los del cifrado:

- Volúmenes de salida anómalos hacia destinos poco habituales, sobre todo fuera del horario normal.
- Conexiones sostenidas a servicios de almacenamiento externo desde equipos que nunca los usan.
- Compresión masiva de ficheros justo antes de esas transferencias.
- Acceso de una misma cuenta a un número inusual de recursos compartidos en poco tiempo.

## Mitigación

- **Cifrado de los datos en reposo**, para que lo exfiltrado tenga poco valor sin las claves.
- **Control de salida** y monitorización del tráfico hacia el exterior, no solo del perímetro de entrada.
- **Mínimo privilegio**: una cuenta comprometida solo debería alcanzar lo que necesita.
- **Clasificación de la información**, porque no toda merece la misma protección ni el mismo nivel de alarma.

Pagar es aquí especialmente inútil: nada garantiza la destrucción de una copia, y el historial de estos grupos muestra reclamaciones repetidas sobre el mismo material.

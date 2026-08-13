---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Vulnerabilidades sin parchear"
summary: "Fallos conocidos en software desactualizado: la vía de entrada que no necesita engañar a nadie."
order: 3
draft: false
sources:
  - "TFM NEMESIS, §3.1.2"
  - "CISA — Known Exploited Vulnerabilities Catalog"
---

A diferencia de la ingeniería social, este vector no necesita que nadie cometa un error: basta con que un sistema expuesto ejecute una versión de software con un fallo ya conocido y publicado. El atacante no descubre nada nuevo, simplemente aprovecha la ventana entre la publicación del parche y su instalación.

## Por qué es tan efectivo

La información juega en contra del defensor. Cuando un fabricante publica un parche, publica también —implícitamente— la existencia del fallo. A partir de ese momento cualquiera puede estudiar la corrección para deducir qué se arreglaba, mientras que las organizaciones tardan semanas o meses en desplegar la actualización en todo su parque.

El caso de WannaCry en 2017 ilustra el patrón: el parche llevaba **dos meses** disponible cuando comenzó la propagación masiva.

## Superficie habitual

- Servicios expuestos a Internet sin actualizar: acceso remoto, comparticiones de red, paneles de administración.
- Software de terceros olvidado: complementos, librerías y dependencias que nadie inventaría.
- Dispositivos que no se perciben como ordenadores: impresoras, cámaras, routers y equipamiento industrial.

## Detección y mitigación

- **Inventario de activos.** No se puede parchear lo que no se sabe que existe; el inventario es el punto de partida, no un trámite.
- **Priorización por explotación real**, no solo por puntuación teórica de gravedad: un fallo medio que se está explotando activamente es más urgente que uno crítico que nadie usa.
- **Segmentación de red**, para que un equipo sin parchear no ponga en riesgo al resto.
- **Ventanas de actualización definidas** y sistemas de prueba, de modo que parchear no dependa de la disponibilidad de nadie.

La lección defensiva es incómoda pero simple: en este vector el tiempo corre siempre a favor del atacante.

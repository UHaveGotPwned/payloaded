---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Ransomware de cifrado"
summary: "El subtipo más común: cifra el máximo de archivos sin inutilizar el sistema operativo y después exige el rescate."
order: 1
draft: false
family: "es/ransomware"
parent: "es/ransomware"
vectors:
  - "es/social-engineering"
sources:
  - "TFM NEMESIS, §3.3.5"
---

El **ransomware de cifrado** es la variante más extendida de la familia. A diferencia de otras variantes que bloquean el acceso al equipo, esta busca el mayor número posible de archivos del usuario —documentos, imágenes, bases de datos— y los cifra, dejando el sistema operativo funcional para que la víctima pueda leer la nota de rescate y realizar el pago.

## Por qué respeta el sistema operativo

Inutilizar el equipo sería contraproducente para el atacante: si la víctima no puede arrancar, tampoco puede leer las instrucciones ni pagar. De ahí que el cifrado se concentre en los datos de usuario y evite los archivos críticos de arranque.

## Cómo se detecta

Los indicadores habituales son un pico de operaciones de escritura y renombrado sobre muchos archivos en poco tiempo, la aparición masiva de extensiones desconocidas y la eliminación de copias de seguridad locales. Un ejemplo de nota de rescate apuntaría a un dominio como `hxxp://example[.]com/pay`, siempre citado de forma defanged.

## Mitigación

Copias de seguridad aisladas y verificadas, segmentación de red, principio de mínimo privilegio y monitorización de comportamiento sobre el sistema de ficheros.

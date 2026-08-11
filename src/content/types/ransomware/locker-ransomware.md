---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Ransomware de bloqueo"
summary: "Bloquea el acceso al dispositivo en lugar de cifrar los datos: aparatoso, pero mucho menos destructivo que el de cifrado."
order: 2
draft: false
family: "ransomware"
parent: "ransomware"
vectors:
  - "social-engineering"
notableCases:
  - "Reveton (2012) — se hacía pasar por un aviso policial para justificar la 'multa'"
  - "WinLocker — familia temprana que bloqueaba el escritorio en Windows"
sources:
  - "TFM NEMESIS, §3.3.5"
---

El **ransomware de bloqueo** impide el uso del dispositivo —normalmente superponiendo una pantalla que no se puede cerrar— y exige un pago para liberarlo. Es especialmente habitual en móviles y tabletas.

## Por qué es menos grave de lo que parece

La diferencia decisiva con el ransomware de cifrado es que **los datos siguen intactos**. El ataque bloquea el acceso, no la información. Eso cambia por completo la respuesta: no hace falta recuperar claves ni descifrar nada, basta con retirar el componente que bloquea o reinstalar el sistema para volver a tener los ficheros.

Su eficacia depende, por tanto, del pánico. Muchas variantes refuerzan ese efecto simulando una comunicación oficial: un aviso de las fuerzas de seguridad acusando a la víctima de alguna infracción y presentando el rescate como una multa.

## Cómo se reconoce

- La pantalla aparece siempre en primer plano y desactiva las combinaciones de teclas habituales de cierre.
- El mensaje mezcla amenaza legal con urgencia y un plazo corto.
- Los archivos personales conservan su extensión original y su tamaño, señal de que **no** ha habido cifrado.
- Suele exigir el pago por métodos no reversibles o tarjetas prepago.

## Mitigación

- **Arranque en modo seguro** o desde un medio externo, que normalmente evita la carga del bloqueo.
- **Restauración del sistema** a un punto anterior, o reinstalación conservando los datos.
- En móviles, desinstalación de la aplicación responsable desde el modo seguro del dispositivo.
- Instalación de aplicaciones solo desde las tiendas oficiales, que es por donde entra la mayoría de estas muestras.

Ninguna autoridad legítima bloquea un dispositivo ni reclama pagos por pantalla emergente: esa sola idea desactiva el mecanismo del que depende toda la familia.

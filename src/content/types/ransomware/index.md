---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Ransomware"
summary: "Malware de extorsión: cifra los datos de la víctima y exige un rescate, generalmente en criptomonedas, por su recuperación."
order: 1
draft: false
family: "ransomware"
vectors:
  - "social-engineering"
  - "removable-devices"
  - "unpatched-vulnerabilities"
notableCases:
  - "WannaCry (2017) — propagación mundial aprovechando una vulnerabilidad SMB con parche disponible desde hacía dos meses"
  - "CryptoLocker (2013) — primera campaña masiva que combinó cifrado sólido con pago en criptomoneda"
  - "Jigsaw (2016) — borrado progresivo de archivos para forzar el pago por urgencia"
  - "NotPetya (2017) — presentado como ransomware, en realidad destructivo: no había recuperación posible"
sources:
  - "TFM NEMESIS, §3.3.5"
  - "ENISA Threat Landscape — Ransomware"
---

El **ransomware** es una de las familias más nocivas que existen. Su mecánica: al llegar al sistema, la carga maliciosa busca archivos por extensión (o todos los que encuentre) y los cifra con claves que solo el atacante conoce. Después muestra un mensaje exigiendo un rescate —generalmente en criptomonedas— por recuperar los datos. Algunas variantes, además, exfiltran los datos sin cifrar para venderlos o usarlos en chantajes posteriores.

## Por qué no pagar

La recomendación general es **no pagar el rescate**. Muchos atacantes generan claves aleatorias que ni ellos conservan, por lo que los datos son irrecuperables aunque se pague; y cuando la clave sí se entrega, buena parte de los archivos suele quedar corrupta. El coste real del ransomware es doble: pérdidas económicas enormes para empresas y pérdida de información personal y sentimental irreemplazable para particulares. La defensa efectiva es previa: **copias de seguridad** verificadas y desconectadas.

## Cifrado empleado

Al necesitar cifrar rápido grandes volúmenes, los atacantes combinan dos algoritmos estándar:

- **AES** (simétrico, rápido) cifra los archivos de la víctima.
- **RSA** (asimétrico) protege a su vez la clave AES: se cifra con la clave pública del atacante, de modo que solo su clave privada puede recuperarla.

## Otras variantes

Además de los subtipos con entrada propia, la familia incluye formas que comparten el modelo de extorsión sin encajar del todo en ellos:

- **RaaS (Ransomware as a Service).** Grupos que desarrollan el ransomware y lo alquilan a terceros a cambio de un porcentaje del rescate. No es una técnica sino un modelo de negocio, y explica buena parte del crecimiento de la familia: abarata y profesionaliza el acceso al ataque.
- **De borrado progresivo.** Elimina datos poco a poco mientras la víctima no paga, para convertir la duda en urgencia.
- **Scareware.** Simula una infección inexistente y vende la solución. Estrictamente no cifra ni bloquea nada: el daño es el pago.

> Un cambio masivo de extensiones de archivo en poco tiempo es uno de los indicadores de compromiso más claros de esta familia.

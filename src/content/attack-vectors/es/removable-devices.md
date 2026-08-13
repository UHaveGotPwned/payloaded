---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Dispositivos extraíbles"
summary: "El USB abandonado como anzuelo: curiosidad humana más conexión física directa al sistema."
order: 2
draft: false
sources:
  - "TFM NEMESIS, §3.1.2"
---

Los atacantes también explotan el factor humano fuera de Internet. La técnica clásica: abandonar memorias USB en zonas públicas como anzuelo, apelando a la curiosidad de quien las encuentra.

## Por qué funciona

Al conectar el dispositivo, la carga maliciosa se ejecuta con la ventaja de estar **físicamente dentro del perímetro**: no hay firewall de red que atravesar, y en muchos entornos el usuario tiene permisos suficientes para que la infección no requiera escalada adicional ni confirmaciones del sistema.

## Defensa

- Nunca conectar dispositivos de origen desconocido a un equipo personal o corporativo.
- Deshabilitar la ejecución automática (autorun) de medios extraíbles mediante política de sistema.
- En entornos corporativos: restringir puertos USB por política, o analizar todo medio extraíble en una estación aislada (*sheep dip*) antes de su uso.

Este vector demuestra que el perímetro de seguridad no termina en la red: incluye el mundo físico y las decisiones de las personas.

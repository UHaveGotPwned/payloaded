---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Locker ransomware"
summary: "Blocks access to the device instead of encrypting the data: dramatic, but far less destructive than the encrypting kind."
order: 2
draft: false
family: "en/ransomware"
parent: "en/ransomware"
vectors:
  - "en/social-engineering"
notableCases:
  - "Reveton (2012) — posed as a police notice to justify the 'fine'"
  - "WinLocker — early family that locked the Windows desktop"
sources:
  - "TFM NEMESIS, §3.3.5"
---

**Locker ransomware** prevents the device from being used — usually by laying a screen over everything that cannot be closed — and demands a payment to release it. It is especially common on phones and tablets.

## Why it is less serious than it looks

The decisive difference from encryption ransomware is that **the data is still intact**. The attack blocks access, not the information. That changes the response entirely: there are no keys to recover and nothing to decrypt, so removing the component doing the locking, or reinstalling the system, is enough to get the files back.

Its effectiveness therefore rests on panic. Many variants reinforce that by imitating an official communication: a notice from law enforcement accusing the victim of some offence and presenting the ransom as a fine.

## How to recognise it

- The screen always sits in the foreground and disables the usual key combinations for closing it.
- The message mixes legal threat with urgency and a short deadline.
- Personal files keep their original extension and size, a sign that **no** encryption took place.
- It usually demands payment through non-reversible methods or prepaid cards.

## Mitigation

- **Booting in safe mode** or from external media, which normally stops the locker from loading.
- **System restore** to an earlier point, or a reinstall that preserves the data.
- On phones, uninstalling the offending app from the device's safe mode.
- Installing apps only from official stores, which is where most of these samples get in.

No legitimate authority locks a device or demands payment through a pop-up: that one idea disarms the mechanism the whole family depends on.

---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Resident virus"
summary: "It loads into memory and survives a reboot: persistence is its advantage, and also where its trail is."
order: 1
draft: false
family: "en/virus"
parent: "en/virus"
vectors:
  - "en/removable-devices"
notableCases:
  - "CIH / Chernobyl (1998) — memory-resident, went as far as overwriting the BIOS of affected machines"
sources:
  - "TFM NEMESIS, §3.3.1"
---

A **resident virus** lodges itself in system memory and keeps operating after the file that introduced it is gone. That permanence is what sets it apart: it does not depend on the victim opening the infected file again, because it is already active.

## Persistence mechanisms

Described here at a conceptual level, as detection material:

- **Autostart entries.** Registry keys that run the code at sign-in.
- **Injection into legitimate processes.** Altering a legitimate process so it runs foreign code, hiding behind a trusted identity.
- **Dynamic loading.** Manipulating libraries or modules to load without leaving visible configuration entries.
- **Virtual memory.** Exploiting the on-disk swap area that emulates RAM.
- **Leaning on rootkits.** Using concealment tooling to make it harder still to find.

## The defensive inversion

Read backwards, that list is an **inventory of places to look**. Every persistence technique leaves a checkable trail:

| Mechanism       | Where to look                                                        |
| --------------- | -------------------------------------------------------------------- |
| Autostart       | Startup entries and scheduled tasks                                   |
| Injection       | Process integrity, memory that does not match the binary              |
| Dynamic loading | Libraries loaded by each process                                      |
| Rootkit         | Discrepancies between what the system reports and what an external analysis sees |

That inversion — from the attacker's behaviour to the analyst's procedure — is the thread running through this wiki.

## Mitigation

- **Analysis from external media**, which does not trust the potentially compromised system.
- **Comparison against a baseline** of known processes and startup entries.
- **Least privilege**: without administrative rights, most of these mechanisms never get established.

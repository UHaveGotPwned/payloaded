---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Unpatched vulnerabilities"
summary: "Known flaws in out-of-date software: the way in that needs to deceive nobody."
order: 3
draft: false
sources:
  - "TFM NEMESIS, §3.1.2"
  - "CISA — Known Exploited Vulnerabilities Catalog"
---

Unlike social engineering, this vector needs nobody to make a mistake: it is enough for an exposed system to run a version of some software with a flaw that is already known and published. The attacker discovers nothing new, they simply exploit the window between a patch being released and being installed.

## Why it works so well

Information works against the defender. When a vendor publishes a patch, it also publishes — implicitly — the existence of the flaw. From that moment anyone can study the fix to work out what it repaired, while organisations take weeks or months to roll the update out across their estate.

WannaCry in 2017 illustrates the pattern: the patch had been available for **two months** when the mass outbreak began.

## The usual surface

- Internet-facing services left un-updated: remote access, network shares, admin panels.
- Forgotten third-party software: plugins, libraries and dependencies nobody would think to inventory.
- Devices nobody thinks of as computers: printers, cameras, routers and industrial equipment.

## Detection and mitigation

- **Asset inventory.** You cannot patch what you do not know exists; the inventory is the starting point, not a formality.
- **Prioritise by real-world exploitation**, not by theoretical severity score alone: a medium-rated flaw under active exploitation is more urgent than a critical one nobody uses.
- **Network segmentation**, so an unpatched machine does not put the rest at risk.
- **Defined patching windows** and test systems, so patching does not depend on anyone being available.

The defensive lesson is uncomfortable but simple: in this vector, time is always on the attacker's side.

---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Leakware (doxware)"
summary: "It charges not for decryption but for silence: the ransom buys the stolen data not being published."
order: 3
draft: false
family: "en/ransomware"
parent: "en/ransomware"
vectors:
  - "en/social-engineering"
  - "en/unpatched-vulnerabilities"
notableCases:
  - "Maze (2019) — popularised the leak site as a method of pressure"
sources:
  - "TFM NEMESIS, §3.3.5"
---

**Leakware** — also called _doxware_ — inverts the logic of classic ransomware. Instead of blocking access to the information and charging to give it back, it exfiltrates the data and charges for **not making it public**. It is usually combined with encryption in what is known as double extortion: the data is stolen first, encrypted afterwards, and a payment is demanded for each.

## Why a backup is no longer enough

This is the important shift for the defence. Against encryption ransomware, a verified, disconnected backup neutralises the blackmail: restore and carry on working. Against leakware that backup **solves nothing**, because the data is already in the attacker's hands and the threat is publication.

That moves the defence onto two different fronts: stopping information from leaving, and reducing the value of whatever does leave.

## Detection

Because it depends on exfiltration, it leaves different traces from encryption:

- Unusual outbound volumes towards uncommon destinations, especially outside normal hours.
- Sustained connections to external storage services from machines that never use them.
- Mass compression of files immediately before those transfers.
- A single account reaching an unusual number of shared resources in a short window.

## Mitigation

- **Encryption of data at rest**, so what is exfiltrated is worth little without the keys.
- **Egress control** and monitoring of outbound traffic, not just of the inbound perimeter.
- **Least privilege**: a compromised account should only reach what it needs.
- **Information classification**, because not all of it deserves the same protection or the same level of alarm.

Paying is especially useless here: nothing guarantees a copy is destroyed, and the track record of these groups shows repeated demands over the same material.

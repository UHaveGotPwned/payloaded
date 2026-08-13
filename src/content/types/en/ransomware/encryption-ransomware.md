---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Encryption ransomware"
summary: "The most common subtype: encrypts as many files as it can without breaking the operating system, then demands the ransom."
order: 1
draft: false
family: "en/ransomware"
parent: "en/ransomware"
vectors:
  - "en/social-engineering"
sources:
  - "TFM NEMESIS, §3.3.5"
---

**Encryption ransomware** is the most widespread variant of the family. Unlike variants that lock access to the machine, this one hunts for as many of the user's files as it can find — documents, images, databases — and encrypts them, leaving the operating system working so the victim can read the ransom note and make the payment.

## Why it spares the operating system

Breaking the machine would be counterproductive for the attacker: if the victim cannot boot, they cannot read the instructions or pay either. Hence the encryption concentrates on user data and steers clear of critical boot files.

## How it is detected

The usual indicators are a spike in write and rename operations across many files in a short window, a mass appearance of unfamiliar extensions, and the deletion of local backups. A sample ransom note would point at a domain such as `hxxp://example[.]com/pay`, always quoted defanged.

## Mitigation

Isolated, verified backups, network segmentation, least privilege, and behavioural monitoring of the file system.

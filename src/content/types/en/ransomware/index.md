---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Ransomware"
summary: "Extortion malware: it encrypts the victim's data and demands a ransom, usually in cryptocurrency, to give it back."
order: 1
draft: false
family: "en/ransomware"
vectors:
  - "en/social-engineering"
  - "en/removable-devices"
notableCases:
  - "WannaCry (2017) — spread worldwide through an SMB flaw patched two months earlier"
  - "CryptoLocker (2013) — first mass campaign to pair strong encryption with cryptocurrency payment"
sources:
  - "TFM NEMESIS, §3.3.5"
---

**Ransomware** is among the most damaging families in existence. Once the payload reaches a system it looks for files by extension — or simply takes everything it finds — and encrypts them with keys only the attacker holds. A message then demands a ransom, usually in cryptocurrency, in exchange for the data. Some variants also exfiltrate the files before encrypting them, so they can be sold or used for later blackmail.

## Why paying is a bad idea

The standing advice is **not to pay**. Many attackers generate random keys they never keep, so the data is unrecoverable no matter what changes hands; and when a key does arrive, a good share of the files usually comes back corrupted. The real cost is twofold: heavy financial losses for organisations, and irreplaceable personal material for individuals. The effective defence is the one taken beforehand — **verified, disconnected backups**.

## The encryption involved

Because large volumes have to be encrypted quickly, attackers combine two standard algorithms:

- **AES** (symmetric, fast) encrypts the victim's files.
- **RSA** (asymmetric) protects the AES key itself: it is encrypted with the attacker's public key, so only their private key can recover it.

> A sudden, widespread change of file extensions is one of the clearest indicators of compromise for this family.

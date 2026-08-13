---
# Example article: placeholder content that exercises the schema, not the final text.
title: "Removable devices"
summary: "The abandoned USB stick as bait: human curiosity plus a direct physical connection to the system."
order: 2
draft: false
sources:
  - "TFM NEMESIS, §3.1.2"
---

Attackers also exploit the human factor away from the internet. The classic technique: leave USB sticks lying around in public areas as bait, appealing to the curiosity of whoever finds them.

## Why it works

Once the device is plugged in, the malicious payload runs with the advantage of being **physically inside the perimeter**: there is no network firewall to cross, and in many environments the user holds enough privileges that the infection needs no further escalation or system confirmation.

## Defence

- Never plug a device of unknown origin into a personal or corporate machine.
- Disable autorun for removable media through system policy.
- In corporate environments: restrict USB ports by policy, or scan every removable device on an isolated station (*sheep dip*) before use.

This vector shows that the security perimeter does not end at the network: it includes the physical world and the decisions people make.

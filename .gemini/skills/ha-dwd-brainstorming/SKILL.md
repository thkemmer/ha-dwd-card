---
name: ha-dwd-brainstorming
description: Guidelines for joint brainstorming on new features. This skill defines how to transition from an 'Idea' (GitHub Issue) into 'Phase 1: Discovery' of the Development Lifecycle.
---

# Feature Brainstorming Protocol

This protocol defines how we collaboratively evolve a simple idea into a technical requirement.

## 1. The Ideation Cycle
When a new idea is shared (usually via a GitHub Issue with the `idea` label):

- **Inquiry:** I will ask clarifying questions about the **user benefit** and the **UI interaction**.
- **Context Search:** I will research if Home Assistant already provides the necessary data for this feature.
- **Feasibility:** I will provide a quick technical assessment:
    - Can we reuse existing components?
    - Does it require a new card or just a new config option?
    - What are the potential edge cases?

## 2. Transitioning to Development
An idea is "ready" for Phase 1 (Discovery) of our `GEMINI.md` Lifecycle when:

- [ ] **The User Story is complete:** We know exactly who uses it and why.
- [ ] **Data Source is verified:** We know which entities or attributes from the DWD integration are needed.
- [ ] **Mock Data exists:** We can create a YAML representation of the required data for synthetic testing.
- [ ] **Rough UX concept exists:** We have a shared understanding of the visual representation.

## 3. Brainstorming Principles
- **Aesthetic Alignment:** New ideas should always feel like part of the "HA DWD Card" family (modern, clean, functional).
- **Simplicity over Complexity:** If a feature can be solved with a simple toggle, prefer that over a new component.
- **Performance First:** Brainstorm how to implement the feature without increasing the overall footprint or re-render count.

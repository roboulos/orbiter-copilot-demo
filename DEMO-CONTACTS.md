# Demo Contacts for Testing

These are fictional contacts to test the Orbiter Copilot demo. Add these to your demo data.

## 1. Sarah Chen
- **Title:** VP of Engineering
- **Company:** Stripe
- **LinkedIn:** linkedin.com/in/sarahchen
- **Context:** Former colleague, now leading 80+ person engineering org
- **Use Cases:**
  - Recruiting senior engineers
  - Technical architecture advice
  - Intro to Stripe's payments ecosystem

## 2. Marcus Williams
- **Title:** Seed Investor
- **Company:** Sequoia Capital
- **LinkedIn:** linkedin.com/in/marcuswilliams
- **Context:** Invests in B2B SaaS, graph databases, and AI tooling
- **Use Cases:**
  - Fundraising introductions
  - Investor network expansion
  - Portfolio company connections

## 3. Jessica Rodriguez
- **Title:** Head of Product
- **Company:** Notion
- **LinkedIn:** linkedin.com/in/jessicarodriguez
- **Context:** Product leader, expert in PLG (product-led growth)
- **Use Cases:**
  - Product strategy advice
  - PLG tactics and playbooks
  - Design partnership opportunities

## 4. David Park
- **Title:** Real Estate Developer
- **Company:** Costa Rica Properties Group
- **LinkedIn:** linkedin.com/in/davidpark
- **Context:** Expat living in Costa Rica, develops properties
- **Use Cases:**
  - Costa Rica real estate connections
  - Relocation advice
  - Local network introductions

## 5. Emily Foster
- **Title:** Fractional CFO
- **Company:** SaaS Finance Partners
- **LinkedIn:** linkedin.com/in/emilyfoster
- **Context:** Specializes in Series A-B SaaS financials
- **Use Cases:**
  - Financial modeling
  - Investor introductions (she needs deal flow)
  - CFO network connections

---

## How to Use in Demo

### Test Flow 1: Own Outcome (No Person Selected)
1. Open copilot (no person selected)
2. Click: "🏠 I want to buy a house in Costa Rica"
3. Should show button options like:
   - Region? [Pacific Coast] [Central Valley] [Caribbean]
   - Purpose? [Vacation] [Investment] [Relocating]
   - etc.
4. End with: "I found David Park in your network..." → Submit button

### Test Flow 2: Leverage Network
1. Search and select "Marcus Williams"
2. Click: "⚡ Leverage Network for Marcus"
3. Should get: "Your best move is to send this message..." → Submit button

### Test Flow 3: Help Someone Specific
1. Search and select "Emily Foster"
2. Click: "🎯 Help Emily with something specific"
3. Type: "She needs investor introductions for her clients"
4. Should show button options → Submit button

### Test Flow 4: Fork → Sub-Fork
1. Search and select "Sarah Chen"
2. Should show Fork in the Road:
   - [Leverage Network for Sarah]
   - [Help Sarah with specific task]
3. Click "Help Sarah..."
4. Should show Sub-Fork:
   - [Suggest what Sarah might need]
   - [I know what to help with]
5. Test both paths

---

## Mock Data Format

For the PersonPicker component, add to demo data:

```json
[
  {
    "master_person_id": 1,
    "full_name": "Sarah Chen",
    "in_my_network": true,
    "master_person": {
      "id": 1,
      "name": "Sarah Chen",
      "avatar": null,
      "current_title": "VP of Engineering",
      "bio": "Leading engineering org at Stripe. Former colleague.",
      "master_company": {
        "id": 101,
        "company_name": "Stripe",
        "logo": null
      }
    }
  },
  {
    "master_person_id": 2,
    "full_name": "Marcus Williams",
    "in_my_network": true,
    "master_person": {
      "id": 2,
      "name": "Marcus Williams",
      "avatar": null,
      "current_title": "Seed Investor",
      "bio": "Investing in B2B SaaS and graph databases.",
      "master_company": {
        "id": 102,
        "company_name": "Sequoia Capital",
        "logo": null
      }
    }
  },
  {
    "master_person_id": 3,
    "full_name": "Jessica Rodriguez",
    "in_my_network": true,
    "master_person": {
      "id": 3,
      "name": "Jessica Rodriguez",
      "avatar": null,
      "current_title": "Head of Product",
      "bio": "Product leader at Notion, PLG expert.",
      "master_company": {
        "id": 103,
        "company_name": "Notion",
        "logo": null
      }
    }
  },
  {
    "master_person_id": 4,
    "full_name": "David Park",
    "in_my_network": true,
    "master_person": {
      "id": 4,
      "name": "David Park",
      "avatar": null,
      "current_title": "Real Estate Developer",
      "bio": "Expat developer in Costa Rica, knows the local market.",
      "master_company": {
        "id": 104,
        "company_name": "Costa Rica Properties Group",
        "logo": null
      }
    }
  },
  {
    "master_person_id": 5,
    "full_name": "Emily Foster",
    "in_my_network": true,
    "master_person": {
      "id": 5,
      "name": "Emily Foster",
      "avatar": null,
      "current_title": "Fractional CFO",
      "bio": "SaaS finance specialist, needs investor introductions.",
      "master_company": {
        "id": 105,
        "company_name": "SaaS Finance Partners",
        "logo": null
      }
    }
  }
]
```

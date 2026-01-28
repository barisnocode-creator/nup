

# Step 2: Professional Question Flow - Implementation Plan

## Overview
Building a multi-step wizard that collects professional information when users click "Create your first website" on the dashboard. All data will be stored in a structured JSON format within an expanded `projects` table.

---

## Database Changes

### Expand the `projects` Table
Add new columns to store all collected form data:

```sql
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';
```

The `form_data` JSONB column will store all wizard answers in a structured format:
```json
{
  "businessInfo": {
    "businessName": "City Dental Clinic",
    "city": "New York",
    "country": "United States", 
    "phone": "+1 555-0123",
    "email": "contact@citydental.com"
  },
  "professionalDetails": {
    // Doctor: { specialty, yearsExperience }
    // Dentist: { services: [...] }
    // Pharmacist: { pharmacyType }
  },
  "websitePreferences": {
    "language": "English",
    "tone": "professional",
    "colorPreference": "light"
  }
}
```

---

## Component Architecture

### New Files to Create

```text
src/
  components/
    wizard/
      CreateWebsiteWizard.tsx      # Main wizard container
      WizardProgress.tsx           # Progress indicator (Step 1 of 4)
      steps/
        ProfessionStep.tsx         # Step 1: Select profession
        BusinessInfoStep.tsx       # Step 2: Business details
        ProfessionalDetailsStep.tsx # Step 3: Profession-specific
        PreferencesStep.tsx        # Step 4: Website preferences
  pages/
    Project.tsx                    # New page: /project/:id
  types/
    wizard.ts                      # TypeScript types for form data
```

---

## Step-by-Step Wizard Flow

### Step 1: Profession Selection
- **UI**: 3 large, clickable cards (Doctor, Dentist, Pharmacist)
- **Icons**: Stethoscope, Smile, Pill (from lucide-react)
- **Behavior**: Single selection, highlight selected card
- **Validation**: Must select one to proceed

### Step 2: Basic Business Information
| Field | Type | Validation |
|-------|------|------------|
| Business/Clinic/Pharmacy Name | Text input | Required, max 100 chars |
| City | Text input | Required |
| Country | Select dropdown | Required, list of countries |
| Phone Number | Text input | Required, basic format |
| Email | Text input | Pre-filled from user, editable, email format |

### Step 3: Professional Details (Conditional)

**If Doctor:**
| Field | Type | Options |
|-------|------|---------|
| Medical Specialty | Select | General Practice, Cardiology, Dermatology, Pediatrics, Orthopedics, Other |
| Years of Experience | Select | 0-2, 3-5, 6-10, 10-20, 20+ |

**If Dentist:**
| Field | Type | Options |
|-------|------|---------|
| Dental Services | Checkboxes (multi-select) | General Dentistry, Cosmetic Dentistry, Orthodontics, Periodontics, Pediatric Dentistry, Oral Surgery, Endodontics |

**If Pharmacist:**
| Field | Type | Options |
|-------|------|---------|
| Pharmacy Type | Radio buttons | Local/Community, 24-Hour, Hospital/Clinical |

### Step 4: Website Preferences
| Field | Type | Options |
|-------|------|---------|
| Preferred Language | Select | English, Spanish, French, German, Arabic, Chinese, Other |
| Tone of Voice | Radio cards | Professional, Friendly, Premium |
| Color Preference | Radio cards with preview | Light, Dark, Neutral |

---

## Wizard UX Features

1. **Progress Indicator**: Top bar showing "Step X of 4" with filled dots
2. **Navigation Buttons**: "Back" and "Continue" buttons
3. **Validation**: Real-time validation with error messages
4. **Smooth Transitions**: Animated step transitions
5. **Modal-based**: Opens as a dialog over the dashboard
6. **Mobile Responsive**: Works on all screen sizes

---

## Data Flow

```text
1. User clicks "Create New Website"
        |
        v
2. Wizard opens (Step 1)
        |
        v
3. User completes all 4 steps
        |
        v
4. On submit:
   - Create project in Supabase with:
     * user_id: auth.uid()
     * profession: selected profession
     * name: businessName from form
     * status: "draft"
     * form_data: all answers as JSON
        |
        v
5. Redirect to /project/:id
        |
        v
6. Show "Your website is being prepared" message
```

---

## Form Validation (using Zod)

Each step will have its own validation schema:

- **Step 1**: `profession` required (enum: doctor, dentist, pharmacist)
- **Step 2**: All fields required, email format, phone format
- **Step 3**: Conditional based on profession - at least one selection required
- **Step 4**: All fields required

---

## Project Page (/project/:id)

A simple placeholder page showing:
- Project name as heading
- Large icon/illustration
- Message: "Your website is being prepared"
- Subtitle: "We're setting up your professional website. This usually takes a few moments."
- "Back to Dashboard" link

---

## Technical Implementation Details

### State Management
- Use React `useState` for wizard step tracking
- Use `react-hook-form` with Zod resolver for form handling
- Persist form data across steps using a parent state object

### Database Interaction
- Use Supabase client for project creation
- Leverage existing RLS policies (user can only insert their own projects)

### Routing
- Add new route `/project/:id` to App.tsx
- Protected route (requires authentication)

---

## Summary of Changes

| Type | Files |
|------|-------|
| Database Migration | Add `form_data` JSONB column to projects |
| New Components | 6 new files in `components/wizard/` |
| New Page | `pages/Project.tsx` |
| New Types | `types/wizard.ts` |
| Modified | `Dashboard.tsx` (add wizard trigger) |
| Modified | `App.tsx` (add /project/:id route) |


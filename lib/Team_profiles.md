# Team Profiling System Design Document

## Overview
This system is designed to collect comprehensive team member profiles to create an objective baseline of the team's current capabilities, communication preferences, and work styles. This information will be used to:
1. Customize AI training programs
2. Design personalized AI expert personas
3. Build tailored AI workflows based on existing tools and skill levels
4. Inform future skill gap analysis and AI integration strategies

## Data Structure

### Core Team Member Profile
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibilities: string;
  email: string;
  inviteStatus: 'not_invited' | 'invited' | 'completed';
  details: {
    expertise: string[];
    aiKnowledge: {
      level: 'Beginner' | 'Intermediate' | 'Advanced';
      tools: string[];
      experience: string;
    };
    enneagramType: {
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
      description?: string; // Auto-populated based on type
    };
    communicationPreferences: {
      primary: string;
      channels: Record<'sms' | 'call' | 'whatsapp' | 'telegram' | 'slack' | 'email', {
        enabled: boolean;
        value?: string; // e.g., phone number, email, username
      }>;
    };
    skills: {
      technical: string[];
      soft: string[];
      certifications: string[];
    };
  };
}
```

## UI Components

### 1. Main Table View
- **Default View**: Two rows with add row capability
- **Columns**:
  - Name
  - Role/Title
  - Responsibilities
  - Email
  - Status (Not Invited/Invited/Completed)
  - Actions (Expand/Collapse, Invite, Delete)

### 2. Expandable Details Panel
```
[Basic Info] [Skills & AI] [Personality & Communication]

Basic Info:
- Role details
- Department
- Reports to

Skills & AI:
- Technical expertise [Tags]
- AI tools experience [Multi-select]
- Certifications [Tags]

Personality & Communication:
- Enneagram Type [Select with descriptions]
  ┌─────────────────────────────┐
  │ Type 1 - The Reformer       │
  │ Type 2 - The Helper         │
  │ Type 3 - The Achiever       ▼
  └─────────────────────────────┘
  [Find Your Type] -> Links to: https://openpsychometrics.org/tests/OEPS/
  [Type Description Display]

- Communication Preferences
  [Primary Channel Selection]
  [Channel Configuration Grid]
  ┌────────┬────────┬──────────┐
  │ Channel│ Enable │ Details   │
  ├────────┼────────┼──────────┤
  │ Slack  │   ☑    │ @username│
  │ Email  │   ☑    │ address  │
  │ SMS    │   ☐    │ phone    │
  └────────┴────────┴──────────┘
```

### 3. Data Import/Export
- CSV template download
- File upload zone (drag & drop)
- Column mapping interface
- Data validation
- Export functionality

## Implementation Phases

### Phase 1: Core UI (Current Focus)
- [ ] Basic table with CRUD operations
- [ ] Expandable details panel
- [ ] Data persistence
- [ ] CSV import/export

### Phase 2: Enhanced Features
- [ ] Team visualization dashboard
- [ ] Communication preference summary
- [ ] Personality type distribution
- [ ] AI readiness assessment

### Phase 3: Invite System
- [ ] Email invitation system
- [ ] Self-service form
- [ ] Progress tracking
- [ ] Reminder system

## Data Usage

This profile data will feed into:
1. **AI Expert Persona Creation**
   - Match communication styles
   - Align with team member preferences
   - Customize interaction patterns

2. **Training Program Design**
   - Personalized learning paths
   - Tool-specific training modules
   - Communication style adaptation

3. **Workflow Optimization**
   - Integration with existing tools
   - Communication channel optimization
   - Process automation opportunities

4. **Future Analysis**
   - Skill gap identification (separate step)
   - Industry benchmark comparison
   - AI integration opportunity mapping

## Notes
- This step focuses on objective data collection
- No skill gap analysis at this stage
- Data will be used for personalization and customization
- Industry benchmarking and gap analysis will be performed in subsequent steps
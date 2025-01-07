Below is a **comprehensive plan** for integrating Supabase into your AI onboarding application. It clarifies:

1. **What tables** you’ll likely need (beyond the “Projects” artifact).  
2. **How to handle user authentication** and document storage.  
3. **Where Tiptap (rich text editor) fits** into the workflow for document creation and editing.  
4. **How to keep your future expansions (team skill data, Enneagram, AI upskilling) in mind** right from the start.

The goal is to build a **scalable, flexible** data layer so your entire “AI Integration Onboarding” flow is well-structured, secure, and easy to iterate on.

---

## 1. Rethinking the Data Model (Instead of “Projects”)

You mentioned that “projects” is a leftover concept you probably *don’t* need. Typically, we want to store information about:

1. **Organizations** (i.e., the companies being onboarded)  
2. **Users** (the individuals who log in—could be the CEO/admin or team members)  
3. **Team Members** (which can overlap with Users if they also have a login, but you may also store extra data about them, e.g., Enneagram, skill sets)  
4. **Documents** (the AI-generated files, templates, rich-text docs, etc.)  
5. **Step Data** (the collected info from each onboarding step, if you want to store or reference it)  

Here’s a more direct approach that replaces the notion of “projects” with “organizations” or “companies.”

### 1.1 Proposed Tables

#### **1) `auth.users`** (Managed by Supabase)
- **id** (UUID)  
- **email**  
- **password** (hashed)  
- **etc.**  

> **Why?** Supabase provides a built-in `auth.users` table for user authentication. You won’t create it manually—Supabase handles it.

#### **2) `companies`** (Your custom table)
- **id** (UUID) — primary key  
- **name** (Text)  
- **website** (Text)  
- **linkedin_url** (Text)  
- **created_at** (Timestamp)  
- **updated_at** (Timestamp)  

> **Why?** Each organization being onboarded is represented here. This is your “Company Profile.”

#### **3) `company_members`** (Bridge between `companies` and `auth.users`)
- **id** (UUID) — primary key  
- **company_id** (UUID) — references `companies.id`  
- **user_id** (UUID) — references `auth.users.id`  
- **role** (Text) — e.g. “Admin,” “Editor,” “Member,” or “CEO,” etc.  
- **created_at** (Timestamp)  

> **Why?** This links each user to a specific company, allowing multiple companies with multiple users. If your use case always has just one company per user, you *could* skip this—but it’s more flexible to keep.

#### **4) `team_members`** (Detailed info about each individual on the team)
- **id** (UUID) — primary key  
- **company_id** (UUID) — references `companies.id`  
- **full_name** (Text)  
- **title** (Text)  
- **department** (Text)  
- **reports_to** (UUID) — references `team_members.id` or `auth.users.id`, whichever you prefer  
- **enneagram_type** (Integer) — 1 through 9, or null if unknown  
- **skills** (JSONB or separate child table) — storing skill ratings or AI skill preferences  
- **created_at** (Timestamp)  
- **updated_at** (Timestamp)  

> **Why?** Not every team member *must* be a logged-in user. Some might just be “profile records.” This table can hold their roles, responsibilities, skill levels, Enneagram type, etc.

#### **5) `documents`**
- **id** (UUID) — primary key  
- **company_id** (UUID) — references `companies.id` (which business does this doc belong to?)  
- **title** (Text)  
- **doc_type** (Text) — e.g., “Executive Summary,” “Upskilling Plan,” “AI Persona,” etc.  
- **content** (JSONB or Text) — can store Tiptap JSON structure, Markdown, or anything you prefer.  
- **created_at** (Timestamp)  
- **updated_at** (Timestamp)  

> **Why?** This is your “single source of truth” for documents. If you want file-tree structure, you can add a `parent_id` or a `path` column to represent folder hierarchy.

#### **6) `onboarding_steps`** (Optional)
- **id** (UUID) — primary key  
- **company_id** (UUID) — references `companies.id`  
- **step_number** (Integer)  
- **step_data** (JSONB) — storing user inputs for that step  
- **completed_at** (Timestamp)  

> **Why?** If your wizard is multi-step and you want to store partial data for each step or re-use it in the final doc generation, you’ll do so here. Once Supabase is integrated, you can fetch a company’s step data whenever you call OpenAI.

---

## 2. User Authentication with Supabase

1. **Supabase Auth**  
   - Use Supabase’s built-in auth for sign-up/login/reset flows.  
   - On successful login, store the user’s JWT in local storage or rely on the built-in session handling.

2. **Linking Users to Companies**  
   - On sign-up, you’ll either:
     - Create a new `company` record if they’re the first user for that org.  
     - Or invite them to an existing `company` (create an entry in `company_members`).  

3. **Permissions**  
   - If you need roles/permissions (“admin,” “member,” etc.), store that in `company_members.role`.  
   - A row-level security policy can ensure only users with the correct role can read/write certain records.

---

## 3. Document Storage & Tiptap

1. **Storing Tiptap Content**  
   - Tiptap’s default output is a **JSON** structure. Just store that in the `documents.content` column as JSONB.  
   - When you load the doc for editing, parse that JSON back into Tiptap.  
   - If you want versioning, create a `document_revisions` table referencing `documents.id`.

2. **File-Tree Style Organization** (Optional columns):
   - **`parent_id`** (UUID) referencing another `documents.id`, so you can nest documents/folders.  
   - **`is_folder`** (Boolean) to distinguish folders from files.  
   - Or a `path` text column (like `/ParentFolder/SubFolder/DocName`).

3. **Updating Documents**  
   - Each time the user edits in Tiptap, either **update** the same doc record or create a **new revision** record.  
   - If you want to link the doc with an AI agent, store any metadata or embeddings in additional columns/tables as needed.

---

## 4. Generating Documents with OpenAI & Storing Them

1. **Data Flow**  
   1. **User completes steps** → data saved in `onboarding_steps` or in the relevant company/team tables.  
   2. **User clicks “Generate”** → front end calls your API route with the relevant `company_id` (and doc type).  
   3. **API route** fetches all needed data from `company`, `team_members`, `onboarding_steps`, etc.  
   4. **Calls OpenAI** to generate content.  
   5. **Stores** the new doc in `documents` (with `doc_type`, `content`, `company_id`).

2. **Versioning**  
   - If you regenerate docs in the future, either **overwrite** the existing record or create a new record in `documents` (or in a `document_revisions` table).

3. **Team Access**  
   - Because the doc is linked to `company_id`, all users who belong to that `company_id` can read/modify it (depending on role-based rules).

---

## 5. Team Overview & Skills (Enneagram, etc.)

Because you want a “great overview of the human team”:

- Store each team member’s relevant info in `team_members`:  
  - Hard/soft skills, interest in AI, Enneagram type, etc.  
  - The *granularity* of skill tracking can be handled by a separate table if you want (e.g., `team_member_skills`).  

- You can **query** all `team_members` for a specific `company_id` to build a “Team Dashboard” page with skill matrices, Enneagram distributions, etc.

- Over time, you can add more tables for **training modules** or **AI upskilling** progress (like `training_enrollments` linking `team_member_id` to a “course” or “module”).

---

## 6. Implementation Steps (Short-Term vs. Future)

**Short-Term** (Next Sprint):

1. **Set Up Supabase** project and environment.  
2. **Create the fundamental tables**: `companies`, `company_members`, `team_members`, `documents`.  
3. **Implement Auth** using Supabase’s built-in approach.  
4. **Migrate or refactor** any local data (Wizard step data, partial storage) into the new structure.  
5. **Document Generator** now fetches data from the DB instead of local React state or localStorage.

**Future** (Subsequent Sprints):

1. **File Tree** logic: add `parent_id`, `is_folder` to `documents`.  
2. **Versioning**: add a `document_revisions` table if needed.  
3. **Skill Visualization**: build a “Team Overview” UI that queries `team_members` for skill sets, Enneagram, etc.  
4. **Role-based Access**: implement row-level security or additional columns for user permissions.  
5. **Tiptap Integration** for robust doc editing. Possibly store the doc in JSONB for advanced features (like track changes).

---

## 7. Why This Architecture Works

1. **Scalable & Flexible**  
   - You can easily add more data fields or relationships (like advanced skill tracking) without reworking everything.

2. **Easy Multi-Tenancy**  
   - Each company’s data is partitioned by `company_id`. Supabase row-level security ensures each user only sees their own data.

3. **Supports Collaboration**  
   - Because documents are stored at the `company` level, multiple users can view/edit them.

4. **Future AI Extensions**  
   - You can store AI embeddings, revision logs, or chat histories without changing the fundamental tables.  
   - The `documents` table can also hold references to advanced AI metadata (like vector embeddings for semantic search).

---

### Final Thoughts

By shifting away from “projects” to a more direct **Company → Team Members → Documents** schema, you get a **clean, intuitive** data model. This approach is easy to integrate with Tiptap for editing, and it plays nicely with the multi-user, multi-step onboarding flow you have in mind. 

When you go to implement, focus on:

- **Auth & RLS**: letting only the correct users see and edit a company’s data.  
- **Data retrieval** for your OpenAI calls, which will likely require combining step data (`onboarding_steps`) + `companies` + `team_members`.  
- **Docs** as JSON in `documents.content` for easy re-rendering and version control.

That should set you (and your AI coder) up for **painless** expansions down the line—especially once you start building deeper analytics, skill gap visualizations, and robust collaboration features.
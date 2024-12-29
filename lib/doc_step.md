Below is a **step-by-step specification** for implementing a **multi-document creation flow** enhanced by **Exa neural search** and **OpenAI**. Users will generate **five** different documents (Executive Summary, Upskilling Docs, 4 AI Personas, Customer-Facing Chatbot, and Custom Automations/AI Integration Plan) **one at a time**. After finishing each document, the user proceeds to the next. All references to third-party data (e.g., news or industry insights) come via **Exa** to **enrich** the AI’s final output.

---

## 1. Required Setup

1. **Install Packages**  
   - **OpenAI (or other LLM client)**  
   - **Exa**:  
     ```bash
     npm install exa-js
     ```  
   - Ensure any additional dependencies for your frontend framework are also in place (e.g., `react-markdown`, `react-syntax-highlighter` if needed).

2. **Environment Variables**  
   - `EXA_API_KEY`: Your Exa API key.  
   - `OPENAI_API_KEY` (or equivalent) for calling the LLM.

3. **Initialization** (Backend or Frontend, depending on architecture)  
   ```typescript
   import Exa from 'exa-js';

   const exa = new Exa(process.env.EXA_API_KEY);
   // or pass the key in a config object if needed
   ```

---

## 2. Flow & Overall Architecture

You will have **five** main documents to generate, **in sequence**. The user must **finish** generating (and optionally editing) a doc before moving on to the next.

### 2.1 Frontend Overview

1. **Document List / Wizard**  
   - Show a **vertical list** of the five deliverables or a “Step 1 of 5” style wizard.  
   - Each doc has a **“Generate Doc”** button.  
   - Only **enable** the next doc’s button once the **current doc** is generated and saved.

2. **Doc Generation Modal / Screen**  
   - On clicking “Generate Doc,” you open a modal (or navigate to a new screen) that:
     1. Optionally fetches external data from **Exa**.  
     2. Calls your backend to generate the doc from user data **plus** Exa results.  
     3. Displays the doc in a **rendered Markdown** view.

3. **Edit / Confirm**  
   - The user can:
     - **Edit** the final output (optional).  
     - **Confirm** or **Save** the doc to proceed.  
     - Move on to the next doc or come back later if you allow partial completion.

### 2.2 Backend Workflow

1. **API Endpoint** (e.g., `POST /api/generate-document`)  
   - Receives a payload:  
     ```json
     {
       "docType": "executiveSummary",
       "userData": {...relevant user info...},
       "exaData": {...results from Exa (optional)...}
     }
     ```
   - The backend composes a **prompt** for OpenAI (or similar LLM) using:
     1. **User Data**: Business info, skill gaps, team roles, etc.  
     2. **Exa Data**: Summaries or highlights from external research.  
   - Sends that prompt to the LLM (OpenAI, Claude, etc.).
   - Receives the **markdown** response and returns it to the frontend.

2. **Storing Docs** (Optional)  
   - You may want to **persist** the doc in a database, or store it in session state so the user can retrieve it later.

---

## 3. Step-by-Step: Each Document Creation

Here’s how **each** of the five documents gets generated **one at a time**:

### 3.1 Executive Summary (One-Pager)

**Purpose**: A high-level overview of the business—background, market, products, etc.

1. **User Clicks “Generate Executive Summary”**  
2. **Frontend** calls an Exa-based method (optional) if you want to search for additional context:  
   ```typescript
   const exaResults = await exa.search(`latest info on ${userBusinessName}`, {
     useAutoprompt: true,
     numResults: 2
   });
   ```  
   Or retrieve full contents with highlights if needed (`exa.searchAndContents`).
3. **Frontend** then calls your backend:  
   ```typescript
   fetch('/api/generate-document', {
     method: 'POST',
     body: JSON.stringify({
       docType: 'executiveSummary',
       userData: { /* from steps 1–3 in your app */ },
       exaData: exaResults
     })
   });
   ```
4. **Backend**  
   - Builds a prompt, e.g.:
     ```plaintext
     "System: You are an AI that generates structured markdown...
      User: Here is user business info: {userData} 
      Here is external research from Exa: {exaData}
      Please create a short, 1-page executive summary in markdown..."
     ```  
   - Sends that prompt to OpenAI, receives markdown.
   - Returns markdown string to the frontend.
5. **Frontend**:  
   - Renders the doc in a markdown view.  
   - Provides a “Copy Markdown” or “Download” option.  
   - **Upon confirmation**, user can mark “Executive Summary” as **Done** and proceed to the next doc.

### 3.2 Custom Upskilling Training Docs

**Purpose**: Provide training modules for team members to address skill gaps.

1. **User Clicks “Generate Upskilling Docs”**  
2. (Optional) **Exa** is called to gather “best AI training resources in [industry].”  
3. **Backend** merges user’s skill gap data + Exa results into a prompt for the LLM.  
4. **Frontend** displays the resulting markdown.  
5. The user can refine or finalize.

### 3.3 Four AI Personas (Internal Use: Marketing, Sales, Operations, Research)

**Purpose**: Generate 4 internal AI assistants, each with specific roles and sample prompts.

1. **User Clicks “Generate 4 AI Personas”**  
2. (Optional) **Exa** search for domain-specific best practices: “AI persona examples in [industry].”  
3. **Backend** builds one prompt or multiple sub-prompts for each department.  
4. Return a single (or multiple) markdown doc(s), e.g., “Persona #1 (Marketing), Persona #2 (Sales), etc.”  
5. User reviews, saves.

### 3.4 Customer-Facing Chatbot

**Purpose**: Outline system prompts, persona, and knowledge base for an external support or marketing chatbot.

1. **User Clicks “Generate Customer-Facing Chatbot Doc”**  
2. (Optional) **Exa** search for “publicly known FAQs about [company product]” if relevant.  
3. Backend merges data + Exa info → AI prompt → returns markdown.  
4. User reviews and finalizes.

### 3.5 Custom Software Automations & AI Integration Plan

**Purpose**: Provide **Mermaid flowcharts** and step-by-step instructions for new automations or AI integrations with existing tools.

1. **User Clicks “Generate Automations & AI Plan”**  
2. (Optional) **Exa** search for “Slack + Salesforce + GPT integration case study” to enrich suggestions.  
3. Backend merges user’s software stack + any relevant Exa results → AI prompt → receives doc in markdown with mermaid diagrams.  
4. Frontend displays the doc with mermaid syntax rendered or at least visible as code.

---

## 4. Putting It All Together

1. **Sequential Workflow**  
   - The user **cannot** move to the next doc until the current doc is **generated** and optionally saved.  
   - This ensures a linear, organized approach to doc creation.  
2. **Storing & Retrieval**  
   - You may store each doc’s final markdown in your database once the user confirms it.  
3. **Refine or Edit**  
   - Allow optional re-generation if the user wants to incorporate new data or run another Exa query.  
4. **Completion**  
   - When all five docs are complete, the user can download them individually or as a bundle.

---

## 5. Example Code Snippets

### 5.1 Exa Initialization (Server or Client)

```typescript
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);
```

### 5.2 Searching for External Data

```typescript
const exaResults = await exa.search(`latest news on ${userBusinessName}`, {
  useAutoprompt: true,
  numResults: 2
});

// Or, if you want the full text
const exaFull = await exa.searchAndContents(`competitive analysis in ${userIndustry}`, {
  text: true,
  numResults: 3
});
```

### 5.3 Building the Prompt (Backend)

```typescript
function buildPrompt(docType, userData, exaData) {
  return `
System: You are an AI that generates structured Markdown documents.
User:
- Document Type: ${docType}
- User Data: ${JSON.stringify(userData)}
- External Research: ${JSON.stringify(exaData)}

Please create the requested document in Markdown format...
  `;
}
```

### 5.4 LLM Call

```typescript
// Pseudocode or example with OpenAI
const response = await openai.createChatCompletion({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a markdown doc generator..." },
    { role: "user", content: buildPrompt(docType, userData, exaData) }
  ]
});
const docMarkdown = response.data.choices[0].message.content;
```

### 5.5 Returning the Doc

```typescript
return res.json({ markdown: docMarkdown });
```

---

## 6. Future Enhancements

1. **Collect & Analyze Exa Results**: Summarize or parse them before giving them to the AI, so the prompt remains concise.  
2. **Batch Generation**: If you ever want a “Generate All” button, you could chain these calls.  
3. **Review & Collaboration**: Let multiple team members annotate or comment on each doc.  
4. **Translations**: If the user needs docs in multiple languages, re-run the generation with a locale prompt.

---

### Final Summary

By integrating **Exa** for external research and **OpenAI** (or a similar LLM) for text generation, you’ll build a **sequential doc creation flow**. Each **document** (Executive Summary, Training Docs, 4 AI Personas, Customer Chatbot, and Automations Plan) is generated **one at a time**—the user clicks “Generate,” you optionally gather info from Exa, pass everything to the LLM via your backend, and return a **rendered Markdown** doc. The user **confirms** or **edits** the doc, then moves on to the next, ensuring a smooth, step-by-step experience.
import { FileCode, Terminal, LayoutTemplate, Database, Server, Cpu, Globe, Rocket } from "lucide-react";

export const SEED_CONTENT: Record<string, string> = {
    "OnePager.md": `# Robert B. Lockhart Jr.
**Systems-Driven Leader & AI Engineer**

I bridge the gap between **Operations**, **Finance**, and **Engineering**.
My career has evolved from Investment Banking (M&A) to Founding/Scaling Ops-heavy ventures ($5M+ raised), to now building autonomous AI agents.

## Core Value Prop
1.  **Founder Mindset**: I don't just write code; I build businesses. I've raised capital, managed P&Ls, and led cross-functional teams.
2.  **Ops-First Engineering**: I build software to solve real operational bottlenecks, not just for the sake of tech.
3.  **Financial Rigor**: My background in M&A means I optimize for ROI and capital efficiency in every architectural decision.

## Experience Highlights
*   **Fathom Cannabis (COO)**: Raised $5M, built a commercial facility, and used data/regression models to cut op costs by 40%.
*   **Standard Cannabis (Founder)**: Engineered custom extraction tech and managed global supply chains.
*   **Top Hat Photo Booths (Founder)**: Bootstrapped to $1M+ revenue with a custom SQL-based booking platform.
*   **Fox-Pitt Kelton (Analyst)**: M&A and Valuation modeling for financial institutions.

## Tech Stack
*   **Languages**: Python, TypeScript, SQL, Go
*   **Data/AI**: Pandas, Scikit-learn, OpenAI API, LangChain
*   **Web**: Next.js, Tailwind, React, Node.js
*   **Tools**: Tableau, AWS, Excel (Advanced Modeling)
`,

    "Fathom_Cannabis.case": `# Case Study: Fathom Cannabis (2018-2025)
**Role**: Owner / Founder / COO
**Outcome**: Secured $5M financing, built commercial facility, reduced OpEx by 40%.

## The Challenge
Scaling a complex, regulated cultivation facility required precise environmental control and strict capital efficiency. Off-the-shelf solutions were expensive and generic.

## The Solution
1.  **Capital Strategy**: Led the development of comprehensive financial models and pitch decks to secure **$5M in debt and equity**.
2.  **Tech-Enabled Ops**: Developed robust **regression models** to analyze Key Performance Indicators (KPIs), identifying levers to reduce energy and labor costs.
3.  **Infrastructure**: Managed the build-out of a high-tech greenhouse, incorporating proprietary design elements that minimized carbon footprint.

## Tech & Skills Used
*   **Financial Modeling**: Complex operational pro formas for investors.
*   **Data Analysis**: Regression modeling for yield optimization.
*   **Operations Management**: Hired and trained a staff of 30+; managed full employee lifecycle.
`,

    "Standard_Cannabis.case": `# Case Study: Standard Cannabis (2014-2018)
**Role**: Owner / Founder
**Focus**: Engineering & Global Supply Chain

## Innovation
Recognized safety gaps in the industry and founded a business to professionalize extraction technology.

## Key Achievements
*   **Hardware Engineering**: Led the design and fabrication of botanical extraction machines using supercritical CO2 and light hydrocarbons.
*   **Global Sourcing**: Spearheaded sourcing initiatives for machine parts, ensuring cost-effectiveness and timely procurement.
*   **Process Optimization**: Developed SOPs for molecular distillation and separation processes.

## Impact
Created a safer, more efficient extraction standard that was adopted by licensees, driving product quality and safety.
`,

    "TopHat_Photo.case": `# Case Study: Top Hat Photo Booths (2010-2014)
**Role**: Owner / Founder
**Outcome**: Bootstrapped to profitability in Year 1, $1M+ Revenue.

## The "Engineer" Moment
I didn't just run the business; I built the system that made it scale. Manual booking was a bottleneck, so I automated it.

## The Tech
*   **Custom SQL Database**: Architected a database to house all booking and event information securely.
*   **Booking System Integration**: Integrated the custom DB with accounting software to automate clerical tasks.
*   **Result**: Reduced admin time by 50% and eliminated booking errors.

## Business Growth
*   Expanded to 15+ cities along the East Coast and Midwest.
*   Clients included **Google, Microsoft, Dolce & Gabbana**.
*   Personally built the initial photo booth hardware and software interfaces.
`,

    "Finance_Analyst.case": `# Experience: Fox-Pitt Kelton (2008-2009)
**Role**: Investment Banking Analyst
**Domain**: M&A and Capital Raising for Financial Institutions

## The Foundation
Before engineering, I learned the language of business: **Finance**.

## Responsibilities
*   **Valuation**: Developed DCF (Discounted Cash Flow) and LBO models.
*   **M&A**: Created detailed pitchbooks and operating models for potential acquisition targets.
*   **Capital Markets**: Assisted with roadshow presentations for a $105M follow-on offering (NASDAQ: ESGR).

## Why This Matters Today
This background ensures that every line of code I write generates business value. I don't build "cool tech"; I build assets that yield ROI.
`,

    "Skills.md": `# Technical & Operational Skills

## Engineering
*   **Frontend**: Next.js, React, Tailwind CSS, TypeScript
*   **Backend**: Node.js, Python (FastAPI/Flask), Go
*   **Database**: PostgreSQL, SQL, Redis
*   **AI/ML**: OpenAI API, LangChain, Scikit-learn, Keras (Deep Learning)

## Operations & Strategy
*   **Financial Modeling**: 3-Statement Models, DCF, Unit Economics
*   **Capital Raising**: Pitch Deck Design, Investor Relations (Raised $5M+)
*   **Team Leadership**: Hiring, Mentoring, Lifecycle Management (Teams of 30+)
*   **Supply Chain**: Global Sourcing, Logistics, Inventory Management

## Tools
*   **Visual**: Tableau, Photoshop, Illustrator
*   **Cloud**: Google Cloud (Cloud Run, Vertex AI, Cloud Build), AWS
*   **Architecture**: Serverless, Docker/Containerization, Microservices
*   **Productivity**: Excel (Expert), Jira, Notion

## NLP & Machine Learning
*   **NLP Techniques**: Text Classification, Sentiment Analysis (FinBERT), Named Entity Recognition, Document Summarization
*   **ML Frameworks**: Sklearn, PyTorch, TensorFlow/Keras, Hugging Face Transformers
*   **LLM Tooling**: LangChain, LlamaIndex, OpenAI API, Google Gemini
*   **Vector Databases**: pgvector (PostgreSQL), Pinecone (familiar)
*   **Libraries**: Pandas, NumPy, Gensim, SpaCy, NLTK
`,
    "Automation_Agent.case": `# Case Study: AI Automation
**Role**: Architect
**Outcome**: Automated workflows using Agentic AI.

## Agentic Workflows
Building autonomous agents that can:
1.  **Research**: Scrape and synthesize web data (like QuiverQuant or EDGAR).
2.  **Plan**: Break down complex objectives into executable steps.
3.  **Execute**: Write code, run tests, and deploy software.

This portfolio itself is a testament to that capability, acting as a virtual clone that can reason about my own history.
`,

    "AI_Hedge_Fund.case": `# Case Study: Lockhart Holdings (AI Hedge Fund)
**Role**: Architect & Lead Engineer
**Status**: Live Paper Trading / Cloud Run Deployment

**An institutional-grade investment system where AI agents research, debate, and execute trades under strict risk constraints.**

## The "Why"
LLMs are great at reasoning but terrible at math and risk. Standalone "finance bots" hallucinate numbers and blow up accounts.
**My Solution: Architectural Separation.**
By decoupling the "Creative" layer (Analysts/PMs generating ideas) from the "Constraint" layer (Risk/Execution enforcing limits), I built a system that allows AI to be imaginative without being dangerous.

## Key Capabilities
*   **Deep Research**: Autonomously investigates tickers using Gemini to browse and write multi-page reports.
*   **Adversarial Debates**: Before any trade, "Bull", "Bear", and "Skeptic" agents debate the thesis to identify blind spots.
*   **Market Neutrality**: Automatically constructs delta-neutral methodologies using pairs trading and option hedges (VIXY/TLT).
*   **Alternative Data**: Ingests Insider Trading, Congress trading, and FinBERT sentiment analysis.
*   **Deterministic Guardrails**: Hard-coded circuit breakers and exposure limits that LLMs cannot override.

## System Architecture
A "Fund of Funds" architecture where specialized agents compete for capital:
*   **Idea Generation**: Macro Agents, Deep Research (Web), Alt Data (Insider/13F).
*   **Decision Layer**: Specialized PMs (Value, Momentum) -> Debate Room -> CIO Agent.
*   **Governance**: Risk Manager (Deterministic Python) -> Execution Trader (Algo).

## Tech Stack
*   **Core**: Python 3.11, FastAPI, LangChain, Pydantic
*   **AI**: OpenAI (GPT-4o), Google Gemini (Interactions), FinBERT (Sentiment)
*   **Data**: Alpaca Markets, EDGAR Tools (SEC), QuiverQuant, GS Quant
*   **Infra**: Docker, Google Cloud Run, Cloud Build (CI/CD)

## Impact & Key Skills
### Business Impact
*   **Risk-Adjusted Returns**: Achieved a Sharpe Ratio > 1.5 in out-of-sample paper trading via strict market-neutral hedging.
*   **Operational Efficiency**: Automated the work of 3 junior analysts (Research, Data Entry, Execution) into a single 24/7 autonomous workflow.
*   **Architectural Separation**: Solved the "hallucination" problem in finance by decoupling the Creative Layer (LLMs) from the Constraint Layer (Python Risk Engine).

### Technical Skills Demonstrated
*   **Agentic Orchestration**: Built complex, stateful workflows using **LangChain** and **FastAPI**.
*   **Financial Engineering**: Implemented Black-Scholes option pricing and covariance matrix calculations from scratch.
*   **System Design**: Designed an Event-Driven Architecture handling concurrent agent execution and real-time websocket streams.

## NLP & Machine Learning Pipeline

### Text Classification & Information Extraction
*   **SEC Filing Analysis**: Custom NLP pipeline to extract sentiment, risk factors, and financial metrics from 10-K/10-Q filings using regex + LLM hybrid approach.
*   **News Classification**: Multi-label classification of market news into sectors, sentiment, and relevance scores.

### Sentiment Analysis
*   **FinBERT Integration**: Fine-tuned BERT model for financial sentiment analysis on earnings calls and news headlines.
*   **Hybrid Confidence Scoring**: FinBERT sentiment modulates trade confidence—high-uncertainty signals reduce position sizing rather than acting as hard filters.

### Vector Database & Semantic Search
*   **pgvector (PostgreSQL)**: Embedded historical research reports for semantic retrieval, enabling agents to "remember" past analysis on similar market conditions.
*   **RAG Architecture**: Retrieval-Augmented Generation for grounding LLM responses in factual, timestamped research.

### Agent Orchestration & Tooling
*   **LangChain**: Multi-agent workflows with tool-calling, structured outputs, and conversation memory.
*   **Pydantic**: Strict schema validation for all agent outputs—eliminates hallucinated JSON fields.

### ML Frameworks Used
*   **Sklearn**: Feature engineering, backtesting metrics (Sharpe, Sortino), clustering for regime detection.
*   **PyTorch**: FinBERT inference, custom model fine-tuning potential.
*   **TensorFlow/Keras**: Time-series forecasting experiments (LSTM-based).
`
};

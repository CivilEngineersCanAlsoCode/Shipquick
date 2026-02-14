**Strategic Business Requirement Lifecycle Report: Large Solution SAFe Configuration**

**To:** Enterprise Leadership & Transformation Steering Committee
**From:** SAFe Practice Consultant (SPC) & Enterprise Architect
**Subject:** End-to-End Value Delivery Lifecycle Analysis

### 1. Portfolio Strategy & The Funnel (The 'Why')

The lifecycle of a strategic business requirement begins at the Portfolio Level, where the **Lean Portfolio Management (LPM)** function aligns strategy with execution. The process initiates with the identification of **Strategic Themes**, which are specific business objectives that connect the enterprise strategy to the portfolio. These themes influence the generation of a **Portfolio Epic**, a significant initiative requiring substantial investment and analysis.

Once identified, the **Portfolio Epic** enters the **Portfolio Kanban**, a system designed to visualize and manage the flow of large initiatives. The Epic enters the _Funnel_ state, capturing the idea without immediate commitment. It then progresses to _Reviewing_, where the **Epic Owner** shepherds the initiative, and the **Enterprise Architect** provides high-level technical feasibility and aligns it with the architectural vision. If approved for further investigation, the Epic moves to the _Analyzing_ state.

Here, the **Epic Owner** collaborates with stakeholders to create the **Lean Business Case**. Crucially, this involves defining the **Minimum Viable Product (MVP)**—the smallest portion of the Epic needed to validate the hypothesis. To prioritize this work against conflicting demands, **LPM** and stakeholders utilize **Weighted Shortest Job First (WSJF)**. This economic framework calculates priority by dividing the **Cost of Delay** (User-Business Value + Time Criticality + Risk Reduction) by the Job Size, ensuring the portfolio delivers the highest value in the shortest sustainable lead time.

### 2. The Solution Layer (The 'What' - Large Scale Coordination)

Upon approval by **LPM**, the **Portfolio Epic** transitions to the Large Solution Level. Because the requirement is too complex for a single **Agile Release Train (ART)**, it is decomposed into **Capabilities**. A **Capability** is a higher-level solution behavior that spans multiple ARTs and is sized to fit within a single **Program Increment (PI)**. These are placed in the **Solution Backlog**, which is owned and prioritized by **Solution Management**.

At this stage, the **Solution Architect/Engineer** defines the **Solution Intent**, a repository of the intended behavior, design, and compliance constraints of the system, ensuring that the technical vision remains consistent across all trains. The **Solution Train Engineer (STE)** acts as the servant leader and coach for the **Solution Train**, facilitating the flow of value.

To ensure alignment before the massive planning events occur, the **STE**, **Solution Management**, and **Solution Architect** conduct the **Pre-PI Planning** event. During this session, they align on the **Solution Roadmap**, validate the top-priority **Capabilities**, and match demand to the aggregate capacity of the ARTs and **Suppliers**, ensuring the inputs are ready for the upcoming planning cycle.

### 3. Program Decomposition & Alignment (The Planning)

Following Pre-PI Planning, **Capabilities** are decomposed into **Features** and placed into the **Program Backlog** (also known as the ART Backlog) of the specific ARTs best suited to deliver them. **Product Management** owns this backlog and is responsible for defining **Features**, which include a benefit hypothesis and acceptance criteria.

The heartbeat of coordination is the **PI Planning** event. All teams within an ART meet to plan the next 8–12 weeks. However, in a Large Solution configuration, individual ART planning is insufficient. Therefore, **PI Planning** feeds directly into **Post-PI Planning**. Facilitated by the **STE**, this event brings together stakeholders from all ARTs to review the aggregate plan.

During **Post-PI Planning**, the **Solution Train Planning Board** is finalized. This visual artifact highlights **Capabilities**, significant cross-ART dependencies, and milestones. It allows the **STE** and **Release Train Engineers (RTEs)** to identify risks where one train's delivery blocks another, ensuring the overall solution plan is viable before a commitment is made.

### 4. Team Execution & "Shift Left" Quality (The 'How')

Once planning concludes, **Agile Teams** (operating on Scrum or Kanban) take over execution. During their local Iteration Planning, they break **Features** down into **User Stories** and **Enablers**. **User Stories** deliver customer value, while **Enablers** support exploration, architecture, and infrastructure. The **Product Owner** maintains the **Team Backlog**, prioritizing stories for the team.

The execution cycle relies on specific events: **Daily Stand-ups** (or Team Syncs) to coordinate daily work, and **Backlog Refinement** to prepare future stories. Quality is mandated via "Shift Left" practices, meaning testing occurs early and often. The teams utilize the **Testing Pyramid**, emphasizing a solid foundation of **Unit Tests** for code correctness, followed by **Automated Acceptance Tests** using BDD (Behavior-Driven Development) and Gherkin syntax to verify the system meets business requirements. Defects found at this stage are triaged immediately by the team; they are either fixed within the iteration or added to the backlog if they are non-critical, preventing technical debt accumulation.

### 5. Integration & The Continuous Delivery Pipeline

In a Large Solution, integration is the primary risk. The flow of code moves through three distinct levels:

1.  **Continuous Integration (CI):** Developers commit code frequently, triggering automated builds and unit tests at the team level.
2.  **System Integration:** The **System Team** integrates assets from all teams within an ART into a staging environment to verify **Features**.
3.  **Solution Integration:** The **System Team** (or a specialized Solution System Team) integrates the work of multiple ARTs and **Suppliers** to verify **Capabilities** and end-to-end flows.

The **System Team** plays a critical role in managing these staging environments and automating the pipeline to support this tiered integration. Verification is demonstrated through two key events: the **System Demo**, where an ART demonstrates its integrated features to stakeholders, and the **Solution Demo**, where the fully integrated solution across all trains is reviewed by **Solution Management** and stakeholders to ensure the solution meets the overall intent.

### 6. Release on Demand & Governance

Deployment is decoupled from release. **Release on Demand** allows the enterprise to make value available to customers when market conditions are optimal. This is enabled by **Feature Toggles**, which allow code to be deployed to production but hidden from users until ready, and **Canary Releases**, which roll out functionality to a small user segment to test stability.

**Release Governance** ensures that the deployed solution complies with regulatory, security, and quality standards before it goes live. This involves final checks against compliance requirements defined in the **Solution Intent**. Once released, **Post-Implementation Verification (PIV)** and value measurement occur. This involves gathering objective data (Innovation Accounting) to validate the benefit hypothesis of the original **Epic**, determining whether to pivot or persevere.

### 7. Managing Variance & Edge Cases

In complex systems, variance is inevitable.

- **Stop-the-Train Events:** When a blocking defect spans multiple ARTs or breaks the **Solution Integration**, the **System Team** or **STE** may halt new feature development. Teams swarm to fix the integration issue immediately, prioritizing system health over new velocity—a core tenet of **Built-in Quality**.
- **Scope Change:** If business priorities shift mid-PI, **Solution Management** and **Product Management** utilize the **Kanban** systems (Solution and Program) to trade off scope. They may de-scope a lower-priority Feature to accommodate a critical change, ensuring capacity remains fixed.
- **Spillovers:** Uncompleted work is reviewed during the **Inspect & Adapt (I&A)** event. This event includes a root cause analysis workshop where the **ART** or **Solution Train** identifies why the work was not completed and creates improvement backlog items to prevent recurrence in the next PI.

---

### RACI Matrix: Strategic Requirement Lifecycle

| Activity / Artifact                     | Lean Portfolio Mgmt (LPM) | Epic Owner | Enterprise Architect | Solution Mgmt | Solution Architect | Solution Train Engineer (STE) | Product Mgmt | System Architect | Release Train Engineer (RTE) | System Team | Agile Team (PO/SM/Dev) |
| :-------------------------------------- | :-----------------------: | :--------: | :------------------: | :-----------: | :----------------: | :---------------------------: | :----------: | :--------------: | :--------------------------: | :---------: | :--------------------: |
| **Define Strategic Themes**             |          **R/A**          |     I      |          C           |       I       |         I          |               I               |      I       |        I         |              I               |      I      |           I            |
| **Define Portfolio Epic & MVP**         |             C             |   **R**    |          C           |       C       |         I          |               I               |      I       |        I         |              I               |      I      |           I            |
| **Approve Epic (Portfolio Kanban)**     |           **A**           |     R      |          C           |       I       |         I          |               I               |      I       |        I         |              I               |      I      |           I            |
| **Define Solution Intent & Compliance** |             I             |     C      |          C           |       A       |       **R**        |               C               |      I       |        C         |              I               |      I      |           I            |
| **Decompose Epic to Capabilities**      |             I             |     C      |          I           |    **R/A**    |         C          |               C               |      C       |        I         |              I               |      I      |           I            |
| **Facilitate Pre-PI Planning**          |             I             |     I      |          I           |       C       |         C          |            **R/A**            |      C       |        C         |              C               |      I      |           I            |
| **Decompose Capabilities to Features**  |             I             |     I      |          I           |       C       |         I          |               I               |   **R/A**    |        C         |              C               |      I      |           C            |
| **Facilitate PI Planning**              |             I             |     I      |          I           |       I       |         I          |               I               |      C       |        C         |           **R/A**            |      C      |           C            |
| **Define User Stories & Enablers**      |             I             |     I      |          I           |       I       |         I          |               I               |      C       |        C         |              I               |      I      |        **R/A**         |
| **Facilitate Post-PI Planning**         |             I             |     I      |          I           |       C       |         C          |            **R/A**            |      C       |        C         |              C               |      I      |           I            |
| **Execute Iterations (Build/Test)**     |             I             |     I      |          I           |       I       |         I          |               I               |      I       |        I         |              I               |      C      |        **R/A**         |
| **System Integration & Testing**        |             I             |     I      |          I           |       I       |         C          |               I               |      I       |        C         |              I               |    **R**    |           C            |
| **System Demo (ART Level)**             |             I             |     I      |          I           |       I       |         I          |               I               |      A       |        C         |              C               |    **R**    |           C            |
| **Solution Demo (Integrated)**          |             C             |     C      |          I           |     **A**     |         C          |               C               |      C       |        C         |              C               |    **R**    |           I            |
| **Release Governance & Deployment**     |             I             |     I      |          I           |       A       |         C          |               C               |      R       |        C         |              C               |      C      |           I            |
| **Inspect & Adapt (Improvements)**      |             I             |     I      |          I           |       C       |         C          |             **R**             |      C       |        C         |            **R**             |      C      |           C            |

**Legend:**

- **R:** Responsible (Doer)
- **A:** Accountable (Approver/Owner)
- **C:** Consulted (Two-way communication)
- **I:** Informed (One-way communication)

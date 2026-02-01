flowchart TD

%% ======================
%% ENTRY / RESUME
%% ======================
START([System Start])
MODE{Start Mode}
RESUME[Resume from Beads\nbd list\nbd ready]
NEWDEV[Start New Development]

START --> MODE
MODE -->|Resume| RESUME
MODE -->|New| NEWDEV

%% ======================
%% FAILURE MODE
%% ======================
BD_FAIL[Beads storage error\nSTOP and report]
RESUME -->|error| BD_FAIL

%% ======================
%% PORTFOLIO LEVEL
%% ======================
subgraph PORTFOLIO["PORTFOLIO LEVEL"]
direction TB

THEME_CREATE[bd create Theme]
ANALYST_WORK[Analyst\nProblem and Market Research]
THEME_BRIEF[Theme Brief]
THEME_DONE[bd done Theme]

EPIC_CREATE[bd create Epic]
PM_DEFINE[PM\nOutcome and PRD]
BO_APPROVE[Business Owner\nApprove Value]
EPIC_DONE[bd done Epic]

THEME_CREATE --> ANALYST_WORK --> THEME_BRIEF --> THEME_DONE
THEME_DONE --> EPIC_CREATE
EPIC_CREATE --> PM_DEFINE --> BO_APPROVE --> EPIC_DONE
end

NEWDEV --> THEME_CREATE

%% ======================
%% SOLUTION LEVEL
%% ======================
subgraph SOLUTION["SOLUTION LEVEL"]
direction TB

CAP_CREATE[bd create Capability]
SOL_BREAK[Solution Manager\nBreak Epic]
ARCH_DEFINE[Solution Architect\nArchitecture and Runway]
CAP_DONE[bd done Capability]

CAP_CREATE --> SOL_BREAK --> ARCH_DEFINE --> CAP_DONE
end

EPIC_DONE --> CAP_CREATE

%% ======================
%% PROGRAM INCREMENT LOOP
%% ======================
subgraph PI_LOOP["PROGRAM INCREMENT LOOP"]
direction TB

PI_START[PI Start\nExample PI 26.1]
FEAT_CREATE[bd create Feature]
PM_PRIOR[PM\nFeature Prioritization]
PI_PLAN[RTE\nPI Planning]
FEAT_COMMIT[Feature committed to PI]

MISC_FEAT[bd create Feature\nMisc Effort PI 26.1]

PI_START --> FEAT_CREATE --> PM_PRIOR --> PI_PLAN --> FEAT_COMMIT
PI_START --> MISC_FEAT
end

CAP_DONE --> PI_START

%% ======================
%% SPRINT LOOP
%% ======================
subgraph SPRINT_LOOP["SPRINT LOOP"]
direction TB

SPRINT_START[Sprint Start\nExample 26.1.1]
STORY_CREATE[bd create Story]
PO_REFINE[PO\nRefinement]
SPRINT_PLAN[SM\nSprint Planning]
DEV_BUILD[Dev\nBuild]
QA_TEST[QA\nManual and Regression Testing]

SPRINT_START --> STORY_CREATE --> PO_REFINE --> SPRINT_PLAN --> DEV_BUILD --> QA_TEST
end

FEAT_COMMIT --> SPRINT_START

%% ======================
%% TASK AND DEFECT FLOW
%% ======================
subgraph TASK_DEFECT["TASK AND DEFECT FLOW"]
direction TB

TASK_CREATE[bd create Task]
TASK_EXEC[Dev executes Task]
TASK_DONE[bd done Task]

DEFECT_CHECK{Defect Found}
DEFECT_CREATE[bd create Defect]
DEFECT_DEP[bd dep add Defect to Story]
DEFECT_FIX[Fix Defect]
DEFECT_DONE[bd done Defect]

TASK_CREATE --> TASK_EXEC --> TASK_DONE --> DEFECT_CHECK
DEFECT_CHECK -->|Yes| DEFECT_CREATE --> DEFECT_DEP --> DEFECT_FIX --> DEFECT_DONE
DEFECT_CHECK -->|No| STORY_GATE
end

QA_TEST --> TASK_CREATE

%% ======================
%% STORY ACCEPTANCE AND SPILLOVER
%% ======================
subgraph STORY_ACCEPTANCE["STORY ACCEPTANCE"]
direction TB

STORY_GATE{All Tasks and Defects Done}
STORY_BLOCK[Story Blocked]
STORY_ACCEPT[PO Accept Story\nbd done Story]

STORY_SPILL[Story Spillover]
SPLIT_STORY[Split Story]
REPLAN[Re estimate]
NEXT_SPRINT[Move to Next Sprint]

STORY_GATE -->|No| STORY_BLOCK
STORY_GATE -->|Yes| STORY_ACCEPT
STORY_BLOCK --> TASK_CREATE

STORY_SPILL --> SPLIT_STORY --> REPLAN --> NEXT_SPRINT --> SPRINT_START
end

DEFECT_DONE --> STORY_GATE
TASK_DONE --> STORY_GATE
QA_TEST --> STORY_GATE

%% ======================
%% FEATURE ACCEPTANCE AND PI SPILLOVER
%% ======================
subgraph FEATURE_ACCEPTANCE["FEATURE ACCEPTANCE"]
direction TB

FEATURE_GATE{All Stories Accepted}
FEATURE_BLOCK[Feature Blocked]
FEATURE_ACCEPT[PM Accept Feature\nbd done Feature]

FEATURE_SPILL[Feature Spillover]
FEATURE_SPLIT[Split or Descope Feature]
NEXT_PI[Move to Next PI]

FEATURE_GATE -->|No| FEATURE_BLOCK
FEATURE_GATE -->|Yes| FEATURE_ACCEPT
FEATURE_BLOCK --> STORY_CREATE

FEATURE_SPILL --> FEATURE_SPLIT --> NEXT_PI --> PI_START
end

STORY_ACCEPT --> FEATURE_GATE

%% ======================
%% CAPABILITY EPIC THEME ACCEPTANCE
%% ======================
subgraph HIGH_ACCEPTANCE["CAPABILITY EPIC THEME ACCEPTANCE"]
direction TB

CAP_GATE{All Features Accepted}
CAP_ACCEPT[Solution Manager Accept Capability\nbd done Capability]

EPIC_GATE{All Capabilities Accepted}
EPIC_ACCEPT[Business Owner Accept Epic\nbd done Epic]

THEME_GATE{All Epics Accepted}
THEME_FINAL[Theme Achieved\nbd done Theme]

CAP_GATE -->|Yes| CAP_ACCEPT --> EPIC_GATE
EPIC_GATE -->|Yes| EPIC_ACCEPT --> THEME_GATE
THEME_GATE -->|Yes| THEME_FINAL
end

FEATURE_ACCEPT --> CAP_GATE

%% ======================
%% MISCELLANEOUS EFFORT STORIES
%% ======================
subgraph MISC_FLOW["MISC EFFORT HANDLING"]
direction TB

MISC_STORY[bd create Story\nFix regression X\nTag misc PI 26.1]
MISC_LINK[bd dep add Story to Misc Feature]

MISC_STORY --> MISC_LINK --> STORY_CREATE
end

QA_TEST -->|Systemic defect| MISC_STORY

%% ======================
%% PRIORITIZATION AND TRIAGE
%% ======================
subgraph TRIAGE["DEFECT TRIAGE"]
direction TB

TRIAGE_NODE[PO and QA Triage]
BO_PRIORITY[Business Owner Priority]
PM_RTE_PRIOR[PM and RTE PI Priority]

DEFECT_CREATE --> TRIAGE_NODE --> BO_PRIORITY --> PM_RTE_PRIOR --> FEAT_COMMIT
end

%% ======================
%% BEADS AUTOMATION LOOP
%% ======================
subgraph AUTOLOOP["BEADS AUTOMATION"]
direction TB

AUTO_LOOP[Loop\nbd ready\nexecute lowest item\nbd done]
RESUME_NODE[On restart\nbd list\nbd ready]

AUTO_LOOP --> RESUME_NODE
end

RESUME --> RESUME_NODE

%% ======================
%% TRACEABILITY
%% ======================
TASK_CREATE --> STORY_CREATE
STORY_CREATE --> FEAT_CREATE
FEAT_CREATE --> CAP_CREATE
CAP_CREATE --> EPIC_CREATE
EPIC_CREATE --> THEME_CREATE

%% ======================
%% LEGEND
%% ======================
subgraph LEGEND["LEGEND"]
direction TB

L1[Analyst Theme]
L2[PM Epic Feature]
L3[Business Owner Value]
L4[Solution Manager Capability]
L5[Solution Architect Architecture]
L6[RTE PI Planning]
L7[PO Story]
L8[SM Sprint]
L9[Dev Task]
L10[QA Testing]
end

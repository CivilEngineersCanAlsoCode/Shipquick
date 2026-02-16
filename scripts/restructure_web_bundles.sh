#!/bin/bash
# Shipquick 3.0: Restructure Web Bundles from 7-Agent to 9-Agent Architecture
# This script migrates the old folder structure to the new 9-agent layout.

set -e

WB="web-bundles"
BACKUP="${WB}_backup_$(date +%Y%m%d_%H%M%S)"

echo "📦 Shipquick 3.0: Web Bundle Restructure"
echo "=========================================="

# Step 0: Backup
echo "🔒 Step 0: Creating backup at ${BACKUP}..."
cp -r "$WB" "$BACKUP"
echo "   ✅ Backup created."

# Step 1: Create new agent directories
echo ""
echo "📁 Step 1: Creating new 9-agent directories..."
mkdir -p "$WB/01-portfolio-solution"
mkdir -p "$WB/02-product-manager"
mkdir -p "$WB/03-system-architect"
mkdir -p "$WB/04a-product-owner"
mkdir -p "$WB/04b-scrum-master"
mkdir -p "$WB/04c-dev-squad"
mkdir -p "$WB/04d-ux-designer"
mkdir -p "$WB/05-test-architect"
echo "   ✅ New directories created."

# Step 2: Populate 01-portfolio-solution (MERGED from 01-lpm + 02-solution)
echo ""
echo "🏛️ Step 2: Merging LPM + Solution Train → 01-portfolio-solution..."
# From 01-lpm-strategy (all files)
cp "$WB/01-lpm-strategy/001_shipquick_manifesto.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/002_safe_core_rules.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/003_prioritization_guide.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/004_rally_theme_template.csv" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/005_rally_epic_template.csv" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/007_rally_milestone_template.csv" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/workflow_sq-init.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/workflow_sq-analyze.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/workflow_domain-research.md" "$WB/01-portfolio-solution/"
cp "$WB/01-lpm-strategy/workflow_market-research.md" "$WB/01-portfolio-solution/"
# From 02-solution-train (selective - capability + solve)
cp "$WB/02-solution-train/003_capability_spec_template.md" "$WB/01-portfolio-solution/008_capability_spec_template.md"
cp "$WB/02-solution-train/004_rally_capability_template.csv" "$WB/01-portfolio-solution/009_rally_capability_template.csv"
cp "$WB/02-solution-train/workflow_sq-solve.md" "$WB/01-portfolio-solution/"
# From 06-quality-release (QA guide for RTE governance)
cp "$WB/06-quality-release/003_quality_assurance_guide.md" "$WB/01-portfolio-solution/010_quality_assurance_guide.md"
# SQ Audit & Export (from 06 → Portfolio/Solution for governance)
cp "$WB/06-quality-release/workflow_sq-audit.md" "$WB/01-portfolio-solution/"
cp "$WB/05-agile-team/workflow_sq-export.md" "$WB/01-portfolio-solution/"
echo "   ✅  01-portfolio-solution: $(ls -1 "$WB/01-portfolio-solution/" | wc -l | tr -d ' ') files"

# Step 3: Populate 02-product-manager (from 03-product-management, minus UX)
echo ""
echo "🎯 Step 3: Product Management → 02-product-manager..."
cp "$WB/03-product-management/001_shipquick_manifesto.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/002_safe_core_rules.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/003_feature_spec_template.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/004_product_mgmt_handbook.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/005_program_kanban_rules.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/006_risk_management_guide.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/007_rally_feature_template.csv" "$WB/02-product-manager/"
cp "$WB/03-product-management/workflow_sq-plan.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/workflow_create-product-brief.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/workflow_create-prd.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/workflow_edit-prd.md" "$WB/02-product-manager/"
cp "$WB/03-product-management/workflow_validate-prd.md" "$WB/02-product-manager/"
echo "   ✅  02-product-manager: $(ls -1 "$WB/02-product-manager/" | wc -l | tr -d ' ') files"

# Step 4: Populate 03-system-architect (from 04-system-architecture)
echo ""
echo "📐 Step 4: System Architecture → 03-system-architect..."
cp "$WB/04-system-architecture/001_shipquick_manifesto.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/002_safe_core_rules.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/003_architecture_handbook.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/006_api_standards.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/007_security_checklist.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/008_design_tokens.yaml" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/workflow_create-architecture.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/workflow_check-implementation-readiness.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/workflow_technical-research.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/workflow_document-project.md" "$WB/03-system-architect/"
cp "$WB/04-system-architecture/workflow_generate-project-context.md" "$WB/03-system-architect/"
echo "   ✅  03-system-architect: $(ls -1 "$WB/03-system-architect/" | wc -l | tr -d ' ') files"

# Step 5: Populate 04a-product-owner (from 05-agile-team, PO subset)
echo ""
echo "📋 Step 5: Agile Team → 04a-product-owner..."
cp "$WB/05-agile-team/001_shipquick_manifesto.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/002_safe_core_rules.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/003_agile_execution_guide.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/006_rally_story_template.csv" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/007_rally_task_template.csv" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/008_rally_defect_template.csv" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/workflow_sprint-planning.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/workflow_create-epics-and-stories.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/workflow_create-story.md" "$WB/04a-product-owner/"
cp "$WB/05-agile-team/workflow_sprint-status.md" "$WB/04a-product-owner/"
echo "   ✅  04a-product-owner: $(ls -1 "$WB/04a-product-owner/" | wc -l | tr -d ' ') files"

# Step 6: Populate 04b-scrum-master (from 05-agile-team, SM subset)
echo ""
echo "🎗️ Step 6: Agile Team → 04b-scrum-master..."
cp "$WB/05-agile-team/001_shipquick_manifesto.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/002_safe_core_rules.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/003_agile_execution_guide.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/workflow_sprint-planning.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/workflow_sprint-status.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/workflow_retrospective.md" "$WB/04b-scrum-master/"
cp "$WB/05-agile-team/workflow_correct-course.md" "$WB/04b-scrum-master/"
# New files will be authored separately: 009_scrum_master_handbook.md, workflow_daily_standup.md
echo "   ✅  04b-scrum-master: $(ls -1 "$WB/04b-scrum-master/" | wc -l | tr -d ' ') files (+ 2 new files pending)"

# Step 7: Populate 04c-dev-squad (from 05-agile-team, Dev subset)
echo ""
echo "⚡ Step 7: Agile Team → 04c-dev-squad..."
cp "$WB/05-agile-team/001_shipquick_manifesto.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/002_safe_core_rules.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/003_agile_execution_guide.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/007_rally_task_template.csv" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/008_rally_defect_template.csv" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/workflow_dev-story.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/workflow_quick-dev.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/workflow_quick-spec.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/workflow_code-review.md" "$WB/04c-dev-squad/"
cp "$WB/05-agile-team/workflow_sq-exec.md" "$WB/04c-dev-squad/"
echo "   ✅  04c-dev-squad: $(ls -1 "$WB/04c-dev-squad/" | wc -l | tr -d ' ') files"

# Step 8: Populate 04d-ux-designer (from 03-product + 04-arch shared)
echo ""
echo "🎨 Step 8: Creating 04d-ux-designer..."
cp "$WB/03-product-management/001_shipquick_manifesto.md" "$WB/04d-ux-designer/"
cp "$WB/03-product-management/002_safe_core_rules.md" "$WB/04d-ux-designer/"
cp "$WB/04-system-architecture/008_design_tokens.yaml" "$WB/04d-ux-designer/"
cp "$WB/03-product-management/workflow_create-ux-design.md" "$WB/04d-ux-designer/"
cp "$WB/00-bmad-orchestrator/workflow_brainstorming.md" "$WB/04d-ux-designer/"
cp "$WB/01-lpm-strategy/workflow_domain-research.md" "$WB/04d-ux-designer/"
# New files will be authored separately: human_centered_design, accessibility, responsive, persona, usability, handoff
echo "   ✅  04d-ux-designer: $(ls -1 "$WB/04d-ux-designer/" | wc -l | tr -d ' ') files (+ 6 new files pending)"

# Step 9: Populate 05-test-architect (from 06-quality-release, minus governance)
echo ""
echo "🤖 Step 9: Quality & Release → 05-test-architect..."
cp "$WB/06-quality-release/001_shipquick_manifesto.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/002_safe_core_rules.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/005_nfr_test_guide.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/006_regression_strategy.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/007_rally_testcase_template.csv" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_qa-automate.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-atdd.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-framework.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-nfr.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-ci.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_teach-me-testing.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-automate.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-test-design.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-test-review.md" "$WB/05-test-architect/"
cp "$WB/06-quality-release/workflow_testarch-trace.md" "$WB/05-test-architect/"
echo "   ✅  05-test-architect: $(ls -1 "$WB/05-test-architect/" | wc -l | tr -d ' ') files"

# Step 10: Remove old directories
echo ""
echo "🗑️ Step 10: Removing old agent directories..."
rm -rf "$WB/01-lpm-strategy"
rm -rf "$WB/02-solution-train"
rm -rf "$WB/03-product-management"
rm -rf "$WB/04-system-architecture"
rm -rf "$WB/05-agile-team"
rm -rf "$WB/06-quality-release"
echo "   ✅ Old directories removed."

# Step 11: Summary
echo ""
echo "=========================================="
echo "📊 FINAL STRUCTURE SUMMARY"
echo "=========================================="
for dir in "$WB"/*/; do
  count=$(ls -1 "$dir" | wc -l | tr -d ' ')
  echo "  $(basename "$dir"): $count files"
done
echo ""
echo "✅ Restructure complete! Backup at: ${BACKUP}"
echo "⚠️  Pending: Author 10 new files (SM Handbook, UX Design files, PI Planning, I&A)"

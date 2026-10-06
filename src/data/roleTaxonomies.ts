/**
 * SkillForge AI — Role Taxonomies Bridge
 * Connects the extensive ROLES_CATALOG and SKILLS_CATALOG with the analysis engine.
 */

import type { RoleTaxonomy } from '../types';
import { ROLES_CATALOG } from './roles';
import { SKILLS_CATALOG, type SkillCategory } from './skills';

function mapCategoryToLegacy(category: SkillCategory): 'core_technical' | 'tools_libraries' | 'architecture_concepts' | 'testing_deployment' | 'soft_skills' {
  switch (category) {
    case 'engineering_fundamentals':
    case 'programming':
    case 'mathematics_statistics':
      return 'core_technical';
    case 'tools_software':
      return 'tools_libraries';
    case 'domain_knowledge':
    case 'design_analysis':
      return 'architecture_concepts';
    case 'testing_validation':
    case 'safety_compliance':
      return 'testing_deployment';
    case 'communication':
    case 'collaboration':
    case 'interview_communication':
    case 'documentation':
    case 'project_execution':
    default:
      return 'soft_skills';
  }
}

export const ROLE_TAXONOMIES: Record<string, RoleTaxonomy> = {};

// Dynamically generate entries for all roles in ROLES_CATALOG
for (const [roleId, role] of Object.entries(ROLES_CATALOG)) {
  ROLE_TAXONOMIES[roleId] = {
    id: role.id,
    title: role.title,
    description: role.summary,
    requiredSkills: role.requiredSkills.map(req => {
      const def = SKILLS_CATALOG[req.skillId];
      const category = def ? mapCategoryToLegacy(def.category) : 'core_technical';
      return {
        skill: req.skillName,
        category,
        importance: (req.importance === 'low' ? 'medium' : req.importance) as 'critical' | 'high' | 'medium',
        benchmarkDescription: req.benchmarkDescription,
      };
    }),
  };
}

export function getRoleTaxonomy(roleId: string): RoleTaxonomy {
  return ROLE_TAXONOMIES[roleId] || ROLE_TAXONOMIES['frontend'];
}

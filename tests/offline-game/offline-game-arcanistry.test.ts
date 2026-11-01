import { describe, expect, it } from "vitest";
import {
  calculateArtificialArtifactCondition, getArtificialArtifactExperiencePoints,
  getArtifactProductionPlan, getBaselineProductionChance, getFocusTrainingPlan,
  validateArcanistGradeOneAward, validateFocusStageAward
} from "../../src/offline-game/mechanics/arcanistry";

describe("Arcanistry canon formulas", () => {
  it("matches all 100 baseline grade/tier cells", () => {
    for (let g=1; g<=10; g++) for (let t=1; t<=10; t++) {
      const d=t-g, expected=d<=-1?100:d===0?80:d===1?30:d===2?10:0;
      expect(getBaselineProductionChance(g,t)).toBe(expected);
    }
    expect(getBaselineProductionChance(0,1)).toBeNull();
    expect(getBaselineProductionChance(1,11)).toBeNull();
  });

  it("returns official focus and production schedules", () => {
    expect(getFocusTrainingPlan("Pemula")).toMatchObject({hours:12,daysAtThreeHours:4,mortalSatiety:87.5});
    expect(getFocusTrainingPlan("Expert")).toMatchObject({hours:120,daysAtThreeHours:40,mortalSatiety:875});
    expect(getArtifactProductionPlan(10)).toMatchObject({hours:36,mortalSatiety:262.5});
    expect(getArtifactProductionPlan(0)).toBeNull();
  });

  it("requires instruction, sequential teacher assessment and the Grade 1 apprentice exam", () => {
    expect(validateFocusStageAward({currentStage:null,targetStage:"Pemula",foundationalInstructionCompleted:true,teacherAssessmentPassed:true}).eligible).toBe(true);
    expect(validateFocusStageAward({currentStage:null,targetStage:"Beginner",foundationalInstructionCompleted:true,teacherAssessmentPassed:true}).eligible).toBe(false);
    expect(validateFocusStageAward({currentStage:"Pemula",targetStage:"Initiate",foundationalInstructionCompleted:true,teacherAssessmentPassed:false}).eligible).toBe(false);
    expect(validateArcanistGradeOneAward({initiateAssessmentPassed:true,officialApprenticeExamPassed:true,affiliationMarkedApprenticeEngraverPresented:true}).eligible).toBe(true);
    expect(validateArcanistGradeOneAward({initiateAssessmentPassed:true,officialApprenticeExamPassed:false,affiliationMarkedApprenticeEngraverPresented:true}).eligible).toBe(false);
  });

  it("calculates the Artifact Condition score and official Tier efficiency", () => {
    expect(calculateArtificialArtifactCondition({tier:1,environmentalPenalty:0,preparationPoints:0,productionSkillPoints:0,experiencePoints:0,consistencyPoints:0}))
      .toMatchObject({rawScore:78.8,displayedScore:78.8,tierEfficiency:1,condition:"Standar"});
    expect(calculateArtificialArtifactCondition({tier:10,environmentalPenalty:0,preparationPoints:20,productionSkillPoints:25,experiencePoints:20,consistencyPoints:18}))
      .toMatchObject({rawScore:97.05,displayedScore:97.05,tierEfficiency:0.35,condition:"Origin"});
    expect(calculateArtificialArtifactCondition({tier:11,environmentalPenalty:0,preparationPoints:0,productionSkillPoints:0,experiencePoints:0,consistencyPoints:0})).toBeNull();
  });

  it("assigns production experience only from completed recorded Artificial Artifacts", () => {
    expect([0,1,2,3,5,6,10,11,20,21,40,41,75,76].map(getArtificialArtifactExperiencePoints))
      .toEqual([0,2,2,4,4,7,7,10,10,13,13,16,16,20]);
    expect(getArtificialArtifactExperiencePoints(-1)).toBeNull();
  });
});

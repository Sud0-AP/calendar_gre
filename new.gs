function createEnhancedStudySchedule() {
  var calendar = CalendarApp.getDefaultCalendar();
  
  // Progress tracking variables
  var progress = {
    // GRE Module progression (in order of completion)
    currentModule: 5, // Start with Module 5
    moduleProgress: 0, // 0=not started, 1=part1, 2=part2, 3=completed
    moduleLessons: {
      5: {total: 21, name: "Functions & Word Problems", duration: "3:11:22"},
      6: {total: 11, name: "Linear Systems & Advanced Graphing", duration: "1:06:21"},
      7: {total: 19, name: "Geometry Foundation", duration: "1:12:30"},
      8: {total: 21, name: "Advanced Triangles & Polygons", duration: "1:23:37"},
      9: {total: 21, name: "Circles & 3D Geometry", duration: "1:11:38"},
      10: {total: 23, name: "Data Analysis & Statistics", duration: "1:35:19"},
      11: {total: 22, name: "Advanced Statistics & Combinatorics", duration: "1:54:35"},
      12: {total: 21, name: "Probability & Distributions", duration: "1:40:14"}
    },
    currentQuiz: 6, // Start with Quiz #6 (after Module 5)
    
    // Vocab Mountain progression
    vocabGroup: 1, // Start with group 1
    vocabPhase: "foundation", // foundation (1-15) or strategy (16-30)
    
    // Strategy phases
    quantStrategy: 0, // 0-4 (5 sessions total)
    verbalStrategy: 0, // 0-3 (4 sessions total)
    
    // Practice tests
    practiceTest: 0, // 0-5 (6 practice tests total)
    
    // Research paper steps
    researchStep: 1, // Steps 1-7
    researchPhase: 1, // Multiple phases per step
    
    // Hardware project steps
    hardwareStep: 1, // Steps 1-19
    
    // TOEFL (post-GRE)
    toeflVocabGroup: 1 // TOEFL Vocab Mountain 2 groups
  };
  
  // Template-based schedule definitions

var scheduleTemplates = {
  // Pattern A: Foundation Phase Templates
  "A-Sunday": [
    {time: "10:00", duration: 105, template: "gre_module_part1", type: "gre"},
    {time: "11:45", duration: 15, template: "break", type: "break"},
    {time: "12:00", duration: 90, template: "gre_module_part2", type: "gre"},
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},
    {time: "16:00", duration: 15, template: "break", type: "break"},
    {time: "16:15", duration: 135, template: "research_deep_work", type: "research"}
  ],
  "A-Work": [
    {time: "09:30", duration: 120, template: "gre_module_part3", type: "gre"},
    {time: "11:30", duration: 15, template: "break", type: "break"},
    {time: "11:45", duration: 105, template: "gre_quiz_review", type: "gre"},
    {time: "14:30", duration: 60, template: "hardware_design", type: "hardware"},
    {time: "19:00", duration: 90, template: "vocab_mountain_3groups", type: "vocab"}
  ],
  "A-Rest": [
    {time: "09:30", duration: 135, template: "research_deep_work", type: "research"},     // 9:30-11:45
    {time: "11:45", duration: 15, template: "break", type: "break"},                    // 11:45-12:00
    {time: "12:00", duration: 90, template: "gre_quiz", type: "gre"},                   // 12:00-1:30 ✓
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},    // 2:30-4:00
    {time: "16:00", duration: 15, template: "break", type: "break"},                    // 4:00-4:15
    {time: "16:15", duration: 135, template: "gre_next_module", type: "gre"}            // 4:15-6:30
  ],
  
  // Pattern B: Concept Building Templates  
  "B-Sunday": [
    {time: "10:00", duration: 105, template: "gre_module_part1", type: "gre"},
    {time: "11:45", duration: 15, template: "break", type: "break"},
    {time: "12:00", duration: 90, template: "gre_module_part2", type: "gre"},
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},
    {time: "16:00", duration: 15, template: "break", type: "break"},
    {time: "16:15", duration: 135, template: "hardware_work", type: "hardware"}
  ],
  "B-Work": [
    {time: "09:30", duration: 135, template: "gre_module_part1", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 90, template: "gre_module_part2", type: "gre"},
    {time: "14:30", duration: 60, template: "research_work", type: "research"},
    {time: "19:00", duration: 90, template: "vocab_mountain_3groups", type: "vocab"}
  ],
  "B-Rest": [
    {time: "09:30", duration: 120, template: "hardware_work", type: "hardware"},        // 9:30-11:30
    {time: "11:30", duration: 15, template: "break", type: "break"},                    // 11:30-11:45
    {time: "11:45", duration: 105, template: "gre_quiz_review", type: "gre"},          // 11:45-1:30 ✓
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},    // 2:30-4:00
    {time: "16:00", duration: 15, template: "break", type: "break"},                    // 4:00-4:15
    {time: "16:15", duration: 135, template: "gre_next_module", type: "gre"}            // 4:15-6:30
  ],
  
  // Pattern C: Strategy Introduction Templates
  "C-Sunday": [
    {time: "10:00", duration: 120, template: "gre_quant_strategy", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 75, template: "gre_quiz", type: "gre"},
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},
    {time: "16:00", duration: 15, template: "break", type: "break"},
    {time: "16:15", duration: 135, template: "research_deep_work", type: "research"}
  ],
  "C-Work": [
    {time: "09:30", duration: 135, template: "gre_module_part1", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 90, template: "gre_module_part2", type: "gre"},
    {time: "14:30", duration: 60, template: "hardware_work", type: "hardware"},
    {time: "19:00", duration: 90, template: "vocab_mountain_3groups", type: "vocab"}
  ],
  "C-Rest": [
    {time: "09:30", duration: 135, template: "research_deep_work", type: "research"},   // 9:30-11:45
    {time: "11:45", duration: 15, template: "break", type: "break"},                    // 11:45-12:00
    {time: "12:00", duration: 90, template: "gre_verbal_strategy", type: "gre"},       // 12:00-1:30 ✓
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},    // 2:30-4:00
    {time: "16:00", duration: 15, template: "break", type: "break"},                    // 4:00-4:15
    {time: "16:15", duration: 135, template: "gre_next_module", type: "gre"}            // 4:15-6:30
  ],
  
  // Pattern D: Practice Intensive Templates
  "D-Sunday": [
    {time: "10:00", duration: 120, template: "gre_practice_test_quant", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 75, template: "gre_practice_review", type: "gre"},
    {time: "14:30", duration: 90, template: "vocab_mountain_3groups", type: "vocab"},
    {time: "16:00", duration: 15, template: "break", type: "break"},
    {time: "16:15", duration: 135, template: "hardware_work", type: "hardware"}
  ],
  "D-Work": [
    {time: "09:30", duration: 135, template: "gre_verbal_strategy", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 90, template: "gre_next_module", type: "gre"},
    {time: "14:30", duration: 60, template: "research_work", type: "research"},
    {time: "19:00", duration: 90, template: "gre_verbal_practice", type: "gre"}
  ],
  "D-Rest": [
    {time: "09:30", duration: 120, template: "hardware_work", type: "hardware"},        // 9:30-11:30
    {time: "11:30", duration: 15, template: "break", type: "break"},                    // 11:30-11:45
    {time: "11:45", duration: 105, template: "gre_quiz_review", type: "gre"},          // 11:45-1:30 ✓
    {time: "14:30", duration: 90, template: "gre_verbal_strategy", type: "gre"},        // 2:30-4:00
    {time: "16:00", duration: 15, template: "break", type: "break"},                    // 4:00-4:15
    {time: "16:15", duration: 135, template: "gre_practice_test_verbal", type: "gre"}   // 4:15-6:30
  ],
  
  // Pattern E: Mock Test Phase Templates
  "E-Sunday": [
    {time: "10:00", duration: 210, template: "gre_full_practice_test", type: "gre"},
    {time: "14:30", duration: 90, template: "gre_practice_review", type: "gre"},
    {time: "16:00", duration: 15, template: "break", type: "break"},
    {time: "16:15", duration: 105, template: "research_professor_contact", type: "research"}
  ],
  "E-Work": [
    {time: "09:30", duration: 150, template: "gre_weak_areas", type: "gre"},
    {time: "12:00", duration: 15, template: "break", type: "break"},
    {time: "12:15", duration: 75, template: "gre_verbal_strategy", type: "gre"},
    {time: "14:30", duration: 60, template: "hardware_work", type: "hardware"},
    {time: "19:00", duration: 90, template: "vocab_review_all", type: "vocab"}
  ],
  "E-Rest": [
    {time: "09:30", duration: 105, template: "research_paper_writing", type: "research"}, // 9:30-11:15
    {time: "11:15", duration: 15, template: "break", type: "break"},                    // 11:15-11:30
    {time: "11:30", duration: 120, template: "gre_quant_review", type: "gre"},          // 11:30-1:30 ✓
    {time: "14:30", duration: 120, template: "gre_mixed_practice", type: "gre"},         // 2:30-4:30
    {time: "16:30", duration: 15, template: "break", type: "break"},                    // 4:30-4:45
    {time: "16:45", duration: 105, template: "gre_final_strategies", type: "gre"}       // 4:45-6:30
  ],
  
  // Pattern F: Final Week + Transition Templates
  "F-Sunday": [
    {time: "10:00", duration: 180, template: "gre_final_practice_test", type: "gre"},
    {time: "13:00", duration: 15, template: "break", type: "break"},
    {time: "13:15", duration: 75, template: "gre_light_review", type: "gre"},
    {time: "14:30", duration: 120, template: "research_paper_writing", type: "research"},
    {time: "16:30", duration: 60, template: "hardware_work", type: "hardware"}
  ],
  "F-Work": [
    {time: "09:30", duration: 180, template: "gre_maintenance_review", type: "gre"},
    {time: "12:30", duration: 15, template: "break", type: "break"},
    {time: "12:45", duration: 45, template: "gre_test_prep", type: "gre"},
    {time: "14:30", duration: 60, template: "research_paper_writing", type: "research"},
    {time: "19:00", duration: 90, template: "toefl_introduction", type: "toefl"}
  ],
  "F-Rest": [
    {time: "09:30", duration: 120, template: "hardware_work", type: "hardware"},        // 9:30-11:30
    {time: "11:30", duration: 15, template: "break", type: "break"},                    // 11:30-11:45
    {time: "11:45", duration: 105, template: "toefl_vocab_groups", type: "toefl"},     // 11:45-1:30 ✓
    {time: "14:30", duration: 180, template: "research_paper_writing", type: "research"}, // 2:30-5:30
    {time: "17:30", duration: 60, template: "weekly_planning", type: "planning"}        // 5:30-6:30
  ]
};
  
  // Function to generate actual content from templates
  function generateContent(template, progress) {
    switch(template) {
      case "gre_module_part1":
        var module = progress.moduleLessons[progress.currentModule];
        if (!module) {
          return {
            title: "GRE Study Session",
            desc: "Focused GRE preparation"
          };
        }
        var lessonStart = Math.floor(progress.moduleProgress * module.total / 3) + 1;
        var lessonEnd = Math.floor((progress.moduleProgress + 1) * module.total / 3);
        return {
          title: "GRE Module " + progress.currentModule + ": " + module.name + " (Part " + (progress.moduleProgress + 1) + ")",
          desc: "Lessons " + lessonStart + "-" + lessonEnd + ": " + getModuleDescription(progress.currentModule, progress.moduleProgress + 1)
        };
        
      case "gre_module_part2":
        var module = progress.moduleLessons[progress.currentModule];
        if (!module) {
          return {
            title: "GRE Study Session",
            desc: "Focused GRE preparation"
          };
        }
        var lessonStart = Math.floor((progress.moduleProgress + 1) * module.total / 3) + 1;
        var lessonEnd = Math.floor((progress.moduleProgress + 2) * module.total / 3);
        return {
          title: "GRE Module " + progress.currentModule + ": " + module.name + " (Part " + (progress.moduleProgress + 2) + ")",
          desc: "Lessons " + lessonStart + "-" + lessonEnd + ": " + getModuleDescription(progress.currentModule, progress.moduleProgress + 2)
        };
        
      case "gre_module_part3":
        var module = progress.moduleLessons[progress.currentModule];
        if (!module) {
          return {
            title: "GRE Study Session",
            desc: "Focused GRE preparation"
          };
        }
        var lessonStart = Math.floor((progress.moduleProgress + 2) * module.total / 3) + 1;
        var lessonEnd = module.total;
        return {
          title: "GRE Module " + progress.currentModule + ": " + module.name + " (Complete)",
          desc: "Lessons " + lessonStart + "-" + lessonEnd + ": " + getModuleDescription(progress.currentModule, 3)
        };
        
      case "gre_next_module":
        var nextModule = progress.currentModule + 1;
        if (nextModule > 12) nextModule = 12;
        var module = progress.moduleLessons[nextModule];
        if (!module) {
          return {
            title: "GRE Advanced Study",
            desc: "Advanced GRE concepts and practice"
          };
        }
        return {
          title: "GRE Module " + nextModule + ": " + module.name + " (Complete)",
          desc: "All " + module.total + " lessons: " + getModuleDescription(nextModule, 1)
        };
        
      case "gre_quiz":
        var module = progress.moduleLessons[progress.currentModule];
        var moduleName = module ? module.name.toLowerCase() : "current module";
        return {
          title: "GRE Tickbox Quiz #" + progress.currentQuiz,
          desc: "Complete quiz on " + moduleName
        };
        
      case "gre_quiz_review":
        var module = progress.moduleLessons[progress.currentModule];
        var moduleName = module ? module.name.toLowerCase() : "current module";
        return {
          title: "GRE Tickbox Quiz #" + progress.currentQuiz + " + Review",
          desc: "Complete quiz and analyze mistakes on " + moduleName
        };
        
      case "vocab_mountain_3groups":
        var startGroup = progress.vocabGroup;
        var endGroup = Math.min(progress.vocabGroup + 2, progress.vocabPhase === "foundation" ? 15 : 30);
        return {
          title: "Vocab Mountain Groups " + startGroup + "-" + endGroup,
          desc: "Learning and writing " + ((endGroup - startGroup + 1) * 30) + " vocabulary words (" + progress.vocabPhase + " phase)"
        };
        
      case "vocab_review_all":
        return {
          title: "GRE Final Vocab Review",
          desc: "Review all vocab mountain groups 1-30"
        };
        
      case "gre_quant_strategy":
        return {
          title: "GRE Quant Strategy Session " + (progress.quantStrategy + 1),
          desc: getQuantStrategyDescription(progress.quantStrategy + 1)
        };
        
      case "gre_verbal_strategy":
        return {
          title: "GRE Verbal Strategy Session " + (progress.verbalStrategy + 1),
          desc: getVerbalStrategyDescription(progress.verbalStrategy + 1)
        };
        
      case "gre_practice_test_quant":
        return {
          title: "GRE Practice Test " + (progress.practiceTest + 1) + " (Quant Sections)",
          desc: "Full quant sections under timed conditions"
        };
        
      case "gre_practice_test_verbal":
        return {
          title: "GRE Practice Test " + (progress.practiceTest + 1) + " (Verbal Sections)",
          desc: "Full verbal sections under timed conditions"
        };
        
      case "gre_full_practice_test":
        return {
          title: "GRE Full Practice Test " + (progress.practiceTest + 1),
          desc: "Complete 3.5-hour practice test simulation"
        };
        
      case "gre_practice_review":
        return {
          title: "GRE Practice Test " + (progress.practiceTest + 1) + " Review",
          desc: "Comprehensive review and score analysis"
        };
        
      case "research_deep_work":
        return {
          title: "Research Paper - Step " + progress.researchStep + " Deep Work",
          desc: getResearchStepDescription(progress.researchStep, progress.researchPhase)
        };
        
      case "research_work":
        return {
          title: "Research Paper - Step " + progress.researchStep + " Work",
          desc: getResearchStepDescription(progress.researchStep, progress.researchPhase)
        };
        
      case "research_paper_writing":
        return {
          title: "Research Paper - Writing Phase " + progress.researchPhase,
          desc: "Step 7: Research paper writing - " + getWritingPhaseDescription(progress.researchPhase)
        };
        
      case "research_professor_contact":
        return {
          title: "Research Paper - Professor Contact",
          desc: "Step 6: Contact professor and internship guide to discuss future"
        };
        
      case "hardware_design":
        return {
          title: "Hardware Project - Step " + progress.hardwareStep,
          desc: getHardwareStepDescription(progress.hardwareStep)
        };
        
      case "hardware_work":
        return {
          title: "Hardware Project - Step " + progress.hardwareStep,
          desc: getHardwareStepDescription(progress.hardwareStep)
        };
        
      case "toefl_introduction":
        return {
          title: "TOEFL Vocab Mountain 2 Introduction",
          desc: "Begin TOEFL preparation"
        };
        
      case "toefl_vocab_groups":
        return {
          title: "TOEFL Vocab Mountain 2 Groups " + progress.toeflVocabGroup + "-" + (progress.toeflVocabGroup + 2),
          desc: "TOEFL vocabulary building"
        };
        
      case "break":
        return {
          title: "Break",
          desc: "Rest and refresh"
        };
        
      case "weekly_planning":
        return {
          title: "Weekly Review & Planning",
          desc: "Review progress and plan next week"
        };
        
      default:
        return {
          title: "Study Session",
          desc: "Focused study time"
        };
    }
  }
  
  // Helper functions for descriptions
  function getModuleDescription(moduleNum, part) {
    var descriptions = {
      5: {1: "Basic function concepts and graphing", 2: "Advanced functions and transformations", 3: "Word problem strategies"},
      6: {1: "Linear systems and graphing techniques", 2: "Advanced graphing", 3: "Complete module"},
      7: {1: "Basic geometry concepts", 2: "Advanced geometry", 3: "Complete module"},
      8: {1: "Triangle properties and theorems", 2: "Advanced triangles", 3: "Complete module"},
      9: {1: "Circle properties", 2: "3D geometry", 3: "Complete module"},
      10: {1: "Statistics basics", 2: "Data interpretation", 3: "Complete module"},
      11: {1: "Advanced statistics", 2: "Combinatorics", 3: "Complete module"},
      12: {1: "Probability basics", 2: "Distributions", 3: "Complete module"}
    };
    return descriptions[moduleNum] ? descriptions[moduleNum][part] : "Module content";
  }
  
  function getQuantStrategyDescription(session) {
    var strategies = {
      1: "Problem-solving techniques and time management",
      2: "Advanced calculation strategies",
      3: "Geometry problem approaches", 
      4: "Data analysis strategies",
      5: "Final review and test techniques"
    };
    return strategies[session] || "Quantitative strategies";
  }
  
  function getVerbalStrategyDescription(session) {
    var strategies = {
      1: "Reading comprehension strategies",
      2: "Text completion and sentence equivalence", 
      3: "Advanced reading comprehension",
      4: "Final verbal strategies and techniques"
    };
    return strategies[session] || "Verbal strategies";
  }
  
  function getResearchStepDescription(step, phase) {
    var steps = {
      1: "Re-do literature review - Phase " + phase,
      2: "ZKP architecture design - Phase " + phase, 
      3: "ZKP architecture testing - Phase " + phase,
      4: "Integration with flutter app - Phase " + phase,
      5: "Testing the app and fixing bugs - Phase " + phase,
      6: "Contact professor and internship guide",
      7: "Research paper writing - Phase " + phase
    };
    return steps[step] || "Research work - Phase " + phase;
  }
  
  function getWritingPhaseDescription(phase) {
    var phases = {
      1: "outline and structure",
      2: "introduction and methodology", 
      3: "results and analysis",
      4: "discussion and conclusion",
      5: "final review and editing"
    };
    return phases[phase] || "writing work";
  }
  
  function getHardwareStepDescription(step) {
    var steps = {
      1: "Design all the screens",
      2: "Optimize and correct all the screen code",
      3: "Assemble breadboard prototype", 
      4: "Test and fix the screens on the real display",
      5: "Implement menu actions and screens with dummy data",
      6: "Implement animations",
      7: "Design the mobile app UI",
      8: "Test background task and constant notification type setup with dummy app",
      9: "Make the PRD for the app properly",
      10: "Make the app UI and api functionality",
      11: "Integrate basic Bluetooth and test auto ui updates for all menus",
      12: "Integrate background task and constant notification",
      13: "Test all the music related functionality works properly",
      14: "Design the device enclosure and circuit",
      15: "Implement workout logging in the app",
      16: "Implement Bluetooth stuff for the logging",
      17: "Test with the device",
      18: "Do battery tests etc with the pcb and case",
      19: "Final testing and bug fixes"
    };
    return steps[step] || "Hardware project work";
  }
  
  // Function to update progress after each event
  function updateProgress(template, progress) {
    switch(template) {
      case "gre_module_part1":
        progress.moduleProgress = Math.max(progress.moduleProgress, 1);
        break;
      case "gre_module_part2": 
        progress.moduleProgress = Math.max(progress.moduleProgress, 2);
        break;
      case "gre_module_part3":
        progress.moduleProgress = 3;
        break;
      case "gre_next_module":
        progress.currentModule++;
        progress.moduleProgress = 0;
        progress.currentQuiz++;
        break;
      case "gre_quiz":
      case "gre_quiz_review":
        // Quiz completed, ready for next module
        break;
      case "vocab_mountain_3groups":
        progress.vocabGroup += 3;
        if (progress.vocabGroup > 15 && progress.vocabPhase === "foundation") {
          progress.vocabPhase = "strategy";
        }
        if (progress.vocabGroup > 30) progress.vocabGroup = 30;
        break;
      case "gre_quant_strategy":
        progress.quantStrategy++;
        break;
      case "gre_verbal_strategy":
        progress.verbalStrategy++;
        break;
      case "gre_practice_test_quant":
      case "gre_practice_test_verbal":
      case "gre_full_practice_test":
        progress.practiceTest++;
        break;
      case "research_deep_work":
      case "research_work":
        progress.researchPhase++;
        if (progress.researchPhase > 3) {
          progress.researchStep++;
          progress.researchPhase = 1;
        }
        break;
      case "research_paper_writing":
        progress.researchPhase++;
        break;
      case "hardware_design":
      case "hardware_work":
        progress.hardwareStep++;
        if (progress.hardwareStep > 19) progress.hardwareStep = 19;
        break;
      case "toefl_vocab_groups":
        progress.toeflVocabGroup += 3;
        break;
    }
  }
  
  // Start August 18, 2025 (Monday - Rest Day) - End September 14, 2025
  var startDate = new Date(2025, 7, 18); // Month is 0-indexed, so 7 = August
  var endDate = new Date(2025, 8, 14); // September 14, 2025
  
  var patternOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
  var gymCycle = ['Rest', 'Work', 'Work', 'Work']; // Starting with Rest Day (Monday Aug 18)
  
  // First, collect all events to create
  var allEvents = [];
  var currentDate = new Date(startDate);
  var studyPatternIndex = 0;
  var gymDayIndex = 0;
  var tempProgress = JSON.parse(JSON.stringify(progress)); // Deep copy for planning
  
  console.log('Planning enhanced calendar with dynamic progression...');
  console.log('Start date: ' + startDate.toDateString());
  console.log('End date: ' + endDate.toDateString());
  
  // Collect all events first
  while (currentDate <= endDate) {
  // Collect all events first
  while (currentDate <= endDate) {
    var studyPattern = patternOrder[studyPatternIndex];
    var gymType = gymCycle[gymDayIndex]; // Work or Rest
    var isSunday = currentDate.getDay() === 0; // 0 = Sunday
    
    // Determine schedule type
    var scheduleType;
    if (isSunday && gymType === 'Work') {
      scheduleType = 'Sunday'; // Work day that falls on Sunday gets Sunday schedule
    } else if (gymType === 'Rest') {
      scheduleType = 'Rest'; // Rest day (regardless of day of week)
    } else {
      scheduleType = 'Work'; // Regular work day on weekday
    }
    
    var scheduleKey = studyPattern + "-" + scheduleType;
    var daySchedule = scheduleTemplates[scheduleKey];
    
    if (daySchedule) {
      for (var i = 0; i < daySchedule.length; i++) {
        var eventTemplate = daySchedule[i];
        var content = generateContent(eventTemplate.template, tempProgress);
        
        var eventDate = new Date(currentDate);
        var timeparts = eventTemplate.time.split(':');
        eventDate.setHours(parseInt(timeparts[0]), parseInt(timeparts[1]), 0, 0);
        var endTime = new Date(eventDate.getTime() + (eventTemplate.duration * 60000));
        
        allEvents.push({
          title: content.title,
          start: eventDate,
          end: endTime,
          description: content.desc,
          type: eventTemplate.type,
          template: eventTemplate.template
        });
        
        // Update temp progress for planning
        updateProgress(eventTemplate.template, tempProgress);
      }
    }
    
    // Move to next day for planning
    currentDate.setDate(currentDate.getDate() + 1);
    studyPatternIndex = (studyPatternIndex + 1) % 6;
    gymDayIndex = (gymDayIndex + 1) % 4;
  }
  
  console.log('Planning completed. Total events to create: ' + allEvents.length);
  
  // Now create events in batches with enhanced error handling
  var batchSize = 15; // Smaller batches for better rate limit handling
  var successCount = 0;
  var failCount = 0;
  var actualProgress = JSON.parse(JSON.stringify(progress)); // Reset to original progress
  
  for (var batchStart = 0; batchStart < allEvents.length; batchStart += batchSize) {
    var batch = allEvents.slice(batchStart, batchStart + batchSize);
    var batchNum = Math.floor(batchStart / batchSize) + 1;
    var totalBatches = Math.ceil(allEvents.length / batchSize);
    
    console.log('Processing batch ' + batchNum + ' of ' + totalBatches + ' (' + batch.length + ' events)');
    
    for (var i = 0; i < batch.length; i++) {
      var eventData = batch[i];
      var maxRetries = 3;
      var retryCount = 0;
      var eventCreated = false;
      
      while (retryCount < maxRetries && !eventCreated) {
        try {
          // Enhanced color coding system
          var eventColor = CalendarApp.EventColor.BLUE; // Default
          switch(eventData.type) {
            case 'gre':
              eventColor = CalendarApp.EventColor.BLUE; // GRE = Blue
              break;
            case 'vocab':
              eventColor = CalendarApp.EventColor.CYAN; // Vocab = Cyan
              break;
            case 'research':
              eventColor = CalendarApp.EventColor.GREEN; // Research = Green
              break;
            case 'hardware':
              eventColor = CalendarApp.EventColor.ORANGE; // Hardware = Orange
              break;
            case 'toefl':
              eventColor = CalendarApp.EventColor.RED; // TOEFL = Red
              break;
            case 'break':
              eventColor = CalendarApp.EventColor.YELLOW; // Break = Yellow
              break;
            case 'planning':
              eventColor = CalendarApp.EventColor.GRAY; // Planning = Gray
              break;
          }
          
          var createdEvent = calendar.createEvent(
            eventData.title,
            eventData.start,
            eventData.end,
            {description: eventData.description}
          );
          
          // Set the color and notification
          createdEvent.setColor(eventColor);
          createdEvent.addPopupReminder(15); // 15 minutes before
          
          successCount++;
          eventCreated = true;
          
          // Update actual progress after successful creation
          updateProgress(eventData.template, actualProgress);
          
          // Delay between events within batch
          Utilities.sleep(1200); // 1.2 seconds between each event
          
        } catch (e) {
          retryCount++;
          failCount++;
          console.log('Retry ' + retryCount + ' for: ' + eventData.title + ' - Error: ' + e.toString());
          
          // Enhanced progressive backoff
          if (e.toString().includes('too many times') || e.toString().includes('rate limit')) {
            var waitTime = 8000 * retryCount; // 8s, 16s, 24s
            console.log('Rate limit detected, waiting ' + (waitTime/1000) + ' seconds...');
            Utilities.sleep(waitTime);
          } else {
            Utilities.sleep(2000 * retryCount); // 2s, 4s, 6s for other errors
          }
        }
      }
      
      if (!eventCreated) {
        console.log('FAILED to create event after ' + maxRetries + ' attempts: ' + eventData.title);
      }
    }
    
    console.log('Batch ' + batchNum + ' completed. Success: ' + successCount + ', Failed: ' + failCount);
    
    // Longer pause between batches to avoid rate limits
    if (batchStart + batchSize < allEvents.length) {
      console.log('Waiting 12 seconds before next batch...');
      Utilities.sleep(12000); // 12 second pause between batches
    }
  }
  
  console.log('Enhanced schedule creation completed!');
  console.log('Events successfully created: ' + successCount);
  console.log('Total events failed: ' + failCount);
  console.log('Expected total events: ' + allEvents.length);
  console.log('Final progress state:');
  console.log('- GRE Module completed: ' + actualProgress.currentModule);
  console.log('- Vocab groups completed: ' + actualProgress.vocabGroup);
  console.log('- Research step: ' + actualProgress.researchStep);
  console.log('- Hardware step: ' + actualProgress.hardwareStep);
  console.log('- Practice tests taken: ' + actualProgress.practiceTest);
  console.log('Schedule includes:');
  console.log('- Dynamic GRE module progression with specific lessons');
  console.log('- Vocab Mountain groups 1-30 progression');
  console.log('- Research paper steps 1-7 with phases');
  console.log('- Hardware project phases 1-19');
  console.log('- 15-minute breaks between major study blocks');
  console.log('- Color-coded events: Blue(GRE), Cyan(Vocab), Green(Research), Orange(Hardware), Red(TOEFL), Yellow(Breaks)');
}

// Alternative batch creation function with smaller batches for extreme rate limiting
function createStudyScheduleConservativeBatch() {
  var calendar = CalendarApp.getDefaultCalendar();
  console.log('Starting conservative batch creation with 10-event batches...');
  
  // Use smaller batch size and longer delays
  var batchSize = 10;
  var interEventDelay = 2000; // 2 seconds between events
  var interBatchDelay = 15000; // 15 seconds between batches
  
  // Call main function with conservative settings
  createEnhancedStudySchedule();
}
}

import type { CategoryValue } from "@/config/site";
import type { QuestionConfig, QuestionCondition, QuestionnaireValues } from "@/lib/types";

function withOther(options: { label: string; value: string; description?: string }[]) {
  return [...options, { label: "Other", value: "other" }];
}

const countryOptions = [
  { label: "United Kingdom", value: "united_kingdom" },
  { label: "United States", value: "united_states" },
  { label: "Canada", value: "canada" },
  { label: "Australia", value: "australia" },
  { label: "Ireland", value: "ireland" },
  { label: "Other", value: "other" }
];

const ageOptions = [
  { label: "18-24", value: "18_24" },
  { label: "25-34", value: "25_34" },
  { label: "35-44", value: "35_44" },
  { label: "45-54", value: "45_54" },
  { label: "55+", value: "55_plus" }
];

const baseQuestions: Record<CategoryValue, QuestionConfig[]> = {
  FINANCE_MONEY: [
    {
      id: "fullName",
      category: "FINANCE_MONEY",
      label: "What is your full name?",
      helper: "We put this on the front of your report.",
      placeholder: "Full name",
      type: "text",
      required: true
    },
    {
      id: "email",
      category: "FINANCE_MONEY",
      label: "What email should we use for your PDF?",
      placeholder: "name@example.com",
      type: "text",
      required: true
    },
    {
      id: "country",
      category: "FINANCE_MONEY",
      label: "Which country do you live in?",
      type: "select",
      required: true,
      options: countryOptions
    },
    {
      id: "ageRange",
      category: "FINANCE_MONEY",
      label: "Which age group are you in?",
      type: "pill",
      required: true,
      options: ageOptions
    },
    {
      id: "mainGoal",
      category: "FINANCE_MONEY",
      label: "What do you want help with most?",
      helper: "Choose the main result you want first.",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Save more money", value: "save_money" },
        { label: "Make a better budget", value: "budget_better" },
        { label: "Pay off debt", value: "reduce_debt" },
        { label: "Build an emergency fund", value: "emergency_fund" },
        { label: "Increase income", value: "increase_income" },
        { label: "Start a side hustle", value: "side_hustle" }
      ])
    },
    {
      id: "mainGoalOther",
      category: "FINANCE_MONEY",
      label: "What else would you like help with?",
      type: "text",
      required: true,
      visibleIf: [{ field: "mainGoal", equals: "other" }],
      placeholder: "Tell us in a few words"
    },
    {
      id: "currentSituation",
      category: "FINANCE_MONEY",
      label: "Which option sounds most like you right now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "I need more control over my spending", value: "need_control" },
        { label: "I earn okay but still struggle to save", value: "struggle_to_save" },
        { label: "Debt is my biggest problem", value: "debt_problem" },
        { label: "My income is not high enough", value: "income_low" },
        { label: "I want a clearer money plan", value: "need_plan" }
      ])
    },
    {
      id: "monthlyIncome",
      category: "FINANCE_MONEY",
      label: "What is your monthly income range?",
      type: "select",
      required: true,
      options: withOther([
        { label: "Under £1,500", value: "under_1500" },
        { label: "£1,500-£3,000", value: "1500_3000" },
        { label: "£3,000-£5,000", value: "3000_5000" },
        { label: "£5,000-£8,000", value: "5000_8000" },
        { label: "£8,000+", value: "8000_plus" }
      ])
    },
    {
      id: "moneyFocusAreas",
      category: "FINANCE_MONEY",
      label: "What do you want this report to improve?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      options: withOther([
        { label: "Saving habits", value: "saving_habits" },
        { label: "Budgeting", value: "budgeting" },
        { label: "Debt plan", value: "debt_plan" },
        { label: "Income ideas", value: "income_ideas" },
        { label: "Money discipline", value: "money_discipline" }
      ])
    },
    {
      id: "debtType",
      category: "FINANCE_MONEY",
      label: "What kind of debt do you want help with?",
      helper: "Choose all that apply.",
      type: "multi",
      required: true,
      maxSelections: 4,
      visibleIf: [{ field: "mainGoal", equals: "reduce_debt" }],
      options: withOther([
        { label: "Credit cards", value: "credit_cards" },
        { label: "Loans", value: "loans" },
        { label: "Overdraft", value: "overdraft" },
        { label: "Buy now pay later", value: "bnpl" },
        { label: "A mix of debts", value: "mixed" }
      ])
    },
    {
      id: "incomeRoute",
      category: "FINANCE_MONEY",
      label: "How would you most likely increase income?",
      type: "radio",
      required: true,
      visibleIf: [{ field: "mainGoal", equals: ["increase_income", "side_hustle"] }],
      options: withOther([
        { label: "Extra work or overtime", value: "extra_work" },
        { label: "Service-based side hustle", value: "service_hustle" },
        { label: "Selling online", value: "selling_online" },
        { label: "Content or personal brand", value: "content_brand" },
        { label: "I need ideas", value: "need_ideas" }
      ])
    },
    {
      id: "trackSpending",
      category: "FINANCE_MONEY",
      label: "Do you track your spending now?",
      type: "toggle",
      required: true
    },
    {
      id: "timeline",
      category: "FINANCE_MONEY",
      label: "When do you want to see progress?",
      type: "pill",
      required: true,
      options: [
        { label: "In 30 days", value: "30_days" },
        { label: "In 90 days", value: "90_days" },
        { label: "In 6 months", value: "6_months" },
        { label: "Long-term", value: "long_term" }
      ]
    },
    {
      id: "confidenceLevel",
      category: "FINANCE_MONEY",
      label: "How confident do you feel about money now?",
      helper: "0 means very low. 10 means very confident.",
      type: "slider",
      min: 0,
      max: 10,
      step: 1,
      required: true
    },
    {
      id: "biggestChallenge",
      category: "FINANCE_MONEY",
      label: "What is the biggest thing making money hard right now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "I spend too easily", value: "overspending" },
        { label: "I do not have a clear plan", value: "no_plan" },
        { label: "My income is not steady", value: "income_not_steady" },
        { label: "Debt payments are too heavy", value: "debt_heavy" },
        { label: "I find it hard to stay consistent", value: "not_consistent" }
      ])
    },
    {
      id: "biggestChallengeOther",
      category: "FINANCE_MONEY",
      label: "Tell us your biggest challenge in your own words",
      type: "textarea",
      required: true,
      visibleIf: [{ field: "biggestChallenge", equals: "other" }],
      placeholder: "Add any extra detail here"
    },
    {
      id: "successVision",
      category: "FINANCE_MONEY",
      label: "What would a good result look like for you?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "I want to save every month", value: "save_each_month" },
        { label: "I want less debt stress", value: "less_debt_stress" },
        { label: "I want a better budget routine", value: "better_budget" },
        { label: "I want extra income coming in", value: "extra_income" },
        { label: "I want more control and confidence", value: "more_control" }
      ])
    },
    {
      id: "personalNotes",
      category: "FINANCE_MONEY",
      label: "Anything else you want us to know?",
      type: "textarea",
      placeholder: "Optional"
    }
  ],
  FITNESS_HEALTH: [
    {
      id: "fullName",
      category: "FITNESS_HEALTH",
      label: "What is your full name?",
      type: "text",
      required: true,
      placeholder: "Full name"
    },
    {
      id: "email",
      category: "FITNESS_HEALTH",
      label: "What email should we send your PDF to?",
      type: "text",
      required: true,
      placeholder: "name@example.com"
    },
    {
      id: "ageRange",
      category: "FITNESS_HEALTH",
      label: "Which age group are you in?",
      type: "pill",
      required: true,
      options: ageOptions
    },
    {
      id: "country",
      category: "FITNESS_HEALTH",
      label: "Which country do you live in?",
      type: "select",
      required: true,
      options: countryOptions
    },
    {
      id: "optionalGender",
      category: "FITNESS_HEALTH",
      label: "If helpful, which gender should we consider?",
      helper: "This is optional.",
      type: "pill",
      options: [
        { label: "Female", value: "female" },
        { label: "Male", value: "male" },
        { label: "Prefer not to say", value: "prefer_not" }
      ]
    },
    {
      id: "mainGoal",
      category: "FITNESS_HEALTH",
      label: "What do you want help with most?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Lose weight", value: "weight_loss" },
        { label: "Build muscle", value: "muscle_gain" },
        { label: "Lose fat and build muscle", value: "body_recomp" },
        { label: "Get fitter", value: "improve_fitness" },
        { label: "Build a better routine", value: "better_routine" },
        { label: "Improve nutrition", value: "better_nutrition" }
      ])
    },
    {
      id: "mainGoalOther",
      category: "FITNESS_HEALTH",
      label: "What else would you like help with?",
      type: "text",
      required: true,
      visibleIf: [{ field: "mainGoal", equals: "other" }],
      placeholder: "Tell us in a few words"
    },
    {
      id: "height",
      category: "FITNESS_HEALTH",
      label: "What is your height?",
      type: "text",
      required: true,
      placeholder: "Example: 175 cm or 5 ft 9"
    },
    {
      id: "weight",
      category: "FITNESS_HEALTH",
      label: "What is your current weight?",
      type: "text",
      required: true,
      placeholder: "Example: 78 kg or 172 lb"
    },
    {
      id: "activityLevel",
      category: "FITNESS_HEALTH",
      label: "How active are you most weeks?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Mostly sitting / not active", value: "sedentary" },
        { label: "A little active", value: "light" },
        { label: "Quite active", value: "moderate" },
        { label: "Very active", value: "high" }
      ])
    },
    {
      id: "trainingPlace",
      category: "FITNESS_HEALTH",
      label: "Where do you train?",
      type: "pill",
      required: true,
      options: [
        { label: "At home", value: "home" },
        { label: "At the gym", value: "gym" },
        { label: "Both", value: "both" }
      ]
    },
    {
      id: "daysPerWeek",
      category: "FITNESS_HEALTH",
      label: "How many days per week can you train?",
      type: "slider",
      min: 1,
      max: 7,
      step: 1,
      suffix: "days",
      required: true
    },
    {
      id: "nutritionStyle",
      category: "FITNESS_HEALTH",
      label: "What eating style suits you best?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Balanced meals", value: "balanced" },
        { label: "High protein", value: "high_protein" },
        { label: "Plant-based", value: "plant_based" },
        { label: "Low carb", value: "low_carb" },
        { label: "I do not have a set style", value: "no_style" }
      ])
    },
    {
      id: "preferredCuisine",
      category: "FITNESS_HEALTH",
      label: "What foods do you prefer most?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      options: withOther([
        { label: "Simple home meals", value: "home_meals" },
        { label: "Asian food", value: "asian" },
        { label: "Mediterranean food", value: "mediterranean" },
        { label: "High protein meals", value: "high_protein_meals" },
        { label: "Quick meals / meal prep", value: "meal_prep" }
      ])
    },
    {
      id: "muscleGainFocus",
      category: "FITNESS_HEALTH",
      label: "What matters most with muscle gain?",
      type: "radio",
      required: true,
      visibleIf: [{ field: "mainGoal", equals: "muscle_gain" }],
      options: withOther([
        { label: "Get bigger overall", value: "get_bigger" },
        { label: "Build lean muscle", value: "lean_muscle" },
        { label: "Get stronger", value: "get_stronger" },
        { label: "Improve my training plan", value: "training_plan" }
      ])
    },
    {
      id: "weightLossBarrier",
      category: "FITNESS_HEALTH",
      label: "What makes weight loss hard for you?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      visibleIf: [{ field: "mainGoal", equals: "weight_loss" }],
      options: withOther([
        { label: "Staying consistent", value: "consistency" },
        { label: "Food choices", value: "food_choices" },
        { label: "Time", value: "time" },
        { label: "Motivation", value: "motivation" },
        { label: "Not sure what to do", value: "not_sure" }
      ])
    },
    {
      id: "biggestChallenge",
      category: "FITNESS_HEALTH",
      label: "What is your biggest struggle right now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "I start but do not stay consistent", value: "inconsistent" },
        { label: "I do not know the best workout plan", value: "workout_plan" },
        { label: "Food is the hard part", value: "food_hard" },
        { label: "I do not have enough time", value: "not_enough_time" },
        { label: "I need more structure", value: "need_structure" }
      ])
    },
    {
      id: "injuriesLimitations",
      category: "FITNESS_HEALTH",
      label: "Do you have any injuries or physical limits we should know about?",
      type: "radio",
      required: true,
      options: [
        { label: "No", value: "none" },
        { label: "Yes - minor", value: "minor" },
        { label: "Yes - important to work around", value: "important" },
        { label: "Other", value: "other" }
      ]
    },
    {
      id: "injuriesNotes",
      category: "FITNESS_HEALTH",
      label: "Please tell us a little more",
      type: "textarea",
      required: true,
      visibleIf: [{ field: "injuriesLimitations", equals: ["minor", "important", "other"] }],
      placeholder: "Add the details we should work around"
    },
    {
      id: "timeline",
      category: "FITNESS_HEALTH",
      label: "When do you want to see progress?",
      type: "pill",
      required: true,
      options: [
        { label: "4 weeks", value: "4_weeks" },
        { label: "8 weeks", value: "8_weeks" },
        { label: "12 weeks", value: "12_weeks" },
        { label: "Long-term", value: "long_term" }
      ]
    },
    {
      id: "personalNotes",
      category: "FITNESS_HEALTH",
      label: "Anything else you want us to include?",
      type: "textarea",
      placeholder: "Optional"
    }
  ],
  BUSINESS_CAREER: [
    {
      id: "fullName",
      category: "BUSINESS_CAREER",
      label: "What is your full name?",
      type: "text",
      required: true,
      placeholder: "Full name"
    },
    {
      id: "email",
      category: "BUSINESS_CAREER",
      label: "What email should we send your PDF to?",
      type: "text",
      required: true,
      placeholder: "name@example.com"
    },
    {
      id: "country",
      category: "BUSINESS_CAREER",
      label: "Which country are you based in?",
      type: "select",
      required: true,
      options: countryOptions
    },
    {
      id: "currentStage",
      category: "BUSINESS_CAREER",
      label: "Where are you right now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Just exploring ideas", value: "exploring" },
        { label: "Starting from zero", value: "starting_zero" },
        { label: "Already working on it", value: "already_active" },
        { label: "Established but want better growth", value: "established_growth" }
      ])
    },
    {
      id: "mainGoal",
      category: "BUSINESS_CAREER",
      label: "What do you want help with most?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Start a business", value: "start_business" },
        { label: "Grow my business", value: "grow_business" },
        { label: "Switch career", value: "career_switch" },
        { label: "Get more clients", value: "more_clients" },
        { label: "Increase income", value: "increase_income" },
        { label: "Improve my positioning", value: "improve_positioning" }
      ])
    },
    {
      id: "businessType",
      category: "BUSINESS_CAREER",
      label: "What kind of business or career path is this?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Service business", value: "service_business" },
        { label: "Product business", value: "product_business" },
        { label: "Freelance / self-employed", value: "freelance" },
        { label: "Corporate / employed role", value: "employed_role" },
        { label: "Creative business", value: "creative_business" }
      ])
    },
    {
      id: "businessTypeOther",
      category: "BUSINESS_CAREER",
      label: "Tell us what type it is",
      type: "text",
      required: true,
      visibleIf: [{ field: "businessType", equals: "other" }],
      placeholder: "For example: recruitment, design, trades, coaching"
    },
    {
      id: "budgetLevel",
      category: "BUSINESS_CAREER",
      label: "What budget level feels right for you?",
      type: "pill",
      required: true,
      options: [
        { label: "Low budget", value: "low" },
        { label: "Medium budget", value: "medium" },
        { label: "Ready to invest", value: "high" }
      ]
    },
    {
      id: "startingPoint",
      category: "BUSINESS_CAREER",
      label: "Which one is true?",
      type: "pill",
      required: true,
      options: [
        { label: "I am starting from zero", value: "zero" },
        { label: "I already have something running", value: "active" }
      ]
    },
    {
      id: "startupFocus",
      category: "BUSINESS_CAREER",
      label: "If you are starting, where do you need the most help?",
      type: "radio",
      required: true,
      visibleIf: [{ field: "mainGoal", equals: "start_business" }],
      options: withOther([
        { label: "Choosing the right offer", value: "offer" },
        { label: "Finding first clients", value: "first_clients" },
        { label: "Turning my skill into a business", value: "skill_to_business" },
        { label: "Knowing where to start", value: "where_to_start" }
      ])
    },
    {
      id: "growthFocus",
      category: "BUSINESS_CAREER",
      label: "If growth matters most, where do you want help?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      visibleIf: [{ field: "mainGoal", equals: ["grow_business", "more_clients", "increase_income", "improve_positioning"] }],
      options: withOther([
        { label: "Getting leads", value: "getting_leads" },
        { label: "Improving offer and pricing", value: "offer_pricing" },
        { label: "Better positioning", value: "positioning" },
        { label: "Better systems and focus", value: "systems_focus" },
        { label: "Personal brand or visibility", value: "visibility" }
      ])
    },
    {
      id: "existingStrengths",
      category: "BUSINESS_CAREER",
      label: "What strengths do you already have?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      options: withOther([
        { label: "Sales", value: "sales" },
        { label: "Marketing", value: "marketing" },
        { label: "Delivery / service quality", value: "delivery" },
        { label: "Operations / organisation", value: "operations" },
        { label: "Industry knowledge", value: "industry_knowledge" }
      ])
    },
    {
      id: "marketPreference",
      category: "BUSINESS_CAREER",
      label: "Do you want online work, local work, or both?",
      type: "pill",
      required: true,
      options: [
        { label: "Online", value: "online" },
        { label: "Local", value: "local" },
        { label: "Both", value: "both" }
      ]
    },
    {
      id: "speed",
      category: "BUSINESS_CAREER",
      label: "How fast do you want to move?",
      type: "pill",
      required: true,
      options: [
        { label: "Steady", value: "steady" },
        { label: "Fast", value: "fast" },
        { label: "Very fast", value: "very_fast" }
      ]
    },
    {
      id: "biggestChallenge",
      category: "BUSINESS_CAREER",
      label: "What is your biggest challenge right now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "I need more clients", value: "need_clients" },
        { label: "My offer is not clear enough", value: "offer_not_clear" },
        { label: "I need more confidence or direction", value: "need_confidence" },
        { label: "I feel busy but not focused", value: "busy_not_focused" },
        { label: "I need a better growth plan", value: "need_growth_plan" }
      ])
    },
    {
      id: "challengeOther",
      category: "BUSINESS_CAREER",
      label: "Tell us your challenge in your own words",
      type: "textarea",
      required: true,
      visibleIf: [{ field: "biggestChallenge", equals: "other" }],
      placeholder: "Add more detail"
    },
    {
      id: "personalNotes",
      category: "BUSINESS_CAREER",
      label: "Anything else you want us to know?",
      type: "textarea",
      placeholder: "Optional"
    }
  ],
  SOCIAL_GROWTH: [
    {
      id: "fullName",
      category: "SOCIAL_GROWTH",
      label: "What is your full name?",
      type: "text",
      required: true,
      placeholder: "Full name"
    },
    {
      id: "email",
      category: "SOCIAL_GROWTH",
      label: "What email should we send your PDF to?",
      type: "text",
      required: true,
      placeholder: "name@example.com"
    },
    {
      id: "country",
      category: "SOCIAL_GROWTH",
      label: "Which country are you based in?",
      type: "select",
      required: true,
      options: countryOptions
    },
    {
      id: "mainPlatform",
      category: "SOCIAL_GROWTH",
      label: "Which platform matters most to you now?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Instagram", value: "instagram" },
        { label: "TikTok", value: "tiktok" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "YouTube", value: "youtube" },
        { label: "X / Twitter", value: "x" }
      ])
    },
    {
      id: "mainGoal",
      category: "SOCIAL_GROWTH",
      label: "What do you want help with most?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Grow Instagram", value: "instagram_growth" },
        { label: "Build a personal brand", value: "personal_brand" },
        { label: "Get more engagement", value: "engagement" },
        { label: "Build an audience", value: "build_audience" },
        { label: "Improve content strategy", value: "content_strategy" },
        { label: "Get leads from content", value: "lead_generation" }
      ])
    },
    {
      id: "followerRange",
      category: "SOCIAL_GROWTH",
      label: "What is your follower range now?",
      type: "pill",
      required: true,
      options: [
        { label: "0-1k", value: "0_1k" },
        { label: "1k-5k", value: "1k_5k" },
        { label: "5k-20k", value: "5k_20k" },
        { label: "20k+", value: "20k_plus" }
      ]
    },
    {
      id: "niche",
      category: "SOCIAL_GROWTH",
      label: "What niche are you in?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Business / marketing", value: "business_marketing" },
        { label: "Fitness / health", value: "fitness_health" },
        { label: "Lifestyle", value: "lifestyle" },
        { label: "Construction / trades", value: "construction_trades" },
        { label: "Finance", value: "finance" },
        { label: "Beauty / fashion", value: "beauty_fashion" }
      ])
    },
    {
      id: "nicheOther",
      category: "SOCIAL_GROWTH",
      label: "Tell us your niche",
      type: "text",
      required: true,
      visibleIf: [{ field: "niche", equals: "other" }],
      placeholder: "Write your niche here"
    },
    {
      id: "postingNow",
      category: "SOCIAL_GROWTH",
      label: "Are you already posting regularly?",
      type: "toggle",
      required: true
    },
    {
      id: "instagramFocus",
      category: "SOCIAL_GROWTH",
      label: "If Instagram growth matters most, where do you want help first?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      visibleIf: [{ field: "mainGoal", equals: "instagram_growth" }],
      options: withOther([
        { label: "Better content ideas", value: "content_ideas" },
        { label: "Hooks and reach", value: "hooks_reach" },
        { label: "Profile clarity", value: "profile_clarity" },
        { label: "Engagement", value: "engagement_focus" },
        { label: "Turning views into leads", value: "views_to_leads" }
      ])
    },
    {
      id: "growthChallenge",
      category: "SOCIAL_GROWTH",
      label: "What is your biggest growth challenge?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Low reach", value: "low_reach" },
        { label: "Not sure what to post", value: "not_sure_what_to_post" },
        { label: "Low engagement", value: "low_engagement" },
        { label: "No clear content plan", value: "no_plan" },
        { label: "Not turning content into business", value: "not_converting" }
      ])
    },
    {
      id: "contentStyle",
      category: "SOCIAL_GROWTH",
      label: "What kind of content feels best for you?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      options: withOther([
        { label: "Educational", value: "educational" },
        { label: "Storytelling", value: "storytelling" },
        { label: "Direct to camera", value: "direct_camera" },
        { label: "Short tips / quick wins", value: "short_tips" },
        { label: "Behind the scenes", value: "behind_scenes" }
      ])
    },
    {
      id: "buildFor",
      category: "SOCIAL_GROWTH",
      label: "What are you building towards?",
      type: "pill",
      required: true,
      options: [
        { label: "Brand", value: "brand" },
        { label: "Sales", value: "sales" },
        { label: "Influence", value: "influence" }
      ]
    },
    {
      id: "postsPerWeek",
      category: "SOCIAL_GROWTH",
      label: "How many posts per week can you do?",
      type: "slider",
      min: 1,
      max: 14,
      step: 1,
      suffix: "posts",
      required: true
    },
    {
      id: "personalNotes",
      category: "SOCIAL_GROWTH",
      label: "Anything else you want us to know?",
      type: "textarea",
      placeholder: "Optional"
    }
  ],
  CONSTRUCTION_GROWTH: [
    {
      id: "fullName",
      category: "CONSTRUCTION_GROWTH",
      label: "What is your full name?",
      type: "text",
      required: true,
      placeholder: "Full name"
    },
    {
      id: "email",
      category: "CONSTRUCTION_GROWTH",
      label: "What email should we send your PDF to?",
      type: "text",
      required: true,
      placeholder: "name@example.com"
    },
    {
      id: "country",
      category: "CONSTRUCTION_GROWTH",
      label: "Which country are you based in?",
      type: "select",
      required: true,
      options: countryOptions
    },
    {
      id: "tradeServices",
      category: "CONSTRUCTION_GROWTH",
      label: "What work do you do?",
      helper: "Choose all that apply.",
      type: "multi",
      required: true,
      maxSelections: 6,
      options: withOther([
        { label: "Extensions", value: "extensions" },
        { label: "Loft conversions", value: "loft_conversions" },
        { label: "Full house renovation", value: "full_house_renovation" },
        { label: "Kitchen fitting", value: "kitchen_fitting" },
        { label: "Bathroom fitting", value: "bathroom_fitting" },
        { label: "Roofing", value: "roofing" },
        { label: "Brickwork", value: "brickwork" },
        { label: "Plastering", value: "plastering" },
        { label: "Flooring", value: "flooring" },
        { label: "Electrical", value: "electrical" },
        { label: "Plumbing & heating", value: "plumbing_heating" },
        { label: "Landscaping", value: "landscaping" },
        { label: "Windows & doors", value: "windows_doors" },
        { label: "Painting & decorating", value: "painting_decorating" }
      ])
    },
    {
      id: "tradeServicesOther",
      category: "CONSTRUCTION_GROWTH",
      label: "What other work do you do?",
      type: "text",
      required: true,
      visibleIf: [{ field: "tradeServices", equals: "other" }],
      placeholder: "Add your other service"
    },
    {
      id: "teamModel",
      category: "CONSTRUCTION_GROWTH",
      label: "How is your business set up?",
      type: "pill",
      required: true,
      options: [
        { label: "Solo", value: "solo" },
        { label: "Small team", value: "small_team" },
        { label: "Larger team", value: "larger_team" }
      ]
    },
    {
      id: "serviceAreas",
      category: "CONSTRUCTION_GROWTH",
      label: "Which areas do you cover?",
      helper: "Choose the closest matches, then add towns or postcodes if needed.",
      type: "multi",
      required: true,
      maxSelections: 5,
      options: withOther([
        { label: "London", value: "london" },
        { label: "Surrey", value: "surrey" },
        { label: "Kent", value: "kent" },
        { label: "Essex", value: "essex" },
        { label: "Hertfordshire", value: "hertfordshire" },
        { label: "Manchester", value: "manchester" },
        { label: "Birmingham", value: "birmingham" },
        { label: "Leeds", value: "leeds" },
        { label: "Liverpool", value: "liverpool" },
        { label: "Bristol", value: "bristol" }
      ])
    },
    {
      id: "serviceAreasDetails",
      category: "CONSTRUCTION_GROWTH",
      label: "Tell us the towns, areas, or postcodes you want to cover",
      type: "textarea",
      required: true,
      visibleIf: [{ field: "serviceAreas", equals: "other" }],
      placeholder: "Example: Bromley, Croydon, Orpington, BR1, BR2"
    },
    {
      id: "mainGoal",
      category: "CONSTRUCTION_GROWTH",
      label: "What do you want help with most?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Get more leads", value: "more_leads" },
        { label: "Improve local visibility", value: "local_visibility" },
        { label: "Win better clients", value: "better_clients" },
        { label: "Build a stronger company brand", value: "brand_building" },
        { label: "Improve my quoting system", value: "quoting" },
        { label: "Increase monthly revenue", value: "increase_revenue" }
      ])
    },
    {
      id: "currentLeadSources",
      category: "CONSTRUCTION_GROWTH",
      label: "Where do your leads come from now?",
      helper: "Choose up to 4.",
      type: "multi",
      required: true,
      maxSelections: 4,
      options: withOther([
        { label: "Referrals", value: "referrals" },
        { label: "Google / search", value: "google" },
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "Checkatrade / lead sites", value: "lead_sites" },
        { label: "Repeat customers", value: "repeat_customers" }
      ])
    },
    {
      id: "leadFocus",
      category: "CONSTRUCTION_GROWTH",
      label: "If you want more leads, where do you want help first?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      visibleIf: [{ field: "mainGoal", equals: "more_leads" }],
      options: withOther([
        { label: "Google and local search", value: "google_local" },
        { label: "Referrals", value: "referrals" },
        { label: "Website trust", value: "website_trust" },
        { label: "Social media", value: "social_media" },
        { label: "Better follow-up and conversion", value: "follow_up" }
      ])
    },
    {
      id: "marketingChannels",
      category: "CONSTRUCTION_GROWTH",
      label: "Which channels do you use now?",
      helper: "Choose all that apply.",
      type: "multi",
      required: true,
      maxSelections: 5,
      options: withOther([
        { label: "Google Business Profile", value: "google_business" },
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "Referral network", value: "referral_network" },
        { label: "Website", value: "website" },
        { label: "Lead websites", value: "lead_websites" }
      ])
    },
    {
      id: "clientType",
      category: "CONSTRUCTION_GROWTH",
      label: "What kind of clients do you want more of?",
      type: "pill",
      required: true,
      options: [
        { label: "Domestic", value: "domestic" },
        { label: "Commercial", value: "commercial" },
        { label: "Both", value: "both" }
      ]
    },
    {
      id: "revenueRange",
      category: "CONSTRUCTION_GROWTH",
      label: "What is your monthly revenue range now?",
      type: "select",
      required: true,
      options: withOther([
        { label: "Under £10k", value: "under_10k" },
        { label: "£10k-£25k", value: "10_25k" },
        { label: "£25k-£50k", value: "25_50k" },
        { label: "£50k+", value: "50k_plus" }
      ])
    },
    {
      id: "biggestChallenge",
      category: "CONSTRUCTION_GROWTH",
      label: "What is the biggest thing holding growth back?",
      type: "radio",
      required: true,
      options: withOther([
        { label: "Not enough leads", value: "not_enough_leads" },
        { label: "Wrong type of leads", value: "wrong_leads" },
        { label: "Low visibility in my area", value: "low_visibility" },
        { label: "Quotes are not converting enough", value: "quotes_not_converting" },
        { label: "No clear growth system", value: "no_growth_system" }
      ])
    },
    {
      id: "successVision",
      category: "CONSTRUCTION_GROWTH",
      label: "What would a good result look like in the next 3-6 months?",
      helper: "Choose up to 3.",
      type: "multi",
      required: true,
      maxSelections: 3,
      options: withOther([
        { label: "More booked jobs", value: "more_booked_jobs" },
        { label: "Better quality clients", value: "better_quality_clients" },
        { label: "Higher monthly revenue", value: "higher_revenue" },
        { label: "Better local reputation", value: "better_reputation" },
        { label: "Stronger quoting process", value: "stronger_quoting" }
      ])
    },
    {
      id: "personalNotes",
      category: "CONSTRUCTION_GROWTH",
      label: "Anything else you want us to know?",
      type: "textarea",
      placeholder: "Optional"
    }
  ]
};

export function getQuestionsForCategory(category: CategoryValue) {
  return baseQuestions[category];
}

function matchesConditionValue(currentValue: QuestionnaireValues[string], accepted: string[]) {
  if (Array.isArray(currentValue)) {
    return currentValue.some((item) => accepted.includes(String(item)));
  }

  return accepted.includes(String(currentValue ?? ""));
}

export function evaluateConditions(
  conditions: QuestionCondition[] | undefined,
  values: QuestionnaireValues
) {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  return conditions.every((condition) => {
    const currentValue = values[condition.field];

    if (condition.equals !== undefined) {
      const accepted = Array.isArray(condition.equals) ? condition.equals : [condition.equals];
      return matchesConditionValue(currentValue, accepted);
    }

    if (condition.notEquals !== undefined) {
      const rejected = Array.isArray(condition.notEquals) ? condition.notEquals : [condition.notEquals];
      return !matchesConditionValue(currentValue, rejected);
    }

    return true;
  });
}

export function getVisibleQuestions(category: CategoryValue, values: QuestionnaireValues) {
  return getQuestionsForCategory(category).filter((question) => evaluateConditions(question.visibleIf, values));
}

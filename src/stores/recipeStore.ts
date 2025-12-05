// ===========================================
// Recipe Store - Zustand
// ===========================================

import { create } from 'zustand';
import type { Recipe, RecipeStep } from '../types';
import { mockRecipes } from '../data/mockData';

interface RecipeState {
    recipes: Recipe[];

    // Actions
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (id: string, updates: Partial<Recipe>) => void;
    deleteRecipe: (id: string) => void;
    addStepToRecipe: (recipeId: string, step: RecipeStep) => void;
    updateStep: (recipeId: string, stepId: string, updates: Partial<RecipeStep>) => void;
    removeStepFromRecipe: (recipeId: string, stepId: string) => void;

    // Getters
    getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
    recipes: mockRecipes,

    addRecipe: (recipe) =>
        set((state) => ({ recipes: [...state.recipes, recipe] })),

    updateRecipe: (id, updates) =>
        set((state) => ({
            recipes: state.recipes.map((r) =>
                r.id === id ? { ...r, ...updates } : r
            ),
        })),

    deleteRecipe: (id) =>
        set((state) => ({
            recipes: state.recipes.filter((r) => r.id !== id),
        })),

    addStepToRecipe: (recipeId, step) =>
        set((state) => ({
            recipes: state.recipes.map((r) =>
                r.id === recipeId
                    ? { ...r, steps: [...r.steps, step].sort((a, b) => a.order - b.order) }
                    : r
            ),
        })),

    updateStep: (recipeId, stepId, updates) =>
        set((state) => ({
            recipes: state.recipes.map((r) =>
                r.id === recipeId
                    ? {
                        ...r,
                        steps: r.steps.map((s) =>
                            s.id === stepId ? { ...s, ...updates } : s
                        ),
                    }
                    : r
            ),
        })),

    removeStepFromRecipe: (recipeId, stepId) =>
        set((state) => ({
            recipes: state.recipes.map((r) =>
                r.id === recipeId
                    ? { ...r, steps: r.steps.filter((s) => s.id !== stepId) }
                    : r
            ),
        })),

    getRecipeById: (id) => get().recipes.find((r) => r.id === id),
}));

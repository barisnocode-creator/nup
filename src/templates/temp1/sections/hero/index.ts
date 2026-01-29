import { HeroSplit } from './HeroSplit';
import { HeroOverlay } from './HeroOverlay';
import { HeroCentered } from './HeroCentered';
import { HeroGradient } from './HeroGradient';
import type { HeroVariant, HeroProps } from './types';
import { ComponentType } from 'react';

export const heroVariants: Record<HeroVariant, ComponentType<HeroProps>> = {
  split: HeroSplit,
  overlay: HeroOverlay,
  centered: HeroCentered,
  gradient: HeroGradient,
};

export function getHeroComponent(variant: HeroVariant): ComponentType<HeroProps> {
  return heroVariants[variant] || heroVariants.split;
}

export type { HeroVariant, HeroProps };
export { HeroSplit, HeroOverlay, HeroCentered, HeroGradient };

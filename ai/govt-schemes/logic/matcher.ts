import schemes from '../data/schemes.json';
import { Profile } from './profile';

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: string;
    location?: string[];
    educationLevel?: string[];
    incomeLevel?: number;
    [key: string]: any;
  };
}

export function matchSchemes(profile: Profile): Scheme[] {
  return schemes.filter((scheme: Scheme): boolean => {
    const e = scheme.eligibility;

    if (e.minAge !== undefined && (profile.age == null || profile.age < e.minAge)) {
      return false;
    }
    if (e.maxAge !== undefined && (profile.age == null || profile.age > e.maxAge)) {
      return false;
    }
    if (e.gender !== undefined) {
      if (profile.gender == null || e.gender.toLowerCase() !== profile.gender.toLowerCase()) {
        return false;
      }
    }
    if (e.location !== undefined) {
      if (profile.location == null || !e.location.includes(profile.location)) {
        return false;
      }
    }
    if (e.educationLevel !== undefined) {
      if (profile.educationLevel == null || !e.educationLevel.includes(profile.educationLevel)) {
        return false;
      }
    }
    if (e.incomeLevel !== undefined) {
      if (profile.incomeLevel == null || profile.incomeLevel > e.incomeLevel) {
        return false;
      }
    }
    return true;
  });
}

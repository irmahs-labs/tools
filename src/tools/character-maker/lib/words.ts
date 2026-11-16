import type { Language } from "../../../lib/language";

/** One line in each of the site's languages: the English SRD's and the French SRD's. */
export type Words = Record<Language, string>;

export const w = (en: string, fr: string): Words => ({ en, fr });

/**
 * A distance in each language: the English SRD counts in feet, the French
 * one in metres, at 1.5 m to 5 feet ("30 feet", "9 m", "4,50 m").
 */
export const distance = (feet: number): Words => {
  const metres = (feet * 3) / 10;

  return {
    en: `${feet} feet`,
    fr: `${Number.isInteger(metres) ? metres : metres.toFixed(2).replace(".", ",")} m`,
  };
};

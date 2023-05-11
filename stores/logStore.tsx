import { produce } from "immer";
import { create } from "zustand";
import {
  regexDealDamage,
  regexHealYourself,
  regexGainExperience,
  regexLoot,
  regexLoseHitpoint
} from "../utils/regex";

export type Error = {
  name: string;
  body: string;
};

type LogStore = {
  logInformation: {
    hitpointsHealed: number;
    damageTaken: {
      total: number;
      byCreatureKind: Map<string, number>;
    };
    experienceGained: number;
    loot: {
      [key: string]: number;
    };
  };
  analyzeLog: (log: string[]) => void | Error;
  // blackKnightHealthRange: () => number;
  unknownDamageCalc: () => number;
};

export const useLogStore = create<LogStore>()((set) => ({
  logInformation: {
    hitpointsHealed: 0,
    damageTaken: { total: 0, byCreatureKind: new Map<string, number>() },
    experienceGained: 0,
    loot: {}
  },
  analyzeLog: (log) => {
    if (log.length < 1) return { name: "Empty Log", body: "Log is Empty!" };

    return set((state) =>
      produce(state, (draft) => {
        //Resets Values
        draft.logInformation = {
          hitpointsHealed: 0,
          damageTaken: { total: 0, byCreatureKind: new Map<string, number>() },
          experienceGained: 0,
          loot: {}
        };

        //Go through Log but being able to use continue/break (map does not allow it)
        for (let i = 0; i < log.length; i++) {
          const logLine = log[i];
          let match;

          //HealYourself Line
          match = logLine.match(regexHealYourself);
          if (match) {
            const healAmount = parseInt(match[1]);
            draft.logInformation.hitpointsHealed += healAmount;
            continue;
          }

          //Experience Line
          match = logLine.match(regexGainExperience);
          if (match) {
            const experienceAmount = parseInt(match[1]);
            draft.logInformation.experienceGained += experienceAmount;
            continue;
          }

          //Damage Taken
          match = logLine.match(regexLoseHitpoint);
          if (match) {
            const damageAmount = parseInt(match[1]);
            const creatureKind = match[2];
            draft.logInformation.damageTaken.total += damageAmount;

            //If creatureKind exists, add damageAmount to it, if not, create and add damageAmount
            if (creatureKind) {
              draft.logInformation.damageTaken.byCreatureKind.set(
                creatureKind,
                damageAmount +
                  (draft.logInformation.damageTaken.byCreatureKind.get(
                    creatureKind
                  ) || 0)
              );
            }
            continue;
          }
        }
      })
    );
  },
  unknownDamageCalc: () => 3
}));

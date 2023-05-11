import { produce } from "immer";
import { create } from "zustand";
import {
  regexHealYourself,
  regexGainExperience,
  regexLootCreature,
  regexLootItems,
  regexLoseHitpoint
} from "../utils/regex";
var pluralize = require("pluralize");

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
    loot: Map<string, number>;
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
    loot: new Map<string, number>()
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
          loot: new Map<string, number>()
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

          //Damage Taken Line
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

          //Loot Line
          match = logLine.match(regexLootCreature);
          if (match) {
            const creature = match[1]; //Only necessary if needed to separate loot by creatureKind
            const itemString = match[2];

            //Item String Section
            while ((match = regexLootItems.exec(itemString)) !== null) {
              // Avoid infinite loops with zero-width matches
              if (match.index === regexLootItems.lastIndex) {
                regexLootItems.lastIndex++;
              }

              let amount = parseInt(match[1]);
              let name = pluralize(match[2], 1);

              //Handles values like "a", "an" or no article for item values
              if (Number.isNaN(amount)) {
                amount = 1;
              }

              if (name === "nothing") continue;

              //If Item exists, add ammount to it, if not, create and add amount
              draft.logInformation.loot.set(
                name,
                amount + (draft.logInformation.loot.get(name) || 0)
              );
            }
          }
        }
      })
    );
  },
  unknownDamageCalc: () => 3
}));

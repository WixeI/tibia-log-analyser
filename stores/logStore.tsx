import { produce } from "immer";
import { create } from "zustand";
import {
  regexHealYourself,
  regexGainExperience,
  regexLootCreature,
  regexLootItems,
  regexLoseHitpoint,
  regexDealDamage
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
  blackKnightHealth: number | string;
  analyzeLog: (log: string[]) => void | Error;
  unknownDamageCalc: () => number;
  blackKightHealthCalc: (log: string[]) => void | Error;
};

export const useLogStore = create<LogStore>()((set, get) => ({
  logInformation: {
    hitpointsHealed: 0,
    damageTaken: { total: 0, byCreatureKind: new Map<string, number>() },
    experienceGained: 0,
    loot: new Map<string, number>()
  },
  blackKnightHealth: "Insuficient Data",
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
  unknownDamageCalc: () => {
    const total = get().logInformation.damageTaken.total;
    let totalFromKnownSources = 0;
    get().logInformation.damageTaken.byCreatureKind.forEach((value) => {
      totalFromKnownSources += value;
    });
    return total - totalFromKnownSources;
  },
  blackKightHealthCalc: (log) => {
    if (log.length < 1) return { name: "Empty Log", body: "Log is Empty!" };
    let blackKnightHealth = 0;
    //Go through Log but being able to use continue/break (map does not allow it)
    for (let i = 0; i < log.length; i++) {
      const logLine = log[i];
      let match;

      //Creature Damage Received Line
      match = logLine.match(regexDealDamage);

      if (match) {
        const creature = match[1];

        const damageReceived = parseInt(match[2]);

        if (creature === "Black Knight") {
          blackKnightHealth += damageReceived;
        }
      }

      //Creature Loot Line
      match = logLine.match(regexLootCreature);
      if (match && match[1] === "Black Knight") {
        set(() => ({ blackKnightHealth: blackKnightHealth }));
        return;
      }
    }
    set(() => ({ blackKnightHealth: "Insuficient Data" }));
    return {
      name: "Insuficient Data",
      body: "You didn't defeat a Black Knight, therefore no health amount can be estimated"
    };
  }
}));

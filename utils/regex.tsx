/**
 * match[1]: healAmount
 */
export const regexHealYourself = /You healed yourself for (\d+)/;

/**
 * match[1]: damageAmount
 *
 * match[2]: creatureKind
 *
 * Unknown sources return match[2] as undefined
 */
export const regexLoseHitpoint =
  /You lose (\d+) hitpoints?(?: due to an attack by (?:a|an) ([^.]*))?\.?/;

/**
 * match[1]: experienceAmount
 */
export const regexGainExperience = /You gained (\d+) experience points\./;

/**
 * match[1]: monsterName
 * match[2]: damageAmount
 */
export const regexDealDamage =
  /^(?:A|An)\s+(.+)\s+loses\s+(\d+)\s+hitpoints\s+due\s+to\s+your\s+attack\.$/i;

/**
 * match[1]: 
 */
export const regexLoot = / /;

//regexHealYourself Example
// const match = "You healed yourself for 328 hitpoints.".match(regexHealYourself);
// if (match) {
//   const healAmount = match[1]; // extract the first captured group
//   console.log(`You healed yourself for ${healAmount} hitpoints!`);
// } else {
//   console.log("No heal detected.");
// }

//regexLoseHitpoint Example
// const str = "You lose 31 hitpoints due to an attack by a Cyclops Smith.";
// const regex =
//   /You lose (\d+) hitpoints(?: due to an attack by (?:a|an) ([^.]*))?\.?/;
// const match = str.match(regex);
// if (match) {
//   const damageAmount = match[1]; // extract the first captured group
//   const attacker = match[2]; // extract the second captured group
//   console.log(`Damage: ${damageAmount}. Attacker: ${attacker}.`);
// } else {
//   console.log("No damage detected.");
// }

//regexGainExperience Example
// const text = "You gained 50 experience points.";
// const regex = /You gained (\d+) experience points\./;
// const match = text.match(regex);
// if (match) {
//   const xp = parseInt(match[1], 10);
//   console.log(xp);
// }

// regexDealDamage Example
// const text =
// "A Blue Eyes White Dragon loses 50 hitpoints due to your attack.";
// const regex =
// /^(?:A|An)\s+(.+)\s+loses\s+(\d+)\s+hitpoints\s+due\s+to\s+your\s+attack\.$/i;
// const match = text.match(regex);
// if (match) {
// const monster = match[1];
// const number = match[2];

// console.log(`Monster: ${monster}`);
// console.log(`Number: ${number}`);
// }

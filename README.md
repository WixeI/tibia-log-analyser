## About

This project shows you processed data based on the Tibia server logs you upload.

## See it live

https://tibia-log-analyser.vercel.app/

## Demonstration

![demonstration-gif](./demonstration.gif)

## This project used:

- RegEx to interpret the logs
- Zustand + Immer to handle state management
- Tailwind to handle styles
- Pluralize to handle noun flexions
- Maps to better handle data iteration
- TypeScript, because duh

## You Should Know When Analysing the Code:

- The organization could be better, and will be fixed in later updates
- No reusable components were created due to the lack of necessity. Since the project is only one page long and most of the sections are unique, creating components out of them would just be overengineering.
- If you don't want to see Tailwind styles while browsing .tsx, just fold the classNames
- Use VSCode fold whenever possible to get code clarity

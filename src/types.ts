export type Language = 'bn' | 'en';

export type ModuleId = 'module1' | 'module2' | 'module3';

export type MysteryModTool = 'none' | 'wax' | 'file';

export type MysteryGuess = 'plus' | 'minus' | null;

export interface MysteryState {
  knownF1: number;
  baseF2: number; // hidden true f2 before waxing/filing
  initialBeats: number; // |knownF1 - baseF2|
  waxMassGrams: number; // 0 to 5 g (each 1g decreases frequency by 1 Hz)
  filingAmount: number; // 0 to 5 units (each 1 unit increases frequency by 1 Hz)
  activeTool: MysteryModTool;
  challengeMode: boolean; // true = f2 hidden, false = practice mode (revealed)
  userGuess: MysteryGuess;
  revealed: boolean;
}

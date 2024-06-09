declare module 'mathsteps' {
    export interface Step {
      oldEquation: Equation;
      newEquation: Equation;
      changeType: string;
      substeps: Step[];
    }
  
    export interface Equation {
      leftNode: any;
      rightNode: any;
      comparator: string;
      asTex(): string;
      asAscii(): string;
    }
  
    export function simplifyExpression(expressionString: string): Step[];
    export function solveEquation(equationString: string): Step[];
  }
  
import { Enum } from "cc";
import { EAttribute } from "./EAttribute";

export enum EModifierOperation {
    Add,
    Multiply,
    Override
}
Enum(EModifierOperation);

export class Modifier {
    public attribute: EAttribute;
    public operation: EModifierOperation = EModifierOperation.Add;
    public value: number = 0;
    constructor(attribute: EAttribute, operation: EModifierOperation, value: number) {
        this.attribute = attribute;
        this.operation = operation;
        this.value = value;
    }
}
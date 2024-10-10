export interface TurtleDataType {
  id: number;
  turtleUuid: string;
  birth: string;
  dead: boolean;
  gender: string;
  imageAddress: string | null;
  name: string;
  scientificName: string;
  weight: number;
  motherName: string;
  fatherName: string;
  motherImageAddress?: string;
  fatherImageAddress?: string;
}

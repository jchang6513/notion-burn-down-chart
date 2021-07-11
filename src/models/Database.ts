export type PropertyType = 'text' | 'date' | 'number' | 'title' | 'checkbox';

export type Data = Record<string, {
  type: PropertyType;
  text?: string;
  date?: {
    start: string;
    end: string;
  };
  number?: number;
  title?: Array<{
    plain_text: string,
  }>;
  checkbox?: boolean;
}>

export type Database = {
  properties: string[];
  data: Data[];
};

export const convertToDatabase = (netDatabase: any): Database => {
  const properties = Object.keys(netDatabase.results?.[0].properties || {})
  const data = netDatabase.results.map((netData: any) => netData.properties);

  return {
    properties,
    data,
  }
}

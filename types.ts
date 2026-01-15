export interface Quote {
  text: string;
  source: string;
  year: string;
  isAI?: boolean;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}
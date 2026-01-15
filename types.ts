export interface Quote {
  text: string;
  author: string;
  source: string;
  year: string;
  isAI?: boolean;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}
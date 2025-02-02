export function decode(content: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'application/xml');

  return doc;
}

export function encode(doc: Document): string {
  const s = new XMLSerializer();

  return s.serializeToString(doc);
}

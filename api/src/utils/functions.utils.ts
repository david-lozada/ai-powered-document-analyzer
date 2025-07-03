export function toPgvectorString(embedding: number[]): string {
    return `[${embedding.join(', ')}]`;
}
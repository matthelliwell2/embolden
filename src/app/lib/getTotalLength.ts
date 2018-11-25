/**
 * Calculates the total length of an list of elements.
 */
export const getTotalLength = (elements: SVGPathElement[]): number => {
    return elements.reduce((total, element) => total + element.getTotalLength(), 0)
}

import { Intersection, Shape } from "../models"
import { getTotalLength } from "./getTotalLength"

export const calculateDistanceAlongPath = (shape: Shape, intersection: Intersection): number => {
    return (
        getTotalLength(shape.pathParts.slice(0, intersection.segmentNumber).map(part => part.segment)) +
        intersection.segmentTValue * shape.pathParts[intersection.segmentNumber].segment.getTotalLength()
    )
}

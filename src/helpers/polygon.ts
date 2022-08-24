import { regexPointBounds } from './regex'

interface Bounds {
  ne: string
  sw: string
}

const pointRegexRule = (point: string) => regexPointBounds.test(point)

export const isRequestBounds = (bounds: Bounds) =>
  bounds?.ne && bounds.sw && pointRegexRule(bounds.ne) && pointRegexRule(bounds.sw)

export const getPolygon = (bounds: Bounds) => {
  const { ne, sw } = bounds

  const boundsNE = ne.trimStart().trimEnd().split(/[, ]+/)
  const boundsSW = sw.trimStart().trimEnd().split(/[, ]+/)

  return `POLYGON((
    ${boundsNE[0]} ${boundsNE[1]},
    ${boundsNE[0]} ${boundsSW[1]},
    ${boundsSW[0]} ${boundsSW[1]},
    ${boundsSW[0]} ${boundsNE[1]},
    ${boundsNE[0]} ${boundsNE[1]}
  ))`
}

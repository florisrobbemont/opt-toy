import * as React from "react"
import { SetStateAction, Dispatch } from "react"
const isSSR = typeof window === "undefined"

interface ParsedQuery {
  [key: string]: string[]
}

function encodeAsQueryString(data: ParsedQuery): string {
  const params = []
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue
    if (!key) continue
    const value = data[key]
    if (!value) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null) continue
        params.push(
          `${encodeURIComponent(key) + "[]"}=${encodeURIComponent(item).replace(
            /%2F/g,
            "/",
          )}`,
        )
      }
    } else {
      params.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(
          /%2F/g,
          "/",
        )}`,
      )
    }
  }
  return `?${params.join("&")}`
}

function parseQueryString(query: string): ParsedQuery {
  return query
    .split("#")
    .reverse()[0]
    .split("?")
    .reverse()[0]
    .split("&")
    .reduce((data, param) => {
      const [key, value]: string[] = param
        .split("=")
        .map(it => decodeURIComponent(it))
      const simpleKey = key.replace("[]", "")
      data[simpleKey] = [...(data[simpleKey] || []), value].filter(Boolean)
      return data
    }, {})
}

function useLocationHash(
  // eslint-disable-next-line no-restricted-globals
  window: Window = isSSR ? null : top,
): [string, Dispatch<SetStateAction<string>>] {
  const [query, setQuery] = React.useState(
    isSSR ? "" : () => window.location.hash,
  )
  React.useEffect(() => {
    if (!isSSR) window.location.hash = query
  }, [query])
  return [query, setQuery]
}

function useQueryData(): [ParsedQuery, Dispatch<SetStateAction<ParsedQuery>>] {
  const [query, setQuery] = useLocationHash(isSSR ? null : window)
  const [queryData, setQueryData] = React.useState(() =>
    parseQueryString(query),
  )
  const encodedQuery = encodeAsQueryString(queryData)
  React.useEffect(() => setQuery(encodedQuery), [encodedQuery])
  return [
    queryData,
    newData => {
      if (!isSSR) setQueryData(parseQueryString(window.location.hash))
      setQueryData(newData)
    },
  ]
}

export function useQueryDataKey(
  dataKey: string,
  defaultValues: string[] = [],
): [string[], Dispatch<SetStateAction<string[]>>] {
  const [queryData, setQueryData] = useQueryData()
  return [
    queryData[dataKey] || defaultValues,
    newValue => {
      setQueryData(state => ({
        ...state,
        [dataKey]:
          typeof newValue === "function"
            ? newValue(state[dataKey] || defaultValues)
            : newValue,
      }))
    },
  ]
}

export function useQueryDataKeySingle(
  dataKey: string,
  defaultValue?: string,
): [string, (value: string) => void] {
  const [queryData, setQueryData] = useQueryData()
  return [
    (queryData[dataKey] || [defaultValue])[0] || defaultValue,
    newValue => {
      setQueryData(state => ({ ...state, [dataKey]: [newValue] }))
    },
  ]
}

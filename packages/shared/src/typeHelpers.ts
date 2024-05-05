/**
 * Dev-helper: expands object types one level deep
 *
 * @typeParam T - target object
 */
export type ExpandShallow<T> = T extends infer U
  ? { [K in keyof U]: U[K] }
  : never;

/**
 * Dev-helper: expands object types recursively
 * This basically is a "prettify" for a complex type,
 * it forces tsc to show all properties
 *
 * @typeParam T - target object
 */
export type Expand<T> = T extends object
  ? T extends infer U
    ? { [K in keyof U]: Expand<U[K]> }
    : never
  : T;

/**
 * Checks if two types are equal
 *
 * @typeParam T - a type
 * @typeParam U - a type
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * Checks if two types are ... not equal
 *
 * @typeParam T - a type
 * @typeParam U - a type
 */
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

/**
 * Checks if a string is all caps
 *
 * @typeParam T - target string
 */
export type IsAllCaps<T extends string> = Equal<T, Uppercase<T>>;

/**
 * Checks if a string is all lowercase
 *
 * @typeParam T - target string
 */
export type IsAllLowerCase<T extends string> = Equal<T, Lowercase<T>>;

/**
 * Resolves if a given type is truthy
 * Solution based on https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean
 *
 * @typeParam T - target type
 */
type ExcludesFalsy = <T>(x: T | false | undefined | null | 0 | "") => x is T;

/**
 * Excludes any falsy values from an array
 *
 * @param arr T[]
 * @returns same array but without falsy values
 */
export const excludeFalsy = <T>(
  arr: (T | false | undefined | null | 0 | "")[],
) => arr.filter(Boolean as unknown as ExcludesFalsy);

/**
 * A type union of all of the text-like html tags
 * This type is used for component props where we want only text-like tags
 */
export type TextTags =
  | "b"
  | "code"
  | "em"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "i"
  | "kbd"
  | "legend"
  | "mark"
  | "p"
  | "ruby"
  | "s"
  | "small"
  | "sup"
  | "sub"
  | "span"
  | "strong"
  | "u"
  | "wbr";

//
/**
 * A type union of all of the div-like html tags
 * This type is used for component props where we want only div-like tags with no special cases like SVGs
 */
export type DivLikeTags =
  | "a"
  | "abbr"
  | "address"
  | "area"
  | "article"
  | "aside"
  | "audio"
  | "b"
  | "base"
  | "bdi"
  | "bdo"
  | "big"
  | "blockquote"
  | "body"
  | "br"
  | "button"
  | "canvas"
  | "caption"
  | "cite"
  | "code"
  | "col"
  | "colgroup"
  | "data"
  | "datalist"
  | "dd"
  | "del"
  | "details"
  | "dfn"
  | "dialog"
  | "div"
  | "dl"
  | "dt"
  | "em"
  | "embed"
  | "fieldset"
  | "figcaption"
  | "figure"
  | "footer"
  | "form"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "head"
  | "header"
  | "hgroup"
  | "hr"
  | "html"
  | "i"
  | "iframe"
  | "img"
  | "input"
  | "ins"
  | "kbd"
  | "keygen"
  | "label"
  | "legend"
  | "li"
  | "link"
  | "main"
  | "map"
  | "mark"
  | "menu"
  | "menuitem"
  | "meta"
  | "meter"
  | "nav"
  | "noindex"
  | "noscript"
  | "object"
  | "ol"
  | "optgroup"
  | "option"
  | "output"
  | "p"
  | "param"
  | "picture"
  | "pre"
  | "progress"
  | "q"
  | "rp"
  | "rt"
  | "ruby"
  | "s"
  | "samp"
  | "slot"
  | "script"
  | "section"
  | "select"
  | "small"
  | "source"
  | "span"
  | "strong"
  | "style"
  | "sub"
  | "summary"
  | "sup"
  | "table"
  | "template"
  | "tbody"
  | "td"
  | "textarea"
  | "tfoot"
  | "th"
  | "thead"
  | "time"
  | "title"
  | "tr"
  | "track"
  | "u"
  | "ul"
  | "var"
  | "video"
  | "wbr"
  | "webview";

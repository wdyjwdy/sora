---
title: Regex
category: Tools
---

## Metacharacters

### Position

| Symbol | Means                        | Examples                    |
| ------ | ---------------------------- | --------------------------- |
| ^      | start of the line            | `^dis` *dis*miss, *dis*like |
| $      | end of the line              | `er$` oth*er*, lat*er*      |
| \b     | word boundary                | `\bcat\b` a _cat_           |
| (?=)   | lookahead (toward the right) |                             |
| (?<=)  | lookbehind (toward the left) |                             |
| (?!)   | negative lookahead           |                             |
| (?<!)  | negative lookbehind          |                             |

### Character

| Symbol     | Means                | Examples                   |
| ---------- | -------------------- | -------------------------- |
| []         | any character listed | `[abc]` a, b or c          |
|            |                      | `[0-9]` 0 through 9        |
|            |                      | `[-.+]` dash, dot, or plus |
|            |                      | `[^A-Z]` not A through Z   |
| .          | any one character    | `se.` _sea_, *see*k        |
| \meta-char | escape               | `1\.2` _1.2_               |
| \s         | space                | equal to `[ \n\t\r\f\v]`   |
| \w         | word                 | equal to `[0-9a-zA-Z_]`    |
| \d         | digit                | equal to `[0-9] `          |

### Expression

| Symbol | Means                         | Examples                         |
| ------ | ----------------------------- | -------------------------------- |
| \|     | one of several subexpressions | `gray\|grey` _gray_, _grey_      |
| ()     | limit scope of \|             | `gr(a\|e)y` _gray_, _grey_       |
|        | group subexpression           | `1(st)?` _1_, _1st_              |
|        | group and capture             | `([a-z]) ([0-9])` \$1, \$2       |
| \num   | backreference                 | `([a-z]+) \1` _the the_, _at at_ |
| (?:)   | group but do not capture      | `([a-z]) (?:[0-9])` $1           |

### Quantifiers

|   Symbol   | Means           | Examples              |
| :--------: | --------------- | --------------------- |
|     ?      | optional        | `July?` _Jul_, _July_ |
|     \*     | any number      |                       |
|     +      | one or more     |                       |
| {min, max} | specified range |                       |

## Options

| Option | Means            |
| :----: | ---------------- |
|   i    | case insensitive |
|   m    | multi-lines      |

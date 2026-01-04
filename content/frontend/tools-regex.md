---
title: Regex
category: Tools
toc: true
---

## Metacharacters

### Position

| Symbol | Means                        | Examples                           |
| :----: | ---------------------------- | ---------------------------------- |
|   ^    | start of the line            | `^cat` a line starting with cat    |
|   $    | end of the line              | `cat$` a line ending with cat      |
|        |                              | `^cat$` a line containing only cat |
|        |                              | `^$` an empty line                 |
|   \b   | word boundary                | `\bcat` a word starting with cat   |
|        |                              | `cat\b` a word ending with cat     |
|        |                              | `\bcat\b` a word cat               |
|  (?=)  | lookahead (toward the right) |                                    |
| (?<=)  | lookbehind (toward the left) |                                    |
|  (?!)  | negative lookahead           |                                    |
| (?<!)  | negative lookbehind          |                                    |

### Character

| Symbol | Means                | Examples                 |
| :----: | -------------------- | ------------------------ |
|   []   | any character listed | `[abc]` a, b or c        |
|        |                      | `[0-9]` 0 to 9           |
|        |                      | `[^a-z]` not a to z      |
|   .    | any character        |                          |
|   \    | escape               | `1\.2` 1.2               |
|        |                      | `[[\]]` \[ or \]         |
|   \s   | space                | equal to `[ \n\t\r\f\v]` |
|   \w   | word                 | equal to `[0-9a-zA-Z_]`  |
|   \d   | digit                | equal to `[0-9]`         |

### Expression

| Symbol | Means                    | Examples                                      |
| :----: | ------------------------ | --------------------------------------------- |
|   \|   | any subexpression        | `gray\|grey` gray or grey                     |
|   ()   | limit scope of \|        | `gr(a\|e)y` gray or grey                      |
|        | group subexpression      | `1(st)?` 1 or 1st                             |
|        | group and capture        | `([a-z]) ([0-9])` \$1, \$2                    |
|  \num  | backreference            | `(\d) \1` \1 refers to the text matched by \d |
|  (?:)  | group but do not capture | `([a-z]) (?:[0-9])` $1                        |

### Quantifiers

|   Symbol   | Means           | Examples                      |
| :--------: | --------------- | ----------------------------- |
|     ?      | optional        | equal to `{0,1}`              |
|     \*     | any number      | equal to `{0,}`               |
|     +      | one or more     | equal to `{1,}`               |
| {min, max} | specified range | `July{2}` Julyy               |
|            |                 | `July{2,}` Julyy, Julyyy, ... |
|            |                 | `July{2,3}` Julyy, Julyyy     |

## Options

| Option | Means                                                              |
| :----: | ------------------------------------------------------------------ |
|   i    | case insensitive, ignore case.                                     |
|   m    | multi-lines, ^/$ match the begin/end of each line (not of string). |

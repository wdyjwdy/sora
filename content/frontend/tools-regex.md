---
title: Regex
category: Tools
toc: true
---

## Metacharacters

### Position

| Character | Meaning                      |
| :-------: | ---------------------------- |
|     ^     | start of the line            |
|     $     | end of the line              |
|    \b     | word boundary                |
|   (?=)    | lookahead (toward the right) |
|   (?<=)   | lookbehind (toward the left) |
|   (?!)    | negative lookahead           |
|   (?<!)   | negative lookbehind          |

### Character

| Character | Meaning              |                 |
| :-------: | -------------------- | --------------- |
|    []     | any character listed | \[a-z], \[^0-9] |
|     .     | any character        |                 |
|     \     | escape               |                 |
|    \s     | space                | \[ \n\t\r\f\v]  |
|    \w     | word                 | \[0-9a-zA-Z_]   |
|    \d     | digit                | \[0-9]          |

### Expression

| Symbol | Means                    |
| :----: | ------------------------ |
|   \|   | any subexpression        |
|   ()   | limit scope of \|        |
|        | group subexpression      |
|        | group and capture        |
|  \num  | backreference            |
|  (?:)  | group but do not capture |

### Quantifiers

|   Symbol   | Means           |       |
| :--------: | --------------- | ----- |
|     ?      | optional        | {0,1} |
|     \*     | any number      | {0,}  |
|     +      | one or more     | {1,}  |
| {min, max} | specified range |       |

## Options

| Option | Means                                                              |
| :----: | ------------------------------------------------------------------ |
|   i    | case insensitive                                                   |
|   m    | multi-lines, ^/$ match the begin/end of each line (not of string). |

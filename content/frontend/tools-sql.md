---
title: SQL
category: Tools
toc: true
---

## Data Definition

### Constraints

Define constraints on columns.

#### Primary Key

- Each row must be unique.
- Disallows NULL.
- Each table can have only one primary key.

#### Unique

- Each row must be unique.
- Allows NULL.
- Each table can have multiple unique keys.

#### Foreign Key

- Each row must belong to another column (Primary Key or Unique).
- Allows NULL.

> **Why must a Foreign Key reference a Primary Key or UNIQUE constraint?**
>
> - Avoid Ambiguity: the referenced row must be uniquely identifiable.
> - Efficient Lookups: the referenced column always have an index to allow efficient lookups on whether a referencing row has a match.

#### Check

- Each row must satisfy the predicate (TRUE or UNKNOWN).
- Allows NULL.

#### Not Null

- Disallows NULL.

> In PostgreSQL, NOT NULL is more efficient than CHECK(id IS NOT NULL).

## Data Manipulation

### Queries

The clauses are logically processed in the following order:

1. FROM
2. WHERE (Expressions -> DISTINCT)
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY (OFFSET -> LIMIT)

> The database engine doesn't have to follow logical query processing, as long as the final result would be the same.

> **All-at-once Operations**: all expressions that appear in the same logical query processing phase are evaluated logically at the same point in time.

#### FROM

Specify a table you want to query.

```sql
SELECT *
FROM employees;
```

#### WHERE

Specify a predicate to filter the rows.

```sql
SELECT *
FROM employees
WHERE id = 1;
```

#### GROUP BY

Produces a group for each distinct combination.

```sql
SELECT city
FROM employees
GROUP BY city;
```

> All phases subsequent to the GROUP BY phase operate on groups. Each group is represented by a single row.

Elements that do not participate in the GROUP BY clause are allowed only as inputs to an [aggregate function](#aggregate-function).

```sql
SELECT city, AVG(salary)
FROM employees
GROUP BY city;
```

#### HAVING

Specify a predicate to filter the groups. Because the HAVING clause is processed after the rows have been grouped, you can refer to [aggregate function](#aggregate-function) in the HAVING filter predicate.

```sql
SELECT city
FROM employees
GROUP BY city
HAVING AVG(salary) > 20000; -- filter groups
```

#### SELECT

Specify the columns you want to return in the result table of the query.

```sql
SELECT name
FROM employees;
```

You can use asterisk to return all columns.

```sql
SELECT *
FROM employees;
```

You can use AS clause to define a column alias.

```sql
SELECT join_date AS date
FROM employees;
```

You can use DISTINCT clause to remove duplicate rows.

```sql
SELECT DISTINCT city
FROM employees;
```

#### ORDER BY

Sort the rows in certain order.

```sql
SELECT *
FROM employees
ORDER BY age;
```

You can use DESC to sort in descending order.

```sql
SELECT *
FROM employees
ORDER BY age DESC;
```

You can refer to column aliases created in the SELECT phase.

```sql
SELECT join_date AS date
FROM employees
ORDER BY date;
```

You can specify elements that do not appear in the SELECT clause.

```sql
SELECT name
FROM employees
ORDER BY age;
```

#### LIMIT OFFSET

With the LIMIT clause you indicate how many rows to filter.

```sql
SELECT id, name
FROM employees
LIMIT 5; -- return lines 1 to 5
```

With the OFFSET clause you indicate how many rows to skip.

```sql
SELECT id, name
FROM employees
LIMIT 5 OFFSET 5; -- return lines 5 to 10
```

> The rows skipped by an OFFSET clause still have to be computed inside the server, therefore a large OFFSET might be inefficient.

## Functions

### Conditional Expressions

Such as CASE, GREATEST, LEAST.

### Aggregate Function

An aggregate function computes a single result from multiple input rows.
Such as COUNT, SUM, AVG, MIN, or MAX.

1. Use GROUP BY to define groups.
2. Collapse groups.

> Aggregate functions can only be used after the ORDER BY clause.

### Window Function

An window function computes a multiple result from multiple input rows.
Such as ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD.
You can also use COUNT, SUM, AVG, MIN, or MAX.

1. Use PARTITION BY to define groups.
2. Don't collapse groups.

## Predicates

### LIKE

1. Use % to match any sequence of characters.
2. Use _ to match any single character.

```sql
SELECT 'hi' LIKE 'h%'; -- use wildcard
SELECT 'hi' ~ '\w'; -- use regex
```

## JOIN

> Table operators are logically evaluated in written order.

### CROSS JOIN

1. Cartesian Product

### INNER JOIN

1. Cartesian Product
2. ON Filter

### OUTER JOIN

1. Cartesian Product
2. ON Filter
3. Add Outer Rows

In an outer join, you mark a table as a preserved table by using the keywords LEFT, RIGHT, FULL.

## Appendix

- SQL: structured query language.
- RDBMS: relational database management system.
- Predicate: a logical expression that evaluate to TRUE, FALSE, or UNKNOWN.

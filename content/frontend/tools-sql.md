---
title: SQL
category: Tools
toc: true
---

## Constraints

Define constraints on columns.

### Primary Key

- Each row must be unique.
- Disallows NULL.
- Each table can have only one primary key.

### Unique

- Each row must be unique.
- Allows NULL.
- Each table can have multiple unique keys.

### Foreign Key

- Each row must belong to another column (Primary Key or Unique).
- Allows NULL.

> **Why must a Foreign Key reference a Primary Key or UNIQUE constraint?**
>
> - Avoid Ambiguity: the referenced row must be uniquely identifiable.
> - Efficient Lookups: the referenced column always have an index to allow efficient lookups on whether a referencing row has a match.

### Check

- Each row must satisfy the predicate (TRUE or UNKNOWN).
- Allows NULL.

### Not Null

- Disallows NULL.

> In PostgreSQL, NOT NULL is more efficient than CHECK(id IS NOT NULL).

## Queries

The clauses are logically processed in the following order:

1. FROM
2. WHERE (Expressions -> DISTINCT)
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY (OFFSET -> LIMIT)

### FROM

Specify a table you want to query.

```sql
SELECT *
FROM students; -- specify a table
```

### WHERE

Specify a predicate to filter the rows.

```sql
SELECT *
FROM students
WHERE id = 1; -- filter rows
```

### GROUP BY

Produces a group for each distinct combination.

```sql
SELECT city
FROM employees
GROUP BY city; -- grouped by city
```

Elements that do not participate in the GROUP BY clause are allowed only as inputs to an [aggregate function](#aggregate-function).

```sql
SELECT city, COUNT(*), AVG(salary)
FROM employees
GROUP BY city;
```

### HAVING

Specify a predicate to filter the groups. Because the HAVING clause is processed after the rows have been grouped, you can refer to [aggregate function](#aggregate-function) in the HAVING filter predicate.

```sql
SELECT city
FROM employees
GROUP BY city
HAVING AVG(salary) > 20000; -- filter groups
```

### SELECT

Specify the columns you want to return in the result table of the query.

```sql
SELECT name -- return the name column
FROM employees;

SELECT * -- return all columns
FROM employees;
```

> It is recommended to explicitly list the columns instead of using asterisk(\*). For example, when the column order changes, different results will be returned.

You can use AS clause to rename the column name.

```sql
SELECT name AS employee_name
FROM employees;
```

You can use DISTINCT clause to remove duplicate rows.

```sql
SELECT DISTINCT city
FROM employees;
```

### ORDER BY

Sort the rows in certain order.

```sql
SELECT name, age
FROM employees
ORDER BY age; -- sorted by age (ASC order is the default)
```

You can use DESC to sort in descending order.

```sql
SELECT name, age
FROM employees
ORDER BY age DESC; -- descending order
```

You can refer to column aliases created in the SELECT phase.

```sql
SELECT name, join_date AS date
FROM employees
ORDER BY date; -- refer to the alias date
```

You can specify elements that do not appear in the SELECT clause.

```sql
SELECT name
FROM employees
ORDER BY age; -- sorted by age
```

### LIMIT OFFSET

With the LIMIT clause you indicate how many rows to filter.

```sql
SELECT id, name
FROM employees
LIMIT 5; -- filters the next 5 rows (return lines 1 to 5)
```

With the OFFSET clause you indicate how many rows to skip.

```sql
SELECT id, name
FROM employees
LIMIT 5
OFFSET 5; -- skips the first 5 rows (return lines 5 to 10)
```

> The rows skipped by an OFFSET clause still have to be computed inside the server, therefore a large OFFSET might be inefficient.

## Aggregate Function

An aggregate function computes a single result from multiple input rows. Such as COUNT, SUM, AVG, MIN, or MAX.

1. In the GROUP BY clause. (return single result for each group)

```sql
SELECT city, AVG(age) FROM employees GROUP BY city;
SELECT city, AVG(age) FROM employees GROUP BY city HAVING AVG(age) > 30;
SELECT city, AVG(age) FROM employees GROUP BY city ORDER BY AVG(age);
```

2. In the SELECT clause. (return single result for one group)

```sql
SELECT AVG(age) FROM employees;
```

An aggregate function ignores NULLs.

```sql
SELECT COUNT(city) FROM employees; -- number of non-NULL rows
SELECT COUNT(*) FROM employees; -- number of rows
```

> Aggregate function cannot be used in the WHERE clause. Because the WHERE clause determines which rows will be included in the aggregate calculation. Use subquery instead.

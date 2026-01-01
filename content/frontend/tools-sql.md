---
title: SQL
category: Tools
toc: true
---

## Constraints

### Primary Key

- Each row must be unique.
- Disallows NULL.
- Each table can have only one primary key.

### Unique

- Each row must be unique.
- Allows NULL.
- Each table can have multiple unique keys.

### Foreign Key

- Each row must points to candidate key attributes (Primary Key or Unique).
- Allows NULL.

### Check

- Each row must satisfy the predicate (TRUE or UNKNOWN).

## Filters

The clauses are logically processed in the following order:

1. FROM
2. WHERE (Expressions -> DISTINCT)
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY (OFFSET -> LIMIT)

### FROM

Specify the name of the table you want to query.

```sql
SELECT *
FROM students; -- query from the students table
```

### WHERE

Specify a predicate to filter the rows.

```sql
SELECT *
FROM students
WHERE id = 1; -- filter rows where the ID equals 1
```

### GROUP BY

Produces a group for each distinct combination.

```sql
SELECT city
FROM employees
GROUP BY city; -- grouped by city (which cities are the employees from?)
```

Elements that do not participate in the GROUP BY clause are allowed only as inputs to an [aggregate function](#aggregate-function).

```sql
SELECT city, COUNT(*), AVG(salary)
FROM employees
GROUP BY city;
```

### HAVING

Specify a predicate to filter the groups.

Because the HAVING clause is processed after the rows have been grouped, you can refer to aggregate functions in the HAVING filter predicate.

```sql
SELECT city
FROM employees
GROUP BY city
HAVING AVG(salary) > 20000; -- filter groups where the average salary is greater than 20000.
```

### SELECT

Specify the attributes you want to return in the result table of the query.

```sql
SELECT name -- return the name attribute
FROM employees;
```

You can assign your own name to the target attribute by using the AS clause.

```sql
SELECT name AS employee_name -- rename the name attribute
FROM employees;
```

You can use an asterisk(\*) to select all attributes.

```sql
SELECT * -- return all attributes
FROM employees;
```

> It is recommended to explicitly list the columns instead of using asterisk(\*). For example, when the column order changes, different results will be returned.

You can use DISTINCT to remove duplicate rows.

```sql
SELECT DISTINCT city -- remove duplicate cities
FROM employees;
```

### ORDER BY

sort the rows

```sql
SELECT name, age
FROM employees
ORDER BY age; -- sorted by age
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

## Aggregate Function

An aggregate function computes a single result from multiple input rows. Such as COUNT, SUM, AVG, MIN, or MAX.

1. In the SELECT clause. (return single result)

```sql
SELECT AVG(age) FROM employees;
```

2. In the GROUP BY clause. (return single result for each group)

```sql
SELECT city, AVG(age) FROM employees GROUP BY city;
SELECT city, AVG(age) FROM employees GROUP BY city HAVING AVG(age) > 30;
SELECT city, AVG(age) FROM employees GROUP BY city ORDER BY AVG(age);
```

> Aggregate function cannot be used in the WHERE clause. Because the WHERE clause determines which rows will be included in the aggregate calculation. Use subquery instead.

> Aggregate functions ignore NULLs.
>
> - COUNT(city) returns the number of non-NULL rows.
> - COUNT(\*) returns the number of rows.

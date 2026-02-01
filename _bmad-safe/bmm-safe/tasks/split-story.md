# Story Splitting Task

## Purpose

Split large Stories into smaller, deliverable pieces.

---

## When to Split

- Story > 8 points
- Story has multiple acceptance criteria groups
- Story spans multiple components
- Story has multiple user types

---

## Splitting Techniques

### 1. Workflow Steps

Split by steps in the user journey.

```
Original: User completes checkout
Split:
- User adds to cart
- User enters payment
- User confirms order
```

### 2. Business Rule Variations

Split by rules or options.

```
Original: Apply discount codes
Split:
- Apply percentage discount
- Apply fixed amount discount
- Apply free shipping discount
```

### 3. Simple/Complex

Start simple, add complexity.

```
Original: Search with filters
Split:
- Basic search
- Search with category filter
- Search with price filter
```

### 4. Data Variations

Split by data types.

```
Original: Import data
Split:
- Import CSV
- Import JSON
- Import Excel
```

### 5. CRUD Operations

Split by operations.

```
Original: Manage products
Split:
- Create product
- View product
- Update product
- Delete product
```

---

## Anti-Patterns

❌ Technical splits (backend vs frontend)
❌ Horizontal splits (design vs test)
❌ Splits that don't deliver value

---

## Output

Smaller Stories, each delivering user value.

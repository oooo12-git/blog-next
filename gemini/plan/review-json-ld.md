# Plan: Conditional JSON-LD for Reviews

## Goal

To dynamically generate either `Review` or `BlogPosting` JSON-LD schema based on the tags in a blog post's MDX metadata. This will improve SEO for review-type posts by providing more specific structured data to search engines.

## File to Modify

- `/Users/jaahyun/blog-next/app/[locale]/blog/[slug]/page.tsx`

## Step-by-Step Implementation

1.  **Create a Helper Function:**
    -   Define a new function named `generateJsonLd` within the `Page` component in `page.tsx`.
    -   This function will accept the `post` object (which contains the metadata) and the `locale` string as arguments.

2.  **Implement Conditional Logic:**
    -   Inside the `generateJsonLd` function, add a check to see if `post.metadata.tags` array includes either `"맛집"` or `"Restaurant"`.
    -   The check should also verify that `post.metadata.itemReviewed` and `post.metadata.reviewRating` exist to ensure the necessary data for the `Review` schema is present.

3.  **Generate `Review` Schema:**
    -   If the condition (tags and required metadata fields are present) is true, the function will construct and return a JSON-LD object with `@type: "Review"`.
    -   The schema will be populated with data from the post's metadata:
        -   `name`: `post.metadata.title`
        -   `itemReviewed`: `post.metadata.itemReviewed`
        -   `reviewRating`: `post.metadata.reviewRating`
        -   `author`, `publisher`, `datePublished`, etc., will be included as they are in the `BlogPosting` schema.

4.  **Generate `BlogPosting` Schema (Default Case):**
    -   If the condition is false, the function will construct and return the default `BlogPosting` JSON-LD schema, using the existing logic and metadata fields.

5.  **Integrate the Function:**
    -   In the main body of the `Page` component, find the section where the `jsonLd` constant is currently defined.
    -   Replace the static object definition with a call to the new `generateJsonLd` function, passing the post data and locale: `const jsonLd = generateJsonLd({ metadata }, locale);`.

6.  **Render the Script:**
    -   The existing `<script>` tag that stringifies and renders the `jsonLd` object will remain the same, as it will now automatically receive the correct schema based on the function's output.

## Verification

- After implementing the changes, I will run `yarn build` to ensure the project compiles without errors.
- I will manually inspect the generated HTML source of a restaurant review page (like Zebra Restaurant) and a regular blog post to confirm that the correct JSON-LD (`Review` or `BlogPosting`) is being generated for each case.

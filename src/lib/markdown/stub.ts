export const MARKDOWN_STUB_WITH_HIERARCHY = `# [[Main Topic]]
This is a paragraph under the main topic. It contains some **bold text**, *italic text*, a [link](http://sonnetate.vercel.app) and even some \`inline code\`. This paragraph showcases basic Markdown formatting.
## [[Main Topic/Subtopic 1|Subtopic 1]]
- This is an unordered list item
- Another unordered list item
- A third unordered list item

### [[Main Topic/Subtopic 1/Nested Topic|Nested Topic]]
1. This is an ordered list item
2. Another ordered list item
3. A third ordered list item

#### [[Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic|Deep Nested Topic]]
> This is a blockquote. It can contain multiple lines and even other Markdown elements.
> 
> - Like this unordered list
> - Within the blockquote

##### [[Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic/Even Deeper|Even Deeper]]

Here's a task list:

- [ ] Uncompleted task
- [x] Completed task
- [ ] Another uncompleted task

###### [[Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic/Even Deeper/Deepest Level|Deepest Level]]

\`\`\`python
def hello_world():
    print("Hello, World!")

hello_world()
\`\`\`

## [[Main Topic/Subtopic 2|Subtopic 2]]

Here's a table:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |

### [[Main Topic/Subtopic 2/Images|Images]]

![Alt text for image](https://example.com/image.jpg)

#### [[Main Topic/Subtopic 2/Images/Links|Links]]

[This is a link](https://www.example.com)

##### [[Main Topic/Subtopic 2/Images/Links/Horizontal Rule|Horizontal Rule]]

---

###### [[Main Topic/Subtopic 2/Images/Links/Horizontal Rule/Final Section|Final Section]]

This is the final paragraph in our sample Markdown. It demonstrates that we've covered headings from H1 to H6, and included various Markdown elements throughout the document.`

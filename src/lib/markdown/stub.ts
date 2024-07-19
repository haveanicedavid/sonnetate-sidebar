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

export const MARKDOWN_STUB_WITH_HIERARCHY_ALT = `# [[Different Main Topic]]
In this alternative version, we explore various aspects of data science. The field encompasses a wide range of techniques and methodologies for extracting insights from complex datasets.

## [[Different Main Topic/Subtopic 1|Subtopic 1]]
- Data collection and preprocessing
- Exploratory data analysis
- Feature engineering and selection

### [[Different Main Topic/Subtopic 1/Nested Topic|Nested Topic]]
1. Linear regression
2. Logistic regression
3. Decision trees

#### [[Different Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic|Deep Nested Topic]]
> Machine learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.
> 
> - Supervised learning
> - Unsupervised learning
> - Reinforcement learning

##### [[Different Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic/Even Deeper|Even Deeper]]

Key data science libraries:

- [ ] Learn NumPy
- [x] Master Pandas
- [ ] Explore Scikit-learn

###### [[Different Main Topic/Subtopic 1/Nested Topic/Deep Nested Topic/Even Deeper/Deepest Level|Deepest Level]]

\`\`\`python
import pandas as pd
import numpy as np

def preprocess_data(df):
    return df.dropna().reset_index(drop=True)

data = pd.DataFrame({'A': [1, 2, np.nan, 4], 'B': [5, np.nan, 7, 8]})
cleaned_data = preprocess_data(data)
print(cleaned_data)
\`\`\`

## [[Different Main Topic/Subtopic 2|Subtopic 2]]

Comparison of popular machine learning algorithms:

| Algorithm | Type | Use Case |
|-----------|------|----------|
| Random Forest | Ensemble | Classification, Regression |
| K-Means | Clustering | Segmentation |
| Support Vector Machine | Kernel-based | Classification, Regression |

### [[Different Main Topic/Subtopic 2/Images|Images]]

![Data Science Venn Diagram](https://example.com/data_science_venn.jpg)

#### [[Different Main Topic/Subtopic 2/Images/Links|Links]]

[Kaggle: Data Science Community](https://www.kaggle.com)

##### [[Different Main Topic/Subtopic 2/Images/Links/Horizontal Rule|Horizontal Rule]]

---

###### [[Different Main Topic/Subtopic 2/Images/Links/Horizontal Rule/Final Section|Final Section]]

As we conclude this overview of data science, it's important to remember that the field is constantly evolving. Staying up-to-date with the latest techniques and technologies is crucial for success in this dynamic discipline.`

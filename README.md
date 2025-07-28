# Advanced HTML Text Editor

![HTML Editor Screenshot](https://raw.githubusercontent.com/Shoko-official/html-text-editor/main/assets/editor-preview.png)

A simple yet powerful rich text editor (WYSIWYG) built entirely with HTML, CSS, and JavaScript. Perfect for drafting articles with advanced formatting options, including image management, links, lists, and code blocks.

---

## 🚩 Features

- **Complete Text Formatting:**  
  Bold, italic, underline, strikethrough.

- **Typography Control:**  
  Font size selection and paragraph formats (H1–H6, Paragraph).

- **Text Alignment:**  
  Left, center, right, justify.

- **Lists:**  
  Bulleted and numbered lists.

- **Text Color:**  
  Custom text color via a color picker.

- **Link Management:**  
  Insert and remove hyperlinks with an intuitive modal.

- **Code Insertion:**  
  Support for inline code snippets and `<pre><code>` blocks.

- **Advanced Image Handling:**
  - Insert images via drag-and-drop or file selection.
  - Automatic image compression for optimized performance.
  - Interactive resizing with aspect ratio lock.
  - Alignment options (left, right, center) and caption addition with a modal.

- **History:**  
  Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`).

- **Counter:**  
  Real-time word and character count.

- **HTML Preview:**  
  Preview the generated HTML and easily copy it to the clipboard.

---

## 🚀 Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Shoko-official/html-text-editor.git
    ```

2. **Navigate to the project folder:**
    ```bash
    cd html-text-editor
    ```

3. **Open `index.html` in your preferred browser:**  
   You can double-click `index.html` or use an extension like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code for a local server.

---

## 📁 Project Structure

```
/html-text-editor/
│--- index.html          # Main editor structure
│
├── css/
│   └── style.css        # All CSS styles for the interface
│
└── js/
    └── script.js        # All JavaScript logic and interactivity
```

---

## ⚠️ Important Note: Form Submission

This editor is a **pure front-end application**!  
The submission form (`<form action="/submit-article" method="post">`) is set to send data to a backend.

- To save articles, you must implement a server-side API (Node.js, Python, PHP, etc.) to receive and process the data.
- The path `http://127.0.0.1:5500/submit-article` is an example target URL.
- For a quick preview of the generated HTML, use the "HTML Preview" function in the toolbar.

---

## 🤝 Contributing

Contributions are welcome!  
If you have ideas, bug reports, or want to add features, feel free to open an [issue](https://github.com/Shoko-official/html-text-editor/issues) or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> **Tip:**  
> For best results, use the editor in an up-to-date browser like Chrome or Firefox.

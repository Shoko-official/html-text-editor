This is an example of an HTML Editor

A simple yet functional rich text editor (WYSIWYG) built entirely with HTML, CSS, and JavaScript. Ideal for drafting articles with advanced formatting options, including image management, links, lists, and code blocks.

Features :

    • Complete Text Formatting: Bold, italic, underline, strikethrough.

    • Typography Control: Font size selection and paragraph formats (H1 to H6, Paragraph).

    • Text Alignment: Left, center, right, justify.

    • Lists: Bulleted and numbered lists.

    • Text Color: Custom text color via a color picker.

    • Link Management: Insert and remove hyperlinks with an intuitive modal.

    • Code Insertion: Support for inline code snippets and <pre><code> blocks.

    • Advanced Image Handling:

        - Image insertion via drag-and-drop or file selection.

        - Automatic image compression upon insertion for optimized web performance.

        - Interactive resizing with aspect ratio preservation.

        - Alignment options (left, right, center) and caption addition via a dedicated modal.

    • History: Undo (Ctrl+Z) and Redo (Ctrl+Y) functionalities for worry-free editing.

    • Counter: Real-time word and character count display.

    • HTML Preview: Preview the generated HTML code and easily copy it to the clipboard.


🚀 Quick Start

To try out this editor, follow these simple steps:

Clone the repository:

git clone https://github.com/your-username/my-advanced-html-editor.git

Navigate to the project folder:

    cd my-advanced-html-editor

    Open the index.html file in your favorite web browser (Google Chrome, Firefox, etc.).

You can also use an extension like "Live Server" for VS Code to launch a local development server.


Basic Structure :

/html-text-editor/
|---index.html          # Main editor structure
|---css/
|    |--style.css       # All CSS styles for the interface
|---js/
     |--script.js       # All JavaScript logic and interactivity


Important Note: Form Submission

This editor is a pure front-end application. The submission form (<form action="/submit-article" method="post">) is configured to send data to a backend.

For it to actually work and save articles, you will need to implement a server-side API (e.g., with Node.js, Python, PHP, etc...) that will receive and process this data. The path http://127.0.0.1:5500/submit-article is an example target URL for such a backend.

For a quick preview of the generated HTML, use the "HTML Preview" function available in the editor's toolbar.


→ Contributing
Contributions are welcome! If you have ideas for improvement, bug reports, or want to add new features, feel free to open an issue or submit a pull request.

📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.
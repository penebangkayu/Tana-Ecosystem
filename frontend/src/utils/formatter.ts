// src/utils/formatter.ts
export function formatPlainText(analysis: string): string {
  let output = analysis;

  // Heading (### Title → UPPERCASE + garis bawah)
  output = output.replace(/### (.*)/g, (_, title) => {
    return `\n${title.toUpperCase()}\n${"=".repeat(title.length)}`;
  });

  // Subheading ( **judul** → >> JUDUL )
  output = output.replace(/\n\*\*(.*?)\*\*/g, (_, text) => {
    return `\n>> ${text.toUpperCase()}`;
  });

  // Bold biasa (**text**) → kapital
  output = output.replace(/\*\*(.*?)\*\*/g, (_, text) => text.toUpperCase());

  // Bullet point `* ` → •
  output = output.replace(/\n\* /g, "\n• ");

  // Dash list `- ` → •
  output = output.replace(/\n- /g, "\n• ");

  // Garis pemisah `---` → =====
  output = output.replace(/---+/g, "==============================");

  return output.trim();
}

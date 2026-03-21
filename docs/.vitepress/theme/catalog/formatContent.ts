export function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="fc-code">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="fc-link" target="_blank" rel="noopener">$1</a>')
}

export function formatContent(content: string): string {
  return content
    // Strip fenced code blocks (```lang\n...\n```)
    .replace(/```[\w-]*\n[\s\S]*?```/g, '')
    .replace(/```[\w-]*/g, '')
    // Markdown tables → simple formatted rows
    .replace(/^\|(.+)\|$/gm, (_, row: string) => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean)
      if (cells.every(c => /^[-:]+$/.test(c))) return '' // separator row
      return '<div class="fc-table-row">' + cells.map(c => `<span class="fc-cell">${c}</span>`).join('') + '</div>'
    })
    // ### headings
    .replace(/^### (.+)$/gm, '<div class="fc-h3">$1</div>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="fc-code">$1</code>')
    // Markdown links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="fc-link" target="_blank" rel="noopener">$1</a>')
    // Numbered lists
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="fc-li"><span class="fc-num">$1.</span> $2</div>')
    // Bullet lists
    .replace(/^[-*]\s+(.+)$/gm, '<div class="fc-li"><span class="fc-dot"></span>$1</div>')
    // Horizontal rules
    .replace(/^---$/gm, '')
    // Double newlines → break, single → space
    .replace(/\n{2,}/g, '<br>')
    .replace(/\n/g, ' ')
    // Clean up empty lines and extra breaks
    .replace(/(<br>\s*){3,}/g, '<br><br>')
    .trim()
}

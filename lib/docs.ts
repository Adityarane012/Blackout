import fs from "fs"
import path from "path"
import matter from "gray-matter"

const contentDir = path.join(process.cwd(), "content", "docs")

export type DocMeta = {
  title: string
  description?: string
  slug: string[]
  readingTime: string
}

export type DocContent = {
  meta: DocMeta
  content: string
  headings: { id: string; title: string; level: number }[]
}

const getReadingTime = (text: string) => {
  const wordsPerMinute = 200
  const noOfWords = text.split(/\s/g).length
  const minutes = noOfWords / wordsPerMinute
  const readTime = Math.ceil(minutes)
  return `${readTime} min read`
}

export const getDocBySlug = (slug: string[]): DocContent | null => {
  try {
    // Determine file path
    const targetPath = slug.length === 0 ? "getting-started/introduction" : slug.join("/")
    let fullPath = path.join(contentDir, `${targetPath}.md`)
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDir, targetPath, "index.md")
    }

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Extract Headings for TOC
    const headingLines = content.split('\n').filter(line => line.match(/^#{2,3}\s/))
    const headings = headingLines.map(line => {
      const level = line.match(/^#/g)?.length || 2
      const title = line.replace(/^#{2,3}\s/, '')
      const id = title.toLowerCase().replace(/[^\w]+/g, '-')
      return { id, title, level }
    })

    return {
      meta: {
        title: data.title || "Documentation",
        description: data.description || "",
        slug: slug,
        readingTime: getReadingTime(content)
      },
      content,
      headings
    }
  } catch (error) {
    console.error("Error reading doc:", error)
    return null
  }
}

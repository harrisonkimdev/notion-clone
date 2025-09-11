import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results = await searchFiles(query)
    
    return NextResponse.json({ 
      results,
      query 
    })

  } catch (error) {
    console.error('File search error:', error)
    return NextResponse.json(
      { error: 'Failed to search files' },
      { status: 500 }
    )
  }
}

async function searchFiles(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const searchPaths = ['src/', 'public/', './'] // Define search directories
  
  for (const searchPath of searchPaths) {
    try {
      await searchInDirectory(searchPath, query, results)
    } catch (error) {
      console.log(`Could not search in ${searchPath}:`, error)
    }
  }
  
  // Sort by relevance (filename matches first, then content matches)
  return results.sort((a, b) => {
    const aFilenameMatch = a.filename.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
    const bFilenameMatch = b.filename.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
    
    if (aFilenameMatch !== bFilenameMatch) {
      return bFilenameMatch - aFilenameMatch
    }
    
    return b.matches.length - a.matches.length
  }).slice(0, 20) // Limit to 20 results
}

async function searchInDirectory(dirPath: string, query: string, results: SearchResult[]) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      // Skip node_modules, .git, .next, etc.
      if (entry.isDirectory() && shouldSkipDirectory(entry.name)) {
        continue
      }
      
      if (entry.isDirectory()) {
        await searchInDirectory(fullPath, query, results)
      } else if (entry.isFile() && shouldSearchFile(entry.name)) {
        await searchInFile(fullPath, query, results)
      }
    }
  } catch (error) {
    // Directory might not exist or be accessible
  }
}

async function searchInFile(filePath: string, query: string, results: SearchResult[]) {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    const matches: FileMatch[] = []
    
    const lowerQuery = query.toLowerCase()
    const filename = path.basename(filePath)
    
    // Check filename match
    const filenameMatch = filename.toLowerCase().includes(lowerQuery)
    
    // Check content matches
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase()
      if (lowerLine.includes(lowerQuery)) {
        matches.push({
          lineNumber: index + 1,
          content: line.trim(),
          context: getLineContext(lines, index)
        })
      }
    })
    
    // Only add to results if there are matches or filename matches
    if (matches.length > 0 || filenameMatch) {
      results.push({
        filename,
        path: filePath,
        matches: matches.slice(0, 5), // Limit matches per file
        filenameMatch
      })
    }
  } catch (error) {
    // File might not be readable or might be binary
  }
}

function getLineContext(lines: string[], targetIndex: number): string[] {
  const start = Math.max(0, targetIndex - 1)
  const end = Math.min(lines.length, targetIndex + 2)
  return lines.slice(start, end)
}

function shouldSkipDirectory(name: string): boolean {
  const skipDirs = [
    'node_modules', '.git', '.next', 'dist', 'build', 
    '.vercel', '.env', 'coverage', '.nyc_output'
  ]
  return skipDirs.includes(name) || name.startsWith('.')
}

function shouldSearchFile(filename: string): boolean {
  const extensions = [
    '.ts', '.tsx', '.js', '.jsx', '.json', '.md', 
    '.txt', '.yml', '.yaml', '.env', '.css', '.scss'
  ]
  const ext = path.extname(filename).toLowerCase()
  return extensions.includes(ext) || !path.extname(filename) // Include extensionless files
}

interface SearchResult {
  filename: string
  path: string
  matches: FileMatch[]
  filenameMatch: boolean
}

interface FileMatch {
  lineNumber: number
  content: string
  context: string[]
}
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import ora from 'ora'
import chalk from 'chalk'

const execAsync = promisify(exec)

interface DonutConfig {
  lang: string
  version: string
  port?: string
  serveFile?: string
  libraries: string[]
}

function parseDonutFile(content: string): Partial<DonutConfig> {
  const config: Partial<DonutConfig> = { libraries: [] }

  const langMatch = content.match(/^use\s+(\w+)\s+from\s+([\w.-]+)/m)
  if (langMatch) {
    config.lang = langMatch[1]
    config.version = langMatch[2]
  }

  const configFuncMatch = content.match(/function\s+config\s*\(\)\s*\{([\s\S]*?)\}/)
  if (configFuncMatch) {
    const configBody = configFuncMatch[1]
    const portMatch = configBody.match(/const\s+PORT\s*=\s*(\d+)/)
    const serveMatch = configBody.match(/const\s+serve\s*=\s*['"](.*?)['"]/)
    if (portMatch) config.port = portMatch[1]
    if (serveMatch) config.serveFile = serveMatch[1]
  }

  const libraryFuncMatch = content.match(/function\s+library\s*\(\)\s*\{([\s\S]*?)\}/)
  if (libraryFuncMatch) {
    const libraryBody = libraryFuncMatch[1]
    const libsMatch = libraryBody.match(/let\s+libs:\s*string\[\]\s*=\s*\[(.*?)\]/)
    if (libsMatch) {
      config.libraries = libsMatch[1].split(',').map(lib => lib.trim().replace(/['"]/g, ''))
    }
  }

  return config
}

async function installDependencies(lang: string, libraries: string[]) {
  if (libraries.length === 0 || libraries[0] === '') return true
  
  let command: string
  if (lang === 'nodejs') {
    command = `npm install ${libraries.join(' ')}`
  } else if (lang === 'python') {
    command = `pip3 install ${libraries.join(' ')}`
  } else {
    return false
  }

  const spinner = ora(`در حال نصب کتابخانه‌ها: ${chalk.cyan(libraries.join(', '))}`).start()
  try {
    await execAsync(command)
    spinner.succeed(chalk.green('کتابخانه‌ها با موفقیت نصب شدند.'))
    return true
  } catch (error: any) {
    spinner.fail(chalk.red('خطا در نصب کتابخانه‌ها.'))
    console.error(chalk.gray(error.stderr || error.message))
    process.exit(1)
  }
}

async function runProject(lang: string, serveFile: string) {
  let command: string
  if (lang === 'nodejs') {
    command = `node ${serveFile}`
  } else if (lang === 'python') {
    command = `python3 ${serveFile}`
  } else {
    console.error(chalk.red('❌ زبان تعریف شده پشتیبانی نمی‌شود.'))
    process.exit(1)
  }

  const spinner = ora(`در حال اجرای پروژه با دستور: ${chalk.cyan(command)}`).start()
  try {
    const { stdout, stderr } = await execAsync(command)
    spinner.succeed(chalk.green('پروژه با موفقیت اجرا شد.'))
    if (stdout) console.log(chalk.gray('--- خروجی ---\n'), stdout)
    if (stderr) console.error(chalk.yellow('--- خطا ---\n'), stderr)
  } catch (error: any) {
    spinner.fail(chalk.red('خطا در هنگام اجرای پروژه.'))
    console.error(chalk.gray(error.stdout || error.stderr || error.message))
    process.exit(1)
  }
}

export async function build() {
  const cwd = process.cwd()
  const configPath = join(cwd, 'donut.ts')

  if (!existsSync(configPath)) {
    console.error(chalk.red('❌ فایل کانفیگ donut.ts در این مسیر پیدا نشد.'))
    process.exit(1)
  }

  const fileContent = readFileSync(configPath, 'utf-8')
  const config = parseDonutFile(fileContent)

  if (!config.lang || !config.serveFile) {
    console.error(chalk.red('❌ اطلاعات ضروری (زبان یا فایل اجرایی) در donut.ts تعریف نشده است.'))
    process.exit(1)
  }

  console.log(chalk.blue(`› زبان: ${chalk.bold(config.lang)} (نسخه: ${config.version})`))
  console.log(chalk.blue(`› فایل اجرایی: ${chalk.bold(config.serveFile)}`))

  await installDependencies(config.lang, config.libraries!)
  await runProject(config.lang, config.serveFile)
}
